import type { Metadata } from "next";
import type { ReactNode } from "react";

import { DashboardTopBar } from "@/components/dashboard/dashboard-top-bar";

export const metadata: Metadata = {
  title: "Dashboard · DevLoot",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <DashboardTopBar />
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">{children}</div>
    </div>
  );
}
