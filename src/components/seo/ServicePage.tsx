import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, Search, ClipboardList, Compass, Hammer, RefreshCw, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { TrackedLink } from "@/components/TrackedLink";
import { SITE_URL } from "@/lib/seo";
import { SEO_PAGES } from "@/lib/seoPages";

// Método NEX (knowledge/methodology.md) — igual em todas as páginas de serviço.
const STEPS: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Search, title: "Pesquisa", text: "Entendemos mercado, comportamento, operação e contexto." },
  { icon: ClipboardList, title: "Diagnóstico", text: "Identificamos gargalos, oportunidades e prioridades." },
  { icon: Compass, title: "Blueprint", text: "Transformamos pesquisa em arquitetura e decisões." },
  { icon: Hammer, title: "Construção", text: "Design, tecnologia, automação e IA entram em execução." },
  { icon: RefreshCw, title: "Evolução", text: "Medimos, aprendemos e melhoramos continuamente." },
];

type Card = { icon?: LucideIcon; title: string; text: string };

export type ServicePageData = {
  path: string;
  slug: string; // prefixo do nome de clique no NEX OS
  badge: { icon: LucideIcon; label: string };
  h1: React.ReactNode;
  intro: string;
  primaryCta: string;
  grid: { title: string; intro?: string; items: Card[] };
  principle?: { title: string; text: string };
  steps: { title: string; intro: string } | null;
  proof?: { title: string; cards: (Card & { link?: { href: string; label: string; cta: string } })[] };
  faq: { q: string; a: string }[];
  closing: { title: string; text: string; button: string };
  service: { name: string; serviceType: string; description: string; breadcrumb: string };
};

export function ServicePage({ data }: { data: ServicePageData }) {
  const { path, slug } = data;
  const BadgeIcon = data.badge.icon;
  const related = SEO_PAGES.filter((p) => p.path !== path);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${SITE_URL}${path}#service`,
        name: data.service.name,
        serviceType: data.service.serviceType,
        description: data.service.description,
        url: `${SITE_URL}${path}`,
        provider: { "@id": `${SITE_URL}/#organization` },
        areaServed: [
          { "@type": "City", name: "Jundiaí" },
          { "@type": "Country", name: "Brasil" },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: data.faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "NEX", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: data.service.breadcrumb, item: `${SITE_URL}${path}` },
        ],
      },
    ],
  };

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

        <div className="inline-flex self-start items-center space-x-2 px-3.5 py-1.5 rounded-full border border-nex-orange/30 bg-nex-orange/10 mb-6">
          <BadgeIcon className="w-3.5 h-3.5 text-nex-orange" />
          <span className="text-[10px] font-mono text-nex-orange tracking-[0.2em] uppercase">{data.badge.label}</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-6 leading-[1.05]">{data.h1}</h1>
        <p className="text-base md:text-lg text-zinc-400 leading-relaxed max-w-3xl mb-10">{data.intro}</p>
        <div className="flex flex-col sm:flex-row gap-3 mb-24">
          <TrackedLink
            href="/ia"
            cta={`${slug}_diagnostico`}
            className="px-8 py-4 rounded-2xl bg-nex-orange text-black font-black uppercase tracking-widest text-xs text-center hover:scale-[1.02] transition-transform"
          >
            {data.primaryCta}
          </TrackedLink>
          <TrackedLink
            href="https://wa.me/5511936202934"
            external
            cta={`${slug}_whatsapp`}
            className="px-8 py-4 rounded-2xl border border-white/10 bg-white/[0.03] text-white font-bold uppercase tracking-widest text-xs text-center hover:bg-white/[0.08] transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" /> Falar no WhatsApp
          </TrackedLink>
        </div>

        <section className="mb-24">
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-4">{data.grid.title}</h2>
          {data.grid.intro && <p className="text-zinc-400 mb-8 max-w-3xl">{data.grid.intro}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {data.grid.items.map(({ icon: Icon, title, text }) => (
              <div key={title} className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
                {Icon && <Icon className="w-5 h-5 text-nex-orange mb-4" />}
                <h3 className="text-lg font-bold mb-2">{title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {data.principle && (
          <section className="mb-24 p-8 md:p-10 rounded-3xl border border-nex-orange/20 bg-nex-orange/[0.04]">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-4">{data.principle.title}</h2>
            <p className="text-zinc-300 leading-relaxed max-w-3xl">{data.principle.text}</p>
          </section>
        )}

        {data.steps && (
          <section className="mb-24">
            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-3">{data.steps.title}</h2>
            <p className="text-zinc-400 mb-8 max-w-3xl">{data.steps.intro}</p>
            <ol className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {STEPS.map(({ icon: Icon, title, text }, i) => (
                <li key={title} className="p-5 rounded-2xl border border-white/10 bg-white/[0.02]">
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="w-5 h-5 text-nex-orange" />
                    <span className="text-[10px] font-mono text-zinc-400">0{i + 1}</span>
                  </div>
                  <h3 className="font-bold mb-1">{title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{text}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {data.proof && (
          <section className="mb-24">
            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-8">{data.proof.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.proof.cards.map((card) => (
                <div key={card.title} className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
                  <h3 className="text-lg font-bold mb-2">{card.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-4">{card.text}</p>
                  {card.link && (
                    <TrackedLink href={card.link.href} cta={card.link.cta} className="text-sm font-bold text-nex-orange hover:underline">
                      {card.link.label} &rarr;
                    </TrackedLink>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mb-24">
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-8">Perguntas frequentes</h2>
          <div className="flex flex-col divide-y divide-white/10 border-y border-white/10">
            {data.faq.map((item) => (
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

        <section className="text-center p-10 md:p-14 rounded-3xl border border-white/10 bg-white/[0.02] mb-16">
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-4">{data.closing.title}</h2>
          <p className="text-zinc-400 mb-8 max-w-xl mx-auto">{data.closing.text}</p>
          <TrackedLink
            href="/ia"
            cta={`${slug}_cta_final`}
            className="inline-block px-8 py-4 rounded-2xl bg-nex-orange text-black font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-transform"
          >
            {data.closing.button}
          </TrackedLink>
        </section>

        <nav aria-label="Outros serviços da NEX" className="mb-8">
          <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-400 mb-4">Outros serviços da NEX</h2>
          <ul className="flex flex-wrap gap-3">
            {related.map((p) => (
              <li key={p.path}>
                <Link
                  href={p.path}
                  className="inline-block px-4 py-2 rounded-full border border-white/10 bg-white/[0.02] text-sm text-zinc-300 hover:text-white hover:border-nex-orange/40 transition-colors"
                >
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="w-full mt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-zinc-500 border-t border-white/5 pt-6">
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
