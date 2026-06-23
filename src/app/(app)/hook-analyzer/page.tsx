"use client";

import { useState } from "react";
import { Target, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { callAI } from "@/lib/ai-client";

export default function HookAnalyzerPage() {
  const { t, locale } = useTranslation();
  const [hook, setHook] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ score: number; strengths: string[]; weaknesses: string[]; variants: string[] } | null>(null);

  const analyze = async () => {
    if (!hook.trim()) return;
    setLoading(true);
    setError("");
    try {
      setResult(await callAI("hook-analyze", { hook }, locale));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title={t.hookAnalyzer.title} description={t.hookAnalyzer.description} />
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title={t.hookAnalyzer.input} />
          <Textarea id="hook" value={hook} onChange={(e) => setHook(e.target.value)} placeholder={t.hookAnalyzer.placeholder} rows={4} />
          <Button onClick={analyze} disabled={loading || !hook.trim()} className="mt-4 w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Target className="h-4 w-4" />}{t.hookAnalyzer.analyze}
          </Button>
        </Card>
        {result ? (
          <div className="space-y-4">
            <Card glow className="text-center">
              <p className="text-sm text-muted">{t.hookAnalyzer.score}</p>
              <p className="text-5xl font-bold text-lime">{result.score}/10</p>
            </Card>
            <Card><CardHeader title={t.hookAnalyzer.strengths} /><ul className="space-y-1">{result.strengths.map((s, i) => <li key={i} className="text-sm">✓ {s}</li>)}</ul></Card>
            {result.weaknesses?.length > 0 && <Card><CardHeader title={t.hookAnalyzer.weaknesses} /><ul className="space-y-1">{result.weaknesses.map((w, i) => <li key={i} className="text-sm text-amber-400">→ {w}</li>)}</ul></Card>}
            <Card><CardHeader title={t.hookAnalyzer.variants} /><div className="space-y-2">{result.variants.map((v, i) => (
              <div key={i} className="rounded-lg bg-surface-elevated p-3 text-sm flex justify-between gap-2"><span>{v}</span>
                <button onClick={() => navigator.clipboard.writeText(v)} className="text-xs text-lime shrink-0">{t.common.copy}</button></div>
            ))}</div></Card>
          </div>
        ) : <Card className="flex min-h-[300px] items-center justify-center"><Target className="h-12 w-12 text-lime/20" /></Card>}
      </div>
    </div>
  );
}
