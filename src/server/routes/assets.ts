import fs from "fs";
import path from "path";

type ManifestEntry = {
  file: string;
  css?: string[];
  isEntry?: boolean;
};

const manifestPath = path.resolve(process.cwd(), "public/.vite/manifest.json");

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8")) as Record<
  string,
  ManifestEntry
>;

export const getClientAssets = () => {
  const entry = manifest["src/client/app.ts"];

  if (!entry) {
    throw new Error("Client entry not found in manifest");
  }

  return {
    js: "/public/" + entry.file,
    css: entry.css?.map((file) => "/public/" + file) ?? [],
  };
};
