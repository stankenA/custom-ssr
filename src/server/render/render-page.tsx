import { ReactElement } from "react";
import { renderToString } from "react-dom/server";
import { Html } from "../../shared/html-template";

export const renderPage = (
  app: ReactElement,
  options?: {
    jsSrc?: string;
    initialData?: unknown;
  },
) => {
  const appHtml = renderToString(app);

  const html = renderToString(
    <Html>
      <div id='root' dangerouslySetInnerHTML={{ __html: appHtml }} />
      {options?.initialData ? (
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__INITIAL_DATA__ = ${JSON.stringify(
              options.initialData,
            )}`,
          }}
        />
      ) : null}

      {options?.jsSrc ? <script type='module' src={options.jsSrc} /> : null}
    </Html>,
  );

  return "<!DOCTYPE html>" + html;
};
