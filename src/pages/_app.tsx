import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.min.css";
import Head from "next/head";
import { CarrinhoProvider } from "@/context/CarrinhoContext";
import Footer from "@/components/Footer/footer";
import Header from "@/components/Header/header";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { queryClient } from "@/queryCliente";
import { QueryClientProvider } from "react-query";

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Head>
          <title>E-commerce Soft Line</title>
        </Head>
        <CarrinhoProvider>
          <Header />
          <Component {...pageProps} />
          <ToastContainer />
          <Footer />
        </CarrinhoProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
