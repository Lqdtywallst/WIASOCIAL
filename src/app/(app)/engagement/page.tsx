"use client";

import { useEffect, useState, useCallback } from "react";
import { Handshake, Search, ExternalLink, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchEngagementTargets, saveEngagementTargets, markTargetEngaged,
  fetchEngagementTasks, saveEngagementTasks, toggleEngagementTask, fetchSettings,
} from "@/lib/db";
import { callAI } from "@/lib/ai-client";
import type { EngagementTarget } from "@/types";

export default function EngagementPage() {
  const { t, locale } = useTranslation();
  const { user } = useAuth();
  const today = new Date().toISOString().split("T")[0];
  const [niche, setNiche] = useState("");
  const [targets, setTargets] = useState<EngagementTarget[]>([]);
  const [dailyTasks, setDailyTasks] = useState<{ id: string; username: string; action: string; commentTemplate: string; completed: boolean }[]>([]);
  const [searching, setSearching] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [error, setError] = useState("");

  const generateDailyPlan = useCallback(async (n?: string) => {
    if (!user) return;
    setLoadingPlan(true);
    try {
      const result = await callAI("engagement-plan", { niche: n || niche }, locale);
      await saveEngagementTasks(user.id, today, result.tasks);
      setDailyTasks(await fetchEngagementTasks(user.id, today));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoadingPlan(false);
    }
  }, [user, niche, locale, today]);

  const load = useCallback(async () => {
    if (!user) return;
    const settings = await fetchSettings(user.id);
    if (settings?.niche) setNiche(settings.niche);
    setTargets(await fetchEngagementTargets(user.id));
    const tasks = await fetchEngagementTasks(user.id, today);
    setDailyTasks(tasks);
    if (tasks.length === 0 && settings?.niche) {
      const result = await callAI("engagement-plan", { niche: settings.niche }, locale);
      await saveEngagementTasks(user.id, today, result.tasks);
      setDailyTasks(await fetchEngagementTasks(user.id, today));
    }
  }, [user, today, locale]);

  useEffect(() => { load(); }, [load]);

  const handleSearch = async () => {
    if (!user) return;
    setSearching(true);
    setError("");
    try {
      const result = await callAI("engagement-targets", { niche }, locale);
      await saveEngagementTargets(user.id, result.targets);
      setTargets(await fetchEngagementTargets(user.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setSearching(false);
    }
  };

  const toggleTask = async (id: string, completed: boolean) => {
    await toggleEngagementTask(id, completed);
    setDailyTasks(dailyTasks.map((t) => (t.id === id ? { ...t, completed } : t)));
  };

  const markEngaged = async (id: string) => {
    await markTargetEngaged(id);
    setTargets(targets.map((t) => t.id === id ? { ...t, lastEngaged: today } : t));
  };

  const completedCount = dailyTasks.filter((t) => t.completed).length;
  const tips = [
    { title: t.engagement.tip1Title, tip: t.engagement.tip1 },
    { title: t.engagement.tip2Title, tip: t.engagement.tip2 },
    { title: t.engagement.tip3Title, tip: t.engagement.tip3 },
    { title: t.engagement.tip4Title, tip: t.engagement.tip4 },
  ];

  return (
    <div>
      <PageHeader title={t.engagement.title} description={t.engagement.description} />
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      <Card className="mb-6" glow>
        <CardHeader title={t.engagement.dailyPlan} description={`${t.engagement.progress}: ${completedCount}/${dailyTasks.length}`}
          action={<Button variant="secondary" size="sm" onClick={() => generateDailyPlan()} disabled={loadingPlan}>{loadingPlan ? <Loader2 className="h-3 w-3 animate-spin" /> : "↻"}</Button>} />
        <div className="mb-3 h-2 rounded-full bg-surface-elevated overflow-hidden">
          <div className="h-full gradient-lime rounded-full transition-all" style={{ width: dailyTasks.length ? `${(completedCount / dailyTasks.length) * 100}%` : "0%" }} />
        </div>
        <div className="space-y-3">
          {dailyTasks.map((task) => (
            <div key={task.id} className={`rounded-lg border p-4 ${task.completed ? "border-lime/20 bg-lime/5" : "border-border bg-surface-elevated"}`}>
              <div className="flex items-start justify-between gap-3">
                <div><div className="flex items-center gap-2"><p className="font-medium">{task.username}</p><Badge className="bg-surface text-muted border-border text-xs">{task.action}</Badge></div>
                  <p className="mt-2 text-sm text-muted italic">&ldquo;{task.commentTemplate}&rdquo;</p></div>
                <Button variant={task.completed ? "ghost" : "secondary"} size="sm" onClick={() => toggleTask(task.id, !task.completed)}>
                  <CheckCircle2 className="h-3.5 w-3.5" />{task.completed ? "✓" : "→"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mb-6 border-lime/20 bg-lime/5">
        <div className="flex items-start gap-3"><Handshake className="h-5 w-5 text-lime shrink-0 mt-0.5" />
          <div><p className="text-sm font-medium text-lime">{t.engagement.bannerTitle}</p><p className="mt-1 text-sm text-muted">{t.engagement.bannerDesc}</p></div></div>
      </Card>

      <Card className="mb-6">
        <CardHeader title={t.engagement.findAccounts} description={t.engagement.findAccountsDesc} />
        <div className="flex flex-col gap-4 sm:flex-row">
          <Input id="niche" label={t.engagement.yourNiche} value={niche} onChange={(e) => setNiche(e.target.value)} className="flex-1" />
          <div className="flex items-end"><Button onClick={handleSearch} disabled={searching}><Search className="h-4 w-4" />{searching ? t.engagement.searching : t.engagement.find}</Button></div>
        </div>
      </Card>

      <div className="space-y-3">
        {targets.map((target) => (
          <Card key={target.id} className="!p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{target.username}</p>
                  <a href={`https://instagram.com/${target.username.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-lime"><ExternalLink className="h-3.5 w-3.5" /></a>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Badge className="bg-surface-elevated text-muted border-border">{target.niche}</Badge>
                  <span className="text-xs text-muted">{target.followers} {t.engagement.followers}</span>
                  <span className="text-xs text-lime">{target.engagementRate} {t.engagement.engagement}</span>
                </div>
                <p className="mt-2 text-sm text-muted">{target.reason}</p>
                {target.lastEngaged && <p className="mt-1 flex items-center gap-1 text-xs text-lime"><CheckCircle2 className="h-3 w-3" />{t.engagement.lastEngaged}: {formatDate(target.lastEngaged, locale)}</p>}
              </div>
              <Button variant={target.lastEngaged ? "ghost" : "secondary"} size="sm" onClick={() => markEngaged(target.id)}>
                <Clock className="h-3.5 w-3.5" />{target.lastEngaged ? t.engagement.engagedToday : t.engagement.markEngaged}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader title={t.engagement.tips} description={t.engagement.tipsDesc} />
        <div className="grid gap-4 sm:grid-cols-2">{tips.map((item) => (
          <div key={item.title} className="rounded-lg border border-border bg-surface-elevated p-4">
            <p className="font-medium">{item.title}</p><p className="mt-1 text-sm text-muted">{item.tip}</p>
          </div>
        ))}</div>
      </Card>
    </div>
  );
}
