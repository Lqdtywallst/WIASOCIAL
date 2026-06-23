"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Instagram, Loader2, RefreshCw, Unplug } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  connectInstagram,
  disconnectInstagram,
  fetchInstagramConnection,
  syncInstagramMetrics,
} from "@/lib/instagram-client";
import { isMetaConfiguredPublic } from "@/lib/meta";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

export function InstagramConnectCard() {
  const { locale } = useTranslation();
  const searchParams = useSearchParams();
  const [connection, setConnection] = useState<Awaited<ReturnType<typeof fetchInstagramConnection>>>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const es = locale === "es";

  const load = async () => {
    setLoading(true);
    try {
      setConnection(await fetchInstagramConnection());
    } catch {
      setConnection(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const status = searchParams.get("instagram");
    const msg = searchParams.get("message");
    const user = searchParams.get("user");
    if (status === "connected" && user) {
      setMessage(es ? `Instagram @${user} conectado` : `Instagram @${user} connected`);
      load();
    }
    if (status === "error") {
      setError(msg ? decodeURIComponent(msg) : (es ? "Error al conectar Instagram" : "Instagram connection failed"));
    }
  }, [searchParams, es]);

  const handleSync = async () => {
    setSyncing(true);
    setError("");
    setMessage("");
    try {
      const result = await syncInstagramMetrics();
      setMessage(
        es
          ? `Sincronizado: @${result.username} · ${result.followers} seguidores · ${result.postsImported} posts`
          : `Synced: @${result.username} · ${result.followers} followers · ${result.postsImported} posts`
      );
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sync error");
    } finally {
      setSyncing(false);
    }
  };

  const handleDisconnect = async () => {
    setError("");
    try {
      await disconnectInstagram();
      setConnection(null);
      setMessage(es ? "Instagram desconectado" : "Instagram disconnected");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    }
  };

  const configured = isMetaConfiguredPublic();

  return (
    <div className="rounded-lg border border-border bg-surface-elevated p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Instagram className="h-5 w-5 text-lime" />
          <div>
            <p className="text-sm font-medium">Instagram API</p>
            <p className="text-xs text-muted">
              {es ? "Importa seguidores y métricas de posts (solo lectura)" : "Import followers and post metrics (read-only)"}
            </p>
          </div>
        </div>
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted" />
        ) : connection ? (
          <Badge className="bg-lime/20 text-lime border-lime/30">@{connection.username}</Badge>
        ) : (
          <Badge className={configured ? "bg-amber-500/20 text-amber-400 border-amber-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}>
            {configured ? (es ? "No conectado" : "Not connected") : (es ? "Configurar Meta" : "Configure Meta")}
          </Badge>
        )}
      </div>

      {connection && (
        <p className="mt-3 text-xs text-muted">
          {connection.followersCount.toLocaleString()} {es ? "seguidores" : "followers"} · {connection.mediaCount} posts
          {connection.lastSyncedAt && ` · ${es ? "Última sync" : "Last sync"}: ${new Date(connection.lastSyncedAt).toLocaleString(locale === "es" ? "es-ES" : "en-US")}`}
        </p>
      )}

      {message && <p className="mt-3 text-sm text-lime">{message}</p>}
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      <div className="mt-4 flex flex-wrap gap-2">
        {!connection ? (
          <Button onClick={connectInstagram} disabled={!configured}>
            <Instagram className="h-4 w-4" />
            {es ? "Conectar Instagram" : "Connect Instagram"}
          </Button>
        ) : (
          <>
            <Button onClick={handleSync} disabled={syncing}>
              {syncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              {es ? "Sincronizar métricas" : "Sync metrics"}
            </Button>
            <Button variant="ghost" onClick={handleDisconnect}>
              <Unplug className="h-4 w-4" />
              {es ? "Desconectar" : "Disconnect"}
            </Button>
          </>
        )}
      </div>

      {!configured && (
        <p className="mt-3 text-xs text-muted">
          {es
            ? "Añade META_APP_ID y META_APP_SECRET en Railway. Guía: INSTAGRAM_SETUP.md"
            : "Add META_APP_ID and META_APP_SECRET in Railway. See INSTAGRAM_SETUP.md"}
        </p>
      )}
    </div>
  );
}
