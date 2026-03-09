import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useSaveBag } from "@/hooks/use-bags";
import type { Bag } from "@/lib/types";
import { useWeightUnit } from "@/hooks/use-weight-unit";

export function AddBagDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [weightLimit, setWeightLimit] = useState("15");
  const saveBag = useSaveBag();
  const { unit, toGrams } = useWeightUnit();

  const handleSubmit = () => {
    if (!name.trim()) return;
    const bag: Bag = {
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description.trim(),
      weightLimit: toGrams(parseFloat(weightLimit) || 15),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveBag.mutate(bag, {
      onSuccess: () => {
        setOpen(false);
        setName("");
        setDescription("");
        setWeightLimit("15");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Nuovo Zaino
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuovo Zaino</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="bag-name">Nome</Label>
            <Input id="bag-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="BOB 72h" />
          </div>
          <div>
            <Label htmlFor="bag-desc">Descrizione</Label>
            <Textarea id="bag-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Zaino principale per evacuazione..." />
          </div>
          <div>
            <Label htmlFor="bag-weight">Limite peso ({unit})</Label>
            <Input id="bag-weight" type="number" step={unit === "kg" ? "0.1" : "1"} value={weightLimit} onChange={(e) => setWeightLimit(e.target.value)} />
          </div>
          <Button onClick={handleSubmit} className="w-full" disabled={!name.trim()}>
            Crea Zaino
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
