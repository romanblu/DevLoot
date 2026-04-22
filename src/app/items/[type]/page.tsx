import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getItemTypeBySlug } from "@/lib/db/items";

export default async function ItemsByTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const itemType = await getItemTypeBySlug({ slug: type });

  if (!itemType) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <p className="text-muted-foreground text-sm">
        <Button variant="link" className="h-auto p-0" asChild>
          <Link href="/dashboard">← Dashboard</Link>
        </Button>
      </p>
      <h1 className="font-semibold text-2xl tracking-tight">
        {itemType.pluralName}
      </h1>
      <p className="text-muted-foreground text-sm">
        Placeholder list view for{" "}
        <span className="font-mono text-foreground">{itemType.id}</span>. Phase
        3 will flesh out item browsing here.
      </p>
    </div>
  );
}
