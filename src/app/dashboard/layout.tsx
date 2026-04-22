import type { Metadata } from "next";
import type { ReactNode } from "react";

import { DashboardWorkspace } from "@/components/dashboard/dashboard-workspace";
import { getDashboardNavModel } from "@/lib/dashboard-nav-model";

export const metadata: Metadata = {
  title: "Dashboard · DevLoot",
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const nav = await getDashboardNavModel();

  return <DashboardWorkspace nav={nav}>{children}</DashboardWorkspace>;
}
