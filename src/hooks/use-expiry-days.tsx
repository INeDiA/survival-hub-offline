import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

const STORAGE_KEY = "bugout-expiry-warning-days";
const DEFAULT_DAYS = 30;

interface ExpiryDaysContextValue {
  expiryWarningDays: number;
  setExpiryWarningDays: (days: number) => void;
}

const ExpiryDaysContext = createContext<ExpiryDaysContextValue>({
  expiryWarningDays: DEFAULT_DAYS,
  setExpiryWarningDays: () => {},
});

export function ExpiryDaysProvider({ children }: { children: ReactNode }) {
  const [days, setDays] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_DAYS;
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? parseInt(stored, 10) || DEFAULT_DAYS : DEFAULT_DAYS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(days));
  }, [days]);

  return (
    <ExpiryDaysContext.Provider value={{ expiryWarningDays: days, setExpiryWarningDays: setDays }}>
      {children}
    </ExpiryDaysContext.Provider>
  );
}

export function useExpiryDays() {
  return useContext(ExpiryDaysContext);
}
