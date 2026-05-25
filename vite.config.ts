import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
const BASE = "/survival-hub-offline/";

export default defineConfig(({ mode }) => ({
  base: mode === "production" ? BASE : "/",
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico"],
      workbox: {
        navigateFallbackDenylist: [/^\/~oauth/],
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
      },
      manifest: {
        name: "BugOut Manager",
        short_name: "BugOut",
        description: "Gestisci i tuoi zaini di emergenza con tracciamento peso, scadenze e checklist offline.",
        start_url: BASE,
        display: "standalone",
        background_color: "#111916",
        theme_color: "#5a7a3a",
        orientation: "portrait",
        icons: [
          {
            src: `${BASE}pwa-192x192.png`,
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: `${BASE}pwa-512x512.png`,
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: `${BASE}pwa-maskable-192.png`,
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: `${BASE}pwa-maskable-512.png`,
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
