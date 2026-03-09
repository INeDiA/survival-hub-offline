import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

export type WeightUnit = "kg" | "lbs";

const KG_TO_LBS = 2.20462;
const STORAGE_KEY = "bugout-weight-unit";

interface WeightUnitContextValue {
  unit: WeightUnit;
  setUnit: (u: WeightUnit) => void;
  formatWeight: (grams: number) => string;
  toGrams: (value: number) => number;
  fromGrams: (grams: number) => number;
}

const WeightUnitContext = createContext<WeightUnitContextValue>({
  unit: "kg",
  setUnit: () => {},
  formatWeight: (g) => `${(g / 1000).toFixed(2)} kg`,
  toGrams: (v) => Math.round(v * 1000),
  fromGrams: (g) => g / 1000,
});

export function WeightUnitProvider({ children }: { children: ReactNode }) {
  const [unit, setUnitState] = useState<WeightUnit>(() => {
    if (typeof window === "undefined") return "kg";
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "lbs" ? "lbs" : "kg";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, unit);
  }, [unit]);

  const setUnit = useCallback((u: WeightUnit) => {
    setUnitState(u);
  }, []);

  const formatWeight = useCallback((grams: number) => {
    if (unit === "lbs") return `${((grams / 1000) * KG_TO_LBS).toFixed(2)} lbs`;
    return `${(grams / 1000).toFixed(2)} kg`;
  }, [unit]);

  const toGrams = useCallback((value: number) => {
    if (unit === "lbs") return Math.round((value / KG_TO_LBS) * 1000);
    return Math.round(value * 1000);
  }, [unit]);

  const fromGrams = useCallback((grams: number) => {
    if (unit === "lbs") return (grams / 1000) * KG_TO_LBS;
    return grams / 1000;
  }, [unit]);

  return (
    <WeightUnitContext.Provider value={{ unit, setUnit, formatWeight, toGrams, fromGrams }}>
      {children}
    </WeightUnitContext.Provider>
  );
}

export function useWeightUnit() {
  return useContext(WeightUnitContext);
}
