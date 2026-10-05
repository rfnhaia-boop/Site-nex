import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Sistemas Sob Medida em Jundiaí | NEX",
  description:
    "Sistemas, plataformas e painéis sob medida para empresas de Jundiaí e região, do diagnóstico à evolução contínua. Comece pelo diagnóstico gratuito.",
  path: "/sistemas-sob-medida-jundiai",
});

export default function SistemasSobMedidaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
