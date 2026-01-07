import { Router } from "express";
import { renderPage } from "../../render/render-page";
import { StaticPage } from "../../../pages/static";
import { getCache } from "../../cache";

const router = Router();
const pageRoute = "/static";

router.get(pageRoute, (_, res) => {
  const cachedPage = getCache(pageRoute);

  if (cachedPage) {
    return res.send(cachedPage);
  }

  const html = renderPage(<StaticPage />);
  return res.send(html);
});

export default router;
