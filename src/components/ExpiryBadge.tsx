import { differenceInDays, parseISO } from "date-fns";
import { AlertTriangle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Item } from "@/lib/types";
import { useLanguage } from "@/hooks/use-language";
import { useExpiryDays } from "@/hooks/use-expiry-days";

interface ExpiryBadgeProps {
  item: Item;
  className?: string;
}

export function ExpiryBadge({ item, className }: ExpiryBadgeProps) {
  const { t } = useLanguage();
  const { expiryWarningDays } = useExpiryDays();

  if (!item.expiryDate) return null;

  const today = new Date();
  const expiry = parseISO(item.expiryDate);
  const daysLeft = differenceInDays(expiry, today);

  if (daysLeft < 0) {
    return (
      <span className={cn("inline-flex items-center gap-1 text-xs font-mono text-destructive", className)}>
        <AlertCircle className="h-3 w-3" /> {t.expired}
      </span>
    );
  }

  if (daysLeft <= expiryWarningDays) {
    return (
      <span className={cn("inline-flex items-center gap-1 text-xs font-mono text-warning", className)}>
        <AlertTriangle className="h-3 w-3" /> {t.daysLeft(daysLeft)}
      </span>
    );
  }

  return (
    <span className={cn("text-xs font-mono text-muted-foreground", className)}>
      {t.daysLeft(daysLeft)}
    </span>
  );
}

export function useExpiringItems(items: Item[]) {
  const { expiryWarningDays } = useExpiryDays();
  const today = new Date();
  return items.filter((item) => {
    if (!item.expiryDate) return false;
    const daysLeft = differenceInDays(parseISO(item.expiryDate), today);
    return daysLeft <= expiryWarningDays;
  });
}
