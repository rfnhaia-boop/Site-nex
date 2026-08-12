"use client";

import Image from "next/image";
import { motion, useMotionValue, useTransform, useMotionTemplate } from "framer-motion";
import {
  User,
  Phone,
  ArrowRight,
  ArrowLeft,
  Settings,
  X,
  Volume2,
  Thermometer,
  Cpu,
  ChevronDown, 
  Share, 
  Target, 
  ScanSearch, 
  Filter, 
  HelpCircle, 
  Sparkles,
  LogOut, 
  CreditCard,
  Lock, 
  Eye, 
  Check, 
  MessageSquare, 
  Upload
} from "lucide-react";
import DiagnosticFlow from "@/components/DiagnosticFlow";
import ChatComposer from "@/components/ChatComposer";
import Link from "next/link";
import { useState, useEffect, MouseEvent, useRef } from "react";
import { useRaviChat } from "@/lib/useRaviChat";

const HAVI_GREETING =
  "Olá! Eu sou o Havi, a inteligência artificial especialista da NEX. Como posso ajudar a transformar seus processos hoje?";

export default function IAPage() {
  // Estados para o chat e layout
  const [inputText, setInputText] = useState("");
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [currentSection, setCurrentSection] = useState("");
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordingTime, setRecordingTime] = useState("00:00");
  const [showAuth, setShowAuth] = useState(false);
  const [isGuest, setIsGuest] = useState(true);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loginName, setLoginName] = useState("");
  const [loginPhone, setLoginPhone] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  // Ainda não existe backend de conta/sessão real — em vez de fingir que logou,
  // avisa e mantém como convidado (que já usa o site inteiro normalmente).
  const [authNotice, setAuthNotice] = useState(false);
  const { messages, isStreaming, sendMessage } = useRaviChat("ia", currentSection);

  // Efeito JavaScript Premium (Spotlight e Tilt)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  // Hook do Framer Motion — precisa ficar no nível do componente (nunca dentro de
  // JSX condicional, tipo a tela de login), senão quebra a ordem dos hooks do React.
  const spotlightBackground = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(255, 106, 0, 0.15), transparent 80%)`;

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const { currentTarget, clientX, clientY } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
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

  // Usada tanto pelos cards da tela inicial quanto pelo menu "+" do composer —
  // garante que os dois caminhos ativem a skill de verdade (currentSection certo).
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

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const hasStarted = messages.length > 0;

  return (
    <main className="h-screen w-full font-sans text-nex-white flex items-center justify-center relative overflow-hidden bg-[#010101] p-4 md:p-8">
      
      {/* ========================================= */}
      {/* 1. FUNDO (Mantido Intacto e Visível)       */}
      {/* ========================================= */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image 
          src="/fundo.jpeg" 
          alt="NEX AI Environment" 
          fill 
          className="object-cover opacity-100" 
        />
        {/* Overlay ultra suave apenas para garantir leitura do texto, sem matar a imagem */}
        <div className="absolute inset-0 bg-[#010101]/40" />
      </div>

      {/* ========================================= */}
      {/* 2. MAIN DASHBOARD CONTAINER OR LOGIN      */}
      {/* ========================================= */}
      {showAuth ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6 overflow-y-auto"
        >
          {/* BACKGROUND RESPONSIVO (Mobile = Fundo da Link, Desktop = Neon Radial) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center z-0">
            {/* Mobile Image Background */}
            <div className="md:hidden absolute inset-0 z-0 bg-[#050505]">
              <Image src="/fundo-mobile.jpeg" fill className="object-cover opacity-80" alt="Fundo NEX" />
              <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Desktop Organic Light Background */}
            <div className="hidden md:flex absolute inset-0 pointer-events-none items-center justify-center">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(255,106,0,0.05)_0%,transparent_100%)]" />
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="absolute w-[100vw] h-[100vw] rounded-[40%_60%_70%_30%] border border-[#FF6A00]/10" 
                style={{ boxShadow: 'inset 0 0 100px rgba(255, 106, 0, 0.1)' }}
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                className="absolute w-[90vw] h-[90vw] rounded-[60%_40%_30%_70%] border border-[#FF6A00]/5"
                style={{ boxShadow: '0 0 150px rgba(255, 106, 0, 0.05)' }}
              />
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, type: "spring", damping: 20 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { mouseX.set(400); mouseY.set(400); }}
            style={{ 
              rotateX, 
              rotateY,
              transformStyle: "preserve-3d" 
            }}
            className="w-full max-w-[460px] relative z-10 rounded-[3rem] bg-[#030303]/60 backdrop-blur-2xl border-[1.5px] border-[#FF6A00]/40 shadow-[0_0_60px_rgba(255,106,0,0.15),inset_0_0_30px_rgba(255,106,0,0.05)] overflow-hidden"
          >
            {/* Efeito Spotlight seguindo o mouse (Fixo no Fundo do Card) */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: spotlightBackground,
                zIndex: 0
              }}
            />

            {/* Container Scrollável Interno */}
            <div className="w-full max-h-[85vh] overflow-y-auto scrollbar-hide flex flex-col items-center pt-16 pb-8 px-8 md:px-12 relative z-10">
              
              {/* Botão Voltar (Canto Superior do Card) */}
            <Link 
              href="/links"
              className="absolute top-12 left-8 z-50 flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-md shadow-lg group transform"
              style={{ transform: 'translateZ(30px)' }}
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </Link>



            {/* Logo Neon NEX */}
            <div className="mb-6 mt-4 relative z-10 transform" style={{ transform: 'translateZ(30px)' }}>
              <Image 
                src="/logo-nex-neon.png" 
                alt="NEX" 
                width={160} 
                height={60} 
                className="opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-500 drop-shadow-[0_0_15px_rgba(255,106,0,0.8)]"
              />
            </div>
            
            <div className="text-center mb-10 w-full relative z-10 transform" style={{ transform: 'translateZ(20px)' }}>
              <h1 className="text-2xl font-bold text-white mb-2 tracking-wide">
                {isLoginMode ? "Bem-vindo de volta." : "Crie sua conta NEX."}
              </h1>
              <p className="text-[#a1a1aa] text-sm font-light">
                {isLoginMode ? "Acesse sua conta e continue evoluindo." : "Junte-se à revolução e acesse a inteligência."}
              </p>
            </div>

            <div className="flex flex-col gap-5 w-full mb-6 relative z-10 transform" style={{ transform: 'translateZ(40px)' }}>
              {/* Nome e Telefone Input (Only in Register Mode) */}
              {!isLoginMode && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginTop: -20 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 0 }}
                  exit={{ opacity: 0, height: 0, marginTop: -20 }}
                  className="flex flex-col gap-5 overflow-hidden"
                >
                  <div className="flex flex-col gap-2">
                    <label className="text-white text-sm font-medium ml-1">Nome Completo</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF6A00]/70 group-focus-within:text-[#FF6A00] transition-colors">
                        <User className="w-5 h-5" />
                      </div>
                      <input 
                        type="text" 
                        value={loginName}
                        onChange={(e) => setLoginName(e.target.value)}
                        className="w-full h-[52px] bg-[#0a0a0a]/60 border border-white/10 rounded-2xl pl-12 pr-4 focus:border-[#FF6A00]/50 outline-none text-white text-sm placeholder-white/20 transition-all shadow-inner"
                        placeholder="Seu nome"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-white text-sm font-medium ml-1">WhatsApp / Telefone</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF6A00]/70 group-focus-within:text-[#FF6A00] transition-colors">
                        <Phone className="w-5 h-5" />
                      </div>
                      <input 
                        type="tel" 
                        value={loginPhone}
                        onChange={(e) => setLoginPhone(e.target.value)}
                        className="w-full h-[52px] bg-[#0a0a0a]/60 border border-white/10 rounded-2xl pl-12 pr-4 focus:border-[#FF6A00]/50 outline-none text-white text-sm placeholder-white/20 transition-all shadow-inner"
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Email Input */}
              <div className="flex flex-col gap-2">
                <label className="text-white text-sm font-medium ml-1">E-mail</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF6A00]/70 group-focus-within:text-[#FF6A00] transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <input 
                    type="email" 
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full h-[52px] bg-[#0a0a0a]/60 border border-white/10 rounded-2xl pl-12 pr-4 focus:border-[#FF6A00]/50 outline-none text-white text-sm placeholder-white/20 transition-all shadow-inner"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>
              
              {/* Password Input */}
              <div className="flex flex-col gap-2">
                <label className="text-white text-sm font-medium ml-1">Senha</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF6A00]/70 group-focus-within:text-[#FF6A00] transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input 
                    type="password" 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full h-[52px] bg-[#0a0a0a]/60 border border-white/10 rounded-2xl pl-12 pr-12 focus:border-[#FF6A00]/50 outline-none text-white text-sm placeholder-white/20 transition-all shadow-inner tracking-widest"
                    placeholder="••••••••"
                  />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors">
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Checkbox and Forgot Password (Only in Login Mode) */}
            {isLoginMode && (
              <div className="flex flex-wrap items-center justify-between gap-4 w-full mb-8 relative z-10 transform" style={{ transform: 'translateZ(30px)' }}>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-5 h-5 shrink-0 rounded flex items-center justify-center border border-[#FF6A00]/50 bg-[#FF6A00]/10 group-hover:bg-[#FF6A00]/20 transition-colors">
                    <Check className="w-3.5 h-3.5 text-[#FF6A00]" />
                  </div>
                  <span className="text-[#a1a1aa] text-sm group-hover:text-white transition-colors whitespace-nowrap">
                    Lembrar de mim
                  </span>
                </label>
                <button className="text-[#FF6A00] hover:text-[#ff8533] text-sm transition-colors whitespace-nowrap">
                  Esqueceu a senha?
                </button>
              </div>
            )}
            
            {/* Espaçamento compensatório se não houver o lembrar senha */}
            {!isLoginMode && <div className="h-6" />}

            {/* Entrar Button - Melhorado */}
            <button
              onClick={() => setAuthNotice(true)}
              className="w-full h-[60px] rounded-2xl bg-gradient-to-r from-[#FFA733] via-[#FF6A00] to-[#CC4400] text-black font-black flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all group relative overflow-hidden mb-4 shadow-[0_0_40px_rgba(255,106,0,0.4)] z-10 transform tracking-widest uppercase"
              style={{ transform: 'translateZ(50px)' }}
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative z-10 text-lg">{isLoginMode ? "Entrar" : "Criar Conta"}</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>

            {authNotice && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full mb-8 p-4 rounded-2xl border border-[#FF6A00]/30 bg-[#FF6A00]/10 text-center relative z-10 transform"
                style={{ transform: 'translateZ(30px)' }}
              >
                <p className="text-white text-sm font-medium mb-3">
                  Login ainda não está disponível nesta versão do site.
                </p>
                <button
                  onClick={() => { setAuthNotice(false); setShowAuth(false); }}
                  className="text-[#FF6A00] hover:text-[#ff8533] text-sm font-semibold transition-colors"
                >
                  Continuar como convidado
                </button>
              </motion.div>
            )}

            {/* Divider */}
            <div className="flex items-center w-full gap-4 mb-8 relative z-10 transform" style={{ transform: 'translateZ(20px)' }}>
              <div className="h-[1px] flex-1 bg-white/10" />
              <span className="text-white/30 text-xs uppercase tracking-wider">ou continue com</span>
              <div className="h-[1px] flex-1 bg-white/10" />
            </div>

            {/* Social Logins */}
            <div className="w-full mb-10 relative z-10 transform" style={{ transform: 'translateZ(30px)' }}>
              <button className="w-full flex items-center justify-center gap-3 h-[56px] bg-[#0a0a0a]/60 border border-white/5 hover:border-white/20 rounded-2xl transition-all">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="text-white/80 text-sm font-medium">Continuar com Google</span>
              </button>
            </div>

            {/* Create Account / Login Toggle */}
            <div className="w-full relative z-10 transform" style={{ transform: 'translateZ(20px)' }}>
              <div className="h-[1px] w-full bg-white/5 mb-6" />
              <div className="flex flex-col items-center justify-center gap-3">
                <span className="text-[#a1a1aa] text-sm">
                  {isLoginMode ? "Novo no ecossistema NEX?" : "Já faz parte do ecossistema?"}
                </span>
                <button 
                  onClick={() => setIsLoginMode(!isLoginMode)}
                  className="px-6 py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white text-sm font-medium transition-all shadow-sm active:scale-95"
                >
                  {isLoginMode ? "Criar minha conta agora" : "Acessar minha conta"}
                </button>
              </div>
            </div>
            
          </div>
        </motion.div>
        </motion.div>
      ) : (
        <main className="relative z-10 w-full max-w-6xl h-full flex flex-col bg-transparent backdrop-blur-[2px] border border-white/[0.03] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden">
        
        {/* Top Header */}
        <header className="w-full h-20 px-6 md:px-10 flex justify-between items-center border-b border-white/[0.03]">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.02] border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all hover:border-white/20"
              title="Voltar para a página principal"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="relative">
              <button 
                onClick={() => setShowChatMenu(!showChatMenu)}
                className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
              >
                <span className="font-light text-base tracking-wide">Chat atual</span>
                <ChevronDown className={`w-4 h-4 opacity-50 transition-transform duration-300 ${showChatMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Menu de Histórico de Chats / Login */}
              {showChatMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute top-full left-0 mt-6 w-80 rounded-[1.5rem] bg-black/60 backdrop-blur-[40px] border border-white/10 p-5 shadow-[0_30px_60px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(255,255,255,0.02)] z-50 flex flex-col gap-4 cursor-default"
                >
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Suas Conversas</span>
                    <span className="text-[10px] font-medium bg-white/5 text-zinc-400 px-2 py-0.5 rounded-full">0</span>
                  </div>
                  
                  {/* Lista vazia simulada */}
                  <div className="flex flex-col items-center justify-center py-6 text-center px-2 bg-white/[0.02] rounded-2xl border border-white/5 border-dashed">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                      <MessageSquare className="w-5 h-5 text-zinc-600" />
                    </div>
                    <p className="text-zinc-400 text-xs font-light leading-relaxed">Você não tem conversas salvas.<br/>O histórico é limpo ao sair.</p>
                  </div>

                  <div className="w-full h-[1px] bg-white/5 my-1" />
                  
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] text-zinc-500 text-center font-light mb-1">Para salvar o histórico e treinar a IA com seus dados:</span>
                    <button className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#FFA733] via-[#FF6600] to-[#CC4400] text-white font-semibold text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(255,106,0,0.4)] flex justify-center items-center gap-2">
                      Fazer Login na Conta NEX
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              <span className="text-white/60 text-xs font-medium uppercase tracking-wider">
                {isGuest ? "Convidado" : "Conectado"}
              </span>
            </div>
            
            {isGuest ? (
              <button 
                onClick={() => setShowAuth(true)}
                className="px-5 py-2 rounded-full bg-[#FF6A00]/10 border border-[#FF6A00]/40 text-[#FF6A00] text-sm font-semibold hover:bg-[#FF6A00] hover:text-black transition-all shadow-[0_0_15px_rgba(255,106,0,0.2)]"
              >
                Entrar
              </button>
            ) : (
              <button 
                onClick={() => setIsGuest(true)}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all hover:border-white/20"
                title="Sair"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </header>

        {/* Center Content (Welcome & Cards, ou histórico da conversa) */}
        <div className="flex-1 flex flex-col items-center px-6 w-full max-w-4xl mx-auto overflow-y-auto custom-scrollbar pt-10">
          {!hasStarted ? (
            <div className="flex-1 flex flex-col items-center justify-center w-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="flex flex-col items-center mb-16 text-center"
              >
                <div className="relative w-[360px] h-32 mb-6">
                  <Image
                    src="/logo-nex-neon.png"
                    alt="NEX Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <h2 className="text-2xl md:text-3xl font-light text-zinc-300 tracking-tight">Como posso ajudar você hoje?</h2>
              </motion.div>

              {/* Cards Grid */}
              <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
                <ActionCard
                  icon={Target}
                  title="Plano de Crescimento Express"
                  desc="3 passos práticos, agora"
                  onClick={startPlanoCrescimento}
                />
                <ActionCard
                  icon={ScanSearch}
                  title="Análise de IA no negócio"
                  desc="Diagnóstico real, gerado pelo NEX OS"
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
                  title="Ajudar com algo específico"
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

        {/* ========================================= */}
        {/* 3. LIQUID GLASS INPUT (Pixel-Perfect)      */}
        {/* ========================================= */}
        <div className="w-full max-w-4xl mx-auto px-6 mb-8 mt-auto shrink-0 relative">
          
          {/* Efeito de Reflexo (Chão) abaixo da barra */}
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


          <div className="text-center mt-5 mb-2">
            <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase opacity-60">
              NEX AI pode cometer erros. Verifique informações importantes. ⓘ
            </span>
          </div>
        </div>

      </main>
      )}
    </main>
  );
}

// ----------------------------------------------------------------------
// Componentes Secundários (UI Premium)
// ----------------------------------------------------------------------

function ActionCard({ icon: Icon, title, desc, onClick }: { icon: any, title: string, desc: string, onClick?: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.2)", boxShadow: "0 15px 30px rgba(0,0,0,0.2)" }}
      className="flex flex-col items-start p-4 sm:p-6 rounded-[1.2rem] sm:rounded-[1.5rem] bg-white/[0.03] backdrop-blur-[40px] border border-white/10 text-left transition-all duration-300 h-full group"
    >
      <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-[1rem] border border-white/10 bg-white/5 flex items-center justify-center mb-3 sm:mb-5 group-hover:border-nex-orange/30 group-hover:bg-nex-orange/10 transition-colors">
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400 group-hover:text-nex-orange transition-colors" />
      </div>
      <div className="flex flex-col w-full">
        <h3 className="text-zinc-200 text-xs sm:text-sm font-medium mb-1 sm:mb-2 leading-tight group-hover:text-white transition-colors pr-1">{title}</h3>
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
        className={`max-w-[85%] md:max-w-[70%] rounded-3xl px-5 py-3.5 text-[15px] leading-relaxed ${
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
