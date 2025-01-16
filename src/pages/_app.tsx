import "@/styles/globals.css";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { AppProps } from "next/app";
import { Layout } from "@/components/Layout";

const WeatherApp = ({ Component, pageProps }: AppProps) => (
  <Provider store={store}>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </Provider>
);

export default WeatherApp;
