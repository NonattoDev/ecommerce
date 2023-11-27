import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="pt-br">
      <Head>
        <title>E-commerce Soft Line</title>
        <link rel="shortcut icon" href={`${process.env.NEXT_PUBLIC_FAVICON}`} type="image/x-icon" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
