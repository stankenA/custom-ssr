import express from "express";
import staticPage from "./routes/pages/static";
import mainPage from "./routes/pages/main";

export const createApp = () => {
  const app = express();

  app.use(staticPage);
  app.use(mainPage);

  return app;
};
