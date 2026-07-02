import { Request, Response } from "express";
import { ComponentType } from "react";
import { renderPage, getPageAssets } from "../render";
import { GetServerSideProps } from "@/shared/types";

type PageHandlerConfig<TProps extends Record<string, unknown>> = {
  moduleId: string;
  page: ComponentType<TProps>;
  getServerSideProps?: GetServerSideProps<TProps>;
};

export const createPageHandler = <TProps extends Record<string, unknown>>({
  moduleId,
  page: Page,
  getServerSideProps,
}: PageHandlerConfig<TProps>) => {
  const assets = getPageAssets();

  return async (req: Request, res: Response) => {
    try {
      const props = getServerSideProps
        ? (await getServerSideProps({ req, res })).props
        : null;

      const html = renderPage({ Component: Page, props, moduleId, ...assets });

      res.send(html);
    } catch (err) {
      console.error("[SSR] getServerSideProps failed:", err);
      res.status(500).send("Internal Server Error");
    }
  };
};
