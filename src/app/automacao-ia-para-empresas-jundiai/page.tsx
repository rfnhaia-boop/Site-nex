import Link from "next/link";
import { ArrowLeft, Headset, LineChart, Workflow, Search, ClipboardList, Compass, Hammer, RefreshCw, MessageCircle, Bot } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { TrackedLink } from "@/components/TrackedLink";
import { SITE_URL } from "@/lib/seo";

const PATH = "/automacao-ia-para-empresas-jundiai";

const AREAS = [
  { icon: Headset, title: "Atendimento", text: "Responde dúvidas e qualifica o contato antes de chegar na sua equipe." },
  { icon: LineChart, title: "Comercial", text: "Funil organizado e acompanhamento de clientes sem depender de planilha." },
  { icon: Workflow, title: "Processos internos", text: "Tarefas repetitivas que hoje tomam o tempo da equipe." },
  { icon: Search, title: "Decisão", text: "Dados organizados que mostram onde está o gargalo." },
];

const STEPS = [
  { icon: Search, title: "Pesquisa", text: "Entendemos mercado, comportamento, operação e contexto." },
  { icon: ClipboardList, title: "Diagnóstico", text: "Identificamos gargalos, oportunidades e prioridades." },
  { icon: Compass, title: "Blueprint", text: "Transformamos pesquisa em arquitetura e decisões." },
  { icon: Hammer, title: "Construção", text: "Design, tecnologia, automação e IA entram em execução." },
  { icon: RefreshCw, title: "Evolução", text: "Medimos, aprendemos e melhoramos continuamente." },
];

const FAQ = [
  {
    q: "Preciso trocar os sistemas que já uso?",
    a: "Não. O que existe, a NEX conecta. O que falta, a NEX constrói.",
  },
  {
    q: "A IA substitui minha equipe?",
    a: "Não. A IA assume o repetitivo e a sua equipe fica com o que exige julgamento, criatividade e relacionamento.",
  },
  {
    q: "Por onde começar?",
    a: "Pela Análise Estratégica gratuita, que você faz conversando com o Havi, a IA da NEX. Ela já entrega valor mesmo antes de qualquer contratação.",
  },
  {
    q: "Quanto custa?",
    a: "Depende do diagnóstico. Não existe valor fixo público, porque cada empresa chega num momento diferente.",
  },
  {
    q: "Quanto tempo leva?",
    a: "Depende do escopo definido no Blueprint. O prazo é confirmado pelo time depois do diagnóstico.",
  },
  {
    q: "Atendem só Jundiaí?",
    a: "A NEX é de Jundiaí e atende empresas daqui, da região e de outras cidades.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${SITE_URL}${PATH}#service`,
      name: "Automação com IA para empresas",
      serviceType: "Automação e agentes de inteligência artificial",
      description:
        "Automações e agentes de IA que trabalham junto com a equipe da empresa: atendimento, comercial e processos internos.",
      url: `${SITE_URL}${PATH}`,
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: [
        { "@type": "City", name: "Jundiaí" },
        { "@type": "Country", name: "Brasil" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "NEX", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Automação com IA em Jundiaí", item: `${SITE_URL}${PATH}` },
      ],
    },
  ],
};

