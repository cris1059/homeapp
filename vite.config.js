import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: false,
      includeAssets: [
        "icons/icon-192.png",
        "icons/icon-512.png",
        "icons/icon-maskable-512.png",
      ],
      manifest: {
        name: "HOME — Días de casa",
        short_name: "HOME",
        description: "Calendario de días home del equipo",
        start_url: "./",
        scope: "./",
        display: "standalone",
        orientation: "portrait-primary",
        background_color: "#fbfaf6",
        theme_color: "#154a3b",
        lang: "es-MX",
        icons: [
          {
            src: "icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "icons/icon-maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        // Precache de toda la app (JS, CSS, HTML, iconos, fuentes locales)
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2,webmanifest}"],
        // SPA: cualquier ruta cae al index cacheado cuando no hay red
        navigateFallback: "index.html",
        navigateFallbackDenylist: [/^\/api/],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        // App propia: cache-first tras precache
        runtimeCaching: [
          {
            urlPattern: ({ request, sameOrigin }) =>
              sameOrigin && request.destination === "document",
            handler: "NetworkFirst",
            options: {
              cacheName: "home-pages",
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 16,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
          {
            urlPattern: ({ request, sameOrigin }) =>
              sameOrigin &&
              ["style", "script", "worker", "font", "image"].includes(
                request.destination
              ),
            handler: "CacheFirst",
            options: {
              cacheName: "home-assets",
              expiration: {
                maxEntries: 64,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
        ],
      },
      // En preview/prod el SW está activo; en dev no hace falta SW
      devOptions: {
        enabled: false,
      },
    }),
  ],
});
