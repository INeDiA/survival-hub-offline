import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WeightProgress } from "@/components/WeightProgress";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2, ChevronRight } from "lucide-react";
import { useDeleteBag } from "@/hooks/use-bags";
import { useItems } from "@/hooks/use-items";
import type { Bag } from "@/lib/types";
import { getExpiringItems } from "@/components/ExpiryBadge";
import { useLanguage } from "@/hooks/use-language";

interface BagCardProps {
  bag: Bag;
}

export function BagCard({ bag }: BagCardProps) {
  const navigate = useNavigate();
  const deleteBag = useDeleteBag();
  const { data: items = [] } = useItems(bag.id);
  const presentItems = items.filter((i) => i.checked);
  const totalWeight = (bag.bagWeight || 0) + presentItems.reduce((s, i) => s + i.weight * i.quantity, 0);
  const expiring = getExpiringItems(items);
  const { t } = useLanguage();

  return (
    <Card className="group cursor-pointer transition-colors hover:border-primary/40" onClick={() => navigate(`/bag/${bag.id}`)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-mono">{bag.name}</CardTitle>
          <div className="flex gap-1">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t.deleteBagTitle(bag.name)}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t.deleteBagDesc}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteBag.mutate(bag.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    {t.delete}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        {bag.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{bag.description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        <WeightProgress currentWeight={totalWeight} weightLimit={bag.weightLimit} />
        <div className="flex justify-between text-xs text-muted-foreground font-mono">
          <span>{items.length} {t.items}</span>
          {expiring.length > 0 && (
            <span className="text-warning">⚠ {expiring.length} {t.inExpiry}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
