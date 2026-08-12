"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue, useScroll, useTransform } from "framer-motion";
import { Zap, Target, Brain, ArrowRight, MessageSquare, Search, Shield, Rocket, Activity } from "lucide-react";
import React, { MouseEvent, useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";

export default function HaviPage() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const { currentTarget, clientX, clientY } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  // Efeito de Typing do Chat
  const [chatText, setChatText] = useState("");
  const fullText = "Olá, como posso te ajudar hoje?";
  
  useEffect(() => {
    let currentLength = 0;
    const interval = setInterval(() => {
      if (currentLength <= fullText.length) {
        setChatText(fullText.slice(0, currentLength));
        currentLength++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const [activeSection, setActiveSection] = useState(1);

  return (
    <main 
      onMouseMove={handleMouseMove}
      className="bg-[#030303] text-white font-sans selection:bg-[#FF6A00]/30 selection:text-[#FF6A00]"
    >
      <Navbar />

      {/* CONTAINER PRINCIPAL */}
      <div className="relative w-full">
        
        {/* VIEWPORT FIXO: HAVI E FUNDO */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center pointer-events-none">
          
          {/* FUNDO INTERATIVO & LUZES */}
          <div className="absolute inset-0 z-0">
            <motion.div 
              className="absolute inset-0"
              style={{
                background: useMotionTemplate`radial-gradient(800px circle at ${mouseX}px ${mouseY}px, rgba(255, 106, 0, 0.08), transparent 80%)`,
              }}
            />
            {/* Luz central */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vh] bg-[radial-gradient(ellipse_at_center,rgba(255,106,0,0.03)_0%,transparent_70%)]" />
          </div>

          {/* HAVI FIXO NO CENTRO (Anima conforme a seção ativa) */}
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            
            {/* POSE 1: STANDING */}
            <motion.div 
              initial={false}
              animate={{ opacity: activeSection === 1 ? 1 : 0, scale: activeSection === 1 ? 1 : 0.9 }}
              transition={{ duration: 0.8 }}
              className="absolute w-full max-w-[500px] aspect-[4/5] lg:scale-110 xl:scale-125 pt-20"
            >
              <Image src="/havi-standing.png" alt="Havi Standing" fill className="object-contain drop-shadow-[0_0_50px_rgba(255,106,0,0.2)]" priority />
            </motion.div>

            {/* POSE 2: POINTING */}
            <motion.div 
              initial={false}
              animate={{ opacity: activeSection === 2 ? 1 : 0, scale: activeSection === 2 ? 1 : 0.9 }}
              transition={{ duration: 0.8 }}
              className="absolute w-full max-w-[500px] aspect-[4/5] lg:scale-110 xl:scale-125 pt-20"
            >
              <Image src="/havi-pointing-clear.png" alt="Havi Pointing" fill className="object-contain drop-shadow-[0_0_50px_rgba(255,106,0,0.3)]" priority />
            </motion.div>

            {/* POSE 3: FLYING */}
            <motion.div 
              initial={false}
              animate={{ opacity: activeSection === 3 ? 1 : 0, scale: activeSection === 3 ? 1.1 : 0.9, y: activeSection === 3 ? -20 : 50 }}
              transition={{ duration: 0.8 }}
              className="absolute w-full max-w-[500px] sm:max-w-[700px] aspect-square pt-10"
            >
              <Image src="/havi-full.png" alt="Havi Flying" fill className="object-contain drop-shadow-[0_0_80px_rgba(255,106,0,0.5)]" priority />
            </motion.div>

            {/* POSE 4: SHIELD */}
            <motion.div 
              initial={false}
              animate={{ opacity: activeSection === 4 ? 1 : 0, scale: activeSection === 4 ? 1 : 0.9, y: activeSection === 4 ? -20 : 50 }}
              transition={{ duration: 0.8 }}
              className="absolute w-full max-w-[450px] sm:max-w-[600px] aspect-[4/5] pt-10"
            >
              <Image src="/havi-pose-4.png" alt="Havi Shield" fill className="object-contain drop-shadow-[0_0_80px_rgba(255,106,0,0.5)]" priority />
            </motion.div>

          </div>
        </div>

        {/* SEÇÕES DE CONTEÚDO SCROLLÁVEL */}
        <div className="relative z-30 -mt-[100vh]">
          
          {/* SEÇÃO 1: INTRODUÇÃO */}
          <motion.div 
            onViewportEnter={() => setActiveSection(1)}
            viewport={{ amount: 0.3 }}
            className="min-h-screen w-full flex flex-col lg:flex-row items-center justify-center lg:px-6 pt-[50vh] lg:pt-24 pb-12 lg:pb-24 max-w-[1440px] mx-auto pointer-events-none"
          >
            {/* Lado Esquerdo */}
            <div className="w-[90%] sm:w-[85%] lg:w-[35%] flex flex-col pointer-events-auto lg:pl-12 bg-black/80 lg:bg-transparent backdrop-blur-2xl lg:backdrop-blur-none p-6 lg:p-0 rounded-[2rem] lg:rounded-none border border-white/10 lg:border-none shadow-[0_20px_50px_rgba(0,0,0,0.8)] lg:shadow-none relative z-10 mx-auto lg:mx-0">
              <h2 className="text-[#FF6A00] uppercase tracking-[0.2em] lg:tracking-[0.3em] text-[9px] sm:text-[10px] lg:text-xs font-bold mb-3 lg:mb-6 drop-shadow-[0_0_10px_rgba(255,106,0,0.3)]">
                A Inteligência da NEX
              </h2>

              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-3 lg:mb-6 text-white">
                Sou o <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6A00] to-[#FF4000] drop-shadow-[0_0_15px_rgba(255,106,0,0.4)]">Havi.</span><br className="hidden lg:block"/>
                <span className="text-[#a1a1aa] font-light ml-2 lg:ml-0">Seu aliado.</span>
              </h1>

              <p className="text-white/70 lg:text-white/60 text-xs sm:text-sm lg:text-lg font-light leading-relaxed mb-5 lg:mb-8 max-w-md">
                Programado para entender, aprender e evoluir com você. Sempre focado no que realmente importa: <strong className="text-white font-medium">resultado.</strong>
              </p>

              {/* Painel: Pronto para te ajudar */}
              <GlassPanel className="p-4 sm:p-5 lg:p-8 flex flex-col border-white/10 lg:border-white/5 bg-white/[0.03] lg:bg-white/[0.02]">
                <h3 className="text-[#FF6A00] uppercase tracking-widest text-[9px] lg:text-xs font-bold mb-3 lg:mb-6">Pronto para te ajudar</h3>
                <ul className="space-y-2 lg:space-y-4 mb-5 lg:mb-8">
                  <FeatureItem icon={Activity} text="Análise e Estratégia" />
                  <FeatureItem icon={MessageSquare} text="Respostas Inteligentes" />
                  <FeatureItem icon={Zap} text="Automação e Execução" />
                </ul>
                
                <Link 
                  href="/ia" 
                  className="w-full flex items-center justify-center gap-3 py-3 lg:py-3.5 rounded-xl bg-gradient-to-r from-[#FF6A00] to-[#FF4000] text-black font-black uppercase tracking-widest text-[10px] lg:text-xs hover:scale-[1.03] active:scale-95 transition-all shadow-[0_0_25px_rgba(255,106,0,0.3)] group relative overflow-hidden"
                >
                  <span className="relative z-10">Fazer Análise</span>
                  <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                </Link>
              </GlassPanel>
            </div>

            {/* Espaço Vazio pro Havi (Centro) */}
            <div className="hidden lg:flex w-full lg:w-[40%] h-[50vh] lg:h-full shrink-0 items-center justify-center pointer-events-none" />

            {/* Lado Direito */}
            <div className="hidden lg:flex w-full lg:w-[25%] flex-col gap-6 lg:pr-12 pointer-events-auto lg:mt-16 bg-black/60 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none p-6 lg:p-0 rounded-[2rem] lg:rounded-none border border-white/5 lg:border-none shadow-[0_20px_40px_rgba(0,0,0,0.5)] lg:shadow-none relative z-10">
              {/* Expressões */}
              <GlassPanel className="p-5 flex flex-col gap-5">
                <h3 className="text-[#FF6A00] uppercase tracking-widest text-xs font-bold mb-2">Expressões</h3>
                <ExpressionItem img="/havi-standing.png" text="Pronto para ajudar" />
                <ExpressionItem img="/havi-pointing-clear.png" text="Analisando..." />
                <ExpressionItem img="/havi-full.png" text="Tudo certo!" />
              </GlassPanel>

              {/* Chat Mockup */}
              <div className="rounded-[2.5rem] border border-[#FF6A00]/20 bg-[#0a0a0a]/90 backdrop-blur-3xl shadow-[0_10px_40px_rgba(255,106,0,0.05)] p-4 flex items-start gap-4 hover:border-[#FF6A00]/40 transition-colors group cursor-default">
                <div className="relative w-10 h-10 shrink-0 rounded-full overflow-hidden border border-[#FF6A00]/30 shadow-[0_0_15px_rgba(255,106,0,0.3)]">
                  <Image src="/ravi-avatar.png" alt="Havi Avatar" fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#FF6A00] text-sm font-bold">Havi</span>
                    <span className="text-white/30 text-xs">agora</span>
                  </div>
                  <p className="text-white/80 text-sm font-light whitespace-pre-wrap leading-relaxed h-[42px]">
                    {chatText}
                    <motion.span 
                      animate={{ opacity: [1, 0] }} 
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      className="inline-block w-[3px] h-[0.85em] bg-[#FF6A00] ml-[2px] align-baseline"
                    />
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* SEÇÃO 2: INTERAÇÃO (Pointing) */}
          <motion.div 
            onViewportEnter={() => setActiveSection(2)}
            viewport={{ amount: 0.5 }}
            className="min-h-screen w-full flex items-end lg:items-center justify-center max-w-[1440px] mx-auto lg:px-6 pb-12 lg:py-24 pointer-events-none"
          >
            <div className="w-full flex">
              <div className="w-[90%] sm:w-[85%] lg:w-auto max-w-sm pointer-events-auto mx-auto lg:mx-0 lg:ml-[15%] bg-black/80 lg:bg-transparent backdrop-blur-2xl lg:backdrop-blur-none p-6 lg:p-0 rounded-[2rem] lg:rounded-none border border-white/10 lg:border-none shadow-[0_20px_50px_rgba(0,0,0,0.8)] lg:shadow-none relative z-10">
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-3 lg:mb-6">
                  Foco no <span className="text-[#FF6A00]">Seu Negócio.</span>
                </h1>
                <p className="text-white/70 lg:text-white/60 text-xs sm:text-sm lg:text-lg font-light leading-relaxed mb-5 lg:mb-8">
                  Esqueça configurações chatas. Eu assumo as operações pesadas para que você foque apenas em liderar.
                </p>
                <GlassPanel className="p-4 sm:p-5 lg:p-6 border-white/10 lg:border-white/5 bg-white/[0.03] lg:bg-white/[0.02] mb-6 lg:mb-8">
                  <h4 className="text-white font-medium text-xs lg:text-sm flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-[#FF6A00]" /> Ação Imediata
                  </h4>
                  <p className="text-white/50 text-[10px] lg:text-xs leading-relaxed">
                    Identifico gargalos, cruzo dados e entrego o próximo passo executável na sua mão. Sem rodeios.
                  </p>
                </GlassPanel>

                <Link 
                  href="/ia" 
                  className="w-full flex items-center justify-center gap-3 py-3.5 lg:py-4 rounded-xl border border-[#FF6A00]/40 bg-[#FF6A00]/10 text-[#FF6A00] font-black uppercase tracking-widest text-[10px] lg:text-xs hover:bg-[#FF6A00]/20 hover:border-[#FF6A00]/80 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(255,106,0,0.15)] group"
                >
                  <Activity className="w-4 h-4 group-hover:animate-ping" />
                  <span>Raio-X do Funil</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* SEÇÃO 3: CAPACIDADES (Hoverboard) */}
          <motion.div 
            onViewportEnter={() => setActiveSection(3)}
            viewport={{ amount: 0.5 }}
            className="min-h-screen w-full flex flex-col justify-end lg:justify-center max-w-[1200px] mx-auto lg:px-6 pb-24 lg:py-24 pointer-events-none relative"
          >
            {/* Floating Cards Desktop */}
            <div className="hidden md:block absolute inset-0 pointer-events-auto">
              <FloatingCard delay={0.2} top="15%" left="5%" icon={Rocket} title="VOANDO" desc="Explorando novas possibilidades." />
              <FloatingCard delay={0.4} top="15%" right="5%" icon={MessageSquare} title="INTERAGINDO" desc="Conectando e conversando com você." />
              <FloatingCard delay={0.6} top="45%" right="2%" icon={Zap} title="EXECUTANDO" desc="Transformando ideias em ação." />
              <FloatingCard delay={0.8} bottom="15%" right="10%" icon={Shield} title="PROTEGENDO" desc="Segurança e confiança em primeiro lugar." />
              <FloatingCard delay={1.0} bottom="10%" left="25%" icon={Activity} title="SEMPRE ATIVO" desc="Monitorando, aprendendo e evoluindo 24h." badge="24H" />
              <FloatingCard delay={1.2} top="50%" left="2%" icon={Search} title="ANALISANDO" desc="Processando dados para gerar insights." />
            </div>
            
            {/* Mobile Horizontal Carousel */}
            <div 
              className="md:hidden flex overflow-x-auto snap-x snap-mandatory gap-4 relative z-40 pointer-events-auto w-full px-6 pt-10 pb-12"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <style dangerouslySetInnerHTML={{__html: `
                .md\\:hidden::-webkit-scrollbar { display: none; }
              `}} />
              
              <FloatingCard mobile delay={0.2} icon={Rocket} title="VOANDO" desc="Explorando novas possibilidades." />
              <FloatingCard mobile delay={0.3} icon={MessageSquare} title="INTERAGINDO" desc="Conectando e conversando com você." />
              <FloatingCard mobile delay={0.4} icon={Zap} title="EXECUTANDO" desc="Transformando ideias em ação." />
              <FloatingCard mobile delay={0.5} icon={Shield} title="PROTEGENDO" desc="Segurança e confiança." />
              <FloatingCard mobile delay={0.6} icon={Activity} title="SEMPRE ATIVO" desc="Monitorando, aprendendo e evoluindo 24h." badge="24H" />
            </div>
          </motion.div>

          {/* SEÇÃO 4: SEGURANÇA (Shield) */}
          <motion.div 
            onViewportEnter={() => setActiveSection(4)}
            viewport={{ amount: 0.5 }}
            className="min-h-screen w-full flex items-end lg:items-center justify-center max-w-[1440px] mx-auto lg:px-6 pb-24 lg:py-24 pointer-events-none"
          >
            <div className="w-full flex justify-end">
              <div className="w-[90%] sm:w-[85%] lg:w-auto max-w-sm sm:max-w-md pointer-events-auto mx-auto lg:mr-[10%] text-left lg:text-right flex flex-col items-start lg:items-end bg-black/80 lg:bg-transparent backdrop-blur-2xl lg:backdrop-blur-none p-6 lg:p-0 rounded-[2rem] lg:rounded-none border border-white/10 lg:border-none shadow-[0_20px_50px_rgba(0,0,0,0.8)] lg:shadow-none relative z-10">
                <h2 className="text-[#FF6A00] uppercase tracking-[0.2em] lg:tracking-[0.3em] text-[9px] sm:text-[10px] lg:text-xs font-bold mb-3 lg:mb-4 drop-shadow-[0_0_10px_rgba(255,106,0,0.3)]">
                  Privacidade de Ponta a Ponta
                </h2>
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-3 lg:mb-6">
                  Inteligência <span className="text-[#FF6A00]">Blindada.</span>
                </h1>
                <p className="text-white/70 lg:text-white/60 text-xs sm:text-sm lg:text-lg font-light leading-relaxed mb-5 lg:mb-8 text-left lg:text-right">
                  A magia acontece com responsabilidade. Todos os dados que eu processo são encriptados e protegidos por uma muralha digital intransponível.
                </p>
                <GlassPanel className="p-4 sm:p-5 lg:p-6 text-left border-[#FF6A00]/40 shadow-[0_0_30px_rgba(255,106,0,0.1)] bg-white/[0.03] lg:bg-white/[0.02] w-full">
                  <h4 className="text-white font-medium text-xs lg:text-sm flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-[#FF6A00]" /> Segurança Corporativa
                  </h4>
                  <p className="text-white/50 text-[10px] lg:text-xs leading-relaxed">
                    Nenhuma informação confidencial vaza. Trabalho 100% isolado garantindo que o conhecimento da sua empresa fique só na sua empresa.
                  </p>
                </GlassPanel>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </main>
  );
}

// ---------------------------------------------------------
// COMPONENTES AUXILIARES
// ---------------------------------------------------------

function GlassPanel({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`rounded-[2rem] border border-white/[0.08] bg-[#0a0a0a]/40 backdrop-blur-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(255,255,255,0.02)] relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/[0.08] to-transparent opacity-50" />
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}

function Badge({ icon: Icon, text }: { icon: any, text: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md text-[#FF6A00] shadow-[0_5px_15px_rgba(0,0,0,0.5),inset_0_0_15px_rgba(255,255,255,0.02)] transition-all hover:bg-[#FF6A00]/10 hover:border-[#FF6A00]/30 hover:shadow-[0_0_20px_rgba(255,106,0,0.2)] hover:scale-105 cursor-default group">
      <div className="bg-[#FF6A00]/10 p-1.5 rounded-full group-hover:bg-[#FF6A00]/20 transition-colors">
        <Icon className="w-3.5 h-3.5 text-[#FF6A00]" />
      </div>
      <span className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-white/90 group-hover:text-white transition-colors">{text}</span>
    </div>
  );
}

function FeatureItem({ icon: Icon, text }: { icon: any, text: string }) {
  return (
    <div className="flex items-center gap-4 group cursor-default">
      <div className="text-[#FF6A00] drop-shadow-[0_0_8px_rgba(255,106,0,0.5)]">
        <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </div>
      <span className="text-white/80 text-[15px] font-light group-hover:text-white transition-colors tracking-wide">{text}</span>
    </div>
  );
}

function ExpressionItem({ img, text }: { img: string, text: string }) {
  return (
    <div className="flex flex-col items-center gap-3 w-full py-2 group cursor-default">
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border border-[#FF6A00]/10 bg-black group-hover:border-[#FF6A00]/40 transition-colors shadow-[inset_0_0_20px_rgba(255,106,0,0.05)]">
        <Image src={img} alt={text} fill className="object-cover scale-[2.5] object-[center_10%] opacity-90 group-hover:opacity-100 group-hover:scale-[2.6] transition-all duration-500" />
      </div>
      <span className="text-white/50 text-[10px] uppercase tracking-widest font-medium group-hover:text-[#FF6A00] transition-colors text-center">
        {text}
      </span>
    </div>
  );
}

function FloatingCard({ delay, top, left, right, bottom, icon: Icon, title, desc, badge, mobile }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{ duration: 0.8, delay, type: "spring", bounce: 0.4 }}
      className={mobile ? "relative w-[80vw] sm:w-[300px] shrink-0 snap-center" : "absolute"}
      style={!mobile ? { top, left, right, bottom } : {}}
    >
      <GlassPanel className={`flex items-start gap-3 sm:gap-4 w-full hover:border-[#FF6A00]/30 hover:scale-105 transition-all cursor-default group mx-auto ${mobile ? 'p-4' : 'p-4 sm:p-5 max-w-[280px]'}`}>
        <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-xl border border-[#FF6A00]/40 bg-[#FF6A00]/10 flex items-center justify-center text-[#FF6A00] shadow-[0_0_20px_rgba(255,106,0,0.2)]">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="flex flex-col gap-1">
          <h4 className="text-[#FF6A00] text-[10px] sm:text-xs font-bold tracking-widest uppercase">{title}</h4>
          <p className="text-white/70 text-[10px] sm:text-xs font-light leading-relaxed pr-2">{desc}</p>
        </div>
        {badge && (
          <div translate="no" className="absolute -right-2 -top-2 sm:-right-3 sm:-top-3 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#FF6A00]/50 bg-black/80 flex items-center justify-center text-[#FF6A00] text-[10px] sm:text-xs font-bold shadow-[0_0_15px_rgba(255,106,0,0.3)]">
            {badge}
          </div>
        )}
      </GlassPanel>
    </motion.div>
  );
}
