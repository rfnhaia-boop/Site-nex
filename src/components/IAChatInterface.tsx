"use client";

import Image from "next/image";
import { motion, useMotionValue, useTransform, useMotionTemplate } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Volume2,
  Thermometer,
  Cpu,
  ChevronDown,
  Target,
  ScanSearch,
  Filter,
  HelpCircle,
  LogOut,
  MessageSquare,
  ArrowUp
} from "lucide-react";
import DiagnosticFlow from "@/components/DiagnosticFlow";
import ChatComposer from "@/components/ChatComposer";
import Link from "next/link";
import { useState, useEffect, MouseEvent, useRef } from "react";
import { useRaviChat } from "@/lib/useRaviChat";
import { useSession, signIn, signOut } from "next-auth/react";

const HAVI_GREETING =
  "Olá! Eu sou o Havi, a inteligência artificial especialista da NEX. Como posso ajudar a transformar seus processos hoje?";

const RESUME_AFTER_LOGIN_KEY = "havi_post_login_resume_ia";

interface IAChatInterfaceProps {
  embedded?: boolean;
  onBackToTop?: () => void;
}

export function IAChatInterface({ embedded = false, onBackToTop }: IAChatInterfaceProps) {
  const [inputText, setInputText] = useState("");
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [currentSection, setCurrentSection] = useState("");
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordingTime, setRecordingTime] = useState("00:00");
  const { data: session, status } = useSession();
  const isGuest = status !== "authenticated";

  const { messages, isStreaming, sendMessage } = useRaviChat("ia", currentSection);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const composerWrapperRef = useRef<HTMLDivElement>(null);
  const [loginToast, setLoginToast] = useState(false);

  // Login com Google às vezes completa sozinho e rápido demais pra dar pra ver
  // (conta já autorizou o app antes) -- sem esse aviso, o botão só troca de
  // "Entrar com Google" pra um ícone pequeno e parece que não aconteceu nada.
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
    setLoginToast(true);
    const timer = setTimeout(() => setLoginToast(false), 4000);
    if (messages.length > 0) {
      sendMessage("Pronto, acabei de fazer login com Google.");
    }
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // Rola o histórico interno pro fim E traz o composer pra vista na página --
  // no /havi o chat fica embutido numa página longa, então só rolar o histórico
  // interno não é suficiente: o composer pode continuar cortado fora da tela.
  useEffect(() => {
    const inner = messagesContainerRef.current;
    if (inner) inner.scrollTop = inner.scrollHeight;
    composerWrapperRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlightBackground = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(255, 106, 0, 0.15), transparent 80%)`;

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const { currentTarget, clientX, clientY } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;
    mouseX.set(x);
    mouseY.set(y);
  }

  const rotateX = useTransform(mouseY, [0, 800], [5, -5]);
  const rotateY = useTransform(mouseX, [0, 800], [-5, 5]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecordingAudio) {
      let seconds = 0;
      setRecordingTime("00:00");
      interval = setInterval(() => {
        seconds++;
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        setRecordingTime(`${mins}:${secs}`);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecordingAudio]);

  function startSkill(text: string, section: string) {
    if (section) setCurrentSection(section);
    sendMessage(text, section || undefined);
  }

  function startAnaliseIA() {
    startSkill(
      "Quero uma análise real de como minha empresa está posicionada digitalmente e onde a IA pode ajudar.",
      "analise-ia"
    );
  }

  function startRaioXFunil() {
    startSkill("Quero entender onde meu funil de vendas está perdendo clientes.", "raio-x-funil");
  }

  function startPlanoCrescimento() {
    startSkill("Quero um plano de crescimento prático pra minha empresa.", "plano-crescimento");
  }

  function handleSend() {
    if (isStreaming || !inputText.trim()) return;
    sendMessage(inputText);
    setInputText("");
  }

  const hasStarted = messages.length > 0;

  return (
    <div className={`relative z-10 w-full ${embedded ? 'h-[750px] max-w-5xl rounded-[2.5rem] border border-white/[0.08] bg-[#050505]/90 backdrop-blur-3xl shadow-[0_20px_70px_rgba(0,0,0,0.8)]' : 'h-full max-w-6xl rounded-[2rem] md:rounded-[2.5rem] border border-white/[0.03] bg-transparent backdrop-blur-[2px]'} flex flex-col overflow-hidden`}>

      {/* Aviso de login -- o Google às vezes completa o redirect rápido demais
          pra dar pra ver, então sem isso parece que o botão não fez nada. */}
      {loginToast && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-3 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-semibold shadow-[0_10px_30px_rgba(0,0,0,0.4)] backdrop-blur-xl whitespace-nowrap"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Login feito! Conectado como {session?.user?.name || session?.user?.email}
        </motion.div>
      )}

      {/* Top Header */}
      <header className="w-full h-20 px-6 md:px-10 flex justify-between items-center border-b border-white/[0.04]">
        <div className="flex items-center gap-4">
          {!embedded ? (
            <Link 
              href="/"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.02] border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all hover:border-white/20"
              title="Voltar para a página principal"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
          ) : (
            <button 
              onClick={onBackToTop || (() => window.scrollTo({ top: 0, behavior: 'smooth' }))}
              className="flex items-center space-x-1.5 text-[10px] font-mono text-zinc-400 hover:text-white bg-white/[0.03] border border-white/5 px-3 py-1.5 rounded-full transition-all hover:bg-white/10"
              title="Voltar ao topo da página"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">TOPO</span>
            </button>
          )}

          <div className="relative">
            <button 
              onClick={() => setShowChatMenu(!showChatMenu)}
              className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
            >
              <span className="font-light text-base tracking-wide">Havi OS</span>
              <ChevronDown className={`w-4 h-4 opacity-50 transition-transform duration-300 ${showChatMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Menu de Histórico de Chats / Login */}
            {showChatMenu && (
              <motion.div 
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute top-full left-0 mt-6 w-80 rounded-[1.5rem] bg-black/80 backdrop-blur-[40px] border border-white/10 p-5 shadow-[0_30px_60px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(255,255,255,0.02)] z-50 flex flex-col gap-4 cursor-default"
              >
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Suas Conversas</span>
                  <span className="text-[10px] font-medium bg-white/5 text-zinc-400 px-2 py-0.5 rounded-full">0</span>
                </div>
                
                <div className="flex flex-col items-center justify-center py-6 text-center px-2 bg-white/[0.02] rounded-2xl border border-white/5 border-dashed">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                    <MessageSquare className="w-5 h-5 text-zinc-600" />
                  </div>
                  <p className="text-zinc-400 text-xs font-light leading-relaxed">Você não tem conversas salvas.<br/>O histórico é limpo ao sair.</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            <span className="text-white/60 text-xs font-medium uppercase tracking-wider">
              {isGuest ? "Convidado" : session?.user?.name || "Conectado"}
            </span>
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
              className="px-4 py-1.5 rounded-full bg-nex-orange/10 border border-nex-orange/30 text-nex-orange text-xs font-semibold hover:bg-nex-orange hover:text-black transition-all"
            >
              Entrar com Google
            </button>
          ) : (
            <button
              onClick={() => signOut()}
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all hover:border-white/20"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}

          {embedded && (
            <Link
              href="/ia"
              className="text-[11px] font-mono text-zinc-400 hover:text-white bg-white/[0.04] border border-white/10 px-3.5 py-1.5 rounded-full transition-all hover:bg-white/10 hidden sm:flex items-center gap-1.5"
            >
              <span>TELA CHEIA</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </header>

      {/* Center Content */}
      <div ref={messagesContainerRef} className="flex-1 flex flex-col items-center px-6 w-full max-w-4xl mx-auto overflow-y-auto custom-scrollbar pt-8">
        {!hasStarted ? (
          <div className="flex-1 flex flex-col items-center justify-center w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="flex flex-col items-center mb-10 text-center"
            >
              <div className="relative w-[280px] md:w-[320px] h-24 mb-4">
                <Image
                  src="/logo-nex-neon.png"
                  alt="NEX Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <h2 className="text-xl md:text-2xl font-light text-zinc-300 tracking-tight">Como posso ajudar você hoje?</h2>
            </motion.div>

            {/* Cards Grid */}
            <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
              <ActionCard
                icon={Target}
                title="Plano de Crescimento"
                desc="3 passos práticos, agora"
                onClick={startPlanoCrescimento}
              />
              <ActionCard
                icon={ScanSearch}
                title="Análise de IA no negócio"
                desc="Diagnóstico real gerado pelo NEX OS"
                onClick={startAnaliseIA}
              />
              <ActionCard
                icon={Filter}
                title="Raio-X do Funil"
                desc="Ache onde seus clientes travam"
                onClick={startRaioXFunil}
              />
              <ActionCard
                icon={HelpCircle}
                title="Dúvida Específica"
                desc="Pergunte sobre qualquer coisa"
                onClick={() => sendMessage("Tenho uma dúvida específica sobre a NEX.")}
              />
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-5 pb-8">
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
          </div>
        )}
      </div>

      {/* Input Composer */}
      <div ref={composerWrapperRef} className="w-full max-w-4xl mx-auto px-6 mb-6 mt-auto shrink-0 relative">
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-[10px] bg-nex-orange/40 blur-[20px] rounded-[100%] pointer-events-none" />

        <ChatComposer
          value={inputText}
          onChange={setInputText}
          onSubmit={handleSend}
          isStreaming={isStreaming}
          onQuickSkill={startSkill}
          settingsMenuContent={
            <>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-left group">
                <Cpu className="w-4 h-4 text-zinc-400 group-hover:text-nex-orange transition-colors shrink-0" />
                <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors leading-tight">Modelo: Havi (Rápido)</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-left group">
                <Thermometer className="w-4 h-4 text-zinc-400 group-hover:text-nex-orange transition-colors shrink-0" />
                <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors leading-tight">Temperatura: Criativa</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-left group">
                <Volume2 className="w-4 h-4 text-zinc-400 group-hover:text-nex-orange transition-colors shrink-0" />
                <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors leading-tight">Tom de Voz: Profissional</span>
              </button>
            </>
          }
        />

        <div className="text-center mt-3 mb-1">
          <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase opacity-60">
            NEX AI pode cometer erros. Verifique informações importantes. ⓘ
          </span>
        </div>
      </div>

    </div>
  );
}

function ActionCard({ icon: Icon, title, desc, onClick }: { icon: any, title: string, desc: string, onClick?: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -4, backgroundColor: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.2)", boxShadow: "0 15px 30px rgba(0,0,0,0.2)" }}
      className="flex flex-col items-start p-4 sm:p-5 rounded-[1.2rem] sm:rounded-[1.5rem] bg-white/[0.03] backdrop-blur-[40px] border border-white/10 text-left transition-all duration-300 h-full group"
    >
      <div className="shrink-0 w-9 h-9 sm:w-11 sm:h-11 rounded-[1rem] border border-white/10 bg-white/5 flex items-center justify-center mb-3 sm:mb-4 group-hover:border-nex-orange/30 group-hover:bg-nex-orange/10 transition-colors">
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400 group-hover:text-nex-orange transition-colors" />
      </div>
      <div className="flex flex-col w-full">
        <h3 className="text-zinc-200 text-xs sm:text-sm font-medium mb-1 leading-tight group-hover:text-white transition-colors pr-1">{title}</h3>
        <p className="text-zinc-500 text-[10px] sm:text-xs font-light leading-relaxed hidden sm:block">{desc}</p>
      </div>
    </motion.button>
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
        className={`max-w-[85%] md:max-w-[70%] rounded-3xl px-5 py-3.5 text-[14px] md:text-[15px] leading-relaxed ${
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
        <div className="flex flex-wrap gap-2 max-w-[85%] md:max-w-[70%]">
          {quickReplies.map((option) => (
            <button
              key={option}
              onClick={() => onQuickReply?.(option)}
              className="px-4 py-2 rounded-full text-xs md:text-sm font-medium border border-nex-orange/30 bg-nex-orange/[0.06] text-nex-orange hover:bg-nex-orange/15 hover:border-nex-orange/50 transition-all duration-200"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
