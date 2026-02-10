import { ReactElement } from "react";
import { renderToString } from "react-dom/server";
import { Html } from "../../shared/html-template";

export const renderPage = (
  app: ReactElement,
) => {
  const appHtml = renderToString(app);

  const html = renderToString(
    <Html>
      <div id='root' dangerouslySetInnerHTML={{ __html: appHtml }} />
    </Html>,
  );

  return "<!DOCTYPE html>" + html;
};
