import type { Express } from "express";
import { pageManifest } from "@/pages/_pageManifest";
import { createPageHandler } from "./create-page-handler";

export const discoverPageRoutes = (app: Express) => {
  for (const [route, { Component, getServerSideProps, revalidateMs }] of Object.entries(pageManifest)) {
    app.use(createPageHandler({ route, page: Component, getServerSideProps, revalidateMs }));
  }
};
