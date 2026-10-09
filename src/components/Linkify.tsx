import type { ReactNode } from "react";

// Os caminhos que o Havi pode sugerir viram links clicáveis (só rotas conhecidas do site, nunca URL externa livre).
const KNOWN = /(\/(?:studio(?:\/briefing|\/painel)?|blueprint(?:\/agendar|\/growth-scan)?|context-agent|squad|ia|havi|links|automacao-ia-para-empresas-jundiai|criacao-de-sites-jundiai|sistemas-sob-medida-jundiai|diagnostico-gratuito)(?![\w/-]))/g;

export function Linkify({ text, className = "text-nex-orange underline underline-offset-2 hover:opacity-80", target }: { text: string; className?: string; target?: string }) {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(KNOWN)) {
    const index = match.index ?? 0;
    // não vira link quando faz parte de uma URL maior (ex.: https://site.com/blueprint)
    if (index > 0 && /[\w.:/-]/.test(text[index - 1])) continue;
    if (index > last) parts.push(text.slice(last, index));
    parts.push(
      <a key={index} href={match[1]} className={className} target={target}>
        {match[1]}
      </a>,
    );
    last = index + match[1].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}
