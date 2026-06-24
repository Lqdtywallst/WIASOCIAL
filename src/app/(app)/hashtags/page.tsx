"use client";

import { useState } from "react";
import { Hash, Search, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { useAuth } from "@/contexts/AuthContext";
import { callAI } from "@/lib/ai-client";
import { saveGeneratedContent } from "@/lib/db";

export default function HashtagsPage() {
  const { t, locale } = useTranslation();
  const { user } = useAuth();
  const [niche, setNiche] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [clusters, setClusters] = useState<{ tier: string; hashtags: { tag: string; posts: string; competition: string }[] }[]>([]);

  const search = async () => {
    if (!niche.trim()) return;
    setLoading(true);
    setError("");
    try {
      const result = await callAI("hashtags", { niche }, locale);
      setClusters(result.clusters);
      if (user) {
        await saveGeneratedContent(user.id, {
          content_type: "hashtags",
          niche,
          hashtags: result.clusters?.flatMap((c: { hashtags: { tag: string }[] }) => c.hashtags.map((h) => h.tag)) ?? [],
          raw_json: result,
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  const tierLabels: Record<string, string> = { large: t.hashtags.large, medium: t.hashtags.medium, small: t.hashtags.small };
  const tierColors: Record<string, string> = { large: "bg-red-500/20 text-red-400 border-red-500/30", medium: "bg-amber-500/20 text-amber-400 border-amber-500/30", small: "bg-lime/20 text-lime border-lime/30" };
  const allTags = clusters.flatMap((c) => c.hashtags.map((h) => h.tag)).join(" ");

  return (
    <div>
      <PageHeader title={t.hashtags.title} description={t.hashtags.description} />
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      <Card className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row">
          <Input id="niche" label={t.hashtags.search} value={niche} onChange={(e) => setNiche(e.target.value)} placeholder={t.hashtags.placeholder} className="flex-1" />
          <div className="flex items-end"><Button onClick={search} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}{t.common.generate}</Button></div>
        </div>
      </Card>
      {clusters.length > 0 && (
        <>
          <div className="grid gap-6 lg:grid-cols-3">
            {clusters.map((cluster) => (
              <Card key={cluster.tier}>
                <CardHeader title={tierLabels[cluster.tier] || cluster.tier} action={<Badge className={tierColors[cluster.tier]}>{cluster.hashtags.length}</Badge>} />
                <div className="space-y-2">{cluster.hashtags.map((h) => (
                  <div key={h.tag} className="rounded-lg bg-surface-elevated p-3">
                    <div className="flex justify-between"><span className="font-medium text-lime">{h.tag}</span>
                      <button onClick={() => navigator.clipboard.writeText(h.tag)} className="text-xs text-muted hover:text-lime">{t.common.copy}</button></div>
                    <p className="mt-1 text-xs text-muted">{h.posts} {t.hashtags.posts} · {h.competition}</p>
                  </div>
                ))}</div>
              </Card>
            ))}
          </div>
          <Card className="mt-6">
            <CardHeader title={t.hashtags.recommended} action={<Button variant="secondary" size="sm" onClick={() => navigator.clipboard.writeText(allTags)}><Hash className="h-3 w-3" />{t.hashtags.copyAll}</Button>} />
            <p className="text-sm text-muted">{allTags}</p>
          </Card>
        </>
      )}
    </div>
  );
}
