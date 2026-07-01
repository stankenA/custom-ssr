import React from "react";
import { hydrateRoot } from "react-dom/client";
import {
  PAGE_NAME_SCRIPT_ID,
  INITIAL_DATA_SCRIPT_ID,
  ROOT_ELEMENT_ID,
} from "@/shared/config";
import App from "@/pages/_app";
import "@/shared/styles/index.css";

const readScript = (id: string) => {
  const el = document.getElementById(id);
  return el ? JSON.parse(el.textContent ?? "null") : null;
};

const pageName: string = readScript(PAGE_NAME_SCRIPT_ID);
const initialData = readScript(INITIAL_DATA_SCRIPT_ID) ?? {};
const container = document.getElementById(ROOT_ELEMENT_ID);

if (!container) throw new Error("Root container not found");
if (!pageName) throw new Error("Page name not injected by server");

const modules = import.meta.glob<{ default: React.ComponentType<any> }>(
  "../pages/**/index.tsx",
);

const loader = modules[`../pages/${pageName}/index.tsx`];
if (!loader) throw new Error(`No page module found for: ${pageName}`);

const mod = await loader();
const Component = mod.default;
if (!Component) throw new Error(`No component exported from page: ${pageName}`);

hydrateRoot(container, <App Component={Component} pageProps={initialData} />);
