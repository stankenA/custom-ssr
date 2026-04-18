import { hydrateRoot } from "react-dom/client";
import "../shared/styles/index.css";
import { StaticPage } from "../pages/static";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container not found");
}

hydrateRoot(container, <StaticPage />);
