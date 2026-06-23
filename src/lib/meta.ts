import crypto from "crypto";

const GRAPH_VERSION = "v21.0";
const GRAPH_BASE = `https://graph.facebook.com/${GRAPH_VERSION}`;

export function isMetaConfigured(): boolean {
  return Boolean(
    process.env.META_APP_ID &&
    process.env.META_APP_SECRET &&
    !process.env.META_APP_ID.includes("your_meta")
  );
}

export function isMetaConfiguredPublic(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_META_APP_ID &&
    !process.env.NEXT_PUBLIC_META_APP_ID.includes("your_meta")
  );
}

export function getAppUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
  }
  return "http://localhost:3000";
}

export function getInstagramRedirectUri(): string {
  return `${getAppUrl()}/api/instagram/callback`;
}

export function getInstagramScopes(): string {
  return [
    "pages_show_list",
    "pages_read_engagement",
    "instagram_basic",
    "instagram_manage_insights",
  ].join(",");
}

export function signOAuthState(userId: string): string {
  const secret = process.env.META_APP_SECRET;
  if (!secret) throw new Error("META_APP_SECRET not configured");

  const payload = JSON.stringify({ userId, ts: Date.now() });
  const sig = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return Buffer.from(JSON.stringify({ payload, sig })).toString("base64url");
}

export function verifyOAuthState(state: string): string | null {
  try {
    const secret = process.env.META_APP_SECRET;
    if (!secret) return null;

    const { payload, sig } = JSON.parse(Buffer.from(state, "base64url").toString());
    const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
    if (sig !== expected) return null;

    const { userId, ts } = JSON.parse(payload);
    if (Date.now() - ts > 15 * 60 * 1000) return null;
    return userId;
  } catch {
    return null;
  }
}

export function buildInstagramAuthUrl(state: string): string {
  const appId = process.env.META_APP_ID!;
  const redirectUri = getInstagramRedirectUri();
  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: redirectUri,
    scope: getInstagramScopes(),
    state,
    response_type: "code",
  });
  return `https://www.facebook.com/${GRAPH_VERSION}/dialog/oauth?${params}`;
}

async function graphGet<T>(path: string, accessToken: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${GRAPH_BASE}${path}`);
  if (accessToken) url.searchParams.set("access_token", accessToken);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const res = await fetch(url.toString());
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message || "Meta API error");
  }
  return data as T;
}

export async function exchangeCodeForToken(code: string): Promise<{ access_token: string; expires_in?: number }> {
  return graphGet("/oauth/access_token", "", {
    client_id: process.env.META_APP_ID!,
    client_secret: process.env.META_APP_SECRET!,
    redirect_uri: getInstagramRedirectUri(),
    code,
  });
}

export async function exchangeForLongLivedToken(shortToken: string): Promise<{ access_token: string; expires_in: number }> {
  return graphGet("/oauth/access_token", "", {
    grant_type: "fb_exchange_token",
    client_id: process.env.META_APP_ID!,
    client_secret: process.env.META_APP_SECRET!,
    fb_exchange_token: shortToken,
  });
}

interface PageAccount {
  id: string;
  name: string;
  access_token: string;
  instagram_business_account?: { id: string };
}

export async function fetchInstagramProfile(igUserId: string, accessToken: string) {
  return graphGet<{
    username: string;
    followers_count: number;
    media_count: number;
  }>(`/${igUserId}`, accessToken, {
    fields: "username,followers_count,media_count",
  });
}

export async function findInstagramBusinessAccount(userAccessToken: string) {
  const pages = await graphGet<{ data: PageAccount[] }>("/me/accounts", userAccessToken, {
    fields: "id,name,access_token,instagram_business_account",
  });

  const page = pages.data.find((p) => p.instagram_business_account?.id);
  if (!page?.instagram_business_account?.id) {
    throw new Error(
      "No encontramos una cuenta Instagram Business vinculada a tu página de Facebook. Convierte tu cuenta a Business/Creator y vincúlala a una página."
    );
  }

  const igUserId = page.instagram_business_account.id;
  const profile = await fetchInstagramProfile(igUserId, page.access_token);

  return {
    pageId: page.id,
    igUserId,
    igUsername: profile.username,
    pageAccessToken: page.access_token,
    followersCount: profile.followers_count ?? 0,
    mediaCount: profile.media_count ?? 0,
  };
}

interface IgMedia {
  id: string;
  caption?: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
  media_type?: string;
  permalink?: string;
}

export async function fetchInstagramMedia(igUserId: string, accessToken: string, limit = 25) {
  const media = await graphGet<{ data: IgMedia[] }>(`/${igUserId}/media`, accessToken, {
    fields: "id,caption,timestamp,like_count,comments_count,media_type,permalink",
    limit: String(limit),
  });

  const enriched = await Promise.all(
    media.data.map(async (item) => {
      let views = 0;
      let saves = 0;
      let shares = 0;

      try {
        const insights = await graphGet<{ data: { name: string; values: { value: number }[] }[] }>(
          `/${item.id}/insights`,
          accessToken,
          { metric: "impressions,reach,saved,shares" }
        );
        for (const metric of insights.data) {
          const value = metric.values?.[0]?.value ?? 0;
          if (metric.name === "impressions" || metric.name === "reach") views = Math.max(views, value);
          if (metric.name === "saved") saves = value;
          if (metric.name === "shares") shares = value;
        }
      } catch {
        views = item.like_count ?? 0;
      }

      return {
        instagramMediaId: item.id,
        title: (item.caption?.slice(0, 80) || "Publicación de Instagram").trim(),
        type: mapMediaType(item.media_type),
        postedAt: item.timestamp.split("T")[0],
        views,
        likes: item.like_count ?? 0,
        comments: item.comments_count ?? 0,
        saves,
        shares,
        permalink: item.permalink,
      };
    })
  );

  return enriched;
}

function mapMediaType(mediaType?: string): "reel" | "carousel" | "story" | "post" {
  if (mediaType === "VIDEO") return "reel";
  if (mediaType === "CAROUSEL_ALBUM") return "carousel";
  if (mediaType === "IMAGE") return "post";
  return "post";
}
