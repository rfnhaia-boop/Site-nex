"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Target,
  HelpCircle,
  Filter,
  ScanSearch,
  ArrowLeft,
  Sparkles,
  Rocket,
  LogOut
} from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRaviChat } from "@/lib/useRaviChat";
import DiagnosticFlow from "@/components/DiagnosticFlow";
import ChatComposer from "@/components/ChatComposer";

const RESUME_AFTER_LOGIN_KEY = "havi_post_login_resume_links";

// Ícones
function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.114 20.452H3.558V9h3.556v11.452z" />
    </svg>
  );
}



function SocialButton({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-14 h-14 rounded-[1.25rem] bg-white/[0.03] backdrop-blur-[40px] border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white hover:border-white/30 hover:bg-white/[0.08] hover:shadow-[0_0_20px_rgba(255,106,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.2)] transition-all duration-300"
    >
      {children}
    </a>
  );
}

function LinkCard({
  href,
  icon: Icon,
  customIcon,
  title,
  subtitle,
  featured = false,
  isLast = false,
  onClick,
}: {
  href?: string;
  icon?: React.ElementType;
  customIcon?: React.ReactNode;
  title: string;
  subtitle: string;
  featured?: boolean;
  isLast?: boolean;
  onClick?: () => void;
}) {
  const content = (
    <div className={`group relative w-full flex items-center gap-4 px-5 py-4 rounded-[1.5rem] backdrop-blur-[40px] border transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 ${
      featured 
        ? 'bg-nex-orange/[0.05] hover:bg-nex-orange/[0.1] border-nex-orange/30 shadow-[0_15px_30px_rgba(255,106,0,0.1)]' 
        : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/10 hover:border-white/20 shadow-[0_15px_30px_rgba(0,0,0,0.2)]'
    }`}>
      {customIcon ? (
        customIcon
      ) : (
        <div className={`shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center transition-colors duration-300 ${featured ? 'bg-nex-orange/20 border border-nex-orange/30 text-nex-orange shadow-[0_0_15px_rgba(255,106,0,0.3)]' : 'bg-white/5 border border-white/10 text-zinc-400 group-hover:text-white group-hover:bg-white/10'}`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      )}

      <div className="flex-1 min-w-0 text-left">
        <h3 className={`font-semibold text-base leading-tight ${featured ? 'text-nex-orange' : 'text-zinc-100'}`}>{title}</h3>
        <p className="text-xs text-zinc-500 leading-snug mt-0.5 font-light">{subtitle}</p>
      </div>

      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${featured ? 'text-nex-orange bg-nex-orange/10' : 'text-zinc-600 group-hover:text-white group-hover:bg-white/10 group-hover:translate-x-0.5'}`}>
        <ArrowRight className="w-4 h-4" />
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="w-full text-left">
        {content}
      </button>
    );
  }

  return (
    <a href={href} className="w-full block">
      {content}
    </a>
  );
}

function ChatBubble({
  role,
  content,
  isStreaming = false,
  quickReplies,
  onQuickReply,
}: {
  role: "user" | "assistant" | "error";
  content: string;
  isStreaming?: boolean;
  quickReplies?: string[];
  onQuickReply?: (option: string) => void;
}) {
  const isUser = role === "user";
  const isError = role === "error";

  return (
    <div className={`flex w-full flex-col ${isUser ? "items-end" : "items-start"} gap-2`}>
      <div
        className={`max-w-[85%] rounded-3xl px-5 py-3.5 text-[15px] leading-relaxed ${
          isUser
            ? "bg-gradient-to-br from-nex-orange/25 to-nex-orange/10 border border-nex-orange/30 text-white rounded-br-md"
            : isError
              ? "bg-red-500/10 border border-red-500/25 text-red-100 rounded-bl-md"
              : "bg-white/[0.04] backdrop-blur-xl border border-white/10 text-zinc-100 rounded-bl-md"
        }`}
      >
        {content || (isStreaming && (
          <span className="inline-flex gap-1.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-nex-orange animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-nex-orange animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-nex-orange animate-bounce" />
          </span>
        ))}
      </div>

      {quickReplies && quickReplies.length > 0 && (
        <div className="flex flex-wrap gap-2 max-w-[85%]">
          {quickReplies.map((option) => (
            <button
              key={option}
              onClick={() => onQuickReply?.(option)}
              className="px-4 py-2 rounded-full text-sm font-medium border border-nex-orange/30 bg-nex-orange/[0.06] text-nex-orange hover:bg-nex-orange/15 hover:border-nex-orange/50 transition-all duration-200"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const HAVI_GREETING = "Olá! Eu sou o Havi, a inteligência da NEX. Me conta rapidinho o que você precisa.";

export default function LinksPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [diagnosticOpen, setDiagnosticOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState("");
  const { data: session, status } = useSession();
  const isGuest = status !== "authenticated";
  const { messages, isStreaming, sendMessage, reset } = useRaviChat("links", currentSection);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const hasStarted = messages.length > 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Login com Google faz redirect completo (sai do site e volta) -- ao voltar já
  // autenticado, retoma a conversa sozinho em vez de deixar o visitante travado.
  useEffect(() => {
    if (status !== "authenticated") return;
    let hasPendingResume = false;
    try {
      hasPendingResume = sessionStorage.getItem(RESUME_AFTER_LOGIN_KEY) === "1";
    } catch {
      // sessionStorage indisponível -- sem retomada automática, sem problema.
    }
    if (!hasPendingResume) return;
    try {
      sessionStorage.removeItem(RESUME_AFTER_LOGIN_KEY);
    } catch {
      // ignora
    }
    if (messages.length > 0) {
      sendMessage("Pronto, acabei de fazer login com Google.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = message;
    if (isStreaming || !text.trim()) return;
    setMessage("");
    sendMessage(text);
  }

  // Usada pelo menu "+" do composer — garante que os atalhos ativem a skill de
  // verdade (currentSection certo), igual já acontece no /ia.
  function startSkill(text: string, section: string) {
    if (section) setCurrentSection(section);
    sendMessage(text, section || undefined);
  }

  return (
    <main className="h-[100dvh] w-full font-sans text-nex-white flex flex-col items-center px-6 py-8 md:py-12 relative overflow-hidden">

      {/* BACKGROUND RESPONSIVO (Mobile = Fundo Fotográfico, Desktop = Neon Radial da IA) */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[#050505]">
        {/* Mobile Image Background */}
        <div className="md:hidden absolute inset-0 z-0">
          <Image
            src="/fundo-mobile.jpeg"
            alt="NEX Environment"
            fill
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Desktop Image Background */}
        <div className="hidden md:flex absolute inset-0 z-0">
          <Image
            src="/fundo.jpeg"
            alt="NEX Environment Desktop"
            fill
            className="object-cover opacity-90"
            quality={100}
            priority
          />
          {/* Overlay escuro para garantir leitura do texto e efeito premium */}
          <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505]" />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md flex-1 min-h-0 flex flex-col items-center">
        <div className="w-full flex-1 min-h-0 overflow-y-auto scrollbar-hide flex flex-col items-center">
        {!hasStarted ? (
          <>
            {/* Logo + subtítulo minimalista */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center mb-6 mt-0"
            >
              <div className="relative w-[360px] h-32 mb-2">
                <Image
                  src="/logo-nex-neon.png"
                  alt="NEX Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <p className="text-zinc-400 font-light text-sm tracking-wide">
                A engenharia da percepção.
              </p>
            </motion.div>

            {/* Redes sociais (Glass Prominent) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-5 mb-8"
            >
              <SocialButton href="https://wa.me/5511936202934" label="WhatsApp">
                <WhatsAppIcon />
              </SocialButton>
              <SocialButton href="https://www.instagram.com/nex_flow_oficial?igsh=enF3cTEzazF1cTBx&utm_source=qr" label="Instagram">
                <InstagramIcon />
              </SocialButton>
              <SocialButton href="https://linkedin.com/company/nex" label="LinkedIn">
                <LinkedInIcon />
              </SocialButton>
            </motion.div>

            {/* Cards de navegação (Glass Pills Individuais e Refinadas) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex flex-col gap-3 mb-4"
            >
              {/* Skills Grid (4 colunas super minimalistas em 1 linha) */}
              <div className="w-full grid grid-cols-4 gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => startSkill("Quero um plano de crescimento prático pra minha empresa.", "plano-crescimento")}
                  className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[1rem] p-2 sm:p-3 flex flex-col items-center justify-center gap-2 hover:bg-white/[0.06] hover:border-white/20 transition-all shadow-[0_5px_15px_rgba(0,0,0,0.2)] group text-center"
                >
                  <div className="w-8 h-8 rounded-full bg-nex-orange/10 flex items-center justify-center text-nex-orange group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(255,106,0,0.1)] group-hover:shadow-[0_0_15px_rgba(255,106,0,0.3)] shrink-0">
                    <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <span className="text-zinc-300 text-[9px] sm:text-[10px] font-semibold leading-none tracking-wide group-hover:text-white transition-colors">Crescimento</span>
                </button>
                <button
                  type="button"
                  onClick={() => startSkill("Quero uma análise real de como minha empresa está posicionada digitalmente e onde a IA pode ajudar.", "analise-ia")}
                  className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[1rem] p-2 sm:p-3 flex flex-col items-center justify-center gap-2 hover:bg-white/[0.06] hover:border-white/20 transition-all shadow-[0_5px_15px_rgba(0,0,0,0.2)] group text-center"
                >
                  <div className="w-8 h-8 rounded-full bg-nex-orange/10 flex items-center justify-center text-nex-orange group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(255,106,0,0.1)] group-hover:shadow-[0_0_15px_rgba(255,106,0,0.3)] shrink-0">
                    <ScanSearch className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <span className="text-zinc-300 text-[9px] sm:text-[10px] font-semibold leading-none tracking-wide group-hover:text-white transition-colors">Análise</span>
                </button>
                <button
                  type="button"
                  onClick={() => startSkill("Quero entender onde meu funil de vendas está perdendo clientes.", "raio-x-funil")}
                  className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[1rem] p-2 sm:p-3 flex flex-col items-center justify-center gap-2 hover:bg-white/[0.06] hover:border-white/20 transition-all shadow-[0_5px_15px_rgba(0,0,0,0.2)] group text-center"
                >
                  <div className="w-8 h-8 rounded-full bg-nex-orange/10 flex items-center justify-center text-nex-orange group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(255,106,0,0.1)] group-hover:shadow-[0_0_15px_rgba(255,106,0,0.3)] shrink-0">
                    <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <span className="text-zinc-300 text-[9px] sm:text-[10px] font-semibold leading-none tracking-wide group-hover:text-white transition-colors">Raio-X</span>
                </button>
                <button
                  type="button"
                  onClick={() => startSkill("Tenho uma dúvida específica sobre a NEX.", "")}
                  className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[1rem] p-2 sm:p-3 flex flex-col items-center justify-center gap-2 hover:bg-white/[0.06] hover:border-white/20 transition-all shadow-[0_5px_15px_rgba(0,0,0,0.2)] group text-center"
                >
                  <div className="w-8 h-8 rounded-full bg-nex-orange/10 flex items-center justify-center text-nex-orange group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(255,106,0,0.1)] group-hover:shadow-[0_0_15px_rgba(255,106,0,0.3)] shrink-0">
                    <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <span className="text-zinc-300 text-[9px] sm:text-[10px] font-semibold leading-none tracking-wide group-hover:text-white transition-colors">Dúvidas</span>
                </button>
              </div>

              <LinkCard
                href="/havi"
                customIcon={
                  <div className="relative h-11 w-11 shrink-0 rounded-2xl bg-nex-orange/[0.05] border border-nex-orange/20 flex items-center justify-center text-nex-orange group-hover:bg-nex-orange/10 group-hover:border-nex-orange/40 group-hover:shadow-[0_0_20px_rgba(255,106,0,0.4)] transition-all duration-500 overflow-hidden">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 rounded-2xl border border-dashed border-nex-orange/40"
                    />
                    <Image 
                      src="/ravi-avatar.png" 
                      alt="Havi" 
                      width={38} 
                      height={38} 
                      className="relative z-10 rounded-full object-cover" 
                    />
                  </div>
                }
                title="Conheça o Havi"
                subtitle="Converse com a Inteligência da NEX"
              />
              <LinkCard
                icon={Sparkles}
                title="Diagnóstico IA"
                subtitle="Análise gratuita e mapeamento do seu potencial."
                featured
                onClick={() => setDiagnosticOpen(true)}
              />
              <LinkCard isLast href="/" icon={Rocket} title="Explore o Futuro" subtitle="Veja nossos projetos em ação." />
            </motion.div>
          </>
        ) : (
          <div className="w-full flex flex-col mb-6 mt-8 md:mt-12">
            <div className="flex items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={reset}
                  aria-label="Voltar"
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-white/[0.04] border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium text-zinc-300 tracking-wide">Havi · NEX AI</span>
              </div>

              {isGuest ? (
                <button
                  onClick={() => {
                    try {
                      sessionStorage.setItem(RESUME_AFTER_LOGIN_KEY, "1");
                    } catch {
                      // ignora
                    }
                    signIn("google");
                  }}
                  className="px-3 py-1.5 rounded-full bg-nex-orange/10 border border-nex-orange/30 text-nex-orange text-xs font-semibold hover:bg-nex-orange hover:text-black transition-all"
                >
                  Entrar com Google
                </button>
              ) : (
                <button
                  onClick={() => signOut()}
                  className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                  title="Sair"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="w-full flex flex-col gap-4 pb-2">
              <ChatBubble role="assistant" content={HAVI_GREETING} />
              {messages.map((m, i) => (
                <ChatBubble
                  key={i}
                  role={m.role}
                  content={m.content}
                  isStreaming={isStreaming && i === messages.length - 1 && m.role === "assistant"}
                  quickReplies={!isStreaming && i === messages.length - 1 ? m.quickReplies : undefined}
                  onQuickReply={(option) => sendMessage(option)}
                />
              ))}
              <div ref={bottomRef} />
            </div>
          </div>
        )}
        </div>

        {/* Composer Expandido (IA Style) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full shrink-0"
        >
          <ChatComposer 
            value={message}
            onChange={setMessage}
            onSubmit={() => {
              if (isStreaming || !message.trim()) return;
              const text = message;
              setMessage("");
              sendMessage(text);
            }}
            isStreaming={isStreaming}
            onQuickSkill={startSkill}
            onHaviClick={() => router.push('/havi')}
            onSettingsClick={() => setDiagnosticOpen(true)}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex items-center gap-2 mt-3 mb-1 shrink-0 text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-medium"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B00] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6B00]"></span>
          </span>
          POWERED BY NEX AI
        </motion.div>
      </div>

      {diagnosticOpen && <DiagnosticFlow onClose={() => setDiagnosticOpen(false)} />}
    </main>
  );
}
