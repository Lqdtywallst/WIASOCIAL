"use client";

import { useEffect, useState } from "react";
import { CircleDot, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { useAuth } from "@/contexts/AuthContext";
import { fetchStorySets, saveStorySet } from "@/lib/db";
import { callAI } from "@/lib/ai-client";
import { formatDate } from "@/lib/utils";

export default function StoriesPage() {
  const { t, locale } = useTranslation();
  const { user } = useAuth();
  const [idea, setIdea] = useState("");
  const [storyType, setStoryType] = useState("educational");
  const [cta, setCta] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stories, setStories] = useState<{ slide: number; content: string; type: string }[]>([]);
  const [saved, setSaved] = useState<{ id: string; idea: string; stories: { slide: number; content: string; type: string }[]; createdAt: string }[]>([]);

  useEffect(() => {
    if (user) fetchStorySets(user.id).then(setSaved);
  }, [user]);

  const storyTypeOptions = [
    { value: "educational", label: t.stories.educational }, { value: "behind_scenes", label: t.stories.behindScenes },
    { value: "testimonial", label: t.stories.testimonial }, { value: "promo", label: t.stories.promo },
    { value: "engagement", label: t.stories.engagement },
  ];
  const typeColors: Record<string, string> = {
    Hook: "bg-lime/20 text-lime border-lime/30", Problem: "bg-red-500/20 text-red-400 border-red-500/30",
    Solution: "bg-blue-500/20 text-blue-400 border-blue-500/30", Engagement: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    CTA: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await callAI("stories", { idea, storyType, cta }, locale);
      setStories(result.stories);
      if (user) {
        await saveStorySet(user.id, idea, result.stories);
        setSaved(await fetchStorySets(user.id));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title={t.stories.title} description={t.stories.description} />
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title={t.stories.brief} description={t.stories.briefDesc} />
          <div className="space-y-4">
            <Input id="idea" label={t.stories.idea} value={idea} onChange={(e) => setIdea(e.target.value)} placeholder={t.stories.ideaPlaceholder} />
            <Select id="storyType" label={t.stories.storyType} value={storyType} onChange={(e) => setStoryType(e.target.value)} options={storyTypeOptions} />
            <Input id="cta" label={t.stories.cta} value={cta} onChange={(e) => setCta(e.target.value)} placeholder={t.stories.ctaPlaceholder} />
            <Button onClick={handleGenerate} disabled={loading} className="w-full">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" />{t.stories.generating}</> : <><CircleDot className="h-4 w-4" />{t.stories.generate}</>}
            </Button>
          </div>
        </Card>
        <div className="space-y-3">
          {stories.length > 0 ? stories.map((story) => (
            <div key={story.slide} className="rounded-lg border border-border bg-surface-elevated p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-lime/20 text-xs font-bold text-lime">{story.slide}</span>
                  <Badge className={typeColors[story.type] || ""}>{t.storyType[story.type as keyof typeof t.storyType] || story.type}</Badge>
                </div>
                <button onClick={() => navigator.clipboard.writeText(story.content)} className="text-xs text-muted hover:text-lime">{t.common.copy}</button>
              </div>
              <p className="text-sm">{story.content}</p>
            </div>
          )) : <Card className="flex h-full min-h-[400px] items-center justify-center"><CircleDot className="h-12 w-12 text-lime/30" /></Card>}
        </div>
      </div>
      {saved.length > 0 && (
        <Card className="mt-8">
          <CardHeader title={t.stories.saved} description={t.stories.savedDesc} />
          {saved.map((set) => (
            <button
              key={set.id}
              onClick={() => { setIdea(set.idea); setStories(set.stories); }}
              className="mb-4 flex w-full justify-between rounded-lg border border-border bg-surface-elevated p-4 text-left hover:border-lime/30"
            >
              <div className="flex justify-between mb-2"><p className="font-medium">{set.idea}</p><span className="text-sm text-muted">{formatDate(set.createdAt, locale)}</span></div>
            </button>
          ))}
        </Card>
      )}
    </div>
  );
}
