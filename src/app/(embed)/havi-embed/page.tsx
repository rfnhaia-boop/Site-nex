"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowUp } from "lucide-react";
import { useRaviChat } from "@/lib/useRaviChat";
import { Linkify } from "@/components/Linkify";

// Contexto de cada produto: o Havi recebe "estou na página X" e sugestões iniciais coerentes com o funil dela.
const PRODUCTS: Record<string, { label: string; page: string; section: string; chips: string[] }> = {
  blueprint: {
    label: "Blueprint NEX",
    page: "produto Blueprint NEX (/blueprint)",
    section: "plano-crescimento",
    chips: ["O que é o Blueprint?", "Quero agendar a reunião", "Como funciona o Growth Scan?"],
  },
  "context-agent": {
    label: "Context Agent",
    page: "produto NEX Context Agent (/context-agent)",
    section: "",
    chips: ["Como funciona o Context Agent?", "Pra que serve o contexto mestre?", "Quero falar com a NEX"],
  },
  squad: {
    label: "Squad NEX",
    page: "produto Squad NEX (/squad)",
    section: "",
    chips: ["O que é o Squad?", "Como o Squad trabalha?", "Quero falar com a NEX"],
  },
  studio: {
    label: "Site Studio",
    page: "produto NEX Site Studio (/studio)",
    section: "",
    chips: ["Quero um site para minha empresa", "Como funciona o briefing?", "Quanto tempo leva?"],
  },
};

function Chat() {
  const params = useSearchParams();
  const key = params.get("from") ?? "studio";
  const product = PRODUCTS[key] ?? PRODUCTS.studio;
  const { status } = useSession();
  const { messages, isStreaming, sendMessage } = useRaviChat(`embed-${key}`, product.section, product.page);
  const [text, setText] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  function send(value: string) {
    const v = value.trim();
    if (!v || isStreaming) return;
    setText("");
    try {
      parent.postMessage({ type: "havi_message", product: key }, location.origin);
    } catch {
      /* sem pai */
    }
    sendMessage(v);
  }

  const last = messages[messages.length - 1];
  const quick = last?.role === "assistant" ? last.quickReplies : undefined;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
        <img src="/ravi-avatar-sm.webp" alt="" className="h-9 w-9 rounded-full border border-nex-orange/50 object-cover" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold leading-tight">Havi · IA da NEX</p>
          <p className="truncate text-[11px] text-zinc-400">Falando sobre {product.label}</p>
        </div>
        {status !== "authenticated" && (
          <a
            href={`/login?returnTo=${encodeURIComponent("/ia")}`}
            target="_top"
            className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-semibold text-zinc-200 hover:border-nex-orange/60"
          >
            Entrar
          </a>
        )}
      </div>

      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="space-y-3">
            <div className="max-w-[88%] rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-relaxed text-zinc-200">
              Oi! Eu sou o Havi, a IA da NEX. Posso te explicar o {product.label}, tirar dúvidas ou te levar para o próximo passo certo. Por onde quer começar?
            </div>
            <div className="flex flex-wrap gap-2">
              {product.chips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => send(chip)}
                  className="rounded-full border border-nex-orange/40 bg-nex-orange/10 px-3 py-1.5 text-xs font-semibold text-nex-orange hover:bg-nex-orange/20"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex"}>
            <div
              className={
                m.role === "user"
                  ? "max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-tr-sm bg-nex-orange px-4 py-2.5 text-sm font-medium text-black"
                  : m.role === "error"
                    ? "max-w-[88%] rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                    : "max-w-[88%] whitespace-pre-wrap rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-relaxed text-zinc-200"
              }
            >
              {m.content ? <Linkify text={m.content} target="_top" className="text-nex-orange underline underline-offset-2" /> : (isStreaming && i === messages.length - 1 ? <span className="opacity-60">Pensando…</span> : null)}
            </div>
          </div>
        ))}
        {quick && !isStreaming && (
          <div className="flex flex-wrap gap-2">
            {quick.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="rounded-full border border-nex-orange/40 bg-nex-orange/10 px-3 py-1.5 text-xs font-semibold text-nex-orange hover:bg-nex-orange/20"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(text);
        }}
        className="flex items-center gap-2 border-t border-white/10 p-3"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escreva sua mensagem…"
          aria-label="Mensagem para o Havi"
          className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-nex-orange/60"
        />
        <button
          type="submit"
          disabled={isStreaming || !text.trim()}
          aria-label="Enviar"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-nex-orange text-black disabled:opacity-40"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

export default function HaviEmbedPage() {
  return (
    <Suspense fallback={null}>
      <Chat />
    </Suspense>
  );
}
