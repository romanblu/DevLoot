import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getRecentDashboardCollections } from "@/lib/db/collections";

export default async function CollectionsPage() {
  const collections = await getRecentDashboardCollections({ take: 100 });

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <p className="text-muted-foreground text-sm">
        <Button variant="link" className="h-auto p-0" asChild>
          <Link href="/dashboard">← Dashboard</Link>
        </Button>
      </p>
      <h1 className="font-semibold text-2xl tracking-tight">Collections</h1>
      <ul className="space-y-2">
        {collections.map((c) => (
          <li key={c.id}>
            <Link
              href={`/collections/${c.id}`}
              className="block rounded-lg border border-border bg-card px-3 py-2 text-sm transition-colors hover:border-primary/40 hover:bg-card/80"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium">{c.name}</span>
                <span className="text-muted-foreground text-xs tabular-nums">
                  {c.itemCount}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

