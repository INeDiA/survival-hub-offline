import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBag } from "@/hooks/use-bags";
import { useItems } from "@/hooks/use-items";
import { AddItemDialog } from "@/components/AddItemDialog";
import { ItemRow } from "@/components/ItemRow";
import { WeightProgress } from "@/components/WeightProgress";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ClipboardCheck, List } from "lucide-react";
import { CATEGORIES, getCategoryInfo, type ItemCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const BagDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: bag } = useBag(id!);
  const { data: items = [] } = useItems(id!);
  const [checklistMode, setChecklistMode] = useState(false);
  const [filterCategory, setFilterCategory] = useState<ItemCategory | "all">("all");

  const totalWeight = items.reduce((s, i) => s + i.weight * i.quantity, 0);
  const checkedCount = items.filter((i) => i.checked).length;

  const usedCategories = useMemo(() => {
    const cats = new Set(items.map((i) => i.category));
    return CATEGORIES.filter((c) => cats.has(c.value));
  }, [items]);

  const filtered = filterCategory === "all"
    ? items
    : items.filter((i) => i.category === filterCategory);

  // Group by category
  const grouped = useMemo(() => {
    const map = new Map<ItemCategory, typeof items>();
    for (const item of filtered) {
      const list = map.get(item.category) || [];
      list.push(item);
      map.set(item.category, list);
    }
    return map;
  }, [filtered]);

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
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={checklistMode ? "default" : "outline"}
              size="sm"
              className="gap-2"
              onClick={() => setChecklistMode(!checklistMode)}
            >
              {checklistMode ? <ClipboardCheck className="h-4 w-4" /> : <List className="h-4 w-4" />}
              {checklistMode ? "Checklist ON" : "Checklist"}
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* Weight & stats */}
        <div className="rounded-lg border bg-card p-4 space-y-3">
          <WeightProgress currentWeight={totalWeight} weightLimit={bag.weightLimit} />
          <div className="flex justify-between text-xs font-mono text-muted-foreground">
            <span>{items.length} oggetti</span>
            {checklistMode && (
              <span className={cn(checkedCount === items.length && items.length > 0 && "text-success")}>
                ✓ {checkedCount}/{items.length}
              </span>
            )}
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex gap-1 flex-wrap">
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
          <AddItemDialog bagId={id!} />
        </div>

        {/* Items grouped by category */}
        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground text-sm">Nessun oggetto nello zaino</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Array.from(grouped.entries()).map(([cat, catItems]) => {
              const info = getCategoryInfo(cat);
              return (
                <div key={cat}>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                    {info.icon} {info.label}
                  </h3>
                  <div className="space-y-2">
                    {catItems.map((item) => (
                      <ItemRow key={item.id} item={item} checklistMode={checklistMode} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default BagDetail;
