import { Request, Response } from "express";
import { ComponentType } from "react";
import App from "@/pages/_app";
import { renderPage, getPageAssets } from "../render";
import { GetServerSideProps } from "@/shared/types";

type PageHandlerConfig<TProps extends Record<string, unknown>> = {
  route: string;
  page: ComponentType<TProps>;
  getServerSideProps?: GetServerSideProps<TProps>;
};

const getPageNameFromRoute = (route: string) => {
  const baseRoute = route.split("/")[1] || "main";
  return baseRoute.startsWith(":") ? "main" : baseRoute;
};

export const createPageHandler = <TProps extends Record<string, unknown>>({
  route,
  page: Page,
  getServerSideProps,
}: PageHandlerConfig<TProps>) => {
  const pageName = getPageNameFromRoute(route);
  const assets = getPageAssets();

  return async (req: Request, res: Response) => {
    try {
      const props = getServerSideProps
        ? (await getServerSideProps({ req, res })).props
        : ({} as TProps);

      const html = renderPage(<App Component={Page} pageProps={props} />, {
        ...assets,
        initialData: props,
        pageName,
      });

      res.send(html);
    } catch (err) {
      console.error("[SSR] getServerSideProps failed:", err);
      res.status(500).send("Internal Server Error");
    }
  };
};
