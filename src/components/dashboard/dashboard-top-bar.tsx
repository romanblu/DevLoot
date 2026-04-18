import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DashboardTopBar() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-background px-4">
      <div className="hidden w-44 shrink-0 sm:block" aria-hidden />
      <div className="flex min-w-0 flex-1 justify-center px-2">
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
      <div className="flex w-44 shrink-0 justify-end">
        <Button type="button" size="lg">
          + New item
        </Button>
      </div>
    </header>
  );
}
