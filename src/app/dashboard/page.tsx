export default function DashboardPage() {
  return (
    <>
      <aside className="w-full shrink-0 border-border border-b p-4 md:w-64 md:border-r md:border-b-0">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Sidebar
        </h2>
      </aside>
      <main className="min-h-0 flex-1 p-6">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Main
        </h2>
      </main>
    </>
  );
}
