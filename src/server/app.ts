import path from "path";
import express from "express";
import apiRouter from "./routes/api";
import { discoverPageRoutes } from "./routes";

export const createApp = async () => {
  const app = express();

  app.use("/public", express.static(path.join(__dirname, "../../public")));
  app.use("/api", apiRouter);
  await discoverPageRoutes(app);

  return app;
};
