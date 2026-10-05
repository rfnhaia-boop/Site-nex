import type { Metadata } from "next";
import { OG_IMAGE } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: "Links da NEX — Havi IA e Diagnóstico Gratuito" },
  description:
    "Todos os links da NEX em um só lugar: fale com o Havi (nossa IA), peça um diagnóstico gratuito, acesse o site ou nossas redes sociais.",
  alternates: { canonical: "/links" },
  openGraph: {
    title: "NEX — Links",
    description:
      "Fale com o Havi, peça um diagnóstico gratuito ou acesse as redes da NEX — tudo em um só lugar.",
    url: "/links",
    images: [{ ...OG_IMAGE, alt: "NEX — Links" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NEX — Links",
    description: "Fale com o Havi, peça um diagnóstico gratuito ou acesse as redes da NEX — tudo em um só lugar.",
    images: [OG_IMAGE.url],
  },
};

export default function LinksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
