import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Acesse sua conta NEX.",
  robots: { index: false, follow: false }, // página de acesso, sem valor pra busca
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
