import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext
} from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="en">
        {/* <Head /> */}
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
          />
          <meta
            name="description"
            content="Centraliza, organiza y administra tu granja de forma eficiente. Incrementa tus utilidades"
          />
          <meta
            name="keywords"
            content="farm, ranchito, miRanchito, migranja granja, crianza de animales, borregos"
          />
          <link rel="manifest" href="/manifest.json" />
          <link
            href="/assets/icons/icon-48x48.png"
            rel="icon"
            type="image/png"
            sizes="16x16"
          />
          <link
            href="/assets/icons/icon-152x152.png"
            rel="icon"
            type="image/png"
            sizes="32x32"
          />
          <link
            rel="apple-touch-icon"
            href="/assets/icons/icon-152x152.png"
          ></link>
          <meta name="theme-color" content="#C6B386" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
{
  /* <Head key={'home-layout'}>
<meta charSet="utf-8" />
<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
<meta
  name="viewport"
  content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
/>
<meta
  name="description"
  content="Centraliza, organiza y administra tu granja de forma eficiente. Incrementa tus utilidades"
/>
<meta
  name="keywords"
  content="farm, ranchito, miRanchito, migranja granja, crianza de animales, borregos"
/>
<title>Mi Granja</title>
<link rel="manifest" href="/manifest.json" />
<link
  href="/assets/icons/icon-48x48.png"
  rel="icon"
  type="image/png"
  sizes="16x16"
/>
<link
  href="/assets/icons/icon-152x152.png"
  rel="icon"
  type="image/png"
  sizes="32x32"
/>
<link
  rel="apple-touch-icon"
  href="/assets/icons/icon-152x152.png"
></link>
<meta name="theme-color" content="#C6B386" />
</Head> */
}

export default MyDocument
