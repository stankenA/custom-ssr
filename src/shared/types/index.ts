import type { Request, Response } from "express";

export type Post = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

export type GetServerSidePropsContext = {
  req: Request;
  res: Response;
};

export type GetServerSideProps<Props extends Record<string, unknown> = Record<string, unknown>> = (
  ctx: GetServerSidePropsContext
) => Promise<{ props: Props }>;
