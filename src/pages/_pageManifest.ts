import type { GetServerSideProps } from "@/shared/types";
import MainPage, { getServerSideProps as mainGetServerSideProps } from "./main";
import PostPage, {
  getServerSideProps as postGetServerSideProps,
} from "./posts";
import StaticPage from "./static";
import { ISR_REVALIDATE } from "@/server/env";
import { ComponentType } from "react";

type PageEntry = {
  Component: ComponentType<any>;
  getServerSideProps?: GetServerSideProps<any>;
  revalidateMs?: number;
};

export const pageManifest: Record<string, PageEntry> = {
  "/": {
    Component: MainPage,
    getServerSideProps: mainGetServerSideProps,
    revalidateMs: ISR_REVALIDATE,
  },
  "/posts/:id": {
    Component: PostPage,
    getServerSideProps: postGetServerSideProps,
  },
  "/static": { Component: StaticPage },
};
