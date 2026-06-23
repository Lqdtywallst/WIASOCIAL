import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
        variant === "primary" &&
          "gradient-lime text-black hover:opacity-90 active:scale-[0.98]",
        variant === "secondary" &&
          "border border-border bg-surface-elevated text-foreground hover:border-lime/30 hover:bg-surface",
        variant === "ghost" &&
          "text-muted hover:text-foreground hover:bg-surface-elevated",
        variant === "danger" &&
          "border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20",
        size === "sm" && "px-3 py-1.5 text-sm",
        size === "md" && "px-4 py-2 text-sm",
        size === "lg" && "px-6 py-3 text-base",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
