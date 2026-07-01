import { PAGE_MODULE_ID_SCRIPT_ID, INITIAL_DATA_SCRIPT_ID } from "@/shared/config";
import { Html } from "@/shared/html-template";
import { ReactElement } from "react";
import { renderToString } from "react-dom/server";

type RenderPageOptions = {
  js?: string;
  css?: string[];
  initialData?: unknown;
  moduleId?: string;
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
      {options?.moduleId && (
        <JsonScript id={PAGE_MODULE_ID_SCRIPT_ID} data={options.moduleId} />
      )}
      {options?.initialData != null && (
        <JsonScript id={INITIAL_DATA_SCRIPT_ID} data={options.initialData} />
      )}
    </Html>,
  );

  return "<!DOCTYPE html>" + html;
};
