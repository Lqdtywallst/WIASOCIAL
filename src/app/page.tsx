import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase";

export default function Home() {
  if (!isSupabaseConfigured()) {
    redirect("/setup");
  }
  redirect("/dashboard");
}
