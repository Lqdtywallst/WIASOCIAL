import { cn, formatNumber } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  className,
}: StatCardProps) {
  const displayValue =
    typeof value === "number" ? formatNumber(value) : value;

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface p-5 transition-colors hover:border-lime/20",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{title}</p>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-lime/10">
          <Icon className="h-4 w-4 text-lime" />
        </div>
      </div>
      <p className="mt-3 text-3xl font-bold text-foreground">{displayValue}</p>
      {trend && (
        <p
          className={cn(
            "mt-1 text-xs",
            trendUp ? "text-lime" : "text-muted"
          )}
        >
          {trend}
        </p>
      )}
    </div>
  );
}
