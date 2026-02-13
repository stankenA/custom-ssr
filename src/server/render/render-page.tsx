import { Html } from "../../shared/html-template";
import { ReactElement } from "react";
import { renderToString } from "react-dom/server";

type RenderPageOptions = {
  js?: string;
  css?: string[];
};

export const renderPage = (app: ReactElement, options?: RenderPageOptions) => {
  const appHtml = renderToString(app);

  const html = renderToString(
    <Html css={options?.css} js={options?.js}>
      <div id='root' dangerouslySetInnerHTML={{ __html: appHtml }} />
    </Html>,
  );

  return "<!DOCTYPE html>" + html;
};
