import { Request, Response, Router } from "express";
import React from "react";
import { getCache, setCache } from "../cache";
import { renderPage } from "../render/render-page";
import { getPageAssets } from "./assets";

type PageHandlerConfig<TData> = {
  route: string;
  strategy: "ssg" | "ssr" | "isr";
  getData?: (req: Request) => Promise<TData> | TData;
  render: (data: TData) => React.ReactElement;
  revalidateMs?: number;
};

export function createPageHandler<TData>({
  route,
  strategy,
  getData,
  render,
  revalidateMs,
}: PageHandlerConfig<TData>) {
  const router = Router();

  const getPageNameFromRoute = (route: string): string => {
    // Убираем начальный слеш и динамические параметры
    // Например: '/' -> 'main'
    // '/posts' -> 'posts'
    // '/posts/:id' -> 'posts'
    // '/about/team' -> 'about'
    const baseRoute = route.split("/")[1] || "main";

    // Убираем динамические параметры (начинающиеся с :)
    if (baseRoute.startsWith(":")) {
      return "main";
    }

    return baseRoute;
  };
  const assets = getPageAssets(getPageNameFromRoute(route));

  router.get(route, async (req: Request, res: Response) => {
    const cacheKey =
      strategy === "ssg" ? route : route + JSON.stringify(req.params);

    const cached = getCache(cacheKey);

    if (strategy === "ssg" && cached) {
      return res.send(cached.html);
    }

    if (strategy === "isr" && cached) {
      const isStale =
        revalidateMs && Date.now() - cached.timestamp > revalidateMs;

      if (isStale) {
        Promise.resolve()
          .then(async () => {
            const data = getData ? await getData(req) : undefined;
            const html = renderPage(render(data as TData), {
              ...assets,
              initialData: data,
            });
            setCache(cacheKey, html);
          })
          .catch((err) => console.error("[ISR] Revalidation failed:", err));
      }

      return res.send(cached.html);
    }

    let data: TData | undefined;
    try {
      data = getData ? await getData(req) : undefined;
    } catch (err) {
      console.error(`[${strategy.toUpperCase()}] getData failed:`, err);
      return res.status(500).send("Internal Server Error");
    }

    const html = renderPage(render(data as TData), {
      ...assets,
      initialData: data,
    });

    if (strategy !== "ssr") {
      setCache(cacheKey, html);
    }

    return res.send(html);
  });

  return router;
}
