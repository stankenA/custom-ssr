import React from "react";
import { hydrateRoot } from "react-dom/client";
import "@/shared/styles/index.css";
import { PAGE_NAME_SCRIPT_ID, INITIAL_DATA_SCRIPT_ID, ROOT_ELEMENT_ID } from "@/shared/config";

const read = (id: string) => {
  const el = document.getElementById(id);
  return el ? JSON.parse(el.textContent ?? "null") : null;
};

const pageName: string = read(PAGE_NAME_SCRIPT_ID);
const initialData = read(INITIAL_DATA_SCRIPT_ID) ?? {};
const container = document.getElementById(ROOT_ELEMENT_ID);

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
