import { NextResponse } from "next/server";
import { getAccessTokenFromRequest, getUserFromAccessToken } from "@/lib/auth-server";
import { buildInstagramAuthUrl, isMetaConfigured, signOAuthState } from "@/lib/meta";

export async function GET(request: Request) {
  if (!isMetaConfigured()) {
    return NextResponse.json({ error: "Meta App no configurada. Añade META_APP_ID y META_APP_SECRET." }, { status: 503 });
  }

  const token = getAccessTokenFromRequest(request);
  const user = await getUserFromAccessToken(token);
  if (!user) {
    return NextResponse.json({ error: "Sesión inválida" }, { status: 401 });
  }

  const state = signOAuthState(user.id);
  return NextResponse.redirect(buildInstagramAuthUrl(state));
}
