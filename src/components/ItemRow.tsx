import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil, ArrowRightLeft, ArrowUpDown } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ExpiryBadge } from "@/components/ExpiryBadge";
import { getCategoryInfo, type Item } from "@/lib/types";
import { useSaveItem, useDeleteItem } from "@/hooks/use-items";
import { cn } from "@/lib/utils";
import { EditItemDialog } from "@/components/EditItemDialog";
import { MoveItemDialog } from "@/components/MoveItemDialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ItemRowProps {
  item: Item;
}

export function ItemRow({ item }: ItemRowProps) {
  const saveItem = useSaveItem();
  const deleteItem = useDeleteItem();
  const formatWeight = (g: number) => `${(g / 1000).toFixed(2)} kg`;
  const cat = getCategoryInfo(item.category);
  const [editOpen, setEditOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);

  const toggleChecked = () => {
    saveItem.mutate({ ...item, checked: !item.checked });
  };

  return (
    <>
      <div className={cn(
        "flex items-center gap-3 rounded-md border p-3 transition-colors",
        item.checked && "bg-success/10 border-success/30"
      )}>
        <span className="text-lg" aria-hidden>{cat.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm">
            {item.name}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <span>{formatWeight(item.weight * item.quantity)}</span>
            {item.quantity > 1 && <span>×{item.quantity}</span>}
            <ExpiryBadge item={item} />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8",
                  item.checked
                    ? "text-success hover:text-warning"
                    : "text-muted-foreground hover:text-success"
                )}
                onClick={toggleChecked}
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {item.checked ? "Sposta in 'Da aggiungere'" : "Sposta in 'Nello zaino'"}
            </TooltipContent>
          </Tooltip>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => setEditOpen(true)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => setMoveOpen(true)}>
            <ArrowRightLeft className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Eliminare "{item.name}"?</AlertDialogTitle>
                <AlertDialogDescription>
                  Questa azione non può essere annullata.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annulla</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteItem.mutate(item.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Elimina
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <EditItemDialog item={item} open={editOpen} onOpenChange={setEditOpen} />
      <MoveItemDialog item={item} open={moveOpen} onOpenChange={setMoveOpen} />
    </>
  );
}
