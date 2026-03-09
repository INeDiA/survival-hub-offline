import { useBags } from "@/hooks/use-bags";
import { useAllItems } from "@/hooks/use-items";
import { BagCard } from "@/components/BagCard";
import { AddBagDialog } from "@/components/AddBagDialog";
import { HamburgerMenu } from "@/components/HamburgerMenu";
import { getExpiringItems } from "@/components/ExpiryBadge";
import { Package, AlertTriangle } from "lucide-react";

const Index = () => {
  const { data: bags = [], isLoading } = useBags();
  const { data: allItems = [] } = useAllItems();

  const formatWeight = (g: number) => {
    return `${(g / 1000).toFixed(2)} kg`;
  };

  const totalItems = allItems.length;
  const totalWeight = allItems.reduce((s, i) => s + i.weight * i.quantity, 0);
  const expiring = getExpiringItems(allItems);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-mono font-bold tracking-tight">BugOut Manager</h1>
          </div>
          <div className="flex items-center gap-2">
            <HamburgerMenu />
          </div>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Zaini" value={bags.length} />
          <StatCard label="Oggetti" value={totalItems} />
          <StatCard label="Peso Totale" value={formatWeight(totalWeight)} />
          <StatCard label="In Scadenza" value={expiring.length} warning={expiring.length > 0} />
        </div>

        {/* Expiry Alerts */}
        {expiring.length > 0 && (
          <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <span className="text-sm font-medium text-warning">Articoli in scadenza</span>
            </div>
            <ul className="space-y-1">
              {expiring.slice(0, 5).map((item) => (
                <li key={item.id} className="text-xs text-muted-foreground font-mono">
                  • {item.name}
                </li>
              ))}
              {expiring.length > 5 && (
                <li className="text-xs text-muted-foreground">...e altri {expiring.length - 5}</li>
              )}
            </ul>
          </div>
        )}

        {/* Bag List */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono font-semibold uppercase tracking-wider text-muted-foreground">I tuoi zaini</h2>
          <AddBagDialog />
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Caricamento...</p>
        ) : bags.length === 0 ? (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <Package className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground text-sm">Nessuno zaino creato</p>
            <p className="text-muted-foreground text-xs mt-1">Crea il tuo primo bugout bag per iniziare</p>
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

function StatCard({ label, value, warning }: { label: string; value: string | number; warning?: boolean }) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`text-xl font-mono font-bold ${warning ? "text-warning" : "text-foreground"}`}>{value}</p>
    </div>
  );
}

export default Index;
