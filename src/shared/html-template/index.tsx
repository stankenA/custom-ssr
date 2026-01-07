import { PropsWithChildren } from "react";

export const Html = ({ children }: PropsWithChildren) => {
  return (
    <html lang='ru'>
      <head>
        <meta charSet='utf-8' />
        <title>Custom SSR</title>
      </head>
      <body>{children}</body>
    </html>
  );
};
