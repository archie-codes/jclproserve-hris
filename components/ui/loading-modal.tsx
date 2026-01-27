"use client";

export function LoadingModal({
  open,
  text = "Signing in...",
}: {
  open: boolean;
  text?: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-lg bg-background px-8 py-6 shadow-xl">
        {/* Spinner */}
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />

        <p className="text-sm font-medium text-muted-foreground">
          {text}
        </p>
      </div>
    </div>
  );
}
