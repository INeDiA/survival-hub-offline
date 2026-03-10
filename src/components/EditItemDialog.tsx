import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useSaveItem } from "@/hooks/use-items";
import { type Item, type ItemCategory } from "@/lib/types";
import { useLanguage, useTranslatedCategories } from "@/hooks/use-language";

interface EditItemDialogProps {
  item: Item;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditItemDialog({ item, open, onOpenChange }: EditItemDialogProps) {
  const [weightUnit, setWeightUnit] = useState<"kg" | "g">("kg");
  const toGrams = (v: number) => weightUnit === "kg" ? Math.round(v * 1000) : v;

  const [name, setName] = useState(item.name);
  const [category, setCategory] = useState<ItemCategory>(item.category);
  const [weight, setWeight] = useState(String(item.weight / 1000));
  const [quantity, setQuantity] = useState(String(item.quantity));
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(
    item.expiryDate ? new Date(item.expiryDate) : undefined
  );
  const [notes, setNotes] = useState(item.notes);
  const [checked, setChecked] = useState(item.checked);
  const saveItem = useSaveItem();
  const { t } = useLanguage();
  const categories = useTranslatedCategories();

  useEffect(() => {
    setName(item.name);
    setCategory(item.category);
    setWeightUnit("kg");
    setWeight(String(item.weight / 1000));
    setQuantity(String(item.quantity));
    setExpiryDate(item.expiryDate ? new Date(item.expiryDate) : undefined);
    setNotes(item.notes);
    setChecked(item.checked);
  }, [item]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    saveItem.mutate(
      {
        ...item,
        name: name.trim(),
        category,
        weight: toGrams(parseFloat(weight) || 0),
        quantity: parseInt(quantity) || 1,
        expiryDate: expiryDate ? expiryDate.toISOString() : null,
        notes: notes.trim(),
      },
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t.editItem}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>{t.name}</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>{t.category}</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as ItemCategory)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.value} value={c.value}>{c.icon} {c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t.weight}</Label>
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
              <Label>{t.quantity}</Label>
              <Input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>{t.expiryOptional}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !expiryDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {expiryDate ? format(expiryDate, "dd/MM/yyyy") : t.selectDate}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={expiryDate} onSelect={setExpiryDate} initialFocus className="p-3 pointer-events-auto" />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label>{t.notes}</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <Button onClick={handleSubmit} className="w-full" disabled={!name.trim()}>
            {t.saveChanges}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
