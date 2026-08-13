import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Como a NEX coleta, usa e protege os dados de visitantes e clientes.",
  alternates: { canonical: "/privacidade" },
  openGraph: {
    title: "Política de Privacidade | NEX",
    description: "Como a NEX coleta, usa e protege os dados de visitantes e clientes.",
    url: "/privacidade",
  },
};

export default function PrivacidadeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
