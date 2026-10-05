import type { Metadata } from "next";
import { OG_IMAGE } from "@/lib/seo";

const TITLE = "Automação com IA para Empresas em Jundiaí | NEX";
const DESCRIPTION =
  "Automação e agentes de IA sob medida para empresas de Jundiaí e região: atendimento, comercial e processos trabalhando juntos. Comece por um diagnóstico gratuito.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/automacao-ia-para-empresas-jundiai" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/automacao-ia-para-empresas-jundiai",
    images: [OG_IMAGE],
  },
};

export default function AutomacaoIaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
