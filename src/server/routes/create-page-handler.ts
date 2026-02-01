import { Request, Response, Router } from "express";
import React from "react";
import { getCache, setCache } from "../cache";
import { renderPage } from "../render/render-page";

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

  router.get(route, async (req: Request, res: Response) => {
    const cacheKey = route + JSON.stringify(req.params);

    const cached = getCache(cacheKey);

    if (strategy === "ssg" && cached) {
      return res.send(cached.html);
    }

    if (strategy === "isr" && cached) {
      const isStale =
        revalidateMs && Date.now() - cached.timestamp > revalidateMs;

      if (isStale) {
        Promise.resolve().then(async () => {
          const data = getData ? await getData(req) : undefined;
          const html = renderPage(render(data as TData), { initialData: data });
          setCache(cacheKey, html);
        });
      }

      return res.send(cached.html);
    }

    const data = getData ? await getData(req) : undefined;
    const html = renderPage(render(data as TData), { initialData: data });

    if (strategy !== "ssr") {
      setCache(cacheKey, html);
    }

    return res.send(html);
  });

  return router;
}
