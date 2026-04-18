import { hydrateRoot } from "react-dom/client";
import "../shared/styles/index.css";
import { PostPage } from "../pages/post";

declare global {
  interface Window {
    __INITIAL_DATA__?: any;
  }
}

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container not found");
}

hydrateRoot(container, <PostPage post={window.__INITIAL_DATA__} />);
