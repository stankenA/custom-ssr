import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import type { Express } from "express";
import { createPageHandler } from "./create-page-handler";

const PAGES_DIR = "src/pages";

export const discoverPageRoutes = async (app: Express) => {
  const pagesDir = path.resolve(process.cwd(), PAGES_DIR);

  for (const entry of fs.readdirSync(pagesDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    const pageFile = path.join(pagesDir, entry.name, "index.tsx");
    if (!fs.existsSync(pageFile)) continue;

    const mod = await import(pathToFileURL(pageFile).href);
    const { default: page, getServerSideProps, pageConfig } = mod;

    app.use(createPageHandler({ ...pageConfig, page, getServerSideProps }));
  }
};
