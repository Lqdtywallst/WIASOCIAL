import type { SupabaseClient } from "@supabase/supabase-js";
import { fetchInstagramMedia, fetchInstagramProfile } from "@/lib/meta";

interface ConnectionRow {
  ig_user_id: string;
  access_token: string;
}

export interface InstagramSyncResult {
  followers: number;
  gained: number;
  postsImported: number;
  username: string;
}

export async function syncInstagramDataForUser(
  sb: SupabaseClient,
  userId: string,
  connection: ConnectionRow
): Promise<InstagramSyncResult> {
  const profile = await fetchInstagramProfile(
    connection.ig_user_id,
    connection.access_token
  );
  const media = await fetchInstagramMedia(
    connection.ig_user_id,
    connection.access_token
  );

  const { data: lastSnapshot } = await sb
    .from("follower_snapshots")
    .select("followers")
    .eq("user_id", userId)
    .order("recorded_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const prevFollowers = (lastSnapshot?.followers as number | undefined) ?? profile.followers_count;
  const gained = profile.followers_count - prevFollowers;
  const today = new Date().toISOString().split("T")[0];

  const { data: todaySnapshot } = await sb
    .from("follower_snapshots")
    .select("id")
    .eq("user_id", userId)
    .eq("recorded_at", today)
    .maybeSingle();

  if (todaySnapshot?.id) {
    await sb.from("follower_snapshots").update({
      followers: profile.followers_count,
      gained,
    }).eq("id", todaySnapshot.id);
  } else {
    await sb.from("follower_snapshots").insert({
      user_id: userId,
      recorded_at: today,
      followers: profile.followers_count,
      gained,
    });
  }

  let postsImported = 0;
  for (const post of media) {
    const { data: existing } = await sb
      .from("post_performance")
      .select("id")
      .eq("user_id", userId)
      .eq("instagram_media_id", post.instagramMediaId)
      .maybeSingle();

    const row = {
      user_id: userId,
      instagram_media_id: post.instagramMediaId,
      title: post.title,
      type: post.type,
      posted_at: post.postedAt,
      views: post.views,
      likes: post.likes,
      comments: post.comments,
      saves: post.saves,
      shares: post.shares,
      leads_generated: 0,
    };

    if (existing?.id) {
      const { error: postError } = await sb.from("post_performance").update(row).eq("id", existing.id);
      if (!postError) postsImported += 1;
    } else {
      const { error: postError } = await sb.from("post_performance").insert(row);
      if (!postError) postsImported += 1;
    }
  }

  await sb.from("instagram_connections").update({
    ig_username: profile.username,
    followers_count: profile.followers_count,
    media_count: profile.media_count,
    last_synced_at: new Date().toISOString(),
  }).eq("user_id", userId);

  return {
    followers: profile.followers_count,
    gained,
    postsImported,
    username: profile.username,
  };
}
