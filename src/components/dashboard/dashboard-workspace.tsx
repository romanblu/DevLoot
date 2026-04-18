"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Menu } from "lucide-react";

import { DashboardTopBar } from "@/components/dashboard/dashboard-top-bar";
import { DashboardSidebarContent } from "@/components/dashboard/dashboard-sidebar-content";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import type { DashboardNavModel } from "@/lib/dashboard-nav";
import { cn } from "@/lib/utils";

export function DashboardWorkspace({
  nav,
  children,
}: {
  nav: DashboardNavModel;
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const mobileNavTrigger = (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="md:hidden"
      aria-label="Open navigation"
      onClick={() => setMobileOpen(true)}
    >
      <Menu className="size-5" aria-hidden />
    </Button>
  );

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <DashboardTopBar mobileNavTrigger={mobileNavTrigger} user={nav.user} />
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <aside
          className={cn(
            "hidden min-h-0 shrink-0 flex-col border-sidebar-border border-r bg-sidebar md:flex",
            "transition-[width] duration-200 ease-out",
            collapsed ? "w-14" : "w-60",
          )}
        >
          <DashboardSidebarContent
            nav={nav}
            collapsed={collapsed}
            variant="desktop"
            onToggleCollapse={() => setCollapsed((c) => !c)}
          />
        </aside>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent
            side="left"
            className="h-full w-[min(100%,20rem)] max-w-[90vw] gap-0 border-sidebar-border p-0 sm:max-w-sm"
          >
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <SheetDescription className="sr-only">
              Browse item types, favorites, and recent collections.
            </SheetDescription>
            <DashboardSidebarContent
              nav={nav}
              collapsed={false}
              variant="drawer"
              onNavigate={() => setMobileOpen(false)}
              className="h-full min-h-0"
            />
          </SheetContent>
        </Sheet>

        <main className="min-h-0 flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
