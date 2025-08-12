import type React from "react"
import type { Metadata } from "next"
import { Inter, Noto_Naskh_Arabic } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
})

const notoNaskhArabic = Noto_Naskh_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto-naskh",
  preload: true,
})

export const metadata: Metadata = {
  title: "Athan Wake - Prayer Companion",
  description:
    "A spiritual alarm and prayer companion app for Muslims with Quran, prayer times, and verse recitation features",
  generator: "v0.app",
  applicationName: "Athan Wake",
  referrer: "origin-when-cross-origin",
  keywords: ["prayer times", "athan", "quran", "islamic", "muslim", "alarm", "spiritual"],
  authors: [{ name: "Athan Wake Team" }],
  creator: "Athan Wake Team",
  publisher: "Athan Wake Team",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://athanwake.app"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
      "ar-SA": "/ar-SA",
    },
  },
  openGraph: {
    title: "Athan Wake - Prayer Companion",
    description: "A spiritual alarm and prayer companion app for Muslims",
    url: "https://athanwake.app",
    siteName: "Athan Wake",
    images: [
      {
        url: "/athan-wake-app-preview.png",
        width: 1200,
        height: 630,
        alt: "Athan Wake - Prayer Companion App",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Athan Wake - Prayer Companion",
    description: "A spiritual alarm and prayer companion app for Muslims",
    images: ["/athan-wake-app-preview.png"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
  },
  manifest: "/manifest.json",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0F4C3A" },
    { media: "(prefers-color-scheme: dark)", color: "#F2C94C" },
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Athan Wake",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Athan Wake",
    "application-name": "Athan Wake",
    "msapplication-TileColor": "#0F4C3A",
    "msapplication-config": "/browserconfig.xml",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${notoNaskhArabic.variable}`} dir="auto">
      <head>
        {/* Preload critical fonts */}
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link
          rel="preload"
          href="/fonts/noto-naskh-arabic-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* PWA Icons */}
        <link rel="icon" type="image/svg+xml" href="/placeholder-qto3w.png" />
        <link rel="apple-touch-icon" href="/placeholder-qto3w.png" />
        <link rel="mask-icon" href="/placeholder-qto3w.png" color="#0F4C3A" />

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}
