import type { ReactNode } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DashboardTopBar({
  mobileNavTrigger,
  user,
}: {
  /** Opens the mobile drawer; shown only at `md:hidden` by the trigger itself. */
  mobileNavTrigger?: ReactNode;
  user: { name: string; initials: string };
}) {
  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-3 sm:gap-3 sm:px-4">
      <div className="flex shrink-0 items-center gap-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-lg py-1 text-foreground outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring/50"
          aria-label={`DevLoot — ${user.name}`}
        >
          <span
            className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 font-bold text-primary text-sm"
            aria-hidden
          >
            D
          </span>
          <span className="hidden font-semibold text-sm tracking-tight sm:inline">
            DevLoot
          </span>
        </Link>
        {mobileNavTrigger}
      </div>
      <div className="flex min-w-0 flex-1 justify-center px-1 sm:px-2">
        <div className="relative w-full max-w-2xl">
          <Search
            className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            readOnly
            tabIndex={-1}
            placeholder="Search snippets, prompts, tags..."
            className="h-9 w-full pl-9 shadow-none md:h-10"
            aria-label="Search (placeholder)"
          />
        </div>
      </div>
      <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-3">
        <Button type="button" size="lg">
          + New item
        </Button>
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-card font-medium text-card-foreground text-sm"
          title={user.name}
          aria-label={user.name}
        >
          {user.initials}
        </div>
      </div>
    </header>
  );
}
