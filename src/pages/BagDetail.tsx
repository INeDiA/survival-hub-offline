import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBag } from "@/hooks/use-bags";
import { useItems } from "@/hooks/use-items";
import { AddItemDropdown } from "@/components/AddItemDropdown";
import { ItemRow } from "@/components/ItemRow";
import { WeightProgress } from "@/components/WeightProgress";
import { HamburgerMenu } from "@/components/HamburgerMenu";
import { EditBagDialog } from "@/components/EditBagDialog";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ChevronRight, Pencil } from "lucide-react";
import { CATEGORIES, getCategoryInfo, type ItemCategory, type Item } from "@/lib/types";
import { cn } from "@/lib/utils";

type SortKey = "name" | "weight" | "category";

function renderItems(items: Item[], sortKey: SortKey) {
  if (sortKey === "category") {
    const map = new Map<ItemCategory, Item[]>();
    for (const item of items) {
      const list = map.get(item.category) || [];
      list.push(item);
      map.set(item.category, list);
    }
    return (
      <div className="space-y-4">
        {Array.from(map.entries()).map(([cat, catItems]) => {
          const info = getCategoryInfo(cat);
          return (
            <div key={cat}>
              <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                {info.icon} {info.label}
              </h3>
              <div className="space-y-2">
                {catItems.map((item) => (
                  <ItemRow key={item.id} item={item} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <ItemRow key={item.id} item={item} />
      ))}
    </div>
  );
}

const BagDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: bag } = useBag(id!);
  const { data: items = [] } = useItems(id!);
  const [filterCategory, setFilterCategory] = useState<ItemCategory | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [missingOpen, setMissingOpen] = useState(false);
  const [presentOpen, setPresentOpen] = useState(true);
  const [editBagOpen, setEditBagOpen] = useState(false);

  const presentItems = items.filter((i) => i.checked);
  const totalWeight = (bag?.bagWeight || 0) + presentItems.reduce((s, i) => s + i.weight * i.quantity, 0);

  const usedCategories = useMemo(() => {
    const cats = new Set(items.map((i) => i.category));
    return CATEGORIES.filter((c) => cats.has(c.value));
  }, [items]);

  const filtered = filterCategory === "all"
    ? items
    : items.filter((i) => i.category === filterCategory);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    switch (sortKey) {
      case "name":
        return copy.sort((a, b) => a.name.localeCompare(b.name));
      case "weight":
        return copy.sort((a, b) => b.weight * b.quantity - a.weight * a.quantity);
      default:
        return copy;
    }
  }, [filtered, sortKey]);

  const missing = useMemo(() => sorted.filter((i) => !i.checked), [sorted]);
  const present = useMemo(() => sorted.filter((i) => i.checked), [sorted]);
  const allPresent = items.length > 0 && missing.length === 0;

  if (!bag) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Caricamento...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-mono font-bold truncate">{bag.name}</h1>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditBagOpen(true)}>
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
          <HamburgerMenu />
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* Weight & stats */}
        <div className="rounded-lg border bg-card p-4 space-y-3">
          <WeightProgress currentWeight={totalWeight} weightLimit={bag.weightLimit} />
          <div className="flex justify-between text-xs font-mono text-muted-foreground">
            <span>{items.length} oggetti</span>
            <span className={cn(allPresent && "text-success")}>
              ✓ {presentItems.length}/{items.length} presenti
            </span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
              <SelectTrigger className="w-[130px] h-8 text-xs">
                <SelectValue placeholder="Ordina per" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="category">Categoria</SelectItem>
                <SelectItem value="name">Nome</SelectItem>
                <SelectItem value="weight">Peso ↓</SelectItem>
              </SelectContent>
            </Select>
            <AddItemDropdown bagId={id!} />
          </div>
          {usedCategories.length > 0 && (
            <div className="flex gap-1 flex-wrap items-center">
              <Button
                variant={filterCategory === "all" ? "secondary" : "ghost"}
                size="sm"
                className="text-xs"
                onClick={() => setFilterCategory("all")}
              >
                Tutti
              </Button>
              {usedCategories.map((c) => (
                <Button
                  key={c.value}
                  variant={filterCategory === c.value ? "secondary" : "ghost"}
                  size="sm"
                  className="text-xs gap-1"
                  onClick={() => setFilterCategory(c.value)}
                >
                  {c.icon} {c.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground text-sm">Nessun oggetto nello zaino</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Da aggiungere — hidden when empty */}
            {missing.length > 0 && (
              <Collapsible open={missingOpen} onOpenChange={setMissingOpen}>
                <CollapsibleTrigger className="flex items-center gap-2 w-full rounded-lg border bg-card p-3 hover:bg-accent/50 transition-colors">
                  <ChevronRight className={cn("h-4 w-4 transition-transform", missingOpen && "rotate-90")} />
                  <span className="text-sm font-mono font-semibold">⬜ Da aggiungere</span>
                  <span className="ml-auto text-xs font-mono text-muted-foreground">{missing.length}</span>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3">
                  {renderItems(missing, sortKey)}
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* Nello zaino */}
            <Collapsible open={presentOpen} onOpenChange={setPresentOpen}>
              <CollapsibleTrigger className="flex items-center gap-2 w-full rounded-lg border bg-card p-3 hover:bg-accent/50 transition-colors">
                <ChevronRight className={cn("h-4 w-4 transition-transform", presentOpen && "rotate-90")} />
                <span className="text-sm font-mono font-semibold">📦 Nello zaino</span>
                <span className="ml-auto text-xs font-mono text-muted-foreground">{present.length}</span>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-3">
                {present.length === 0 ? (
                  <p className="text-xs text-muted-foreground pl-6">Nessun oggetto presente</p>
                ) : (
                  renderItems(present, sortKey)
                )}
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}
      </main>
      <EditBagDialog bag={bag} open={editBagOpen} onOpenChange={setEditBagOpen} />
    </div>
  );
};

export default BagDetail;
