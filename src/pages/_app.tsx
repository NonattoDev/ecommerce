import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.min.css";
import Head from "next/head";
import { CarrinhoProvider } from "@/context/CarrinhoContext";
import Footer from "@/components/Footer/footer";
import Header from "@/components/Header/header";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>E-commerce Soft Line</title>
      </Head>
      <CarrinhoProvider>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </CarrinhoProvider>
    </>
  );
}
