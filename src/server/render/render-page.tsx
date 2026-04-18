import { Html } from "../../shared/html-template";
import { ReactElement } from "react";
import { renderToString } from "react-dom/server";

type RenderPageOptions = {
  js?: string;
  css?: string[];
  initialData?: unknown;
  pageName?: string;
};

const JsonScript = ({ id, data }: { id: string; data: unknown }) => (
  <script
    id={id}
    type='application/json'
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(data).replace(/<\/script>/gi, "<\\/script>"),
    }}
  />
);

export const renderPage = (app: ReactElement, options?: RenderPageOptions) => {
  const appHtml = renderToString(app);

  const html = renderToString(
    <Html css={options?.css} js={options?.js}>
      <div id='root' dangerouslySetInnerHTML={{ __html: appHtml }} />
      {options?.pageName && (
        <JsonScript id='__page-name__' data={options.pageName} />
      )}
      {options?.initialData != null && (
        <JsonScript id='__initial-data__' data={options.initialData} />
      )}
    </Html>,
  );

  return "<!DOCTYPE html>" + html;
};
