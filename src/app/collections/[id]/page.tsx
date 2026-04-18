import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { mockCollections } from "@/lib/mock-data";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const collection = mockCollections.find((c) => c.id === id);

  if (!collection) {
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
        {collection.name}
      </h1>
      <p className="text-muted-foreground text-sm">
        {collection.itemCount} items · {collection.dominantLabel}. Collection
        detail is a stub until later phases.
      </p>
    </div>
  );
}
