import type { ComponentType } from "react";

export type AppProps = {
  Component: ComponentType<any>;
  pageProps: Record<string, unknown>;
};

const App = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />;
};

export default App;
