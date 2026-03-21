import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useBags } from "@/hooks/use-bags";
import { useAllItems } from "@/hooks/use-items";
import { BagCard } from "@/components/BagCard";
import { AddBagDialog } from "@/components/AddBagDialog";
import { HamburgerMenu } from "@/components/HamburgerMenu";
import { StarterTemplateDialog } from "@/components/StarterTemplateDialog";
import { useExpiringItems } from "@/components/ExpiryBadge";
import { Package, AlertTriangle, ChevronRight, X, Download, Share } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { differenceInDays, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";
import { useWeightUnit } from "@/hooks/use-weight-unit.tsx";
import { useStoragePersist } from "@/hooks/use-storage-persist";
import { usePwaInstall } from "@/hooks/use-pwa-install";
import { Button } from "@/components/ui/button";
import { seedBagWithItems } from "@/lib/db";
import { buildStarterTemplateData, getStarterTemplates, STARTER_ONBOARDING_KEY } from "@/lib/starter-templates";

const Index = () => {
  const { data: bags = [], isLoading } = useBags();
  const { data: allItems = [] } = useAllItems();
  const [expiryOpen, setExpiryOpen] = useState(false);
  const [starterOpen, setStarterOpen] = useState(false);
  const { t, lang } = useLanguage();
  const { formatWeight } = useWeightUnit();
  const { state: persistState, dismissed: persistDismissed, dismiss: dismissPersist } = useStoragePersist();
  const { canShow: showInstall, isIos, install, dismiss: dismissInstall } = usePwaInstall();
  const queryClient = useQueryClient();

  const presentItems = allItems.filter((i) => i.checked);
  const totalWeight = bags.reduce((s, b) => s + (b.bagWeight || 0), 0) + presentItems.reduce((s, i) => s + i.weight * i.quantity, 0);
  const expiring = useExpiringItems(allItems);

  const bagNameMap = new Map(bags.map((b) => [b.id, b.name]));
  const starterTemplates = useMemo(() => getStarterTemplates(lang), [lang]);

  const seedTemplate = useMutation({
    mutationFn: async (templateId: string) => {
      const { bag, items } = buildStarterTemplateData(templateId, lang);
      await seedBagWithItems(bag, items);
    },
    onSuccess: async () => {
      localStorage.setItem(STARTER_ONBOARDING_KEY, "1");
      setStarterOpen(false);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["bags"] }),
        queryClient.invalidateQueries({ queryKey: ["items"] }),
      ]);
    },
  });

  useEffect(() => {
    if (typeof window === "undefined" || isLoading || bags.length > 0) return;

    const onboardingCompleted = window.localStorage.getItem(STARTER_ONBOARDING_KEY) === "1";
    if (!onboardingCompleted) setStarterOpen(true);
  }, [bags.length, isLoading]);

  const handleSkipStarter = () => {
    localStorage.setItem(STARTER_ONBOARDING_KEY, "1");
    setStarterOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <StarterTemplateDialog
        open={starterOpen}
        templates={starterTemplates}
        pending={seedTemplate.isPending}
        onConfirm={(templateId) => seedTemplate.mutate(templateId)}
        onSkip={handleSkipStarter}
      />

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
        {persistState === "denied" && !persistDismissed && (
          <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
            <p className="flex-1">{t.storageDenied}</p>
            <button onClick={dismissPersist} className="shrink-0 p-0.5 rounded hover:bg-destructive/20">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
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

      {showInstall && (
        <div className="fixed bottom-0 inset-x-0 z-50 p-4 safe-area-bottom">
          <div className="container max-w-lg mx-auto rounded-xl border bg-card shadow-lg p-4">
            <div className="flex items-start gap-3">
              {isIos ? (
                <Share className="h-5 w-5 mt-0.5 shrink-0 text-primary" />
              ) : (
                <Download className="h-5 w-5 mt-0.5 shrink-0 text-primary" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground">{t.installApp}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isIos ? t.iosInstallGuide : t.installDesc}
                </p>
              </div>
              <button onClick={dismissInstall} className="shrink-0 p-1 rounded hover:bg-muted">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            {!isIos && (
              <Button onClick={install} size="sm" className="w-full mt-3 gap-2">
                <Download className="h-4 w-4" /> {t.installButton}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
