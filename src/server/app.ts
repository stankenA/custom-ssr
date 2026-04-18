import path from "path";
import express from "express";
import apiRouter from "./routes/api";
import { discoverPageRoutes } from "./routes";
import { PUBLIC_PATH } from "@/shared/config";

export const createApp = async () => {
  const app = express();

  app.use(PUBLIC_PATH, express.static(path.join(__dirname, "../../public")));
  app.use("/api", apiRouter);
  discoverPageRoutes(app);

  return app;
};
