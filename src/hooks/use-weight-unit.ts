import { useState, useCallback } from "react";

export type WeightUnit = "kg" | "g" | "lbs";

const STORAGE_KEY = "bugout-weight-unit";
const KG_TO_LBS = 2.20462;

function getStoredUnit(): WeightUnit {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "g" || stored === "lbs") return stored;
  return "kg";
}

export function useWeightUnit() {
  const [unit, setUnitState] = useState<WeightUnit>(getStoredUnit);

  const setUnit = useCallback((u: WeightUnit) => {
    localStorage.setItem(STORAGE_KEY, u);
    setUnitState(u);
  }, []);

  const toggleUnit = useCallback(() => {
    setUnit(unit === "kg" ? "g" : unit === "g" ? "lbs" : "kg");
  }, [unit, setUnit]);

  const formatWeight = useCallback((grams: number) => {
    if (unit === "kg") return `${(grams / 1000).toFixed(2)} kg`;
    if (unit === "lbs") return `${((grams / 1000) * KG_TO_LBS).toFixed(2)} lbs`;
    return `${grams} g`;
  }, [unit]);

  /** Convert display value to grams for storage */
  const toGrams = useCallback((value: number) => {
    if (unit === "kg") return Math.round(value * 1000);
    if (unit === "lbs") return Math.round((value / KG_TO_LBS) * 1000);
    return value;
  }, [unit]);

  /** Convert grams to display value */
  const fromGrams = useCallback((grams: number) => {
    if (unit === "kg") return grams / 1000;
    if (unit === "lbs") return (grams / 1000) * KG_TO_LBS;
    return grams;
  }, [unit]);

  return { unit, setUnit, toggleUnit, formatWeight, toGrams, fromGrams };
}
