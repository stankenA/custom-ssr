import { Request, Response } from "express";
import { ComponentType } from "react";
import { renderPage, getPageAssets } from "../render";
import { getCache, setCache } from "../cache";
import { GetServerSideProps, GetStaticProps } from "@/shared/types";

type PageHandlerConfig<TProps extends Record<string, unknown>> = {
  moduleId: string;
  page: ComponentType<TProps>;
  getServerSideProps?: GetServerSideProps<TProps>;
  getStaticProps?: GetStaticProps<TProps>;
};

export const createPageHandler = <TProps extends Record<string, unknown>>({
  moduleId,
  page: Page,
  getServerSideProps,
  getStaticProps,
}: PageHandlerConfig<TProps>) => {
  const assets = getPageAssets();
  const isStatic = !getServerSideProps;

  return async (req: Request, res: Response) => {
    try {
      if (isStatic) {
        const cached = getCache(req.path);
        if (cached) {
          res.send(cached.html);
          return;
        }
      }

      const props = getServerSideProps
        ? (await getServerSideProps({ req, res })).props
        : getStaticProps
          ? (await getStaticProps({ params: req.params })).props
          : null;

      const html = renderPage({ Component: Page, props, moduleId, ...assets });

      if (isStatic) setCache(req.path, html);

      res.send(html);
    } catch (err) {
      console.error("[SSR] page render failed:", err);
      res.status(500).send("Internal Server Error");
    }
  };
};