export default function AutomacaoIaPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-nex-orange/30 selection:text-white font-sans relative overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-nex-orange/[0.04] rounded-full blur-[140px]" />
        <div className="absolute bottom-[20%] right-1/4 w-[500px] h-[400px] bg-white/[0.02] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-36 pb-28 flex flex-col">
        <Link
          href="/"
          className="self-start inline-flex items-center space-x-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors duration-300 mb-8 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span>VOLTAR AO INÍCIO</span>
        </Link>

        {/* Abertura */}
        <div className="inline-flex self-start items-center space-x-2 px-3.5 py-1.5 rounded-full border border-nex-orange/30 bg-nex-orange/10 mb-6">
          <Bot className="w-3.5 h-3.5 text-nex-orange" />
          <span className="text-[10px] font-mono text-nex-orange tracking-[0.2em] uppercase">Jundiaí e região</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-6 leading-[1.05]">
          Automação com <span className="text-nex-orange">IA</span> para empresas em Jundiaí
        </h1>
        <p className="text-base md:text-lg text-zinc-400 leading-relaxed max-w-3xl mb-10">
          A NEX projeta e constrói automações e agentes de IA que trabalham junto com a sua equipe: no atendimento, no
          comercial e nos processos internos. O que você já usa, a gente conecta. O que falta, a gente constrói.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mb-24">
          <TrackedLink
            href="/ia"
            cta="seo_automacao_diagnostico"
            className="px-8 py-4 rounded-2xl bg-nex-orange text-black font-black uppercase tracking-widest text-xs text-center hover:scale-[1.02] transition-transform"
          >
            Fazer diagnóstico gratuito
          </TrackedLink>
          <TrackedLink
            href="https://wa.me/5511936202934"
            external
            cta="seo_automacao_whatsapp"
            className="px-8 py-4 rounded-2xl border border-white/10 bg-white/[0.03] text-white font-bold uppercase tracking-widest text-xs text-center hover:bg-white/[0.08] transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" /> Falar no WhatsApp
          </TrackedLink>
        </div>

        {/* O que a IA pode fazer */}
        <section className="mb-24">
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-8">O que a IA pode fazer na sua empresa</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {AREAS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
                <Icon className="w-5 h-5 text-nex-orange mb-4" />
                <h3 className="text-lg font-bold mb-2">{title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Princípio */}
        <section className="mb-24 p-8 md:p-10 rounded-3xl border border-nex-orange/20 bg-nex-orange/[0.04]">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-4">IA onde amplifica, humano onde importa</h2>
          <p className="text-zinc-300 leading-relaxed max-w-3xl">
            Automatizamos o repetitivo e preservamos o humano onde julgamento, criatividade e relacionamento fazem diferença.
            A IA amplia a sua equipe, não a substitui.
          </p>
        </section>

        {/* Como trabalhamos */}
        <section className="mb-24">
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-3">Como trabalhamos</h2>
          <p className="text-zinc-400 mb-8 max-w-3xl">
            Não começamos construindo. Primeiro entendemos, depois desenhamos o sistema, só então construímos.
          </p>
          <ol className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="p-5 rounded-2xl border border-white/10 bg-white/[0.02]">
                <div className="flex items-center justify-between mb-4">
                  <Icon className="w-5 h-5 text-nex-orange" />
                  <span className="text-[10px] font-mono text-zinc-500">0{i + 1}</span>
                </div>
                <h3 className="font-bold mb-1">{title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Prova */}
        <section className="mb-24">
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-8">IA funcionando no mundo real</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
              <h3 className="text-lg font-bold mb-2">Lari</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Assistente de IA para imobiliárias. Gera descrições de imóveis de forma conversacional, organiza anúncios por
                canal e acompanha clientes num CRM.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
              <h3 className="text-lg font-bold mb-2">Havi</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                A própria IA da NEX. Você pode testar agora: ela entende o seu negócio e aponta o próximo passo.
              </p>
              <TrackedLink href="/ia" cta="seo_automacao_testar_havi" className="text-sm font-bold text-nex-orange hover:underline">
                Conversar com o Havi &rarr;
              </TrackedLink>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-24">
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-8">Perguntas frequentes</h2>
          <div className="flex flex-col divide-y divide-white/10 border-y border-white/10">
            {FAQ.map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-bold">
                  {item.q}
                  <span className="text-nex-orange transition-transform group-open:rotate-45 text-xl leading-none">+</span>
                </summary>
                <p className="mt-3 text-sm text-zinc-400 leading-relaxed max-w-3xl">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section className="text-center p-10 md:p-14 rounded-3xl border border-white/10 bg-white/[0.02]">
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-4">Comece pelo diagnóstico</h2>
          <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
            Conte um pouco sobre a sua empresa para o Havi e descubra onde a automação faz mais diferença.
          </p>
          <TrackedLink
            href="/ia"
            cta="seo_automacao_cta_final"
            className="inline-block px-8 py-4 rounded-2xl bg-nex-orange text-black font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-transform"
          >
            Fazer diagnóstico gratuito
          </TrackedLink>
        </section>

        <div className="w-full mt-16 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-zinc-500 border-t border-white/5 pt-6">
          <span>&copy; {new Date().getFullYear()} NEX. Jundiaí, SP.</span>
          <span className="mt-2 sm:mt-0 flex gap-4">
            <Link href="/termos" className="text-zinc-400 hover:text-white transition-colors">Termos</Link>
            <Link href="/privacidade" className="text-zinc-400 hover:text-white transition-colors">Privacidade</Link>
          </span>
        </div>
      </div>
    </main>
  );
}
