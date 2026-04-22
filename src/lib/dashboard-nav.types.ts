import type { DashboardCollectionRow } from "@/lib/db/collections";
import type { DashboardItemTypeRow } from "@/lib/db/items";

export interface DashboardNavUser {
  id: string;
  name: string;
  initials: string;
  email: string;
  image: string | null;
  isPro: boolean;
}

export type DashboardNavItemType = DashboardItemTypeRow & {
  isProLocked: boolean;
};

export interface DashboardNavModel {
  user: DashboardNavUser;
  itemTypes: DashboardNavItemType[];
  collections: DashboardCollectionRow[];
}

