import { Bot, Headset, LineChart, Workflow, Search } from "lucide-react";
import { ServicePage, type ServicePageData } from "@/components/seo/ServicePage";
import { FAQ_CUSTO_PRAZO_REGIAO } from "@/lib/seoFaq";

const data: ServicePageData = {
  path: "/automacao-ia-para-empresas-jundiai",
  slug: "seo_automacao",
  badge: { icon: Bot, label: "Jundiaí e região" },
  h1: (
    <>
      Automação com <span className="text-nex-orange">IA</span> para empresas em Jundiaí
    </>
  ),
  intro:
    "A NEX projeta e constrói automações e agentes de IA que trabalham junto com a sua equipe: no atendimento, no comercial e nos processos internos. O que você já usa, a gente conecta. O que falta, a gente constrói.",
  primaryCta: "Fazer diagnóstico gratuito",
  grid: {
    title: "O que a IA pode fazer na sua empresa",
    items: [
      { icon: Headset, title: "Atendimento", text: "Responde dúvidas e qualifica o contato antes de chegar na sua equipe." },
      { icon: LineChart, title: "Comercial", text: "Funil organizado e acompanhamento de clientes sem depender de planilha." },
      { icon: Workflow, title: "Processos internos", text: "Tarefas repetitivas que hoje tomam o tempo da equipe." },
      { icon: Search, title: "Decisão", text: "Dados organizados que mostram onde está o gargalo." },
    ],
  },
  principle: {
    title: "IA onde amplifica, humano onde importa",
    text: "Automatizamos o repetitivo e preservamos o humano onde julgamento, criatividade e relacionamento fazem diferença. A IA amplia a sua equipe, não a substitui.",
  },
  steps: {
    title: "Como trabalhamos",
    intro: "Não começamos construindo. Primeiro entendemos, depois desenhamos o sistema, só então construímos.",
  },
  proof: {
    title: "IA funcionando no mundo real",
    cards: [
      {
        title: "Lari",
        text: "Assistente de IA para imobiliárias. Gera descrições de imóveis de forma conversacional, organiza anúncios por canal e acompanha clientes num CRM.",
      },
      {
        title: "Havi",
        text: "A própria IA da NEX. Você pode testar agora: ela entende o seu negócio e aponta o próximo passo.",
        link: { href: "/ia", label: "Conversar com o Havi", cta: "seo_automacao_testar_havi" },
      },
    ],
  },
  faq: [
    { q: "Preciso trocar os sistemas que já uso?", a: "Não. O que existe, a NEX conecta. O que falta, a NEX constrói." },
    { q: "A IA substitui minha equipe?", a: "Não. A IA assume o repetitivo e a sua equipe fica com o que exige julgamento, criatividade e relacionamento." },
    {
      q: "Por onde começar?",
      a: "Pela Análise Estratégica gratuita, que você faz conversando com o Havi, a IA da NEX. Ela já entrega valor mesmo antes de qualquer contratação.",
    },
    ...FAQ_CUSTO_PRAZO_REGIAO,
  ],
  closing: {
    title: "Comece pelo diagnóstico",
    text: "Conte um pouco sobre a sua empresa para o Havi e descubra onde a automação faz mais diferença.",
    button: "Fazer diagnóstico gratuito",
  },
  service: {
    name: "Automação com IA para empresas",
    serviceType: "Automação e agentes de inteligência artificial",
    description: "Automações e agentes de IA que trabalham junto com a equipe da empresa: atendimento, comercial e processos internos.",
    breadcrumb: "Automação com IA em Jundiaí",
  },
};

export default function AutomacaoIaPage() {
  return <ServicePage data={data} />;
}
