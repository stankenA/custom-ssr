import { hydrateRoot } from "react-dom/client";

declare global {
  interface Window {
    __INITIAL_DATA__?: unknown;
  }
}

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container not found");
}

hydrateRoot(container, "<App initialData={window.__INITIAL_DATA__} />");
