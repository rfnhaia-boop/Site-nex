export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nex.newflowsys.cloud";

// Imagem de compartilhamento (WhatsApp, LinkedIn, X): 1200x630, ~48 KB.
export const OG_IMAGE = {
  url: "/og-nex.jpg",
  width: 1200,
  height: 630,
  alt: "NEX — Design, tecnologia e estratégia para empresas que não aceitam o ordinário.",
};

// Mesmos dados que aparecem no rodapé do site (NAP precisa bater em todo lugar).
// LinkedIn fora do sameAs de propósito: o link do site ainda é placeholder.
const PHONE = "+55-11-93620-2934";
const EMAIL = "new.flow.sys@gmail.com";
const INSTAGRAM = "https://www.instagram.com/nex_flow_oficial";

const SERVICES = [
  { name: "Estratégia", description: "Visão sistêmica para desenhar caminhos que realmente funcionam no mercado." },
  { name: "Tecnologia", description: "Sistemas digitais, automação e inteligência artificial sob medida para a operação da empresa." },
  { name: "Design", description: "Experiências digitais premium que posicionam a marca e convertem." },
  { name: "Crescimento", description: "Tração e escala com dados: do diagnóstico ao próximo passo executável." },
];

export const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#organization`,
      name: "NEX",
      legalName: "NEX",
      url: SITE_URL,
      logo: `${SITE_URL}/logo-nex-png.png`,
      image: `${SITE_URL}${OG_IMAGE.url}`,
      description:
        "Empresa de crescimento da NEW: pesquisamos, projetamos e construímos sistemas digitais que unem estratégia, design, tecnologia e IA.",
      slogan: "Design, tecnologia e estratégia para empresas que não aceitam o ordinário.",
      telephone: PHONE,
      email: EMAIL,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Jundiaí",
        addressRegion: "SP",
        addressCountry: "BR",
      },
      areaServed: [
        { "@type": "City", name: "Jundiaí" },
        { "@type": "Country", name: "Brasil" },
      ],
      knowsLanguage: "pt-BR",
      sameAs: [INSTAGRAM],
      parentOrganization: { "@type": "Organization", name: "NEW" },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Serviços da NEX",
        itemListElement: SERVICES.map((s) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: s.name, description: s.description, provider: { "@id": `${SITE_URL}/#organization` } },
        })),
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "NEX",
      inLanguage: "pt-BR",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

// Metadata padrão das páginas de conteúdo (título absoluto, canonical, OG com imagem).
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }) {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, images: [OG_IMAGE] },
  };
}
