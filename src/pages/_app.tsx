import type { ComponentType } from "react";

export type AppProps = {
  Component: ComponentType<unknown>;
  pageProps: Record<string, unknown> | null;
};

const App = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />;
};

export default App;
