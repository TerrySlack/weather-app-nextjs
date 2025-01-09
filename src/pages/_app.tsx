import "@/styles/globals.css";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { AppProps } from "next/app";

const WeatherApp = ({ Component, pageProps }: AppProps) => (
  <Provider store={store}>
    <Component {...pageProps} />
  </Provider>
);

export default WeatherApp;
