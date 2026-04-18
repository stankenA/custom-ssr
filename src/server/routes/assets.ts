import fs from "fs";
import path from "path";

type ManifestEntry = {
  file: string;
  name?: string;
  src?: string;
  isEntry?: boolean;
  css?: string[];
  imports?: string[];
};

// Загружаем манифест один раз
const manifestPath = path.resolve(process.cwd(), "public/.vite/manifest.json");

function loadManifest() {
  try {
    return JSON.parse(fs.readFileSync(manifestPath, "utf-8")) as Record<
      string,
      ManifestEntry
    >;
  } catch (error) {
    console.error("Failed to load manifest:", error);
    return {};
  }
}

const manifest = loadManifest();

/**
 * Получает ассеты для конкретной страницы
 * @param pageName - имя страницы (main, post, static и т.д.)
 */
export const getPageAssets = (pageName: string) => {
  const entryKey = `src/client/${pageName}.tsx`;
  const entry = manifest[entryKey];

  if (!entry) {
    console.warn(`Client entry not found in manifest for page: ${pageName}`);
    // Пробуем найти похожий entry
    const alternativeEntry = Object.entries(manifest).find(
      ([key, value]) =>
        value.isEntry &&
        (key.includes(`/${pageName}.tsx`) || value.name === pageName),
    );

    if (alternativeEntry) {
      console.log(
        `Found alternative entry for ${pageName}:`,
        alternativeEntry[0],
      );
      return extractAssets(alternativeEntry[1]);
    }

    return { js: "", css: [] };
  }

  return extractAssets(entry);
};

/**
 * Извлекает JS и CSS из entry, включая CSS из импортируемых чанков
 */
function extractAssets(entry: ManifestEntry) {
  const assets = {
    js: entry.file.startsWith("/") ? entry.file : `/${entry.file}`,
    css: [
      ...(entry.css?.map((file) =>
        file.startsWith("/") ? file : `/${file}`,
      ) ?? []),
    ],
  };

  // Если у entry есть imports, ищем среди них CSS
  if (entry.imports && entry.imports.length > 0) {
    entry.imports.forEach((importKey) => {
      const importedModule = manifest[importKey];
      if (importedModule?.css) {
        importedModule.css.forEach((cssFile) => {
          const cssPath = cssFile.startsWith("/") ? cssFile : `/${cssFile}`;
          if (!assets.css.includes(cssPath)) {
            assets.css.push(cssPath);
          }
        });
      }
    });
  }

  return assets;
}

/**
 * Получает ассеты для всех страниц (полезно для предзагрузки)
 */
export const getAllPagesAssets = () => {
  const pages: Record<string, ReturnType<typeof getPageAssets>> = {};

  Object.entries(manifest).forEach(([key, entry]) => {
    if (entry.isEntry && key.startsWith("src/client/")) {
      const pageName = key.replace("src/client/", "").replace(".tsx", "");
      pages[pageName] = extractAssets(entry);
    }
  });

  return pages;
};
