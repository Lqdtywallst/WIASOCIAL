"use client";

import { useState, useEffect } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { OutputBlock } from "@/components/ui/PageHeader";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { useAuth } from "@/contexts/AuthContext";
import { callAI } from "@/lib/ai-client";
import { saveGeneratedContent, fetchSettings } from "@/lib/db";
import type { ContentGoal, ContentTone, GeneratedContent } from "@/types";

export default function ContentGeneratorPage() {
  const { t, locale } = useTranslation();
  const { user } = useAuth();
  const [niche, setNiche] = useState("");
  const [audience, setAudience] = useState("");
  const [offer, setOffer] = useState("");
  const [goal, setGoal] = useState<ContentGoal>("leads");
  const [tone, setTone] = useState<ContentTone>("professional");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [output, setOutput] = useState<GeneratedContent | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchSettings(user.id).then((s) => {
      if (s) {
        setNiche(s.niche);
        setAudience(s.targetAudience);
        setOffer(s.offer);
        setGoal(s.defaultGoal);
        setTone(s.defaultTone);
      }
    });
  }, [user]);

  const goalOptions = [
    { value: "followers", label: t.goalLabel.followers },
    { value: "leads", label: t.goalLabel.leads },
    { value: "sales", label: t.goalLabel.sales },
  ];
  const toneOptions = [
    { value: "luxury", label: t.tone.luxury },
    { value: "professional", label: t.tone.professional },
    { value: "aggressive", label: t.tone.aggressive },
    { value: "educational", label: t.tone.educational },
  ];

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await callAI("content", { niche, audience, offer, goal, tone }, locale);
      const content: GeneratedContent = {
        hook: result.hook,
        reelScript: result.reelScript,
        caption: result.caption,
        cta: result.cta,
        hashtags: result.hashtags,
        storySequence: result.storySequence,
        dmReplyTemplate: result.dmReplyTemplate,
      };
      setOutput(content);
      if (user) {
        await saveGeneratedContent(user.id, {
          content_type: "full", niche, audience, offer, goal, tone,
          hook: content.hook, reel_script: content.reelScript,
          caption: content.caption, cta: content.cta,
          hashtags: content.hashtags, story_sequence: content.storySequence,
          dm_reply_template: content.dmReplyTemplate,
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title={t.contentGenerator.title} description={t.contentGenerator.description} />
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title={t.contentGenerator.brief} description={t.contentGenerator.briefDesc} />
          <div className="space-y-4">
            <Input id="niche" label={t.common.niche} value={niche} onChange={(e) => setNiche(e.target.value)} placeholder={t.contentGenerator.nichePlaceholder} />
            <Input id="audience" label={t.contentGenerator.targetAudience} value={audience} onChange={(e) => setAudience(e.target.value)} placeholder={t.contentGenerator.audiencePlaceholder} />
            <Textarea id="offer" label={t.contentGenerator.offer} value={offer} onChange={(e) => setOffer(e.target.value)} rows={2} placeholder={t.contentGenerator.offerPlaceholder} />
            <div className="grid grid-cols-2 gap-4">
              <Select id="goal" label={t.contentGenerator.goal} value={goal} onChange={(e) => setGoal(e.target.value as ContentGoal)} options={goalOptions} />
              <Select id="tone" label={t.contentGenerator.tone} value={tone} onChange={(e) => setTone(e.target.value as ContentTone)} options={toneOptions} />
            </div>
            <Button onClick={handleGenerate} disabled={loading} className="w-full">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" />{t.common.generating}</> : <><Sparkles className="h-4 w-4" />{t.contentGenerator.generateContent}</>}
            </Button>
          </div>
        </Card>
        <div className="space-y-4">
          {output ? (
            <>
              <OutputBlock label={t.contentGenerator.hook} content={output.hook} copyLabel={t.common.copy} />
              <OutputBlock label={t.contentGenerator.reelScript} content={output.reelScript} copyLabel={t.common.copy} />
              <OutputBlock label={t.contentGenerator.caption} content={output.caption} copyLabel={t.common.copy} />
              <OutputBlock label={t.contentGenerator.cta} content={output.cta} copyLabel={t.common.copy} />
              <OutputBlock label={t.contentGenerator.hashtags} content={output.hashtags.join(" ")} copyLabel={t.common.copy} />
              <OutputBlock label={t.contentGenerator.storySequence} content={output.storySequence} copyLabel={t.common.copy} />
              <OutputBlock label={t.contentGenerator.dmReply} content={output.dmReplyTemplate} copyLabel={t.common.copy} />
            </>
          ) : (
            <Card className="flex h-full min-h-[400px] items-center justify-center">
              <div className="text-center">
                <Sparkles className="mx-auto h-12 w-12 text-lime/30" />
                <p className="mt-4 text-muted">{t.contentGenerator.emptyState}</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
