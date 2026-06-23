import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import {
  exchangeCodeForToken,
  exchangeForLongLivedToken,
  findInstagramBusinessAccount,
  getAppUrl,
  verifyOAuthState,
} from "@/lib/meta";
import { syncInstagramDataForUser } from "@/lib/instagram-sync";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error_description") || searchParams.get("error");

  if (error) {
    return NextResponse.redirect(`${getAppUrl()}/settings?instagram=error&message=${encodeURIComponent(error)}`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${getAppUrl()}/settings?instagram=error&message=missing_code`);
  }

  const userId = verifyOAuthState(state);
  if (!userId) {
    return NextResponse.redirect(`${getAppUrl()}/settings?instagram=error&message=invalid_state`);
  }

  try {
    const sb = getSupabaseAdmin();
    const short = await exchangeCodeForToken(code);
    const long = await exchangeForLongLivedToken(short.access_token);
    const account = await findInstagramBusinessAccount(long.access_token);

    const expiresAt = new Date(Date.now() + long.expires_in * 1000).toISOString();

    const { error: dbError } = await sb
      .from("instagram_connections")
      .upsert({
        user_id: userId,
        ig_user_id: account.igUserId,
        ig_username: account.igUsername,
        page_id: account.pageId,
        access_token: account.pageAccessToken,
        token_expires_at: expiresAt,
        followers_count: account.followersCount,
        media_count: account.mediaCount,
        connected_at: new Date().toISOString(),
      }, { onConflict: "user_id" });

    if (dbError) throw dbError;

    await sb
      .from("user_settings")
      .upsert({
        user_id: userId,
        instagram_handle: `@${account.igUsername}`,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });

    let synced = false;
    try {
      await syncInstagramDataForUser(sb, userId, {
        ig_user_id: account.igUserId,
        access_token: account.pageAccessToken,
      });
      synced = true;
    } catch {
      synced = false;
    }

    const params = new URLSearchParams({
      instagram: "connected",
      user: account.igUsername,
      synced: synced ? "1" : "0",
    });
    return NextResponse.redirect(`${getAppUrl()}/dashboard?${params}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : "connection_failed";
    return NextResponse.redirect(`${getAppUrl()}/settings?instagram=error&message=${encodeURIComponent(message)}`);
  }
}
