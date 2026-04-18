import { hydrateRoot } from "react-dom/client";
import { MainPage } from "../pages/main";
import "../shared/styles/index.css";

declare global {
  interface Window {
    __INITIAL_DATA__?: any;
  }
}

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container not found");
}

hydrateRoot(container, <MainPage {...window.__INITIAL_DATA__} />);
