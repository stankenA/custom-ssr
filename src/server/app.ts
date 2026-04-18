import express from "express";
import staticPage from "./routes/pages/static";
import mainPage from "./routes/pages/main";
import postPage from "./routes/pages/posts";
import path from "path";

export const createApp = () => {
  const app = express();

  app.use("/public", express.static(path.join(__dirname, "../../public")));

  app.use(staticPage);
  app.use(mainPage);
  app.use(postPage);

  return app;
};
