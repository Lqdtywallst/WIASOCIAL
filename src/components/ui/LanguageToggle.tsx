"use client";

import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const { locale, setLocale, t } = useTranslation();

  return (
    <div className="flex items-center rounded-lg border border-border bg-surface p-0.5">
      <button
        onClick={() => setLocale("es")}
        className={cn(
          "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
          locale === "es"
            ? "bg-lime/20 text-lime"
            : "text-muted hover:text-foreground"
        )}
        title={t.common.spanish}
      >
        ES
      </button>
      <button
        onClick={() => setLocale("en")}
        className={cn(
          "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
          locale === "en"
            ? "bg-lime/20 text-lime"
            : "text-muted hover:text-foreground"
        )}
        title={t.common.english}
      >
        EN
      </button>
    </div>
  );
}
