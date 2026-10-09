import type { Metadata } from "next";
import { AuthSessionProvider } from "@/components/AuthSessionProvider";
import "../(site)/globals.css";

// Layout raiz próprio do chat embutido nos produtos (Blueprint, Squad, Studio...): sem navbar,
// sem botão flutuante, sem rastreador do site — só o chat do Havi dentro de um painel.
export const metadata: Metadata = {
  title: "Havi — NEX",
  robots: { index: false, follow: false },
};

export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark h-full">
      <body className="h-full bg-[#07090b] text-white antialiased">
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
