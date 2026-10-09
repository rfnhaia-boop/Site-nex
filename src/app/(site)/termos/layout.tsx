import type { Metadata } from "next";
import { OG_IMAGE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Termos e condições de uso do site e dos produtos da NEX.",
  alternates: { canonical: "/termos" },
  openGraph: {
    title: "Termos de Uso | NEX",
    description: "Termos e condições de uso do site e dos produtos da NEX.",
    url: "/termos",
    images: [OG_IMAGE],
  },
};

export default function TermosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
