"use client";

import { useState, useEffect } from "react";
import { UserCheck, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { useAuth } from "@/contexts/AuthContext";
import { fetchSettings } from "@/lib/db";
import { callAI } from "@/lib/ai-client";

export default function ProfileAuditPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [bio, setBio] = useState("");
  const [handle, setHandle] = useState("");
  const [niche, setNiche] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [audit, setAudit] = useState<{ overallScore: number; items: { category: string; score: number; status: string; tip: string }[]; bioSuggestion: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchSettings(user.id).then((s) => {
      if (s) { setHandle(s.instagramHandle); setNiche(s.niche); setBio(`${s.brandName} | ${s.offer}`); }
    });
  }, [user]);

  const runAudit = async () => {
    setLoading(true);
    setError("");
    try {
      setAudit(await callAI("profile-audit", { bio, handle, niche }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  const statusColors: Record<string, string> = { good: "bg-lime/20 text-lime border-lime/30", warning: "bg-amber-500/20 text-amber-400 border-amber-500/30", bad: "bg-red-500/20 text-red-400 border-red-500/30" };

  return (
    <div>
      <PageHeader title={t.profileAudit.title} description={t.profileAudit.description}
        action={<Button onClick={runAudit} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserCheck className="h-4 w-4" />}{t.profileAudit.runAudit}</Button>} />
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      <Card className="mb-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input id="handle" label={t.settings.instagramHandle} value={handle} onChange={(e) => setHandle(e.target.value)} />
          <Input id="niche" label={t.common.niche} value={niche} onChange={(e) => setNiche(e.target.value)} />
          <div className="sm:col-span-2"><Textarea id="bio" label="Bio actual" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} /></div>
        </div>
      </Card>
      {audit && (
        <>
          <Card glow className="mb-6 text-center"><p className="text-sm text-muted">{t.profileAudit.overall}</p><p className="text-5xl font-bold text-lime">{audit.overallScore}/10</p></Card>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {audit.items.map((item, i) => (
              <Card key={i} className="!p-4">
                <div className="flex justify-between mb-2"><p className="font-medium">{item.category}</p><div className="flex gap-2"><span className="font-bold text-lime">{item.score}/10</span><Badge className={statusColors[item.status]}>{item.status}</Badge></div></div>
                <p className="text-sm text-muted">{item.tip}</p>
              </Card>
            ))}
          </div>
          <Card className="mt-6">
            <CardHeader title={t.profileAudit.bioSuggestion} />
            <p className="whitespace-pre-wrap text-sm">{audit.bioSuggestion}</p>
            <Button variant="secondary" size="sm" className="mt-3" onClick={() => navigator.clipboard.writeText(audit.bioSuggestion)}>{t.common.copy}</Button>
          </Card>
        </>
      )}
    </div>
  );
}
