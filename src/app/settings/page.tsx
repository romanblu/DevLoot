import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-lg space-y-4 p-6">
      <h1 className="font-semibold text-2xl tracking-tight">Settings</h1>
      <p className="text-muted-foreground text-sm">
        Placeholder.{" "}
        <Link href="/dashboard" className="text-primary underline-offset-4 hover:underline">
          Back to dashboard
        </Link>
      </p>
    </div>
  );
}
