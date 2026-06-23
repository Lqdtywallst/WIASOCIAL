"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Radar, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { fetchGrowthRadar, generateGrowthRadar, type GrowthRadarResponse } from "@/lib/ai-client";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

export function GrowthRadarCard() {
  const { locale } = useTranslation();
  const [data, setData] = useState<GrowthRadarResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const es = locale === "es";

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const existing = await fetchGrowthRadar();
        const result = existing.report ? existing : await generateGrowthRadar(locale);
        if (mounted) setData(result);
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : "Error");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [locale]);

  if (loading) {
    return (
      <Card className="flex h-full min-h-48 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-lime" />
      </Card>
    );
  }

  if (error || !data?.report) {
    return (
      <Card className="h-full">
        <div className="flex items-center gap-2">
          <Radar className="h-5 w-5 text-lime" />
          <p className="text-xs font-semibold uppercase tracking-wider text-lime">Radar IA</p>
        </div>
        <p className="mt-3 text-sm text-muted">
          {error ?? (es ? "Genera tu Radar para ver oportunidades de crecimiento." : "Generate your Radar to see growth opportunities.")}
        </p>
        <Link href="/growth-radar" className="mt-4 block">
          <Button variant="secondary" size="sm" className="w-full">
            {es ? "Abrir Radar" : "Open Radar"}
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </Card>
    );
  }

  const report = data.report;

  return (
    <Card glow className="h-full">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-lime/10">
            <Radar className="h-5 w-5 text-lime" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-lime">Radar IA</p>
            <h3 className="text-lg font-bold text-foreground">{report.headline}</h3>
          </div>
        </div>
        <div className="rounded-full border border-lime/30 bg-lime/10 px-3 py-1 text-sm font-bold text-lime">
          {report.opportunityScore}
        </div>
      </div>

      <p className="mt-3 text-sm text-muted">{report.biggestOpportunity}</p>

      <div className="mt-4 rounded-lg border border-lime/20 bg-lime/5 p-3">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-lime" />
          <p className="text-sm font-medium">{es ? "Siguiente accion" : "Next action"}</p>
        </div>
        <p className="text-sm">
          {report.recommendations[0]?.action ?? (es ? "Revisa tu plan semanal de crecimiento." : "Review your weekly growth plan.")}
        </p>
      </div>

      <Link href="/growth-radar" className="mt-4 block">
        <Button variant="secondary" size="sm" className="w-full">
          {es ? "Ver Radar completo" : "View full Radar"}
          <ArrowRight className="h-3 w-3" />
        </Button>
      </Link>
    </Card>
  );
}
