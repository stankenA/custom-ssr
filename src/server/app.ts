import express from "express";
import staticPage from "./routes/pages/static";

export const createApp = () => {
  const app = express();

  app.use(staticPage);

  return app;
};
