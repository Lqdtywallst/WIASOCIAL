"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Layers, Loader2, Clock } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { useAuth } from "@/contexts/AuthContext";
import { saveContentSeries, fetchSettings, fetchContentSeries } from "@/lib/db";
import { callAI } from "@/lib/ai-client";
import type { ContentSeriesPiece } from "@/types";

export default function ContentSeriesPage() {
  const { t, locale } = useTranslation();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [idea, setIdea] = useState("");
  const [series, setSeries] = useState<ContentSeriesPiece[]>([]);
  const [saved, setSaved] = useState<{ id: string; idea: string; pieces: ContentSeriesPiece[]; createdAt: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const ideaParam = searchParams.get("idea");
    if (ideaParam) setIdea(ideaParam);
  }, [searchParams]);

  useEffect(() => {
    if (!user) return;
    fetchContentSeries(user.id).then(setSaved).catch(() => setSaved([]));
  }, [user]);

  const generate = async () => {
    if (!idea.trim()) return;
    setLoading(true);
    setError("");
    try {
      const settings = user ? await fetchSettings(user.id) : null;
      const result = await callAI("content-series", { idea, niche: settings?.niche }, locale);
      setSeries(result.pieces);
      if (user) {
        await saveContentSeries(user.id, idea, result.pieces);
        setSaved(await fetchContentSeries(user.id));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  const typeColors: Record<string, string> = {
    reel: "bg-pink-500/20 text-pink-400 border-pink-500/30", carousel: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    story: "bg-purple-500/20 text-purple-400 border-purple-500/30", post: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  };

  return (
    <div>
      <PageHeader title={t.contentSeries.title} description={t.contentSeries.description} />
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      <Card className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row">
          <Input id="idea" label={t.contentSeries.idea} value={idea} onChange={(e) => setIdea(e.target.value)} placeholder={t.contentSeries.placeholder} className="flex-1" />
          <div className="flex items-end"><Button onClick={generate} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Layers className="h-4 w-4" />}{t.contentSeries.generate}</Button></div>
        </div>
      </Card>
      {series.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-muted">{series.length} {t.contentSeries.pieces}</p>
          {series.map((piece) => (
            <Card key={piece.day} className="!p-4">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime/20 text-sm font-bold text-lime shrink-0">{piece.day}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1"><p className="font-medium">{piece.title}</p><Badge className={typeColors[piece.type]}>{t.postType[piece.type]}</Badge></div>
                  <p className="text-sm text-lime mb-1">{piece.hook}</p><p className="text-sm text-muted">{piece.description}</p>
                </div>
                <button onClick={() => navigator.clipboard.writeText(`${piece.title}\n${piece.hook}`)} className="text-xs text-muted hover:text-lime">{t.common.copy}</button>
              </div>
            </Card>
          ))}
        </div>
      )}
      {saved.length > 0 && (
        <Card className="mt-8">
          <CardHeader title="Series guardadas" description="Haz clic para volver a cargar una serie." />
          <div className="space-y-3">
            {saved.map((item) => (
              <button
                key={item.id}
                onClick={() => { setIdea(item.idea); setSeries(item.pieces); }}
                className="flex w-full items-center justify-between rounded-lg border border-border bg-surface-elevated p-4 text-left hover:border-lime/30"
              >
                <div>
                  <p className="font-medium">{item.idea}</p>
                  <p className="text-sm text-muted">{item.pieces.length} {t.contentSeries.pieces}</p>
                </div>
                <span className="flex items-center gap-2 text-xs text-muted"><Clock className="h-3 w-3" />{item.createdAt}</span>
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
