import { Request, Response, Router } from "express";
import React from "react";
import { getCache, setCache } from "../cache";
import { renderPage, getPageAssets } from "../render";
import { GetServerSideProps } from "@/shared/types";

type PageHandlerConfig<TProps extends Record<string, unknown>> = {
  route: string;
  page: React.ComponentType<TProps>;
  getServerSideProps?: GetServerSideProps<TProps>;
  revalidateMs?: number;
};

function getPageNameFromRoute(route: string): string {
  const baseRoute = route.split("/")[1] || "main";
  return baseRoute.startsWith(":") ? "main" : baseRoute;
}

export function createPageHandler<TProps extends Record<string, unknown>>({
  route,
  page: Page,
  getServerSideProps,
  revalidateMs,
}: PageHandlerConfig<TProps>) {
  const router = Router();
  const pageName = getPageNameFromRoute(route);
  const assets = getPageAssets();

  const strategy = getServerSideProps
    ? revalidateMs
      ? "isr"
      : "ssr"
    : "ssg";

  const generateHtml = async (req: Request, res: Response): Promise<string> => {
    const props = getServerSideProps
      ? (await getServerSideProps({ req, res })).props
      : ({} as TProps);
    return renderPage(<Page {...props} />, { ...assets, initialData: props, pageName });
  };

  router.get(route, async (req: Request, res: Response) => {
    const cacheKey =
      strategy === "ssg" ? route : route + JSON.stringify(req.params);

    const cached = getCache(cacheKey);

    if (strategy === "ssg" && cached) {
      return res.send(cached.html);
    }

    if (strategy === "isr" && cached) {
      const isStale = Date.now() - cached.timestamp > revalidateMs!;

      if (isStale) {
        generateHtml(req, res)
          .then((html) => setCache(cacheKey, html))
          .catch((err) => console.error("[ISR] Revalidation failed:", err));
      }

      return res.send(cached.html);
    }

    let html: string;
    try {
      html = await generateHtml(req, res);
    } catch (err) {
      console.error(`[${strategy.toUpperCase()}] getServerSideProps failed:`, err);
      return res.status(500).send("Internal Server Error");
    }

    if (strategy !== "ssr") {
      setCache(cacheKey, html);
    }

    return res.send(html);
  });

  return router;
}
