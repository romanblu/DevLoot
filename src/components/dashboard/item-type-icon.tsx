import type { LucideIcon } from "lucide-react";
import {
  Code,
  File,
  Image as ImageIcon,
  Link as LinkIcon,
  Sparkles,
  StickyNote,
  Terminal,
} from "lucide-react";

const ITEM_TYPE_ICONS: Record<string, LucideIcon> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  Link: LinkIcon,
  File,
  Image: ImageIcon,
};

export function ItemTypeIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = ITEM_TYPE_ICONS[name] ?? Code;
  return <Icon className={className} aria-hidden />;
}
