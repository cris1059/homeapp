import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import "@fontsource/fraunces/500.css";
import "@fontsource/fraunces/700.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import App from "./App.jsx";
import "./styles.css";

registerSW({
  immediate: true,
  onOfflineReady() {
    console.info("[HOME] Lista para usarse sin internet");
  },
  onRegisteredSW(swUrl, registration) {
    if (!registration) return;
    // Revisa actualizaciones al volver a la app (útil en móvil)
    setInterval(() => {
      registration.update().catch(() => {});
    }, 60 * 60 * 1000);
    console.info("[HOME] Service Worker registrado:", swUrl);
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
