import type { Metadata, Viewport } from "next";
import { Archivo, Hanken_Grotesk, Space_Mono } from "next/font/google";
import { SITE } from "@/lib/site-data";
import JsonLd from "@/components/JsonLd";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "Mount Toubkal trek",
    "Toubkal summit",
    "High Atlas trekking",
    "Morocco trekking",
    "Berber villages trek",
    "trail running Morocco",
    "Toubkal guides",
    "Grand Toubkal Traverse",
    "sustainable tourism Morocco",
  ],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  alternates: { canonical: "/" },
  category: "travel",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/mark.png", type: "image/png" }],
    shortcut: "/mark.png",
    apple: "/mark.png",
  },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [
      {
        url: "/logo.png",
        width: 932,
        height: 356,
        alt: SITE.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: ["/logo.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#15170E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${hanken.variable} ${spaceMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Enable reveal animations only when JS is present — runs before
            first paint so content never flashes hidden. Uses classList.add
            so it does not clobber the next/font variable classes. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        <JsonLd />
      </head>
      <body>{children}</body>
    </html>
  );
}
