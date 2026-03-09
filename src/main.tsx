import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Request persistent storage so IndexedDB data survives browser/OS cleanup
if (navigator.storage?.persist) {
  navigator.storage.persist().then((granted) => {
    if (granted) {
      console.log("Storage persistence granted — data is safe.");
    } else {
      console.warn("Storage persistence denied — data may be evicted under pressure.");
    }
  });
}

createRoot(document.getElementById("root")!).render(<App />);
