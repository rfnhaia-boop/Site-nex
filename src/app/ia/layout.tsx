import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fale com o Havi",
  description:
    "Converse com o Havi, a inteligência artificial especialista da NEX. Tire dúvidas, entenda seu gargalo e receba uma próxima ação concreta.",
  alternates: { canonical: "/ia" },
  robots: { index: false, follow: true }, // é uma ferramenta interativa, não uma página de conteúdo pra indexar
  openGraph: {
    title: "Havi — a IA da NEX",
    description: "Converse com o Havi, a inteligência artificial especialista da NEX.",
    url: "/ia",
  },
};

export default function IALayout({ children }: { children: React.ReactNode }) {
  return children;
}
