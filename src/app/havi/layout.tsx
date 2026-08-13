import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Havi — A Inteligência da NEX",
  description:
    "Conheça o Havi: a inteligência artificial da NEX que entende seu negócio, identifica gargalos e entrega o próximo passo executável. Análise, execução e segurança em um só lugar.",
  alternates: { canonical: "/havi" },
  openGraph: {
    title: "Havi — A Inteligência da NEX",
    description:
      "A IA que entende seu negócio, identifica gargalos e entrega o próximo passo executável.",
    url: "/havi",
    images: [{ url: "/havi-flying-cards.jpg", width: 1024, height: 682, alt: "Havi — a inteligência da NEX" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Havi — A Inteligência da NEX",
    description:
      "A IA que entende seu negócio, identifica gargalos e entrega o próximo passo executável.",
    images: ["/havi-flying-cards.jpg"],
  },
};

export default function HaviLayout({ children }: { children: React.ReactNode }) {
  return children;
}
