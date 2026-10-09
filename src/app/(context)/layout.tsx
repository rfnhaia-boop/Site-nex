import type { Metadata } from "next";
import Script from "next/script";
import "./context.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nex.newflowsys.cloud";
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "NEX Context Agent",
      serviceType: "Diagnóstico e contexto empresarial com IA",
      description: "Responda 12 perguntas sobre a empresa e receba um Contexto Mestre reutilizável para IA, um diagnóstico inicial e um plano de 30 dias. Gratuito.",
      url: `${SITE_URL}/context-agent`,
      provider: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: "NEX", url: SITE_URL },
      areaServed: [{ "@type": "City", name: "Jundiaí" }, { "@type": "Country", name: "Brasil" }],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "NEX", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "NEX Context Agent", item: `${SITE_URL}/context-agent` },
      ],
    },
  ],
};

// Layout raiz próprio do NEX Context Agent (CSS isolado do resto do site).
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://nex.newflowsys.cloud"),
  title: { absolute: "NEX Context Agent: transforme uma conversa em contexto e diagnóstico" },
  description:
    "Responda a 12 perguntas sobre a sua empresa e receba um Contexto Mestre reutilizável para qualquer IA, um diagnóstico inicial e um plano de 30 dias.",
  alternates: { canonical: "/context-agent" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "NEX",
    url: "/context-agent",
    title: "NEX Context Agent",
    description: "Uma conversa vira contexto empresarial, diagnóstico e plano de ação.",
    images: [{ url: "/og-nex.jpg", width: 1200, height: 630, alt: "NEX" }],
  },
  icons: {
    icon: "/context-agent/assets/nex-favicon-32.png",
    apple: "/context-agent/assets/nex-favicon-180.png",
  },
};

export default function ContextLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <link rel="stylesheet" href="/nex-shared/nex-navigation.css" />
        <link rel="stylesheet" href="/nex-shared/nex-products.css" />
      </head>
      <body className="antialiased">
        {children}
        <Script src="/nex-shared/nex-config.js" strategy="beforeInteractive" />
        <Script src="/nex-shared/nex-track.js" strategy="beforeInteractive" />
        <Script src="/nex-shared/nex-leads.js" strategy="beforeInteractive" />
        <Script src="/nex-shared/nex-navigation.js" strategy="afterInteractive" />
        <Script src="/nex-shared/nex-havi.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
