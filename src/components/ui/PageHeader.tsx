import { formatAiText } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          {title}
        </h1>
        <p className="mt-1 text-muted">{description}</p>
      </div>
      {action}
    </div>
  );
}

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface/50 py-16 px-6 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-lime/10 text-lime">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

interface OutputBlockProps {
  label: string;
  content: string | string[] | unknown;
  copyLabel?: string;
  onCopy?: () => void;
}

export function OutputBlock({ label, content, copyLabel = "Copy" }: OutputBlockProps) {
  const items = Array.isArray(content) ? content.map((item) => formatAiText(item)) : null;
  const text = items ? items.join("\n") : formatAiText(content);

  return (
    <div className="rounded-lg border border-border bg-surface-elevated p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-lime">
          {label}
        </span>
        <button
          onClick={() => navigator.clipboard.writeText(text)}
          className="text-xs text-muted hover:text-lime transition-colors"
        >
          {copyLabel}
        </button>
      </div>
      {items ? (
        <ol className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="text-sm text-foreground">
              <span className="mr-2 text-lime font-medium">{i + 1}.</span>
              {item}
            </li>
          ))}
        </ol>
      ) : (
        <p className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">
          {text}
        </p>
      )}
    </div>
  );
}
