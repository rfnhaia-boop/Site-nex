import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { FloatingBot } from "@/components/FloatingBot";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
});

// TODO(Rafael): trocar pelo domínio real antes do lançamento — hoje é só um placeholder.
// Definir via env var em produção (NEXT_PUBLIC_SITE_URL) evita ter que mexer em código depois.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nex.com.br";
const SITE_NAME = "NEX — Estratégia. Tecnologia. Crescimento.";
const SITE_DESCRIPTION =
  "A NEX é a empresa de crescimento da NEW. Pesquisamos, projetamos e construímos sistemas digitais que conectam estratégia, design, tecnologia e IA — não vendemos site, post ou IA isolados.";

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
    images: [
      {
        url: "/hero-bg.png",
        width: 1536,
        height: 1024,
        alt: "NEX — Design, tecnologia e estratégia para empresas que não aceitam o ordinário.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/hero-bg.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "NEX",
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  slogan: "Design, tecnologia e estratégia para empresas que não aceitam o ordinário.",
  parentOrganization: {
    "@type": "Organization",
    name: "NEW",
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-nex-black text-nex-white selection:bg-nex-orange/30">
        {children}
        <FloatingBot />
      </body>
    </html>
  );
}
