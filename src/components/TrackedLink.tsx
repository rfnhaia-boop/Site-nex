"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/nexTracking";

type Props = {
  href: string;
  cta: string; // nome do clique no NEX OS (aba Comportamento → botões mais clicados)
  className?: string;
  children: React.ReactNode;
  external?: boolean;
};

// Link de página de conteúdo que continua renderizando no servidor (SEO) e só
// carrega o clique de rastreamento no navegador.
export function TrackedLink({ href, cta, className, children, external }: Props) {
  const onClick = () => trackEvent(external ? "whatsapp_click" : "cta_click", { metadata: { cta } });
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} onClick={onClick} className={className}>
      {children}
    </Link>
  );
}
