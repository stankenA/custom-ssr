import { Html } from "../../shared/html-template";
import { ReactElement } from "react";
import { renderToString } from "react-dom/server";

type RenderPageOptions = {
  js?: string;
  css?: string[];
  initialData?: unknown;
  pageName?: string;
};

export const renderPage = (app: ReactElement, options?: RenderPageOptions) => {
  const appHtml = renderToString(app);

  const html = renderToString(
    <Html css={options?.css} js={options?.js}>
      <div id='root' dangerouslySetInnerHTML={{ __html: appHtml }} />

      {options?.pageName ? (
        <script
          id='__page-name__'
          type='application/json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(options.pageName),
          }}
        />
      ) : null}

      {options?.initialData ? (
        <script
          id='__initial-data__'
          type='application/json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(options.initialData).replace(
              /<\/script>/gi,
              "<\\/script>",
            ),
          }}
        />
      ) : null}
    </Html>,
  );

  return "<!DOCTYPE html>" + html;
};
