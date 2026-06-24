"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import { safeInternalRedirect } from "@/lib/safe-redirect";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Verificando tu cuenta...");

  useEffect(() => {
    const handleAuth = async () => {
      const sb = getSupabase();
      const params = new URLSearchParams(window.location.search);
      const authError = params.get("error_description") || params.get("error");
      const redirectParam = params.get("redirect");
      const redirectTo = safeInternalRedirect(redirectParam);

      if (authError) {
        setMessage(decodeURIComponent(authError));
        setTimeout(() => router.replace("/login"), 4000);
        return;
      }

      const code = params.get("code");
      const tokenHash = params.get("token_hash");
      const type = params.get("type");

      if (code) {
        const { error } = await sb.auth.exchangeCodeForSession(code);
        if (error) {
          setMessage(error.message);
          setTimeout(() => router.replace("/login"), 4000);
          return;
        }
      } else if (tokenHash && type) {
        const { error } = await sb.auth.verifyOtp({
          token_hash: tokenHash,
          type: type as "signup" | "email" | "recovery" | "invite" | "email_change",
        });
        if (error) {
          setMessage(error.message);
          setTimeout(() => router.replace("/login"), 4000);
          return;
        }
      }

      const { data: { session } } = await sb.auth.getSession();
      router.replace(session ? redirectTo : "/login");
    };

    handleAuth();
  }, [router]);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3 bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-lime" />
      <p className="text-sm text-muted">{message}</p>
    </div>
  );
}
