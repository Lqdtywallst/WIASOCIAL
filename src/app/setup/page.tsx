import { Zap, Database, Key, ExternalLink } from "lucide-react";
import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase";
import { redirect } from "next/navigation";

export default function SetupPage() {
  const configured = isSupabaseConfigured();

  if (configured) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-lime">
            <Zap className="h-6 w-6 text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Configuración inicial</h1>
            <p className="text-muted">Conecta Supabase y OpenAI para datos reales</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="flex items-center gap-3 mb-4">
              <Database className="h-5 w-5 text-lime" />
              <h2 className="font-semibold text-foreground">1. Crear proyecto Supabase</h2>
            </div>
            <ol className="space-y-2 text-sm text-muted list-decimal list-inside">
              <li>
                Ve a{" "}
                <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-lime hover:underline inline-flex items-center gap-1">
                  supabase.com <ExternalLink className="h-3 w-3" />
                </a>{" "}
                y crea un proyecto gratis
              </li>
              <li>En SQL Editor, pega y ejecuta el contenido de <code className="text-lime">supabase/schema.sql</code></li>
              <li>En Settings → API, copia la URL y la anon key</li>
            </ol>
          </div>

          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="flex items-center gap-3 mb-4">
              <Key className="h-5 w-5 text-lime" />
              <h2 className="font-semibold text-foreground">2. Obtener OpenAI API Key</h2>
            </div>
            <ol className="space-y-2 text-sm text-muted list-decimal list-inside">
              <li>
                Ve a{" "}
                <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-lime hover:underline inline-flex items-center gap-1">
                  platform.openai.com <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>Crea una API key y cópiala</li>
            </ol>
          </div>

          <div className="rounded-xl border border-lime/20 bg-lime/5 p-6">
            <h2 className="font-semibold text-foreground mb-3">3. Editar .env.local</h2>
            <pre className="rounded-lg bg-surface-elevated p-4 text-xs text-muted overflow-x-auto">{`NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
OPENAI_API_KEY=sk-tu_openai_key`}</pre>
            <p className="mt-3 text-sm text-muted">Reinicia el servidor después de guardar: <code className="text-lime">./start-dev.sh</code></p>
          </div>

          <Link href="/login" className="block text-center text-sm text-lime hover:underline">
            Ya configuré todo → Ir al login
          </Link>
        </div>
      </div>
    </div>
  );
}
