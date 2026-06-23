"use client";

import { useEffect, useState, useCallback } from "react";
import { TrendingUp, Plus, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import { formatDate } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { useAuth } from "@/contexts/AuthContext";
import { fetchFollowerSnapshots, logFollowers } from "@/lib/db";

export default function GrowthTrackerPage() {
  const { t, locale } = useTranslation();
  const { user } = useAuth();
  const [snapshots, setSnapshots] = useState<{ id: string; date: string; followers: number; gained: number; topPost?: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState("");
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    setSnapshots(await fetchFollowerSnapshots(user.id));
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const latest = snapshots[snapshots.length - 1];
  const weekAgo = snapshots[snapshots.length - 2];
  const monthAgo = snapshots[0];
  const weekGain = latest && weekAgo ? latest.followers - weekAgo.followers : 0;
  const monthGain = latest && monthAgo ? latest.followers - monthAgo.followers : 0;
  const maxFollowers = Math.max(...snapshots.map((s) => s.followers), 1);

  const handleLog = async () => {
    if (!user || !count) return;
    const newCount = parseInt(count);
    const prev = latest?.followers ?? 0;
    await logFollowers(user.id, newCount, newCount - prev);
    await load();
    setCount("");
    setShowForm(false);
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-lime" /></div>;

  return (
    <div>
      <PageHeader title={t.growthTracker.title} description={t.growthTracker.description}
        action={<Button onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4" />{t.growthTracker.logFollowers}</Button>} />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title={t.growthTracker.current} value={latest?.followers ?? 0} icon={TrendingUp} trendUp />
        <StatCard title={t.growthTracker.thisWeek} value={`+${weekGain}`} icon={TrendingUp} trendUp />
        <StatCard title={t.growthTracker.thisMonth} value={`+${monthGain}`} icon={TrendingUp} trendUp />
      </div>
      {showForm && (
        <Card className="mt-6">
          <div className="flex gap-4">
            <Input id="count" label={t.growthTracker.count} type="number" value={count} onChange={(e) => setCount(e.target.value)} className="flex-1" />
            <div className="flex items-end gap-2"><Button onClick={handleLog}>{t.common.save}</Button><Button variant="ghost" onClick={() => setShowForm(false)}>{t.common.cancel}</Button></div>
          </div>
        </Card>
      )}
      <Card className="mt-6">
        <CardHeader title={t.growthTracker.history} />
        {snapshots.length === 0 ? (
          <p className="text-sm text-muted py-8 text-center">Registra tus seguidores actuales desde Instagram para empezar a trackear</p>
        ) : (
          <>
            <div className="mb-6 flex items-end gap-2 h-40">
              {snapshots.map((s) => (
                <div key={s.id} className="flex flex-1 flex-col items-center gap-1">
                  <div className="w-full rounded-t gradient-lime min-h-[4px]" style={{ height: `${(s.followers / maxFollowers) * 100}%` }} />
                  <span className="text-[10px] text-muted">{formatDate(s.date, locale).split(" ")[0]}</span>
                  <span className="text-xs font-bold text-lime">{s.followers}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {[...snapshots].reverse().map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-lg bg-surface-elevated p-3 text-sm">
                  <span className="text-muted">{formatDate(s.date, locale)}</span>
                  <span className="font-bold">{s.followers.toLocaleString()}</span>
                  <span className="text-lime">+{s.gained}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
