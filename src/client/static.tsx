import { hydrateRoot } from "react-dom/client";
import "../shared/styles/index.css";
import { StaticPage } from "../pages/static";

declare global {
  interface Window {
    __INITIAL_DATA__?: any;
  }
}

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container not found");
}

hydrateRoot(container, <StaticPage {...window.__INITIAL_DATA__} />);
