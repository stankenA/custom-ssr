import { Request, Response, Router } from "express";
import React from "react";
import { getCache, setCache } from "../cache";
import { renderPage } from "../render/render-page";
import { getPageAssets } from "./assets";

type PageHandlerConfig<TData> = {
  route: string;
  getData?: (req: Request) => Promise<TData> | TData;
  render: (data: TData) => React.ReactElement;
} & (
  | { strategy: "ssg" | "ssr"; revalidateMs?: never }
  | { strategy: "isr"; revalidateMs: number }
);

function getPageNameFromRoute(route: string): string {
  const baseRoute = route.split("/")[1] || "main";
  return baseRoute.startsWith(":") ? "main" : baseRoute;
}

export function createPageHandler<TData>({
  route,
  strategy,
  getData,
  render,
  revalidateMs,
}: PageHandlerConfig<TData>) {
  const router = Router();
  const pageName = getPageNameFromRoute(route);
  const assets = getPageAssets();

  const generateHtml = async (req: Request): Promise<string> => {
    const data = getData ? await getData(req) : undefined;
    return renderPage(render(data as TData), { ...assets, initialData: data, pageName });
  };

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
        generateHtml(req)
          .then((html) => setCache(cacheKey, html))
          .catch((err) => console.error("[ISR] Revalidation failed:", err));
      }

      return res.send(cached.html);
    }

    let html: string;
    try {
      html = await generateHtml(req);
    } catch (err) {
      console.error(`[${strategy.toUpperCase()}] getData failed:`, err);
      return res.status(500).send("Internal Server Error");
    }

    if (strategy !== "ssr") {
      setCache(cacheKey, html);
    }

    return res.send(html);
  });

  return router;
}
