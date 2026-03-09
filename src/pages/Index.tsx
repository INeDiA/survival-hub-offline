import { useState } from "react";
import { useBags } from "@/hooks/use-bags";
import { useAllItems } from "@/hooks/use-items";
import { BagCard } from "@/components/BagCard";
import { AddBagDialog } from "@/components/AddBagDialog";
import { HamburgerMenu } from "@/components/HamburgerMenu";
import { getExpiringItems } from "@/components/ExpiryBadge";
import { Package, AlertTriangle, ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { differenceInDays, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";
import { useWeightUnit } from "@/hooks/use-weight-unit.tsx";

const Index = () => {
  const { data: bags = [], isLoading } = useBags();
  const { data: allItems = [] } = useAllItems();
  const [expiryOpen, setExpiryOpen] = useState(false);
  const { t } = useLanguage();
  const { formatWeight } = useWeightUnit();

  const presentItems = allItems.filter((i) => i.checked);
  const totalWeight = bags.reduce((s, b) => s + (b.bagWeight || 0), 0) + presentItems.reduce((s, i) => s + i.weight * i.quantity, 0);
  const expiring = getExpiringItems(allItems);

  const bagNameMap = new Map(bags.map((b) => [b.id, b.name]));

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-mono font-bold tracking-tight">{t.appTitle}</h1>
          </div>
          <HamburgerMenu />
        </div>
      </header>

      <main className="container py-6 space-y-6">
        <Collapsible open={expiryOpen} onOpenChange={setExpiryOpen}>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border bg-card p-3">
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{t.totalWeight}</p>
              <p className="text-xl font-mono font-bold text-foreground">{formatWeight(totalWeight)}</p>
            </div>
            <CollapsibleTrigger className={cn(
              "w-full rounded-lg border p-3 text-left transition-colors",
              expiring.length > 0 ? "bg-warning/5 border-warning/30 hover:bg-warning/10 cursor-pointer" : "bg-card"
            )}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{t.expiring}</p>
                  <p className={cn("text-xl font-mono font-bold", expiring.length > 0 ? "text-warning" : "text-foreground")}>{expiring.length}</p>
                </div>
                {expiring.length > 0 && (
                  <ChevronRight className={cn("h-4 w-4 text-warning transition-transform", expiryOpen && "rotate-90")} />
                )}
              </div>
            </CollapsibleTrigger>
          </div>
          {expiring.length > 0 && (
            <CollapsibleContent className="pt-3">
              <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span className="text-sm font-medium text-warning">{t.expiringItems}</span>
                </div>
                <div className="space-y-2">
                  {expiring.map((item) => {
                    const daysLeft = differenceInDays(parseISO(item.expiryDate!), new Date());
                    const bagName = bagNameMap.get(item.bagId) || "—";
                    return (
                      <div key={item.id} className="flex items-center justify-between text-xs font-mono">
                        <div className="flex-1 min-w-0">
                          <span className="text-foreground">{item.name}</span>
                          <span className="text-muted-foreground ml-2">({bagName})</span>
                        </div>
                        <span className={cn(
                          "ml-2 whitespace-nowrap",
                          daysLeft < 0 ? "text-destructive" : "text-warning"
                        )}>
                          {daysLeft < 0 ? t.expiredDaysAgo(Math.abs(daysLeft)) : t.daysLeft(daysLeft)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CollapsibleContent>
          )}
        </Collapsible>

        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono font-semibold uppercase tracking-wider text-muted-foreground">{t.yourBags}</h2>
          <AddBagDialog />
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">{t.loading}</p>
        ) : bags.length === 0 ? (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <Package className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground text-sm">{t.noBagsCreated}</p>
            <p className="text-muted-foreground text-xs mt-1">{t.createFirstBag}</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {bags.map((bag) => (
              <BagCard key={bag.id} bag={bag} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
