import React from "react";
import { hydrateRoot } from "react-dom/client";
import "@/shared/styles/index.css";

const read = (id: string) => {
  const el = document.getElementById(id);
  return el ? JSON.parse(el.textContent ?? "null") : null;
};

const pageName: string = read("__page-name__");
const initialData = read("__initial-data__") ?? {};
const container = document.getElementById("root");

if (!container) throw new Error("Root container not found");
if (!pageName) throw new Error("Page name not injected by server");

const modules = import.meta.glob<Record<string, React.ComponentType<any>>>(
  "../pages/**/index.tsx",
);

const loader = modules[`../pages/${pageName}/index.tsx`];
if (!loader) throw new Error(`No page module found for: ${pageName}`);

const mod = await loader();
const Component = Object.values(mod)[0];
if (!Component) throw new Error(`No component exported from page: ${pageName}`);

hydrateRoot(container, <Component {...initialData} />);
