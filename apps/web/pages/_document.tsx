import Document, {Html, Head, Main, NextScript} from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx);
    return {...initialProps};
  }

  render() {
    return (
      <Html>
        <Head>
          <meta name="application-name" content="Nest Next Auth" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content="Nest Next Auth" />
          <meta name="description" content="TurboRepo" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta
            name="msapplication-config"
            content="/icons/browserconfig.xml"
          />
          <meta name="msapplication-TileColor" content="#29A0B1" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content="#29A0B1" />

          <link rel="apple-touch-icon" href="/icons/apple-touch-icon-iphone" />
          <link
            rel="apple-touch-icon"
            sizes="152x152"
            href="/icons/apple-touch-icon-ipad.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/icons/apple-touch-icon-iphone-retina.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="167x167"
            href="/icons/apple-touch-icon-ipad-retina.png"
          />

          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/icons/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/icons/favicon-16x16.png"
          />
          <link
            rel="manifest"
            href="/manifest.json"
            crossOrigin="use-credentials"
          />
          <link
            rel="mask-icon"
            href="/icons/safari-pinned-tab.svg"
            color="#29A0B1"
          />
          <link rel="shortcut icon" href="/icons/favicon.ico" />

          <meta name="twitter:card" content="summary" />
          <meta name="twitter:url" content="https://twitter.com" />
          <meta name="twitter:title" content="Nest Next Auth" />
          <meta name="twitter:description" content="TTurboRepo" />
          <meta
            name="twitter:image"
            content="https://mrrhak.com/icons/android-chrome-192x192.png"
          />
          <meta name="twitter:creator" content="@twitter" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Nest Next Auth" />
          <meta property="og:description" content="TurboRepo" />
          <meta property="og:site_name" content="Nest Next Auth" />
          <meta property="og:url" content="https://twitter.com" />
          <meta
            property="og:image"
            content="https://mrrhak.com/icons/apple-touch-icon-iphone-retina.png"
          />

          {/* apple splash screen images */}

          {/* <link rel='apple-touch-startup-image' href='/images/apple_splash_2048.png' sizes='2048x2732' />
<link rel='apple-touch-startup-image' href='/images/apple_splash_1668.png' sizes='1668x2224' />
<link rel='apple-touch-startup-image' href='/images/apple_splash_1536.png' sizes='1536x2048' />
<link rel='apple-touch-startup-image' href='/images/apple_splash_1125.png' sizes='1125x2436' />
<link rel='apple-touch-startup-image' href='/images/apple_splash_1242.png' sizes='1242x2208' />
<link rel='apple-touch-startup-image' href='/images/apple_splash_750.png' sizes='750x1334' />
<link rel='apple-touch-startup-image' href='/images/apple_splash_640.png' sizes='640x1136' /> */}
        </Head>
        <body className="font-poppins">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
