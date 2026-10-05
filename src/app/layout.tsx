import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { FloatingBot } from "@/components/FloatingBot";
import { AuthSessionProvider } from "@/components/AuthSessionProvider";
import { NexPageTracker } from "@/components/NexPageTracker";
import { OG_IMAGE, siteJsonLd } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nex.newflowsys.cloud";
const SITE_NAME = "NEX | Agência de Crescimento, Tecnologia e IA em Jundiaí";
const SITE_DESCRIPTION =
  "Empresa de crescimento da NEW em Jundiaí-SP: unimos estratégia, design, tecnologia e IA para construir sistemas digitais que posicionam e escalam empresas.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: "%s | NEX",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "NEX",
    "NEW",
    "agência de crescimento",
    "estratégia digital",
    "tecnologia",
    "automação e IA",
    "sistemas digitais",
    "design de produto",
    "growth",
  ],
  authors: [{ name: "NEX" }],
  creator: "NEX",
  publisher: "NEX",
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
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: "NEX",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} h-full antialiased dark`}
    >
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-nex-black text-nex-white selection:bg-nex-orange/30">
        <AuthSessionProvider>
          <NexPageTracker />
          {children}
          <FloatingBot />
        </AuthSessionProvider>
      </body>
    </html>
  );
}
