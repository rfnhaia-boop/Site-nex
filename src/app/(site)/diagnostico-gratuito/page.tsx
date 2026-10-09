import { Target } from "lucide-react";
import { ServicePage, type ServicePageData } from "@/components/seo/ServicePage";

const data: ServicePageData = {
  path: "/diagnostico-gratuito",
  slug: "seo_diagnostico",
  badge: { icon: Target, label: "Análise Estratégica NEX" },
  h1: (
    <>
      Diagnóstico digital <span className="text-nex-orange">gratuito</span> para a sua empresa
    </>
  ),
  intro:
    "A Análise Estratégica NEX é uma auditoria gratuita que avalia como a sua empresa aparece e converte hoje e mostra onde estão as oportunidades de crescimento. Ela já entrega valor por si só, antes de qualquer contratação.",
  primaryCta: "Iniciar diagnóstico gratuito",
  grid: {
    title: "O que avaliamos",
    items: [
      { title: "Posicionamento", text: "Como a empresa se diferencia e que valor ela comunica." },
      { title: "Marca", text: "A identidade e a percepção que a empresa transmite." },
      { title: "Google", text: "Como a empresa é encontrada quando alguém busca." },
      { title: "Instagram", text: "Presença, consistência e uso da rede." },
      { title: "Site", text: "Se ele apresenta, convence e gera contato." },
      { title: "Comunicação", text: "Clareza e coerência das mensagens nos canais." },
      { title: "Conversão", text: "Se a atenção vira contato e venda." },
      { title: "Autoridade", text: "Os sinais de confiança e a prova que a empresa mostra." },
      { title: "Experiência do cliente", text: "A jornada do primeiro contato ao pós-venda." },
      { title: "Oportunidades de crescimento", text: "O que priorizar primeiro." },
    ],
  },
  principle: {
    title: "Como funciona",
    text: "Você conversa com o Havi, a IA da NEX, e conta sobre a sua empresa. Ele organiza o que você disse e aponta os pontos de atenção. A partir dali, o time da NEX pode continuar o contato com você.",
  },
  steps: null,
  faq: [
    { q: "É realmente gratuito?", a: "Sim. A Análise Estratégica é a porta de entrada da NEX e não tem custo." },
    { q: "Preciso ter site ou Instagram?", a: "Não. A análise parte do que a sua empresa tem hoje, seja muito ou pouco." },
    {
      q: "O que acontece com os meus dados?",
      a: "O que você conta na conversa fica guardado para o time da NEX dar continuidade ao contato, e pode ser apagado a seu pedido. Os detalhes estão na Política de Privacidade.",
    },
    { q: "Por onde eu começo?", a: "Direto na conversa com o Havi, pelo botão desta página. Ele começa perguntando qual é o negócio da sua empresa." },
    { q: "Atendem só Jundiaí?", a: "A NEX é de Jundiaí e atende empresas daqui, da região e de outras cidades." },
  ],
  closing: {
    title: "Comece agora",
    text: "Uma conversa com o Havi é o primeiro passo para entender o que a sua empresa precisa.",
    button: "Iniciar diagnóstico gratuito",
  },
  service: {
    name: "Análise Estratégica gratuita (diagnóstico digital)",
    serviceType: "Diagnóstico digital e auditoria estratégica",
    description: "Auditoria gratuita de posicionamento, marca, Google, Instagram, site, comunicação, conversão e oportunidades de crescimento.",
    breadcrumb: "Diagnóstico gratuito",
  },
};

export default function DiagnosticoGratuitoPage() {
  return <ServicePage data={data} />;
}
