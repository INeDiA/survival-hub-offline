import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useBags } from "@/hooks/use-bags";
import { useSaveItem } from "@/hooks/use-items";
import type { Item } from "@/lib/types";

interface MoveItemDialogProps {
  item: Item;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MoveItemDialog({ item, open, onOpenChange }: MoveItemDialogProps) {
  const { data: bags = [] } = useBags();
  const saveItem = useSaveItem();
  const [targetBagId, setTargetBagId] = useState("");

  const otherBags = bags.filter((b) => b.id !== item.bagId);

  const handleMove = () => {
    if (!targetBagId) return;
    saveItem.mutate(
      { ...item, bagId: targetBagId },
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sposta Oggetto</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Sposta <strong>{item.name}</strong> in un altro zaino:
          </p>
          {otherBags.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nessun altro zaino disponibile.</p>
          ) : (
            <>
              <div>
                <Label>Zaino di destinazione</Label>
                <Select value={targetBagId} onValueChange={setTargetBagId}>
                  <SelectTrigger><SelectValue placeholder="Seleziona zaino" /></SelectTrigger>
                  <SelectContent>
                    {otherBags.map((b) => (
                      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleMove} className="w-full" disabled={!targetBagId}>
                Sposta
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
