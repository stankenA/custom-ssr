import { Router } from "express";
import { renderPage } from "../../render/render-page";
import { getCache, setCache } from "../../cache";
import { MainPage } from "../../../pages/main";
import { ISR_REVALIDATE } from "../../../shared/config";

const router = Router();
const pageRoute = "/";

router.get(pageRoute, (_, res) => {
  const cachedPage = getCache(pageRoute);

  if (!cachedPage) {
    console.log("wop");
    const html = renderPage(<MainPage date={Date.now()} />);
    setCache(pageRoute, html);
    return res.send(html);
  }

  const isStale = Date.now() - cachedPage.timestamp > ISR_REVALIDATE;

  if (isStale) {
    // revalidate в фоне
    Promise.resolve().then(() => {
      const newHtml = renderPage(<MainPage date={Date.now()} />);
      setCache(pageRoute, newHtml);
    });
  }

  return res.send(cachedPage.html);
});

export default router;
