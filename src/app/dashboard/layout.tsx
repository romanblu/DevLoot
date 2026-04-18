import type { Metadata } from "next";
import type { ReactNode } from "react";

import { DashboardWorkspace } from "@/components/dashboard/dashboard-workspace";
import { getDashboardNavModel } from "@/lib/dashboard-nav";

export const metadata: Metadata = {
  title: "Dashboard · DevLoot",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const nav = getDashboardNavModel();

  return <DashboardWorkspace nav={nav}>{children}</DashboardWorkspace>;
}
