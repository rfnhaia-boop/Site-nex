import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Termos e condições de uso do site e dos produtos da NEX.",
  alternates: { canonical: "/termos" },
  openGraph: {
    title: "Termos de Uso | NEX",
    description: "Termos e condições de uso do site e dos produtos da NEX.",
    url: "/termos",
  },
};

export default function TermosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
