import { Cpu, Layers, LayoutDashboard, Link2, Bot } from "lucide-react";
import { ServicePage, type ServicePageData } from "@/components/seo/ServicePage";
import { FAQ_CUSTO_PRAZO_REGIAO } from "@/lib/seoFaq";

const data: ServicePageData = {
  path: "/sistemas-sob-medida-jundiai",
  slug: "seo_sistemas",
  badge: { icon: Cpu, label: "Jundiaí e região" },
  h1: (
    <>
      Sistemas <span className="text-nex-orange">sob medida</span> em Jundiaí
    </>
  ),
  intro:
    "Quando planilha, WhatsApp e ferramentas soltas já não dão conta, a NEX projeta e constrói o sistema que a sua operação precisa: plataformas, painéis e produtos digitais desenhados a partir do seu processo real e construídos para evoluir.",
  primaryCta: "Fazer diagnóstico gratuito",
  grid: {
    title: "O que construímos",
    items: [
      { icon: Layers, title: "Plataformas e produtos digitais", text: "Do SaaS ao portal do cliente, pensados do diagnóstico à evolução contínua." },
      { icon: LayoutDashboard, title: "Painéis e dashboards", text: "Os dados da operação num só lugar, para decidir com fundamento." },
      { icon: Link2, title: "Integrações", text: "Conectamos o que a empresa já usa para que as peças trabalhem juntas." },
      { icon: Bot, title: "Automação e IA", text: "O repetitivo automatizado e a IA onde ela amplifica o trabalho da equipe." },
    ],
  },
  principle: {
    title: "Complexidade por dentro, simplicidade por fora",
    text: "A complexidade pertence ao sistema, não ao usuário. E nada é tratado como terminado: produtos e empresas mudam, e os sistemas precisam acompanhar.",
  },
  steps: {
    title: "Como trabalhamos",
    intro: "Não começamos construindo. Primeiro entendemos, depois desenhamos o sistema, só então construímos.",
  },
  proof: {
    title: "Sistemas no mundo real",
    cards: [
      {
        title: "Lari",
        text: "SaaS de assistente de IA para imobiliárias, com CRM em funil (Novo, Contato, Visita, Proposta, Fechado) em que a própria IA acompanha os clientes de forma proativa.",
      },
      {
        title: "Como a NEX conduz seus projetos",
        text: "Pesquisa, decisões, blueprint, tarefas e progresso ficam conectados num único ambiente, do diagnóstico à evolução. É o mesmo princípio que aplicamos aos sistemas dos clientes.",
      },
    ],
  },
  faq: [
    {
      q: "Que tipo de sistema vocês constroem?",
      a: "Depende do seu processo. O diagnóstico identifica se o que falta é um painel, uma plataforma, uma integração ou uma automação. Não presumimos a solução antes de entender o problema.",
    },
    { q: "Preciso abandonar as ferramentas que já uso?", a: "Não necessariamente. O que existe, a NEX conecta. O que falta, a NEX constrói." },
    { q: "E depois que o sistema fica pronto?", a: "Nada é tratado como terminado. A etapa de Evolução mede, aprende e melhora o sistema continuamente." },
    ...FAQ_CUSTO_PRAZO_REGIAO,
  ],
  closing: {
    title: "Comece pelo diagnóstico",
    text: "Conte para o Havi como a sua operação funciona hoje e descubra o que vale construir primeiro.",
    button: "Fazer diagnóstico gratuito",
  },
  service: {
    name: "Sistemas sob medida para empresas",
    serviceType: "Desenvolvimento de sistemas, plataformas e painéis",
    description: "Sistemas, plataformas e painéis sob medida, desenhados a partir do processo real da empresa e construídos para evoluir.",
    breadcrumb: "Sistemas sob medida em Jundiaí",
  },
};

export default function SistemasSobMedidaPage() {
  return <ServicePage data={data} />;
}
