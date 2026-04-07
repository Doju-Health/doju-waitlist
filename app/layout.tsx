import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.SITE_URL ?? "https://doju.health";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Doju — Your Complete Medical Supply Store",
    template: "%s | Doju",
  },
  description:
    "Doju is the trusted, centralized marketplace for medical supplies and health equipment. Join the waitlist and be first to access thousands of products from verified sellers.",
  keywords: [
    "medical supply store",
    "health marketplace",
    "medical equipment",
    "healthcare procurement",
    "medical supplies online",
    "buy medical equipment",
    "verified medical sellers",
    "Doju",
  ],
  authors: [{ name: "Doju", url: siteUrl }],
  creator: "Doju",
  publisher: "Doju",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Doju",
    title: "Doju — Your Complete Medical Supply Store",
    description:
      "Doju is the trusted, centralized marketplace for medical supplies and health equipment. Join the waitlist for early access.",
    images: [
      {
        url: "/doju-logo.png",
        width: 1200,
        height: 630,
        alt: "Doju — Medical Supply Marketplace",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Doju — Your Complete Medical Supply Store",
    description:
      "Join the waitlist for early access to Doju — one trusted marketplace for all your medical supply needs.",
    images: ["/doju-logo.png"],
    creator: "@doju",
  },
  icons: {
    icon: "/doju-logo.png",
    apple: "/doju-logo.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Doju",
  url: siteUrl,
  logo: `${siteUrl}/doju-logo.png`,
  description:
    "Doju is a centralized health marketplace for medical supplies and equipment, connecting healthcare professionals with verified sellers.",
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
