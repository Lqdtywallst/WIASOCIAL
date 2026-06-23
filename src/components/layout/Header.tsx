"use client";

import { Menu, Bell, Search, LogOut } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { useAuth } from "@/contexts/AuthContext";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { useRouter } from "next/navigation";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur-xl px-4 lg:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-muted hover:bg-surface-elevated hover:text-foreground lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden sm:flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2">
          <Search className="h-4 w-4 text-muted" />
          <input
            type="text"
            placeholder={t.common.search}
            className="w-48 bg-transparent text-sm text-foreground placeholder:text-muted focus:outline-none lg:w-64"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <LanguageToggle />
        <button className="relative rounded-lg p-2 text-muted hover:bg-surface-elevated hover:text-foreground">
          <Bell className="h-5 w-5" />
        </button>
        <button
          onClick={handleSignOut}
          title="Cerrar sesión"
          className="rounded-lg p-2 text-muted hover:bg-surface-elevated hover:text-foreground"
        >
          <LogOut className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-foreground truncate max-w-[120px]">
              {user?.email?.split("@")[0]}
            </p>
            <p className="text-xs text-lime">● Activo</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-lime text-sm font-bold text-black">
            {(user?.email?.[0] ?? "W").toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
