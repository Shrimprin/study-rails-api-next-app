import "@/styles/globals.css";
import type { AppProps } from "next/app";
import * as React from "react";
import "@/styles/destyle.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
