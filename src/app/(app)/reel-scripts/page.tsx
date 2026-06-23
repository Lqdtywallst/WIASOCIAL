"use client";

import { useEffect, useState } from "react";
import { Film, Loader2, Clock } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { OutputBlock } from "@/components/ui/PageHeader";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { useAuth } from "@/contexts/AuthContext";
import { fetchReelScripts, saveReelScript, fetchSettings } from "@/lib/db";
import { callAI } from "@/lib/ai-client";
import { formatDate, formatAiText } from "@/lib/utils";

export default function ReelScriptsPage() {
  const { t, locale } = useTranslation();
  const { user } = useAuth();
  const [topic, setTopic] = useState("");
  const [niche, setNiche] = useState("");
  const [duration, setDuration] = useState("30");
  const [style, setStyle] = useState("talking_head");
  const [keyPoints, setKeyPoints] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  const [generatedHook, setGeneratedHook] = useState<string | null>(null);
  const [saved, setSaved] = useState<{ id: string; title: string; hook: string; script: string; duration: string; niche: string; createdAt: string }[]>([]);

  useEffect(() => {
    if (!user) return;
    fetchSettings(user.id).then((s) => { if (s?.niche) setNiche(s.niche); });
    fetchReelScripts(user.id).then(setSaved);
  }, [user]);

  const durationOptions = [
    { value: "15", label: t.reelScripts.sec15 }, { value: "30", label: t.reelScripts.sec30 },
    { value: "60", label: t.reelScripts.sec60 }, { value: "90", label: t.reelScripts.sec90 },
  ];
  const styleOptions = [
    { value: "talking_head", label: t.reelScripts.talkingHead }, { value: "broll", label: t.reelScripts.broll },
    { value: "text_overlay", label: t.reelScripts.textOverlay }, { value: "tutorial", label: t.reelScripts.tutorial },
  ];

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await callAI("reel-script", { topic, niche, duration, style, keyPoints }, locale);
      const hook = formatAiText(result.hook);
      const script = formatAiText(result.script);
      const title = formatAiText(result.title) || topic;
      setGeneratedHook(hook);
      setGeneratedScript(script);
      if (user) {
        await saveReelScript(user.id, { title, hook, script, duration: `${duration}s`, niche });
        setSaved(await fetchReelScripts(user.id));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title={t.reelScripts.title} description={t.reelScripts.description} />
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title={t.reelScripts.brief} description={t.reelScripts.briefDesc} />
          <div className="space-y-4">
            <Input id="topic" label={t.reelScripts.topic} value={topic} onChange={(e) => setTopic(e.target.value)} placeholder={t.reelScripts.topicPlaceholder} />
            <Input id="niche" label={t.common.niche} value={niche} onChange={(e) => setNiche(e.target.value)} />
            <div className="grid grid-cols-2 gap-4">
              <Select id="duration" label={t.reelScripts.duration} value={duration} onChange={(e) => setDuration(e.target.value)} options={durationOptions} />
              <Select id="style" label={t.reelScripts.style} value={style} onChange={(e) => setStyle(e.target.value)} options={styleOptions} />
            </div>
            <Textarea id="keyPoints" label={t.reelScripts.keyPoints} value={keyPoints} onChange={(e) => setKeyPoints(e.target.value)} rows={3} />
            <Button onClick={handleGenerate} disabled={loading} className="w-full">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" />{t.reelScripts.writing}</> : <><Film className="h-4 w-4" />{t.reelScripts.generate}</>}
            </Button>
          </div>
        </Card>
        <div className="space-y-4">
          {generatedScript ? (
            <>
              <OutputBlock label={t.contentGenerator.hook} content={generatedHook!} copyLabel={t.common.copy} />
              <OutputBlock label={t.reelScripts.fullScript} content={generatedScript} copyLabel={t.common.copy} />
            </>
          ) : (
            <Card className="flex h-full min-h-[400px] items-center justify-center"><Film className="h-12 w-12 text-lime/30" /></Card>
          )}
        </div>
      </div>
      {saved.length > 0 && (
        <Card className="mt-8">
          <CardHeader title={t.reelScripts.saved} description={t.reelScripts.savedDesc} />
          <div className="space-y-3">{saved.map((script) => (
            <div key={script.id} className="flex items-center justify-between rounded-lg border border-border bg-surface-elevated p-4">
              <div><p className="font-medium">{script.title}</p><p className="text-sm text-muted line-clamp-1">{script.hook}</p></div>
              <div className="flex items-center gap-3 text-sm text-muted"><Clock className="h-3 w-3" />{script.duration}<span>{formatDate(script.createdAt, locale)}</span></div>
            </div>
          ))}</div>
        </Card>
      )}
    </div>
  );
}
