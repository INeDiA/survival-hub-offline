import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useBags } from "@/hooks/use-bags";
import { useSaveItem } from "@/hooks/use-items";
import type { Item } from "@/lib/types";
import { useLanguage } from "@/hooks/use-language";

interface MoveItemDialogProps {
  item: Item;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MoveItemDialog({ item, open, onOpenChange }: MoveItemDialogProps) {
  const { data: bags = [] } = useBags();
  const saveItem = useSaveItem();
  const [targetBagId, setTargetBagId] = useState("");
  const { t } = useLanguage();

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
          <DialogTitle>{t.moveItem}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {t.moveItemTo(item.name)}
          </p>
          {otherBags.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t.noOtherBags}</p>
          ) : (
            <>
              <div>
                <Label>{t.destinationBag}</Label>
                <Select value={targetBagId} onValueChange={setTargetBagId}>
                  <SelectTrigger><SelectValue placeholder={t.selectBag} /></SelectTrigger>
                  <SelectContent>
                    {otherBags.map((b) => (
                      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleMove} className="w-full" disabled={!targetBagId}>
                {t.move}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
