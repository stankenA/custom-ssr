import type { GetServerSideProps } from "@/shared/types";
import { ComponentType } from "react";
import MainPage, { getServerSideProps as mainGetServerSideProps } from "./main";
import PostPage, {
  getServerSideProps as postGetServerSideProps,
} from "./posts";
import StaticPage from "./static";

type PageEntry = {
  Component: ComponentType<any>;
  getServerSideProps?: GetServerSideProps<any>;
};

export const pageManifest: Record<string, PageEntry> = {
  "/": {
    Component: MainPage,
    getServerSideProps: mainGetServerSideProps,
  },
  "/posts/:id": {
    Component: PostPage,
    getServerSideProps: postGetServerSideProps,
  },
  "/static": { Component: StaticPage },
};
