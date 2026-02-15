import path from "path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  build: {
    outDir: "public",
    emptyOutDir: true,
    manifest: true,

    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "src/client/app.tsx"),
      },
      output: {
        assetFileNames(chunkInfo) {
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
