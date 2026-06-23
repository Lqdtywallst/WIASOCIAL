import { cn } from "@/lib/utils";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ label, className, id, ...props }: TextareaProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={cn(
          "w-full rounded-lg border border-border bg-surface-elevated px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-lime/50 focus:outline-none focus:ring-1 focus:ring-lime/30 transition-colors resize-none",
          className
        )}
        {...props}
      />
    </div>
  );
}
