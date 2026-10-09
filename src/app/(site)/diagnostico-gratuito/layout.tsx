import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Diagnóstico Digital Gratuito para Empresas | NEX",
  description:
    "Análise Estratégica gratuita da NEX: avalie posicionamento, marca, Google, Instagram, site e conversão da sua empresa e descubra o próximo passo.",
  path: "/diagnostico-gratuito",
});

export default function DiagnosticoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
