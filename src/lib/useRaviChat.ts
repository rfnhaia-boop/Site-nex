"use client";

import { useEffect, useState } from "react";

export type ChatMessage = {
  role: "user" | "assistant" | "error";
  content: string;
  quickReplies?: string[];
};

const QUICK_REPLIES_RE = /\[\[OPCOES:\s*([^\]]+)\]\]\s*$/;

function extractQuickReplies(text: string): { content: string; quickReplies?: string[] } {
  const match = text.match(QUICK_REPLIES_RE);
  if (!match) return { content: text };
  const quickReplies = match[1]
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 4);
  return { content: text.slice(0, match.index).trimEnd(), quickReplies };
}

// Evita mostrar a tag [[OPCOES:...]] piscando na tela enquanto ainda está sendo streamada.
function stripPartialMarker(text: string): string {
  const openIdx = text.lastIndexOf("[[");
  if (openIdx !== -1 && !text.slice(openIdx).includes("]]")) {
    return text.slice(0, openIdx);
  }
  return text;
}

function storageKey(currentPage: string) {
  return `havi_chat_${currentPage}`;
}

// Login com Google navega pra fora do site e volta (redirect completo, sem popup),
// o que remonta o componente e perderia a conversa em memória -- guardamos no
// sessionStorage antes de sair e restauramos ao voltar.
function loadPersisted(currentPage: string): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(storageKey(currentPage));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useRaviChat(currentPage: string, defaultSection = "") {
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadPersisted(currentPage));
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (messages.length === 0) {
        sessionStorage.removeItem(storageKey(currentPage));
      } else {
        sessionStorage.setItem(storageKey(currentPage), JSON.stringify(messages));
      }
    } catch {
      // sessionStorage indisponível (modo privado etc) -- sem persistência, sem problema.
    }
  }, [messages, currentPage]);

  async function sendMessage(text: string, sectionOverride?: string) {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    const currentSection = sectionOverride ?? defaultSection;
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setIsStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
          currentPage,
          currentSection,
        }),
      });

      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || "Falha ao conversar com o Havi.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        const liveContent = stripPartialMarker(extractQuickReplies(accumulated).content);
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: liveContent };
          return updated;
        });
      }

      if (!accumulated.trim()) {
        throw new Error("Resposta vazia do Havi.");
      }

      const { content: finalContent, quickReplies } = extractQuickReplies(accumulated);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: finalContent, quickReplies };
        return updated;
      });
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "error",
          content: "Não consegui responder agora. Tenta de novo em instantes ou fala com a gente pelo WhatsApp.",
        };
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  }

  function reset() {
    setMessages([]);
  }

  return { messages, isStreaming, sendMessage, reset };
}
