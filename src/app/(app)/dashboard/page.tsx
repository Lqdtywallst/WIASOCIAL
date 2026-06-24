"use client";

import { Suspense, useEffect, useState } from "react";
import { Users, Phone, TrendingUp, Calendar, Lightbulb, ArrowRight, Target, Hash, UserCheck, Clock, Layers, Loader2, Megaphone, Workflow, CheckCircle2, Settings, Instagram, Radar } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatNumber, formatDate, isToday } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { useAuth } from "@/contexts/AuthContext";
import { fetchLeads, fetchPosts, fetchFollowUps, fetchFollowerSnapshots, fetchSettings } from "@/lib/db";
import { DailyBriefCard } from "@/components/ai/DailyBriefCard";
import { GrowthRadarCard } from "@/components/ai/GrowthRadarCard";
import { InstagramConnectBanner } from "@/components/instagram/InstagramConnectBanner";
import { fetchInstagramConnection } from "@/lib/instagram-client";

export default function DashboardPage() {
  const { t, locale } = useTranslation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [totalLeads, setTotalLeads] = useState(0);
  const [callsBooked, setCallsBooked] = useState(0);
  const [clients, setClients] = useState(0);
  const [followUpsToday, setFollowUpsToday] = useState<{ leadUsername: string; note: string }[]>([]);
  const [bestPost, setBestPost] = useState<{ title: string; postedAt: string; type: string; views: number; saves: number; leadsGenerated: number } | null>(null);
  const [weekGain, setWeekGain] = useState(0);
  const [brandConfigured, setBrandConfigured] = useState(false);
  const [instagramConnected, setInstagramConnected] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [leads, posts, followUps, snapshots, settings, instagram] = await Promise.all([
        fetchLeads(user.id),
        fetchPosts(user.id),
        fetchFollowUps(user.id),
        fetchFollowerSnapshots(user.id),
        fetchSettings(user.id),
        fetchInstagramConnection().catch(() => null),
      ]);
      setTotalLeads(leads.length);
      setCallsBooked(leads.filter((l) => l.status === "call_booked").length);
      setClients(leads.filter((l) => l.status === "client").length);
      setFollowUpsToday(followUps.filter((f) => isToday(f.dueDate)));
      const sorted = [...posts].sort((a, b) => b.views - a.views);
      if (sorted[0]) setBestPost(sorted[0]);
      const latest = snapshots[snapshots.length - 1];
      const prev = snapshots[snapshots.length - 2];
      if (latest && prev) setWeekGain(latest.followers - prev.followers);
      setBrandConfigured(Boolean(settings?.niche && settings?.targetAudience && settings?.offer));
      setInstagramConnected(Boolean(instagram));
      setLoading(false);
    })();
  }, [user]);

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-lime" /></div>;

  return (
    <div>
      <PageHeader title={t.dashboard.title} description={t.dashboard.description}
        action={<Link href="/content-generator"><Button><Lightbulb className="h-4 w-4" />{t.dashboard.generateContent}</Button></Link>} />

      <Suspense fallback={<div className="h-24 animate-pulse rounded-xl bg-surface-elevated" />}>
        <InstagramConnectBanner />
      </Suspense>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card glow>
          <CardHeader
            title="Siguiente mejor acción"
            description="WIA prioriza el paso que más desbloquea crecimiento real ahora mismo."
          />
          <NextAction
            brandConfigured={brandConfigured}
            instagramConnected={instagramConnected}
            totalLeads={totalLeads}
            bestPost={Boolean(bestPost)}
          />
        </Card>

        <Card>
          <CardHeader title="Checklist de activación IA" description="Completa estos pasos para que la IA trabaje con más contexto." />
          <ActivationChecklist
            items={[
              { label: "Perfil de marca configurado", done: brandConfigured, href: "/settings", icon: Settings },
              { label: "Instagram conectado", done: instagramConnected, href: "/instagram-data", icon: Instagram },
              { label: "Radar IA generado", done: true, href: "/growth-radar", icon: Radar },
              { label: "Primer lead en CRM", done: totalLeads > 0, href: "/leads", icon: Users },
            ]}
          />
        </Card>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title={t.dashboard.totalLeads} value={totalLeads} icon={Users} trendUp />
        <StatCard title={t.dashboard.callsBooked} value={callsBooked} icon={Phone} trendUp />
        <StatCard title={t.dashboard.activeClients} value={clients} icon={TrendingUp} />
        <StatCard title={t.dashboard.followUpsToday} value={followUpsToday.length} icon={Calendar} />
      </div>

      <div className="mt-4">
        <StatCard title="Seguidores esta semana" value={`+${weekGain}`} icon={TrendingUp} trend={`+${weekGain} ganados`} trendUp />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <GrowthRadarCard />
        <DailyBriefCard />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card glow>
          <CardHeader title={t.dashboard.bestContent} description={t.dashboard.bestContentDesc} />
          {bestPost ? (
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div><p className="font-medium">{bestPost.title}</p><p className="text-sm text-muted">{t.common.posted} {formatDate(bestPost.postedAt, locale)} · {t.postType[bestPost.type as keyof typeof t.postType]}</p></div>
                <Badge className="bg-lime/20 text-lime border-lime/30">#1 {t.dashboard.top}</Badge>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-surface-elevated p-3 text-center"><p className="text-lg font-bold text-lime">{formatNumber(bestPost.views)}</p><p className="text-xs text-muted">{t.common.views}</p></div>
                <div className="rounded-lg bg-surface-elevated p-3 text-center"><p className="text-lg font-bold">{formatNumber(bestPost.saves)}</p><p className="text-xs text-muted">{t.common.saves}</p></div>
                <div className="rounded-lg bg-surface-elevated p-3 text-center"><p className="text-lg font-bold">{bestPost.leadsGenerated}</p><p className="text-xs text-muted">{t.common.leads}</p></div>
              </div>
              <Link href="/analytics"><Button variant="secondary" size="sm" className="w-full">{t.dashboard.viewAnalytics}<ArrowRight className="h-3 w-3" /></Button></Link>
            </div>
          ) : <p className="text-sm text-muted">Registra publicaciones en Analíticas para ver tu mejor contenido</p>}
        </Card>

        <Card>
          <CardHeader title={t.dashboard.followUpsDue} description={`${followUpsToday.length} ${t.dashboard.reminders}`} />
          {followUpsToday.length > 0 ? (
            <div className="space-y-3">{followUpsToday.map((f, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-surface-elevated p-3">
                <div><p className="text-sm font-medium">{f.leadUsername}</p><p className="text-xs text-muted">{f.note}</p></div>
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">{t.common.due}</Badge>
              </div>
            ))}</div>
          ) : <p className="text-sm text-muted">{t.dashboard.noFollowUps}</p>}
          <Link href="/leads" className="mt-4 block"><Button variant="ghost" size="sm">{t.dashboard.manageLeads}<ArrowRight className="h-3 w-3" /></Button></Link>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title={t.dashboard.growthTools} description={t.dashboard.growthToolsDesc} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: "/calendar", icon: Calendar, label: t.nav.calendar },
            { href: "/hook-analyzer", icon: Target, label: t.nav.hookAnalyzer },
            { href: "/hashtags", icon: Hash, label: t.nav.hashtags },
            { href: "/profile-audit", icon: UserCheck, label: t.nav.profileAudit },
            { href: "/best-times", icon: Clock, label: t.nav.bestTimes },
            { href: "/content-series", icon: Layers, label: t.nav.contentSeries },
            { href: "/marketing-plan", icon: Megaphone, label: t.nav.marketingPlan },
            { href: "/funnel-builder", icon: Workflow, label: t.nav.funnelBuilder },
          ].map((tool) => (
            <Link key={tool.href} href={tool.href} className="flex items-center gap-3 rounded-lg border border-border bg-surface-elevated p-4 hover:border-lime/30">
              <tool.icon className="h-5 w-5 text-lime" /><span className="text-sm font-medium">{tool.label}</span><ArrowRight className="h-3 w-3 text-muted ml-auto" />
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}

function NextAction({
  brandConfigured,
  instagramConnected,
  totalLeads,
  bestPost,
}: {
  brandConfigured: boolean;
  instagramConnected: boolean;
  totalLeads: number;
  bestPost: boolean;
}) {
  if (!brandConfigured) {
    return (
      <ActionContent
        icon={Settings}
        title="Configura tu perfil de negocio"
        description="Define nicho, audiencia y oferta para que todas las herramientas IA dejen de ser genéricas."
        href="/settings"
        label="Completar perfil"
      />
    );
  }

  if (!instagramConnected) {
    return (
      <ActionContent
        icon={Instagram}
        title="Conecta Instagram para datos reales"
        description="Cuando Meta permita el acceso, WIA usará métricas, posts y audiencia para priorizar acciones."
        href="/settings"
        label="Conectar Instagram"
      />
    );
  }

  if (totalLeads === 0) {
    return (
      <ActionContent
        icon={Users}
        title="Crea tu primer lead cualificado"
        description="Usa Audience Finder o CRM para convertir interés en una oportunidad comercial medible."
        href="/audience-finder"
        label="Buscar seguidores potenciales"
      />
    );
  }

  if (!bestPost) {
    return (
      <ActionContent
        icon={Calendar}
        title="Registra contenido para medir"
        description="Añade publicaciones o genera un calendario para que la IA detecte formatos ganadores."
        href="/calendar"
        label="Crear calendario"
      />
    );
  }

  return (
    <ActionContent
      icon={Radar}
      title="Ejecuta el Radar IA semanal"
      description="Convierte tus datos en una prioridad clara: qué crear, a quién atraer y cómo convertir."
      href="/growth-radar"
      label="Abrir Radar IA"
    />
  );
}

function ActionContent({
  icon: Icon,
  title,
  description,
  href,
  label,
}: {
  icon: typeof Settings;
  title: string;
  description: string;
  href: string;
  label: string;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-lime/10">
          <Icon className="h-5 w-5 text-lime" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-muted">{description}</p>
        </div>
      </div>
      <Link href={href} className="shrink-0">
        <Button>
          {label}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}

function ActivationChecklist({
  items,
}: {
  items: { label: string; done: boolean; href: string; icon: typeof Settings }[];
}) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="flex items-center justify-between rounded-lg border border-border bg-surface-elevated p-3 hover:border-lime/30"
        >
          <div className="flex items-center gap-3">
            <item.icon className="h-4 w-4 text-lime" />
            <span className="text-sm font-medium">{item.label}</span>
          </div>
          {item.done ? (
            <CheckCircle2 className="h-4 w-4 text-lime" />
          ) : (
            <ArrowRight className="h-4 w-4 text-muted" />
          )}
        </Link>
      ))}
    </div>
  );
}
