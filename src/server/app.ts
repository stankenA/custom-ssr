import express from "express";
import mainPage from "./routes/pages/main";

export const createApp = () => {
  const app = express();

  app.use(mainPage);

  return app;
};
