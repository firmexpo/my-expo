import type { Metadata } from "next";
import { Space_Grotesk, Manrope, IBM_Plex_Mono, Geist } from "next/font/google";
import { site } from "./lib/site";
import "./globals.css";
import Script from "next/script";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    // Core
    "digital exposition platform",
    "virtual expo",
    "online trade show",
    "company innovation showcase",
    "business exhibition online",
    "virtual exhibition platform",
    "exhibit your company",
    "Firm Expo",

    // Global / international
    "Global Firm Expo",
    "Global Business Expo",
    "International Business Expo",
    "International Trade Expo",
    "World Business Expo",
    "International Investment Platform",
    "Global Business Growth",
    "International Business Growth",
    "Business Investment Platform",
    "Cross Border Business Expo",

    // Firm Expo — city / country pairings
    "Firm Expo London",
    "Firm Expo Dubai",
    "Firm Expo New York",
    "Firm Expo Singapore",
    "Firm Expo Paris",
    "Firm Expo Tokyo",
    "Firm Expo Berlin",
    "Firm Expo Toronto",
    "Firm Expo Sydney",
    "Firm Expo Mumbai",
    "Firm Expo Riyadh",
    "Firm Expo Abu Dhabi",
    "Firm Expo Hong Kong",
    "Firm Expo India",
    "Firm Expo UAE",
    "Firm Expo USA",
    "Firm Expo UK",

    // Business Expo — city / country pairings
    "Business Expo Dubai",
    "Business Expo London",
    "Business Expo New York",
    "Business Expo Singapore",
    "Business Expo Paris",
    "Business Expo Tokyo",
    "Business Expo Berlin",
    "Business Expo Toronto",
    "Business Expo Sydney",
    "Business Expo Mumbai",
    "Business Expo Riyadh",
    "Business Expo Abu Dhabi",
    "Business Expo Hong Kong",
    "Business Expo India",
    "Business Expo UAE",
    "Business Expo USA",
    "Business Expo UK",
  ],
  alternates: {
    canonical: "/",
  },
  icons: {
    // Static files in /public (not the app/ auto-convention), so Next
    // resolves these against metadataBase into stable, absolute URLs —
    // e.g. https://www.firmexpo.com/favicon.ico — instead of the
    // relative, content-hashed URL the app/ file convention emits
    // (which Search Console can't reliably pick up as a site favicon).
    icon: [
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.url,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    site: site.twitterHandle,
    creator: site.twitterHandle,
  },
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
  category: "business",
};

export const viewport = {
  themeColor: "#0a0f16",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.url}/#organization`,
        name: site.name,
        url: site.url,
        email: site.email,
        description: site.description,
        slogan: site.tagline,
        logo: {
          "@type": "ImageObject",
          url: `${site.url}/brand/logo-full.png`,
        },
        sameAs: [site.instagram, site.twitter],
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        name: site.name,
        url: site.url,
        description: site.description,
        publisher: { "@id": `${site.url}/#organization` },
        inLanguage: "en",
      },
    ],
  };

  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body
        className={`${spaceGrotesk.variable} ${manrope.variable} ${plexMono.variable} font-body antialiased`}
      >
      {/* Google tag (gtag.js)  */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-N8TZP040KX"></script>
      <Script  id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-N8TZP040KX');
        `}
      </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
