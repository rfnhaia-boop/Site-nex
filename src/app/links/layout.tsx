import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Links",
  description:
    "Todos os links da NEX em um só lugar: fale com o Havi (nossa IA), peça um diagnóstico gratuito, acesse o site ou nossas redes sociais.",
  alternates: { canonical: "/links" },
  openGraph: {
    title: "NEX — Links",
    description:
      "Fale com o Havi, peça um diagnóstico gratuito ou acesse as redes da NEX — tudo em um só lugar.",
    url: "/links",
  },
};

export default function LinksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
