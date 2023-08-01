// Bibliothèques externes
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'

export default function DocumentPage() {
  return (
    <Html lang="fr" dir="ltr">
      <Head>
        <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
        <link rel="icon" type="image/ico" sizes="64x64" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <body className=" bg-bg text-txt">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export async function getInitialProps(ctx: DocumentContext) {
  return await Document.getInitialProps(ctx)
}
