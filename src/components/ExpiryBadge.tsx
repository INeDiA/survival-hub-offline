import { differenceInDays, parseISO } from "date-fns";
import { AlertTriangle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Item } from "@/lib/types";
import { EXPIRY_WARNING_DAYS } from "@/lib/types";

interface ExpiryBadgeProps {
  item: Item;
  className?: string;
}

export function ExpiryBadge({ item, className }: ExpiryBadgeProps) {
  if (!item.expiryDate) return null;

  const today = new Date();
  const expiry = parseISO(item.expiryDate);
  const daysLeft = differenceInDays(expiry, today);

  if (daysLeft < 0) {
    return (
      <span className={cn("inline-flex items-center gap-1 text-xs font-mono text-destructive", className)}>
        <AlertCircle className="h-3 w-3" /> Scaduto
      </span>
    );
  }

  if (daysLeft <= EXPIRY_WARNING_DAYS) {
    return (
      <span className={cn("inline-flex items-center gap-1 text-xs font-mono text-warning", className)}>
        <AlertTriangle className="h-3 w-3" /> {daysLeft}g
      </span>
    );
  }

  return (
    <span className={cn("text-xs font-mono text-muted-foreground", className)}>
      {daysLeft}g
    </span>
  );
}

export function getExpiringItems(items: Item[]) {
  const today = new Date();
  return items.filter((item) => {
    if (!item.expiryDate) return false;
    const daysLeft = differenceInDays(parseISO(item.expiryDate), today);
    return daysLeft <= EXPIRY_WARNING_DAYS;
  });
}
