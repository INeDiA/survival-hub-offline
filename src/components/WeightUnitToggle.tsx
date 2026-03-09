import { Button } from "@/components/ui/button";
import { useWeightUnit } from "@/hooks/use-weight-unit";

export function WeightUnitToggle() {
  const { unit, toggleUnit } = useWeightUnit();
  return (
    <Button variant="outline" size="sm" className="font-mono text-xs px-2" onClick={toggleUnit}>
      {unit}
    </Button>
  );
}
