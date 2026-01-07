import express from "express";
import staticPage from "./routes/pages/static";
import mainPage from "./routes/pages/main";
import postPage from "./routes/pages/post";

export const createApp = () => {
  const app = express();

  app.use(staticPage);
  app.use(mainPage);
  app.use(postPage);

  return app;
};
