import type { Metadata } from "next";
import Script from "next/script";
import "./studio.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nex.newflowsys.cloud";
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "NEX Site Studio",
      serviceType: "Criação de sites e mini SaaS",
      description: "Briefing guiado para criar o site da empresa ou um mini SaaS, com design, copy e tecnologia da NEX.",
      url: `${SITE_URL}/studio`,
      provider: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: "NEX", url: SITE_URL },
      areaServed: [{ "@type": "City", name: "Jundiaí" }, { "@type": "Country", name: "Brasil" }],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "NEX", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "NEX Site Studio", item: `${SITE_URL}/studio` },
      ],
    },
  ],
};

// Layout raiz próprio do NEX Site Studio (CSS/tema isolados do resto do site).
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://nex.newflowsys.cloud"),
  title: { absolute: "NEX Site Studio: seu negócio merece um site à altura" },
  description:
    "Conte sobre a sua empresa em um briefing guiado e receba a direção para um site ou mini SaaS feito pela NEX, com design, copy e tecnologia.",
  alternates: { canonical: "/studio" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "NEX",
    url: "/studio",
    title: "NEX Site Studio",
    description: "Organize sua ideia e receba uma proposta de site ou mini SaaS com a NEX.",
    images: [{ url: "/og-nex.jpg", width: 1200, height: 630, alt: "NEX" }],
  },
  icons: { icon: "/studio/assets/favicon-32.png", apple: "/studio/assets/favicon-180.png" },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <link rel="preload" as="font" type="font/woff2" href="/studio/assets/inter-400.woff2" crossOrigin="anonymous" />
        <link rel="preload" as="font" type="font/woff2" href="/studio/assets/inter-600.woff2" crossOrigin="anonymous" />
        <link rel="preload" as="font" type="font/woff2" href="/studio/assets/inter-700.woff2" crossOrigin="anonymous" />
        <link rel="stylesheet" href="/nex-shared/nex-navigation.css" />
        <link rel="stylesheet" href="/nex-shared/nex-products.css" />
        <meta name="theme-color" content="#07090b" />
      </head>
      <body className="antialiased">
        {children}
        <Script src="/nex-shared/nex-config.js" strategy="beforeInteractive" />
        <Script src="/nex-shared/nex-track.js" strategy="beforeInteractive" />
        <Script src="/nex-shared/nex-leads.js" strategy="beforeInteractive" />
        <Script src="/nex-shared/nex-havi.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
