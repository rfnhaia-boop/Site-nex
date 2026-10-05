import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Criação de Sites Profissionais em Jundiaí | NEX",
  description:
    "Criação de sites profissionais em Jundiaí com estratégia, design e tecnologia conectados ao seu atendimento e comercial. Comece por um diagnóstico gratuito.",
  path: "/criacao-de-sites-jundiai",
});

export default function CriacaoSitesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
