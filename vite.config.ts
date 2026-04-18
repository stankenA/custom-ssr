import path from "path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";

// Функция для автоматического поиска всех страниц
function getPageEntries() {
  const pagesDir = path.resolve(__dirname, "src/pages");
  const entries: Record<string, string> = {};

  // Автоматически находим все страницы в папке pages
  const pageFiles = fs.readdirSync(pagesDir);
  pageFiles.forEach((folder) => {
    const indexPath = path.join(pagesDir, folder, "index.tsx");
    const clientEntryPath = path.join(__dirname, `src/client/${folder}.tsx`);

    // Проверяем существует ли папка с index.tsx
    if (fs.existsSync(indexPath)) {
      // Для каждой страницы создаем entry point
      entries[folder] = clientEntryPath;
    }
  });

  return entries;
}

export default defineConfig({
  build: {
    outDir: "public",
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: getPageEntries(),
      output: {
        entryFileNames: "js/[name]-[hash].js",
        chunkFileNames: "js/[name]-[hash].js",
        assetFileNames: (chunkInfo) => {
          if (chunkInfo.name?.endsWith(".css")) {
            return "css/[name]-[hash].css";
          }
          return "assets/[name]-[hash][extname]";
        },
      },
    },
  },
  plugins: [tailwindcss()],
});
