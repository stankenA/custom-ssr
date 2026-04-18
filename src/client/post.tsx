import { hydrateRoot } from "react-dom/client";
import "../shared/styles/index.css";
import { PostPage } from "../pages/post";

const container = document.getElementById("root");
const dataEl = document.getElementById("__initial-data__");
const initialData = dataEl ? JSON.parse(dataEl.textContent ?? "{}") : {};

if (!container) {
  throw new Error("Root container not found");
}

hydrateRoot(container, <PostPage post={initialData} />);
