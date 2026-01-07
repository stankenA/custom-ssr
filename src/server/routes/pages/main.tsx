import { Router } from "express";
import { renderPage } from "../../render/render-page";
import { MainPage } from "../../../pages/main";

const router = Router();

router.get("/", (_, res) => {
  const html = renderPage(<MainPage />);
  res.send(html);
});

export default router;
