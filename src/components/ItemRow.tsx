import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ExpiryBadge } from "@/components/ExpiryBadge";
import { getCategoryInfo, type Item } from "@/lib/types";
import { useSaveItem, useDeleteItem } from "@/hooks/use-items";
import { cn } from "@/lib/utils";

interface ItemRowProps {
  item: Item;
  checklistMode: boolean;
}

export function ItemRow({ item, checklistMode }: ItemRowProps) {
  const saveItem = useSaveItem();
  const deleteItem = useDeleteItem();
  const cat = getCategoryInfo(item.category);

  const toggleChecked = () => {
    saveItem.mutate({ ...item, checked: !item.checked });
  };

  const formatWeight = (g: number) => {
    if (g >= 1000) return `${(g / 1000).toFixed(1)}kg`;
    return `${g}g`;
  };

  return (
    <div className={cn(
      "flex items-center gap-3 rounded-md border p-3 transition-colors",
      item.checked && checklistMode && "bg-success/10 border-success/30"
    )}>
      {checklistMode && (
        <Checkbox checked={item.checked} onCheckedChange={toggleChecked} />
      )}
      <span className="text-lg" aria-hidden>{cat.icon}</span>
      <div className="flex-1 min-w-0">
        <div className={cn("font-medium text-sm", item.checked && checklistMode && "line-through text-muted-foreground")}>
          {item.name}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <span>{formatWeight(item.weight * item.quantity)}</span>
          {item.quantity > 1 && <span>×{item.quantity}</span>}
          <ExpiryBadge item={item} />
        </div>
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteItem.mutate(item.id)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
