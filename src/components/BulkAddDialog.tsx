import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useSaveItem } from "@/hooks/use-items";
import type { Item } from "@/lib/types";
import { useLanguage } from "@/hooks/use-language";

interface BulkAddDialogProps {
  bagId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BulkAddDialog({ bagId, open, onOpenChange }: BulkAddDialogProps) {
  const [text, setText] = useState("");
  const [alreadyInBag, setAlreadyInBag] = useState(false);
  const saveItem = useSaveItem();
  const { t } = useLanguage();

  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  const handleSubmit = () => {
    if (lines.length === 0) return;
    for (const name of lines) {
      const item: Item = {
        id: crypto.randomUUID(),
        bagId,
        name,
        category: "accessories",
        weight: 0,
        quantity: 1,
        expiryDate: null,
        checked: alreadyInBag,
        notes: "",
      };
      saveItem.mutate(item);
    }
    setText("");
    setAlreadyInBag(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.importList}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>{t.onePerLine}</Label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t.bulkPlaceholder}
              rows={8}
            />
          </div>
          {lines.length > 0 && (
            <p className="text-xs text-muted-foreground font-mono">
              {t.itemsToAdd(lines.length)}
            </p>
          )}
          <div className="flex items-center gap-3">
            <Switch checked={alreadyInBag} onCheckedChange={setAlreadyInBag} id="bulk-already-in-bag" />
            <Label htmlFor="bulk-already-in-bag" className="text-sm cursor-pointer">{t.alreadyInBag}</Label>
          </div>
          <Button onClick={handleSubmit} className="w-full" disabled={lines.length === 0}>
            {t.addItems(lines.length)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
