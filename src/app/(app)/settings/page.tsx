"use client";

import { Suspense, useEffect, useState } from "react";
import { Settings, Save, Key, Database, Globe, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { useAuth } from "@/contexts/AuthContext";
import { fetchSettings, saveSettings } from "@/lib/db";
import { isOpenAIConfigured } from "@/lib/openai";
import { isSupabaseConfigured } from "@/lib/supabase";
import { InstagramConnectCard } from "@/components/settings/InstagramConnectCard";
import type { ContentGoal, ContentTone, UserSettings } from "@/types";

const defaults: UserSettings = {
  brandName: "", instagramHandle: "", niche: "", targetAudience: "", offer: "",
  defaultTone: "professional", defaultGoal: "leads",
};

export default function SettingsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(defaults);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    fetchSettings(user.id).then((s) => { if (s) setSettings(s); setLoading(false); });
  }, [user]);

  const toneOptions = (["luxury", "professional", "aggressive", "educational"] as ContentTone[]).map((tone) => ({ value: tone, label: t.tone[tone] }));
  const goalOptions = (["followers", "leads", "sales"] as ContentGoal[]).map((goal) => ({ value: goal, label: t.goalLabel[goal] }));

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError("");
    try {
      await saveSettings(user.id, settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la configuración");
    } finally {
      setSaving(false);
    }
  };

  const openaiOk = isOpenAIConfigured();
  const supabaseOk = isSupabaseConfigured();

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-lime" /></div>;

  return (
    <div>
      <PageHeader title={t.settings.title} description={t.settings.description} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title={t.settings.brandProfile} description={t.settings.brandProfileDesc} />
          <div className="space-y-4">
            <Input id="brandName" label={t.settings.brandName} value={settings.brandName} onChange={(e) => setSettings({ ...settings, brandName: e.target.value })} />
            <Input id="handle" label={t.settings.instagramHandle} value={settings.instagramHandle} onChange={(e) => setSettings({ ...settings, instagramHandle: e.target.value })} />
            <Input id="niche" label={t.common.niche} value={settings.niche} onChange={(e) => setSettings({ ...settings, niche: e.target.value })} />
            <Input id="audience" label={t.settings.targetAudience} value={settings.targetAudience} onChange={(e) => setSettings({ ...settings, targetAudience: e.target.value })} />
            <Textarea id="offer" label={t.contentGenerator.offer} value={settings.offer} onChange={(e) => setSettings({ ...settings, offer: e.target.value })} rows={2} />
            <div className="grid grid-cols-2 gap-4">
              <Select id="tone" label={t.settings.defaultTone} value={settings.defaultTone} onChange={(e) => setSettings({ ...settings, defaultTone: e.target.value as ContentTone })} options={toneOptions} />
              <Select id="goal" label={t.settings.defaultGoal} value={settings.defaultGoal} onChange={(e) => setSettings({ ...settings, defaultGoal: e.target.value as ContentGoal })} options={goalOptions} />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <Button onClick={handleSave} disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{saved ? t.common.saved : t.settings.saveSettings}</Button>
          </div>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader title={t.common.language} />
            <div className="flex items-center gap-3"><Globe className="h-5 w-5 text-lime" /><LanguageToggle /></div>
          </Card>
          <Card>
            <CardHeader title={t.settings.apiIntegrations} description={t.settings.apiIntegrationsDesc} />
            <div className="space-y-4">
              <Suspense fallback={<div className="h-24 animate-pulse rounded-lg bg-surface-elevated" />}>
                <InstagramConnectCard />
              </Suspense>
              <div className="flex items-center justify-between rounded-lg border border-border bg-surface-elevated p-4">
                <div className="flex items-center gap-3"><Key className="h-5 w-5 text-lime" /><div><p className="text-sm font-medium">OpenAI API</p><p className="text-xs text-muted">{t.settings.openaiDesc}</p></div></div>
                <Badge className={openaiOk ? "bg-lime/20 text-lime border-lime/30" : "bg-amber-500/20 text-amber-400 border-amber-500/30"}>
                  {openaiOk ? "✓ Conectado" : t.settings.configureEnv}
                </Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-surface-elevated p-4">
                <div className="flex items-center gap-3"><Database className="h-5 w-5 text-lime" /><div><p className="text-sm font-medium">Supabase</p><p className="text-xs text-muted">{t.settings.supabaseDesc}</p></div></div>
                <Badge className={supabaseOk ? "bg-lime/20 text-lime border-lime/30" : "bg-amber-500/20 text-amber-400 border-amber-500/30"}>
                  {supabaseOk ? "✓ Conectado" : t.settings.configureEnv}
                </Badge>
              </div>
            </div>
          </Card>
          <Card>
            <CardHeader title={t.settings.about} description={t.settings.aboutDesc} />
            <p className="text-sm text-muted">{t.settings.aboutText}</p>
            <div className="mt-3 flex items-center gap-2"><Settings className="h-4 w-4 text-lime" /><span className="text-foreground">{t.common.version} 0.2.0</span></div>
          </Card>
        </div>
      </div>
    </div>
  );
}
