import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { useSaveBag } from "@/hooks/use-bags";
import type { Bag } from "@/lib/types";
import { useLanguage } from "@/hooks/use-language";

interface EditBagDialogProps {
  bag: Bag;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditBagDialog({ bag, open, onOpenChange }: EditBagDialogProps) {
  const [name, setName] = useState(bag.name);
  const [description, setDescription] = useState(bag.description);
  const [weightLimit, setWeightLimit] = useState(String(bag.weightLimit / 1000));
  const [bagWeight, setBagWeight] = useState(String((bag.bagWeight || 0) / 1000));
  const saveBag = useSaveBag();
  const { t } = useLanguage();

  useEffect(() => {
    setName(bag.name);
    setDescription(bag.description);
    setWeightLimit(String(bag.weightLimit / 1000));
    setBagWeight(String((bag.bagWeight || 0) / 1000));
  }, [bag]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    saveBag.mutate(
      {
        ...bag,
        name: name.trim(),
        description: description.trim(),
        weightLimit: Math.round((parseFloat(weightLimit) || 15) * 1000),
        bagWeight: Math.round((parseFloat(bagWeight) || 0) * 1000),
        updatedAt: new Date().toISOString(),
      },
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.editBag}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>{t.name}</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>{t.description}</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t.weightLimit} (kg)</Label>
              <Input type="number" step="0.1" value={weightLimit} onChange={(e) => setWeightLimit(e.target.value)} />
            </div>
            <div>
              <Label>{t.bagWeight} (kg)</Label>
              <Input type="number" step="0.01" value={bagWeight} onChange={(e) => setBagWeight(e.target.value)} />
            </div>
          </div>
          <Button onClick={handleSubmit} className="w-full" disabled={!name.trim()}>
            {t.saveChanges}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
