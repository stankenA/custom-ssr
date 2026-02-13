import { PropsWithChildren } from "react";

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
          <link key={href} rel='stylesheet' href={href} />
        ))}
      </head>
      <body>
        {children}

        {js && <script type='module' src={js} />}
      </body>
    </html>
  );
};
