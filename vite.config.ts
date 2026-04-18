import path from "path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/public/",
  publicDir: false,
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  build: {
    outDir: "public",
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: { entry: path.resolve(__dirname, "src/app/entry.client.tsx") },
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
