import path from "path";
import express from "express";
import apiRouter from "./routes/api";
import { createPageHandler } from "./routes";
import { pageManifest } from "@/pages/_pageManifest";
import { PUBLIC_PATH } from "@/shared/config";

export const createApp = async () => {
  const app = express();

  app.use(PUBLIC_PATH, express.static(path.join(__dirname, "../../public")));
  app.use("/api", apiRouter);

  for (const [route, { Component, getServerSideProps }] of Object.entries(
    pageManifest,
  )) {
    app.get(
      route,
      createPageHandler({ route, page: Component, getServerSideProps }),
    );
  }

  return app;
};
