import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";


interface WeightProgressProps {
  currentWeight: number;
  weightLimit: number;
  className?: string;
}

export function WeightProgress({ currentWeight, weightLimit, className }: WeightProgressProps) {
  const formatWeight = (g: number) => `${(g / 1000).toFixed(2)} kg`;
  const percentage = weightLimit > 0 ? Math.min((currentWeight / weightLimit) * 100, 100) : 0;
  const isOver = currentWeight > weightLimit;
  const isWarning = percentage > 80 && !isOver;

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex justify-between text-xs font-mono">
        <span className={cn(isOver && "text-destructive", isWarning && "text-warning")}>
          {formatWeight(currentWeight)}
        </span>
        <span className="text-muted-foreground">/ {formatWeight(weightLimit)}</span>
      </div>
      <Progress
        value={percentage}
        className={cn(
          "h-2",
          isOver && "[&>div]:bg-destructive",
          isWarning && "[&>div]:bg-warning"
        )}
      />
    </div>
  );
}
