import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useSaveItem } from "@/hooks/use-items";
import { CATEGORIES, type Item, type ItemCategory } from "@/lib/types";
import { Select as UnitSelect } from "@/components/ui/select";

interface AddItemDialogProps {
  bagId: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddItemDialog({ bagId, open: controlledOpen, onOpenChange: controlledOnOpenChange }: AddItemDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = controlledOnOpenChange ?? setInternalOpen;
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ItemCategory>("other");
  const [weight, setWeight] = useState("0");
  const [weightUnit, setWeightUnit] = useState<"kg" | "g">("kg");
  const [quantity, setQuantity] = useState("1");
  const [expiryDate, setExpiryDate] = useState<Date | undefined>();
  const [notes, setNotes] = useState("");
  const [alreadyInBag, setAlreadyInBag] = useState(false);
  const saveItem = useSaveItem();

  const toGrams = (v: number) => weightUnit === "kg" ? Math.round(v * 1000) : v;

  const reset = () => {
    setName("");
    setCategory("other");
    setWeight("0");
    setWeightUnit("kg");
    setQuantity("1");
    setExpiryDate(undefined);
    setNotes("");
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    const item: Item = {
      id: crypto.randomUUID(),
      bagId,
      name: name.trim(),
      category,
      weight: toGrams(parseFloat(weight) || 0),
      quantity: parseInt(quantity) || 1,
      expiryDate: expiryDate ? expiryDate.toISOString() : null,
      checked: false,
      notes: notes.trim(),
    };
    saveItem.mutate(item, {
      onSuccess: () => {
        setOpen(false);
        reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {controlledOpen === undefined && (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="h-4 w-4" /> Aggiungi Oggetto
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Aggiungi Oggetto</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Nome</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Bottiglia d'acqua 1L" />
          </div>
          <div>
            <Label>Categoria</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as ItemCategory)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.icon} {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Peso</Label>
              <div className="flex gap-2">
                <Input type="number" step={weightUnit === "kg" ? "0.01" : "1"} value={weight} onChange={(e) => setWeight(e.target.value)} className="flex-1" />
                <Select value={weightUnit} onValueChange={(v) => setWeightUnit(v as "kg" | "g")}>
                  <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="g">g</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Quantità</Label>
              <Input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Scadenza (opzionale)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !expiryDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {expiryDate ? format(expiryDate, "dd/MM/yyyy") : "Seleziona data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={expiryDate} onSelect={setExpiryDate} initialFocus className="p-3 pointer-events-auto" />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label>Note</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Note aggiuntive..." />
          </div>
          <Button onClick={handleSubmit} className="w-full" disabled={!name.trim()}>
            Aggiungi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
