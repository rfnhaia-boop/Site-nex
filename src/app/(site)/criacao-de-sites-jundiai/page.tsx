import { Globe, Compass, Palette, Cpu, Link2 } from "lucide-react";
import { ServicePage, type ServicePageData } from "@/components/seo/ServicePage";
import { FAQ_CUSTO_PRAZO_REGIAO } from "@/lib/seoFaq";

const data: ServicePageData = {
  path: "/criacao-de-sites-jundiai",
  slug: "seo_sites",
  badge: { icon: Globe, label: "Jundiaí e região" },
  h1: (
    <>
      Criação de <span className="text-nex-orange">sites</span> em Jundiaí
    </>
  ),
  intro:
    "A NEX cria sites que não ficam parados como cartão de visitas: nascem de uma estratégia, têm design e tecnologia de alto nível e se conectam ao atendimento, ao comercial e aos dados da sua empresa. O que você já tem, a gente aproveita. O que falta, a gente constrói.",
  primaryCta: "Fazer diagnóstico gratuito",
  grid: {
    title: "O que está dentro de um site NEX",
    items: [
      { icon: Compass, title: "Estratégia primeiro", text: "Posicionamento e mensagem definidos antes do primeiro layout." },
      { icon: Palette, title: "Design", text: "Experiência e interface que posicionam a marca no nível do mercado em que ela quer atuar." },
      { icon: Cpu, title: "Tecnologia", text: "Site rápido, seguro e preparado para evoluir, com a base técnica de SEO para ser encontrado no Google." },
      { icon: Link2, title: "Conectado", text: "Integrado a atendimento com IA, CRM e acompanhamento de dados, para o site gerar contato e não só visita." },
    ],
  },
  principle: {
    title: "Sistemas, não peças",
    text: "Uma solução isolada resolve uma tarefa. Um sistema conecta o negócio. Por isso o site da NEX nunca nasce sozinho: ele é uma peça de uma estrutura digital pensada para evoluir junto com a empresa.",
  },
  steps: {
    title: "Como trabalhamos",
    intro: "Não começamos construindo. Primeiro entendemos, depois desenhamos o sistema, só então construímos.",
  },
  proof: {
    title: "Veja funcionando",
    cards: [
      {
        title: "O site da própria NEX",
        text: "Você está vendo o nosso: design próprio, uma IA que conversa com o visitante (o Havi) e rastreamento do comportamento para melhorar a cada ciclo.",
        link: { href: "/havi", label: "Conhecer o Havi", cta: "seo_sites_conhecer_havi" },
      },
      {
        title: "Lari",
        text: "Plataforma que a NEX desenhou e construiu: estratégia, UX e tecnologia reunidas num produto de IA para imobiliárias.",
      },
    ],
  },
  faq: [
    {
      q: "Vocês fazem só o site?",
      a: "A NEX não vende site isolado: o site entra como parte de uma estrutura. Mas se o que falta na sua empresa é o site, começamos por ele. O diagnóstico mostra o que realmente faz sentido primeiro.",
    },
    { q: "Preciso já ter marca, textos e fotos?", a: "Não presumimos que você tenha as peças prontas. O que existe, conectamos. O que falta, construímos." },
    {
      q: "O site vai aparecer no Google?",
      a: "Entregamos a base técnica de SEO: metadados, estrutura, velocidade e dados estruturados. A posição no Google depende de concorrência e de tempo, por isso não prometemos ranking.",
    },
    ...FAQ_CUSTO_PRAZO_REGIAO,
  ],
  closing: {
    title: "Comece pelo diagnóstico",
    text: "Conte sobre a sua empresa para o Havi e descubra o que o seu site precisa fazer por você.",
    button: "Fazer diagnóstico gratuito",
  },
  service: {
    name: "Criação de sites para empresas",
    serviceType: "Criação de sites e presença digital",
    description: "Sites profissionais com estratégia, design e tecnologia conectados ao atendimento, ao comercial e aos dados da empresa.",
    breadcrumb: "Criação de sites em Jundiaí",
  },
};

export default function CriacaoSitesPage() {
  return <ServicePage data={data} />;
}
