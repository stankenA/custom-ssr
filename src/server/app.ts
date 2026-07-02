import path from "path";
import express from "express";
import apiRouter from "./routes/api";
import { createPageHandler } from "./routes";
import { pageManifest } from "@/pages/_pageManifest";
import { PUBLIC_PATH } from "@/shared/config";

export const createApp = () => {
  const app = express();

  app.use(PUBLIC_PATH, express.static(path.join(__dirname, "../../public")));
  app.use("/api", apiRouter);

  for (const [
    route,
    { Component, getServerSideProps, moduleId },
  ] of Object.entries(pageManifest)) {
    app.get(
      route,
      createPageHandler({ moduleId, page: Component, getServerSideProps }),
    );
  }

  return app;
};
