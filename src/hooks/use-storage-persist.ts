import { useState, useEffect } from "react";

type PersistState = "granted" | "denied" | "unsupported" | "loading";

export function useStoragePersist() {
  const [state, setState] = useState<PersistState>("loading");
  const [dismissed, setDismissed] = useState(() =>
    localStorage.getItem("persist-banner-dismissed") === "true"
  );

  useEffect(() => {
    if (!navigator.storage?.persist) {
      setState("unsupported");
      return;
    }
    navigator.storage.persisted().then((persisted) => {
      if (persisted) {
        setState("granted");
      } else {
        navigator.storage.persist().then((granted) => {
          setState(granted ? "granted" : "denied");
        });
      }
    });
  }, []);

  const dismiss = () => {
    setDismissed(true);
    localStorage.setItem("persist-banner-dismissed", "true");
  };

  return { state, dismissed, dismiss };
}
