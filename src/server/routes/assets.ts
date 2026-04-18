import fs from "fs";
import path from "path";

type ManifestEntry = {
  file: string;
  isEntry?: boolean;
  css?: string[];
  imports?: string[];
};

const manifestPath = path.resolve(process.cwd(), "public/.vite/manifest.json");

function loadManifest() {
  try {
    return JSON.parse(fs.readFileSync(manifestPath, "utf-8")) as Record<
      string,
      ManifestEntry
    >;
  } catch {
    console.error("Failed to load Vite manifest — did you run the build?");
    return {};
  }
}

const manifest = loadManifest();

function extractAssets(entry: ManifestEntry) {
  const normalize = (f: string) => (f.startsWith("/") ? f : `/${f}`);

  const assets = {
    js: normalize(entry.file),
    css: entry.css?.map(normalize) ?? [],
  };

  entry.imports?.forEach((key) => {
    manifest[key]?.css?.forEach((f) => {
      const p = normalize(f);
      if (!assets.css.includes(p)) assets.css.push(p);
    });
  });

  return assets;
}

export const getPageAssets = () => {
  const entry = manifest["src/pages/entry.client.tsx"];
  if (!entry) {
    console.warn("Client entry not found in manifest");
    return { js: "", css: [] };
  }
  return extractAssets(entry);
};
