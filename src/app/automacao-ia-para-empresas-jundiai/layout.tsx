import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Automação com IA para Empresas em Jundiaí | NEX",
  description:
    "Automação e agentes de IA sob medida para empresas de Jundiaí e região: atendimento, comercial e processos conectados. Comece por um diagnóstico gratuito.",
  path: "/automacao-ia-para-empresas-jundiai",
});

export default function AutomacaoIaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
