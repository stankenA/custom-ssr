import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { type Express, Router } from "express";

export const discoverPageRoutes = async (app: Express) => {
  const pagesDir = path.resolve(process.cwd(), "src/pages");

  for (const entry of fs.readdirSync(pagesDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    const serverFile = path.join(pagesDir, entry.name, "index.server.tsx");
    if (!fs.existsSync(serverFile)) continue;

    const mod = await import(pathToFileURL(serverFile).href);
    app.use(mod.default as Router);
  }
};
