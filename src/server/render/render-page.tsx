import { PAGE_MODULE_ID_SCRIPT_ID, INITIAL_DATA_SCRIPT_ID } from "@/shared/config";
import { Html } from "@/shared/html-template";
import App from "@/pages/_app";
import { ComponentType } from "react";
import { renderToString } from "react-dom/server";

type RenderPageOptions = {
  Component: ComponentType<any>;
  props: Record<string, unknown> | null;
  moduleId: string;
  js?: string;
  css?: string[];
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

export const renderPage = ({
  Component,
  props,
  moduleId,
  js,
  css,
}: RenderPageOptions) => {
  const appHtml = renderToString(<App Component={Component} pageProps={props} />);

  const html = renderToString(
    <Html css={css} js={js}>
      <div id='root' dangerouslySetInnerHTML={{ __html: appHtml }} />
      {moduleId && (
        <JsonScript id={PAGE_MODULE_ID_SCRIPT_ID} data={moduleId} />
      )}
      {props != null && (
        <JsonScript id={INITIAL_DATA_SCRIPT_ID} data={props} />
      )}
    </Html>,
  );

  return "<!DOCTYPE html>" + html;
};
