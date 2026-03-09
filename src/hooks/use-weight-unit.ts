import { useState, useCallback } from "react";

export type WeightUnit = "kg" | "g";

const STORAGE_KEY = "bugout-weight-unit";

function getStoredUnit(): WeightUnit {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "g" ? "g" : "kg";
}

export function useWeightUnit() {
  const [unit, setUnitState] = useState<WeightUnit>(getStoredUnit);

  const setUnit = useCallback((u: WeightUnit) => {
    localStorage.setItem(STORAGE_KEY, u);
    setUnitState(u);
  }, []);

  const toggleUnit = useCallback(() => {
    setUnit(unit === "kg" ? "g" : "kg");
  }, [unit, setUnit]);

  const formatWeight = useCallback((grams: number) => {
    if (unit === "kg") return `${(grams / 1000).toFixed(2)} kg`;
    return `${grams} g`;
  }, [unit]);

  /** Convert display value to grams for storage */
  const toGrams = useCallback((value: number) => {
    return unit === "kg" ? Math.round(value * 1000) : value;
  }, [unit]);

  /** Convert grams to display value */
  const fromGrams = useCallback((grams: number) => {
    return unit === "kg" ? grams / 1000 : grams;
  }, [unit]);

  return { unit, setUnit, toggleUnit, formatWeight, toGrams, fromGrams };
}
