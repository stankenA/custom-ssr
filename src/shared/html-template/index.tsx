import { PropsWithChildren } from "react";
import { PUBLIC_PATH } from "../config";

type HtmlProps = PropsWithChildren & {
  css?: string[];
  js?: string;
};

export const Html = ({ children, css = [], js }: HtmlProps) => {
  return (
    <html lang='ru'>
      <head>
        <meta charSet='utf-8' />
        <title>Custom SSR</title>

        {css.map((href) => (
          <link key={href} rel='stylesheet' href={PUBLIC_PATH + href} />
        ))}
      </head>
      <body>
        {children}

        {js && <script type='module' src={PUBLIC_PATH + js} />}
      </body>
    </html>
  );
};
