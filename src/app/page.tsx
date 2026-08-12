"use client";

import { useState, useRef, MouseEvent, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import { Target, Zap, TrendingUp, Layers, ChevronDown, ArrowRight, Unlock, Check, MessageSquare } from "lucide-react";
import { Navbar } from "@/components/Navbar";

function SpotlightCard({ card, index, isActive }: { card: any, index: number, isActive: boolean }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  // Animação de ativação do card sincronizada com o scroll
  const cardVariants = {
    inactive: {
      borderColor: "rgba(255, 255, 255, 0.05)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.8)",
      backgroundColor: "rgba(10, 10, 10, 0.5)",
      transition: { duration: 0.3 }
    },
    active: {
      borderColor: "rgba(255, 106, 0, 1)", 
      boxShadow: "0 0 40px rgba(255, 106, 0, 0.4)", 
      backgroundColor: "#D95A00", 
      transition: { duration: 0.3 }
    }
  };

  const iconVariants = {
    inactive: {
      borderColor: "rgba(255, 255, 255, 0.1)",
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      boxShadow: "none",
      color: "#9ca3af", // zinc-400
      transition: { duration: 0.3 }
    },
    active: {
      borderColor: "rgba(255, 255, 255, 0.8)",
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      boxShadow: "0 0 30px rgba(255, 255, 255, 0.6)",
      color: "#ffffff", 
      transition: { duration: 0.3 }
    }
  };

  const textVariants = {
    inactive: { color: "#ffffff", transition: { duration: 0.3 } },
    active: { color: "#ffffff", transition: { duration: 0.3 } }
  };

  const descVariants = {
    inactive: { color: "#9ca3af", transition: { duration: 0.3 } }, 
    active: { color: "#ffffff", transition: { duration: 0.3 } } 
  };

  return (
    <motion.div 
      variants={cardVariants}
      animate={isActive ? "active" : "inactive"}
      initial="inactive"
      onMouseMove={handleMouseMove}
      className="group relative flex flex-col md:flex-row items-start md:items-center p-6 lg:p-6 rounded-3xl backdrop-blur-3xl border overflow-hidden transition-all duration-700 hover:border-nex-orange/30 hover:shadow-[0_8px_32px_rgba(255,106,0,0.15)] z-20 gap-4 md:gap-6"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-0"
        style={{
          background: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(255, 255, 255, 0.15), transparent 80%)`,
        }}
      />

      <motion.div 
        variants={iconVariants}
        className="w-12 h-12 shrink-0 rounded-full border flex items-center justify-center group-hover:border-white/60 group-hover:bg-white/20 transition-all duration-700 z-10"
      >
        <card.icon className="w-5 h-5 transition-colors duration-500" />
      </motion.div>
      
      <div className="flex-1 flex flex-col z-10">
        <motion.h3 variants={textVariants} className="text-lg font-bold uppercase tracking-widest mb-1 transition-colors duration-500">
          {card.title}
        </motion.h3>
        <motion.p variants={descVariants} className="text-xs leading-relaxed font-medium transition-colors duration-500">
          {card.description}
        </motion.p>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Controle do Splash Screen
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // O vídeo carrega em background. Após 2.5s, o splash sobe e revela o Hero.
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Estado para feixes de luz subindo (gerado apenas no client para evitar hydration mismatch)
  const [lightBeams, setLightBeams] = useState<Array<{left: string, height: string, duration: number, delay: number}>>([]);

  useEffect(() => {
    setLightBeams(Array.from({ length: 30 }).map(() => ({
      left: `${Math.random() * 100}%`,
      height: `${Math.random() * 40 + 20}%`,
      duration: Math.random() * 15 + 15, // Mais lento e cadenciado
      delay: Math.random() * 15,
    })));
  }, []);

  // Scroll lock removido para permitir navegação livre

  // Mapeia o scroll da seção para desenhar a linha e a bolinha
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "center center"] // O raio desenha completamente conforme você desce até o meio da seção
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const cards = [
    { title: "Estratégia", description: "Visão sistêmica para desenhar caminhos que realmente funcionam no mercado.", icon: Target },
    { title: "Tecnologia", description: "Arquitetura robusta para suportar o crescimento sem limites operacionais.", icon: Zap },
    { title: "Design", description: "Experiências premium que convertem pela clareza e autoridade estética.", icon: Layers },
    { title: "Crescimento", description: "Tração e escala fundamentadas em dados reais e execução implacável.", icon: TrendingUp }
  ];

  return (
    <main className="min-h-screen font-sans text-nex-white flex flex-col overflow-x-hidden relative">
      
      {/* SPLASH SCREEN (Animação de Entrada) */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div 
            className="fixed inset-0 z-[100] bg-[#050505] flex items-center justify-center overflow-hidden"
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Fundo do Splash (O mesmo padrão usado no Hero) */}
            <div 
              className="absolute inset-0 w-full h-full z-0 opacity-50 mix-blend-screen pointer-events-none"
              style={{ backgroundImage: "url('/fundo.jpeg')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] pointer-events-none" />

            {/* Logo Subindo */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ y: -300, scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="relative z-10 w-[280px] md:w-[360px] h-[100px]"
            >
              <Image 
                src="/logo-nex-neon.png" 
                alt="NEX Logo" 
                fill 
                className="object-contain drop-shadow-[0_0_30px_rgba(255,106,0,0.3)]" 
                priority 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar />
      
      {/* ========================================= */}
      {/* CAMADA AMBIENTAL GLOBAL (O NÚCLEO)        */}
      {/* ========================================= */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[#050505] shadow-[inset_0_0_200px_rgba(5,5,5,1)]">
        
        {/* Camada 1: Luzes Difusas em Movimento (Respiração do Sistema Global) */}
        <motion.div 
          className="absolute top-[10%] left-[-5%] w-[1200px] h-[600px] bg-nex-orange/[0.05] rounded-[100%] blur-[150px] pointer-events-none mix-blend-screen"
          animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.05, 1], x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-[10%] right-[-5%] w-[1000px] h-[500px] bg-white/[0.03] rounded-[100%] blur-[150px] pointer-events-none mix-blend-screen"
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1], x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        />

        {/* Camada 2: Ruído/Grain Orgânico para profundidade */}
        <div 
          className="absolute inset-0 w-full h-full opacity-30 mix-blend-overlay"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />

      </div>

      {/* SEÇÃO 1: A ENTRADA (Vídeo Full Screen) */}
      {/* SEÇÃO 1: A ENTRADA (Vídeo Full Screen) */}
      {/* SEÇÃO 1: HERO (Premium Split Screen) */}
      <section className="relative w-full min-h-[95vh] z-10 flex items-center justify-center pt-24 md:pt-0 overflow-hidden">
        
        {/* Fundo da Seção 1 (Sutil e profundo) */}
        <div 
          className="absolute inset-0 w-full h-full z-0 opacity-30 mix-blend-screen pointer-events-none"
          style={{ backgroundImage: "url('/fundo.jpeg')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] pointer-events-none" />

        {/* Foco de luz holográfica acompanhando o texto */}
        <div className="absolute top-1/2 left-[15%] -translate-y-1/2 w-[600px] h-[600px] bg-nex-orange/[0.04] rounded-[100%] blur-[120px] pointer-events-none z-0" />

        <div className="relative z-30 w-full max-w-[1300px] mx-auto px-4 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* ESQUERDA: COPY E CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="flex flex-col items-start text-left space-y-6"
          >
            <div className="inline-flex items-center space-x-3 px-4 py-1.5 rounded-full border border-nex-orange/30 bg-nex-orange/10 backdrop-blur-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-nex-orange animate-pulse" />
              <span className="text-nex-orange font-mono text-xs tracking-[0.2em] uppercase">O Padrão NEX</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white uppercase leading-[1.05] drop-shadow-2xl">
              A Engenharia <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-300 to-zinc-600">da Percepção</span>
            </h1>
            
            <p className="text-base md:text-lg text-zinc-300 font-light max-w-lg leading-relaxed drop-shadow-lg">
              Construímos ecossistemas digitais premium. Estratégia, design e tecnologia desenhados para posicionar e escalar empresas no mais alto nível do mercado.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto">
              {/* Botão Primário: Diagnóstico */}
              <button onClick={() => router.push("/ia")} className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/[0.03] backdrop-blur-[40px] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 text-white font-bold tracking-widest uppercase text-xs flex justify-center items-center transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group relative shadow-[0_15px_30px_rgba(0,0,0,0.2)]">
                <span className="relative z-10 flex items-center gap-2">
                  <Target className="w-4 h-4 text-nex-orange group-hover:scale-110 transition-transform" />
                  Fazer Diagnóstico
                </span>
                <div className="absolute inset-0 bg-white/5 -translate-x-[100%] group-hover:translate-x-0 transition-transform duration-700 ease-in-out rounded-2xl" />
              </button>

              {/* Botão Secundário: Agendar */}
              <button onClick={() => router.push("/ia")} className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-white/10 bg-transparent hover:bg-white/[0.04] text-zinc-300 font-bold tracking-widest uppercase text-xs flex justify-center items-center transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                Agendar Reunião
              </button>
            </div>
          </motion.div>

          {/* DIREITA: VÍDEO (Logo 3D) - Carregando no fundo desde o início */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 1.5, delay: 0.4 }}
            className="relative w-full aspect-video md:h-[600px] flex justify-center items-center mix-blend-screen"
          >
            {/* Altar de luz pulsante embaixo da logo */}
            <motion.div
              className="absolute bottom-[20%] w-[50%] h-[15px] bg-nex-orange/40 rounded-full blur-[30px]"
              animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.08, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover scale-110"
              style={{
                maskImage: 'radial-gradient(circle at center, black 40%, transparent 70%)',
                WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 70%)'
              }}
            >
              <source src="/hero.mp4" type="video/mp4" />
            </video>
          </motion.div>
          
        </div>
      </section>

      {/* SEÇÃO 2: SYSTEM STATUS */}
      <section ref={containerRef} className="relative z-30 w-full min-h-screen flex flex-col items-center justify-center bg-transparent py-48">
        
        {/* IMAGEM ORIGINAL DA SEÇÃO 2 */}
        <div 
          className="absolute inset-0 w-full h-full z-0 opacity-50 bg-cover bg-center bg-no-repeat pointer-events-none"
          style={{ backgroundImage: 'url(/section2-bg.jpg)' }}
        />
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#050505] via-transparent to-[#050505] z-10 pointer-events-none" />
        
        {/* OS 4 CARTÕES (Exatamente no meio da divisa entre Seção 1 e 2) */}
        <div className="relative lg:absolute lg:top-0 lg:-translate-y-1/2 left-0 w-full z-40 mt-12 lg:-mt-[5vh]">
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-[900px] mx-auto px-4 md:px-12 flex flex-col gap-4 lg:gap-0 lg:pb-[25vh]"
          >
            {cards.map((card, index) => {
              const thresholds = [0.72, 0.81, 0.90, 0.99]; 
              const topOffset = `calc(10vh + ${index * 25}px)`;
              return (
                <div 
                  key={index} 
                  className="w-full shrink-0 lg:sticky"
                  style={{ top: topOffset, zIndex: 10 + index }}
                >
                  <CardWrapper 
                    card={card} 
                    index={index} 
                    progress={scrollYProgress} 
                    threshold={thresholds[index]} 
                  />
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Palavra em Pé (Empilhada Verticalmente) movida para o CANTO INFERIOR da Seção 2 */}
        <div className="absolute bottom-12 left-4 pointer-events-none hidden lg:flex flex-col items-center justify-center leading-[0.75] opacity-[0.04] z-20">
            <span className="text-[10rem] xl:text-[12rem] font-black text-white">N</span>
            <span className="text-[10rem] xl:text-[12rem] font-black text-white">E</span>
            <span className="text-[10rem] xl:text-[12rem] font-black text-white">X</span>
          </div>

          {/* CONTEÚDO SUPERIOR: Card (No canto superior) */}
          <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 px-4 md:px-12 items-start mt-32 relative z-30">
            
            <motion.div 
              className="lg:col-start-1 lg:col-span-5 flex flex-col space-y-6"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              <motion.div 
                className="p-10 backdrop-blur-3xl bg-black/40 border-l border-t rounded-3xl relative overflow-hidden group shadow-2xl"
                animate={{ borderColor: ["rgba(255, 255, 255, 0.05)", "rgba(255, 106, 0, 0.4)", "rgba(255, 255, 255, 0.05)"] }}
                transition={{ duration: 4, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
              >
                {/* Lógica rígida e neon sutil */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
                
                {/* Orbe pulsante interno sincronizado com a borda */}
                <motion.div 
                  className="absolute -top-10 -right-10 w-40 h-40 blur-[60px] pointer-events-none"
                  animate={{ backgroundColor: ["rgba(255, 106, 0, 0)", "rgba(255, 106, 0, 0.3)", "rgba(255, 106, 0, 0)"] }}
                  transition={{ duration: 4, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
                />
                
                <h4 className="text-4xl font-black uppercase tracking-widest text-white mb-2 relative z-10">
                  Status<span className="text-nex-orange">.NEX_OS</span>
                </h4>
                <p className="text-zinc-500 font-mono text-xs tracking-[0.2em] mb-10 flex items-center relative z-10">
                  <span className="w-2 h-2 rounded-full bg-nex-orange animate-ping mr-3" />
                  [ RUNNING_OPTIMIZATION ]
                </p>
                
                <div className="space-y-6 relative z-10">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-full">
                      <div className="flex justify-between text-[10px] font-mono text-zinc-600 mb-2">
                        <span>CLUSTER_0{i}</span>
                        <span>{60 + (i * 12)}%</span>
                      </div>
                      <div className="w-full h-[2px] bg-white/5 overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-nex-orange/30 to-nex-orange"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${50 + (i * 15)}%` }}
                          transition={{ duration: 1.5, delay: i * 0.2 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* CONTEÚDO INFERIOR: A Frase Intercalada e Elemento Visual */}
          <div className="w-full max-w-[1400px] mx-auto px-4 md:px-12 mt-24 mb-48 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-30">
            
            {/* ESQUERDA: A Lente de Precisão (Método) */}
            <div className="hidden lg:flex lg:col-span-5 items-end justify-start relative top-72 pl-8 lg:pl-16">
              <motion.div 
                className="relative w-[350px] h-[350px] flex items-center justify-center group"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                {/* Glow radial sutil atrás da lente */}
                <div className="absolute inset-0 bg-nex-orange/5 rounded-full blur-[80px] group-hover:bg-nex-orange/10 transition-colors duration-1000" />
                
                {/* O Anel Principal (Lente) */}
                <motion.div 
                  className="absolute inset-0 rounded-full border border-white/[0.03] bg-white/[0.01] backdrop-blur-md shadow-[inset_0_0_40px_rgba(255,255,255,0.02)]"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                >
                  {/* SVG Estrutural */}
                  <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="48" fill="none" stroke="white" strokeWidth="0.15" strokeDasharray="1 3" />
                    <circle cx="50" cy="50" r="35" fill="none" stroke="white" strokeWidth="0.1" strokeDasharray="4 4" />
                    <line x1="50" y1="0" x2="50" y2="4" stroke="white" strokeWidth="0.5" />
                    <line x1="50" y1="100" x2="50" y2="96" stroke="white" strokeWidth="0.5" />
                    <line x1="0" y1="50" x2="4" y2="50" stroke="white" strokeWidth="0.5" />
                    <line x1="100" y1="50" x2="96" y2="50" stroke="white" strokeWidth="0.5" />
                    <path d="M 15 15 L 20 20" stroke="rgba(255,106,0,0.5)" strokeWidth="0.2" />
                    <path d="M 85 15 L 80 20" stroke="rgba(255,106,0,0.5)" strokeWidth="0.2" />
                    <path d="M 15 85 L 20 80" stroke="rgba(255,106,0,0.5)" strokeWidth="0.2" />
                    <path d="M 85 85 L 80 80" stroke="rgba(255,106,0,0.5)" strokeWidth="0.2" />
                  </svg>
                </motion.div>

                {/* Eixos Fixos (Crosshairs vazados) */}
                <div className="absolute w-[120%] h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
                <div className="absolute h-[120%] w-[1px] bg-gradient-to-b from-transparent via-white/[0.08] to-transparent" />
                
                {/* Núcleo Central */}
                <div className="relative z-10 w-12 h-12 border border-nex-orange/30 rounded-sm flex items-center justify-center backdrop-blur-sm bg-black/20">
                  <motion.div 
                    className="w-2 h-2 bg-nex-orange"
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  {/* Brackets do núcleo */}
                  <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-nex-orange" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-nex-orange" />
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-nex-orange" />
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-nex-orange" />
                </div>

                {/* HUD Textual Flutuante (Direita) */}
                <motion.div 
                  className="absolute top-[20%] right-[-15%] flex flex-col space-y-1"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 1 }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-white/50 rounded-full" />
                    <span className="text-[10px] font-mono text-zinc-400 tracking-widest uppercase">Target_Locked</span>
                  </div>
                  <div className="text-[8px] font-mono text-nex-orange tracking-[0.3em] pl-3">
                    LAT: 0.001MS
                  </div>
                </motion.div>
                
                {/* HUD Textual Flutuante (Esquerda) */}
                <motion.div 
                  className="absolute bottom-[20%] left-[-15%] flex flex-col space-y-1 text-right"
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 1 }}
                >
                  <div className="flex items-center justify-end space-x-2">
                    <span className="text-[10px] font-mono text-zinc-400 tracking-widest uppercase">Method_Opt</span>
                    <div className="w-1 h-1 bg-white/50 rounded-full" />
                  </div>
                  <div className="text-[8px] font-mono text-nex-orange tracking-[0.3em] pr-3">
                    100% PURE
                  </div>
                </motion.div>
            </motion.div>
          </div>

            {/* DIREITA: O Texto */}
            <motion.div 
              className="lg:col-start-7 lg:col-span-6 flex flex-col justify-center text-right space-y-6"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
            >
              <h3 className="text-5xl lg:text-[5.5rem] font-black tracking-tighter text-white leading-[0.85] uppercase">
                Menos<br/>Opinião.<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-nex-orange to-[#FF9040]">Mais<br/>Método.</span>
              </h3>
              
              <div className="w-full flex justify-end mt-12">
                <p className="text-lg text-zinc-400 font-medium max-w-sm border-r-2 border-nex-orange/40 pr-6 py-2 leading-relaxed">
                  A experiência não deve impressionar apenas pela estética. Ela deve convencer pela absoluta clareza estrutural.
                </p>
              </div>
            </motion.div>
          </div>

          {/* INDICADOR DE SCROLL (Premium Line Indicator) */}
          <motion.div 
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center cursor-pointer z-30 group"
            onClick={() => {
              window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
            }}
          >
            <span className="text-[9px] font-mono tracking-[0.4em] uppercase mb-4 text-zinc-500 group-hover:text-nex-orange transition-colors duration-500">
              Scroll
            </span>
            <div className="w-[1px] h-16 bg-white/10 relative overflow-hidden">
              <motion.div 
                className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-nex-orange to-transparent"
                animate={{ y: ["-100%", "200%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </motion.div>
      </section>

      {/* NOVA SEÇÃO 3: Infraestrutura Silenciosa (Estética Arc/Stripe/VisionOS) */}
      <section id="infra" className="relative z-10 w-full min-h-screen px-6 md:px-12 py-32 flex flex-col items-center justify-center overflow-hidden">
        
        {/* ================== AMBIENTE OPERACIONAL (FUNDO EXCLUSIVO DA SEÇÃO 3) ================== */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          {/* 1. Base Preta Profunda */}
          <div className="absolute inset-0 bg-[#050505]" />

          {/* 2. Grid Inteligente (Estruturas Irregulares / Blueprints) */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
            <pattern id="smart-grid" width="200" height="200" patternUnits="userSpaceOnUse">
              <path d="M 100 95 L 100 105 M 95 100 L 105 100" stroke="white" strokeWidth="0.5" fill="none" />
              <path d="M 198 198 L 202 202 M 202 198 L 198 202" stroke="white" strokeWidth="0.2" fill="none" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#smart-grid)" />
            
            {/* Eixos Estruturais */}
            <line x1="0" y1="20%" x2="100%" y2="20%" stroke="white" strokeWidth="0.2" strokeDasharray="5 15" />
            <line x1="0" y1="75%" x2="100%" y2="75%" stroke="white" strokeWidth="0.2" />
            <line x1="15%" y1="0" x2="15%" y2="100%" stroke="white" strokeWidth="0.2" />
            
            {/* Módulos Fantasmas */}
            <rect x="25%" y="30%" width="15%" height="20%" fill="none" stroke="white" strokeWidth="0.1" strokeDasharray="2 4" />
            <rect x="75%" y="60%" width="10%" height="15%" fill="none" stroke="white" strokeWidth="0.15" />
          </svg>

          {/* 3. Iluminação Natural e Difusa (Multi-color) */}
          <motion.div 
            className="absolute -bottom-[20%] -right-[10%] w-[1200px] h-[800px] bg-nex-orange/[0.04] rounded-[100%] blur-[150px]"
            animate={{ scale: [1, 1.05, 1], opacity: [0.6, 0.9, 0.6], x: [0, -30, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute -top-[10%] -left-[10%] w-[900px] h-[600px] bg-[#005f73]/[0.05] rounded-[100%] blur-[150px]"
            animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4], y: [0, 40, 0] }}
            transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          />
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-white/[0.015] rounded-[100%] blur-[100px]"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* 4. Vinheta (Escurecimento Cinemático das Bordas) */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.85)_100%)]" />

          {/* 5. Ruído Fotográfico (Grain) Muito Discreto */}
          <div 
            className="absolute inset-0 w-full h-full opacity-[0.03] mix-blend-screen pointer-events-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
          />

          {/* 6. Feixes de Luz Subindo (Data Streams) - Exclusivo da Seção 3 */}
          <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
            {lightBeams.map((beam, i) => (
              <motion.div
                key={i}
                className="absolute bottom-0 w-[1px] bg-gradient-to-t from-transparent via-nex-orange/40 to-transparent"
                style={{
                  left: beam.left,
                  height: beam.height,
                }}
                animate={{
                  y: ["100%", "-200%"],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: beam.duration,
                  repeat: Infinity,
                  ease: "linear",
                  delay: beam.delay,
                }}
              />
            ))}
          </div>

        </div>
        {/* ============================================================================== */}

        <div className="max-w-[1200px] mx-auto w-full relative z-10 flex flex-col items-center justify-center">
          
          <motion.div 
            className="flex flex-col items-center text-center space-y-4 mb-20 w-full"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center w-full max-w-2xl space-x-4 mb-6 relative">
              {/* Linha esquerda animada (Data Stream) */}
              <div className="relative flex-1 h-[1px] bg-white/[0.05] overflow-hidden">
                <motion.div 
                  className="absolute inset-0 w-[50%] h-full bg-gradient-to-r from-transparent via-nex-orange/60 to-transparent"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              </div>
              
              {/* Badge Silêncio Operacional */}
              <motion.div 
                className="flex items-center px-5 py-2 border border-white/5 bg-black/40 backdrop-blur-md rounded-full shadow-[0_0_30px_rgba(255,106,0,0.05)] relative overflow-hidden group"
                animate={{ borderColor: ["rgba(255,255,255,0.05)", "rgba(255,106,0,0.3)", "rgba(255,255,255,0.05)"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-nex-orange animate-ping mr-3" />
                <span className="text-zinc-400 font-mono text-[10px] tracking-[0.4em] uppercase">
                  Silêncio Operacional
                </span>
              </motion.div>

              {/* Linha direita animada (Data Stream) */}
              <div className="relative flex-1 h-[1px] bg-white/[0.05] overflow-hidden">
                <motion.div 
                  className="absolute inset-0 w-[50%] h-full bg-gradient-to-r from-transparent via-nex-orange/60 to-transparent"
                  animate={{ x: ["200%", "-100%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1.5 }}
                />
              </div>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white/90 mb-6 leading-[1.1]">
              Existe uma operação complexa acontecendo nos bastidores.<br/>
              <span className="text-zinc-600">Mas você enxerga apenas clareza.</span>
            </h2>
          </motion.div>

          <StackedMethodCards />

        </div>
      </section>
      {/* ========================================================================================= */}
      {/* SEÇÃO 4: A DOR VS. A SOLUÇÃO (SALES BLOCK)                                                */}
      {/* ========================================================================================= */}
      <section id="metodo" className="relative z-20 w-full min-h-screen py-20 md:py-32 flex flex-col items-center justify-center bg-[#050505] overflow-hidden">
        
        {/* Imagem de Fundo (Super Sutil) */}
        <div 
          className="absolute inset-0 w-full h-full z-0 opacity-10 mix-blend-luminosity pointer-events-none grayscale"
          style={{ backgroundImage: "url('/fundo.jpeg')", backgroundSize: "cover", backgroundPosition: "center" }}
        />
        
        {/* Vignette para escurecer as bordas da foto */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)] pointer-events-none" />

        {/* 6. Feixes de Luz Subindo (Data Streams) - Adicionado à Seção 4 */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          {lightBeams.map((beam, i) => (
            <motion.div
              key={i}
              className="absolute bottom-0 w-[1px] bg-gradient-to-t from-transparent via-nex-orange/40 to-transparent"
              style={{
                left: beam.left,
                height: beam.height,
              }}
              animate={{
                y: ["100%", "-200%"],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: beam.duration,
                repeat: Infinity,
                ease: "linear",
                delay: beam.delay,
              }}
            />
          ))}
        </div>

        <div className="w-full max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center">
          
          {/* O PROBLEMA (A DOR) */}
          <motion.div 
            className="flex flex-col items-center text-center space-y-8 max-w-3xl mb-16 md:mb-24 bg-white/[0.02] backdrop-blur-[40px] p-8 md:p-14 rounded-[2rem] md:rounded-[3rem] border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="px-5 py-2 rounded-full border border-white/5 bg-white/[0.02] text-[10px] font-mono tracking-[0.2em] text-zinc-500 uppercase">
              O Mercado Padrão
            </div>
            
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-zinc-400 leading-[1.2]">
              Cansado de agências que <br/>
              <span className="text-zinc-600 line-through decoration-zinc-800">prometem muito</span>, <br/>
              falham na qualidade e pecam na entrega?
            </h2>
            
            <p className="text-base text-zinc-500 font-light max-w-xl leading-relaxed">
              Enquanto o mercado entrega templates genéricos e promessas vazias, sua empresa perde autoridade e dinheiro a cada clique frustrado.
            </p>
          </motion.div>

          {/* DIVISOR (A TRANSIÇÃO) */}
          <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-white/10 to-nex-orange/30 mb-24 relative" />

          {/* A SOLUÇÃO (NEX) */}
          <motion.div 
            className="flex flex-col items-center text-center space-y-10 max-w-4xl relative"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            {/* Brilho radial muito sutil de fundo para destacar o texto */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-nex-orange/5 rounded-[100%] blur-[120px] pointer-events-none -z-10" />

            <div className="px-5 py-2 rounded-full border border-nex-orange/20 bg-nex-orange/5 text-[10px] font-mono tracking-[0.2em] text-nex-orange uppercase flex items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-nex-orange animate-ping mr-3 shadow-[0_0_15px_rgba(255,106,0,1)]" />
              O Padrão NEX
            </div>
            
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase leading-[1] md:leading-[1]">
              Nós não somos<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-nex-orange to-[#FF9040] drop-shadow-[0_0_40px_rgba(255,106,0,0.4)]">uma agência.</span>
            </h2>
            
            <p className="text-xl md:text-3xl text-zinc-300 font-light max-w-3xl leading-relaxed mt-4">
              Somos uma infraestrutura de resultados. Construímos ecossistemas digitais onde <strong className="font-semibold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">a precisão técnica convence e a estética converte.</strong>
            </p>

            {/* CALL TO ACTION (CTA) */}
            <motion.div 
              className="mt-12"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button onClick={() => router.push("/ia")} className="group relative px-14 py-6 rounded-full bg-black/40 backdrop-blur-3xl border border-nex-orange/50 text-nex-orange hover:bg-nex-orange hover:text-black font-black tracking-[0.2em] uppercase text-sm flex items-center space-x-4 overflow-hidden transition-all duration-500 shadow-[0_0_40px_rgba(255,106,0,0.2)] hover:shadow-[0_0_60px_rgba(255,106,0,0.6)]">
                <span className="relative z-10 transition-colors duration-500">Mudar o Padrão</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-2 transition-transform duration-500" />
              </button>
            </motion.div>
          </motion.div>

        </div>
      </section>
      
      {/* ========================================================================================= */}
      {/* SEÇÃO 4.5: CONHEÇA O HAVI (INTELIGÊNCIA ARTIFICIAL NEX)                                     */}
      {/* ========================================================================================= */}
      <section className="relative z-20 w-full min-h-screen py-20 lg:py-32 flex flex-col items-center justify-center bg-[#030303] overflow-hidden border-t border-white/[0.02]">
        {/* Luz de Fundo Holográfica */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] lg:w-[800px] lg:h-[500px] bg-nex-orange/5 rounded-[100%] blur-[80px] lg:blur-[120px] pointer-events-none z-0" />
        
        <div className="w-full max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">
          
          {/* Texto (Esquerda) */}
          <div className="flex-1 flex flex-col space-y-6 lg:space-y-8 text-left max-w-2xl w-full">
            <div className="flex items-center gap-3 lg:gap-4 text-nex-orange tracking-[0.2em] uppercase text-xs lg:text-sm font-bold">
              <span className="w-6 lg:w-10 h-[1px] bg-nex-orange shadow-[0_0_10px_rgba(255,106,0,0.8)]" />
              NEX AI SYSTEM
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[1.1]">
              CONHEÇA O <span className="block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-nex-orange to-[#FF9040] drop-shadow-[0_0_20px_rgba(255,106,0,0.3)]">HAVI.</span>
            </h2>
            
            <p className="text-zinc-400 text-base sm:text-lg lg:text-xl font-light leading-relaxed">
              O futuro da sua empresa não pode depender de suposições. Apresentamos nossa Inteligência Artificial exclusiva, projetada para analisar, otimizar e escalar suas conversões com precisão matemática.
            </p>
            
            <ul className="space-y-3 lg:space-y-4 pt-2 lg:pt-4">
              {[
                "Análise preditiva de funis de vendas",
                "Geração instantânea de estratégias",
                "Otimização de processos complexos"
              ].map((item, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="flex items-center gap-3 lg:gap-4 text-zinc-300"
                >
                  <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-nex-orange/10 border border-nex-orange/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,106,0,0.15)]">
                    <Check className="w-3 h-3 lg:w-4 lg:h-4 text-nex-orange" />
                  </div>
                  <span className="font-light tracking-wide text-sm lg:text-base">{item}</span>
                </motion.li>
              ))}
            </ul>

            <div className="pt-6 lg:pt-10 flex w-full">
              <button onClick={() => router.push("/havi")} className="w-full sm:w-auto group relative px-8 lg:px-10 py-4 lg:py-5 rounded-full bg-white/[0.02] backdrop-blur-3xl border border-white/10 text-white hover:bg-white/[0.06] hover:border-nex-orange/40 transition-all duration-500 flex items-center justify-between sm:justify-start space-x-6 overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(255,106,0,0.2)]">
                <span className="relative z-10 font-bold tracking-[0.1em] lg:tracking-[0.15em] uppercase text-xs lg:text-sm">Conhecer o Havi</span>
                <div className="relative z-10 w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-nex-orange/20 flex items-center justify-center group-hover:bg-nex-orange transition-colors duration-500 border border-nex-orange/30 group-hover:border-nex-orange overflow-hidden shrink-0">
                  <Image src="/ravi-avatar.png" alt="Havi" width={24} height={24} className="object-cover rounded-full group-hover:scale-110 transition-transform duration-500 w-full h-full p-1" />
                </div>
              </button>
            </div>
          </div>

          {/* Visual Havi (Direita) */}
          <div className="flex-1 flex justify-center lg:justify-end relative w-full max-w-[350px] sm:max-w-[450px] mx-auto mt-8 lg:mt-0">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, type: "spring", bounce: 0.4 }}
              className="relative w-full aspect-square"
            >
              {/* Efeitos de Fundo do Avatar */}
              <div className="absolute inset-0 bg-nex-orange/10 blur-[50px] lg:blur-[80px] rounded-full animate-pulse" />
              <div className="absolute inset-2 lg:inset-4 bg-black/60 backdrop-blur-3xl rounded-full border border-white/5 shadow-[inset_0_0_100px_rgba(255,106,0,0.05)]" />
              
              {/* Órbitas */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-nex-orange/20"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute inset-6 lg:inset-8 rounded-full border border-white/10 border-l-nex-orange/40"
              />
              
              {/* Ponto orbitando */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 z-20"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-nex-orange shadow-[0_0_15px_rgba(255,106,0,1)]" />
              </motion.div>

              {/* Avatar Central (Pop-out 3D Effect) */}
              <div className="absolute inset-0 rounded-full flex items-center justify-center pointer-events-none z-30">
                <div className="relative w-[120%] h-[120%] lg:w-[130%] lg:h-[130%]">
                  <Image 
                    src="/havi-full.png" 
                    alt="Havi AI" 
                    fill
                    className="object-contain hover:scale-105 transition-transform duration-700 drop-shadow-[0_20px_40px_rgba(255,106,0,0.4)]"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================================================= */}
      {/* SEÇÃO 5: O CHECKMATE (OFERTA DE DIAGNÓSTICO FINAL)                                        */}
      {/* ========================================================================================= */}
      <section id="resultados" className="relative z-20 w-full py-32 flex flex-col items-center justify-center bg-[#010101] overflow-hidden">
        
        {/* IMAGEM DE FUNDO DA SEÇÃO 5 (Aparente e Viva) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image 
            src="/fundo.jpeg" 
            alt="NEX Environment" 
            fill 
            className="object-cover opacity-100" 
          />
          {/* Leve fade no topo e na base para não quebrar o layout, mas mantendo a imagem viva no centro */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#010101] via-transparent to-[#010101] opacity-70" />
          <div className="absolute inset-0 bg-black/40" /> {/* Uma camada de sombra sutil para a leitura do texto */}
        </div>

        {/* Glow de escaneamento de fundo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-white/[0.02] rounded-[100%] blur-[100px] pointer-events-none z-0" />

        <div className="w-full max-w-[1200px] mx-auto px-4 md:px-12 relative z-10">
          
          <motion.div 
            className="w-full relative rounded-[2.5rem] bg-white/[0.02] backdrop-blur-[40px] border border-white/10 overflow-hidden p-6 md:p-16 lg:p-20 shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            {/* Scanner line effect inside the card */}
            <motion.div 
              className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-nex-orange/40 to-transparent"
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              {/* ESQUERDA: O Texto do Checkmate */}
              <div className="flex flex-col space-y-6 relative z-10">
                <div className="inline-flex items-center space-x-3 text-zinc-500 font-mono text-[10px] tracking-[0.2em] uppercase">
                  <Unlock className="w-4 h-4 text-nex-orange" />
                  <span>Acesso Desbloqueado</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white leading-[1.1] uppercase">
                  Você chegou até aqui. <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 to-zinc-700">Isso não é por acaso.</span>
                </h2>
                
                <p className="text-lg text-zinc-400 font-light leading-relaxed">
                  Se você leu até o final, é porque sabe que sua empresa merece mais do que o padrão. 
                  Como recompensa, liberamos um <strong className="text-white font-medium">Diagnóstico Estratégico Gratuito</strong>.
                </p>
                <p className="text-sm text-zinc-500 font-light leading-relaxed border-l-2 border-nex-orange/30 pl-4">
                  Não é uma ligação genérica de vendas. Você sairá com direções práticas e um mapa exato de como aplicar o Método NEX para escalar suas conversões imediatamente.
                </p>
              </div>

              {/* DIREITA: O Terminal de Acesso */}
              <div className="relative z-10 flex flex-col items-center lg:items-end justify-center w-full">
                <div className="w-full max-w-sm rounded-[2rem] border border-white/10 bg-white/[0.02] backdrop-blur-xl p-8 relative overflow-hidden group shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
                  {/* Fundo dinâmico do terminal */}
                  <div className="absolute inset-0 bg-gradient-to-br from-nex-orange/[0.02] to-transparent" />
                  
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="w-2 h-2 rounded-full bg-nex-orange animate-pulse" />
                    <span className="text-nex-orange font-mono text-xs tracking-widest uppercase">System.Ready</span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">Solicitar Diagnóstico</h3>
                  <p className="text-xs text-zinc-500 font-mono mb-8">Limitado à capacidade da equipe técnica.</p>

                  <button onClick={() => router.push("/ia")} className="w-full relative py-4 rounded-xl bg-gradient-to-r from-nex-orange to-[#FF9040] text-black font-bold tracking-widest uppercase text-sm flex justify-center items-center overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]">
                    <span className="relative z-10">Garantir Minha Vaga</span>
                    {/* Brilho hover */}
                    <div className="absolute inset-0 bg-white/20 -translate-x-[100%] group-hover:translate-x-0 transition-transform duration-500 ease-in-out" />
                  </button>

                  <div className="mt-6 flex justify-between items-center text-[9px] font-mono text-zinc-600 uppercase border-t border-white/[0.05] pt-4">
                    <span>Custo: 0.00</span>
                    <span>Status: Aguardando Ação</span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </section>
      {/* ========================================================================================= */}
      {/* SEÇÃO 6: RODAPÉ (FOOTER INSTITUCIONAL)                                                    */}
      {/* ========================================================================================= */}
      <footer className="relative w-full min-h-[80vh] py-24 flex flex-col items-center justify-end bg-[#020202] overflow-hidden border-t border-white/[0.05]">
        
        {/* ELEMENTOS DE FUNDO (Grid e Ruído - Padrão NEX) */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          {/* Grid Inteligente */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <pattern id="footer-grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 50 48 L 50 52 M 48 50 L 52 50" stroke="white" strokeWidth="0.5" fill="none" />
              <path d="M 98 98 L 102 102 M 102 98 L 98 102" stroke="white" strokeWidth="0.2" fill="none" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#footer-grid)" />
          </svg>
          {/* Ruído Sutil */}
          <div 
            className="absolute inset-0 w-full h-full opacity-[0.02] mix-blend-screen"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
          />
        </div>



        {/* CONTEÚDO DO RODAPÉ (Flutuando sobre o holograma) */}
        <div className="w-full max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col items-center z-10 mt-auto relative">
          
          <h4 className="text-white text-xl md:text-2xl tracking-[0.4em] uppercase font-light mb-16 text-center drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            A Engenharia da Percepção
          </h4>

          {/* Grid Institucional com Glassmorphism sutil */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 border-t border-white/10 pt-16 pb-12 bg-black/20 backdrop-blur-sm rounded-t-3xl px-8">
            <div className="flex flex-col space-y-5 items-center md:items-start text-center md:text-left">
              <span className="text-zinc-500 font-mono text-[11px] tracking-[0.2em] uppercase">Navegação</span>
              <a href="/" className="text-sm text-zinc-300 hover:text-white hover:tracking-wide transition-all duration-300">Início</a>
              <a href="/ia" className="text-sm text-zinc-300 hover:text-white hover:tracking-wide transition-all duration-300">Fale com o Havi</a>
              <a href="/ia" className="text-sm text-zinc-300 hover:text-white hover:tracking-wide transition-all duration-300">Solicitar Diagnóstico</a>
              <a href="/links" className="text-sm text-zinc-300 hover:text-white hover:tracking-wide transition-all duration-300">Todos os Links</a>
            </div>

            <div className="flex flex-col space-y-5 items-center md:items-start text-center md:text-left">
              <span className="text-zinc-500 font-mono text-[11px] tracking-[0.2em] uppercase">Contato</span>
              <a href="mailto:falecom@nex.com.br" className="text-sm text-zinc-300 hover:text-white transition-colors">falecom@nex.com.br</a>
              <span className="text-sm text-zinc-300">São Paulo, SP</span>
            </div>

            <div className="flex flex-col space-y-5 items-center md:items-start text-center md:text-left">
              <span className="text-zinc-500 font-mono text-[11px] tracking-[0.2em] uppercase">Social</span>
              <a href="https://instagram.com/suaconta" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-300 hover:text-nex-orange hover:tracking-wide transition-all duration-300">Instagram</a>
              <a href="https://linkedin.com/company/nex" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-300 hover:text-nex-orange hover:tracking-wide transition-all duration-300">LinkedIn</a>
            </div>
          </div>

          {/* Assinatura Final */}
          <div className="w-full flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-zinc-500 tracking-[0.1em] uppercase border-t border-white/5 pt-8 pb-4">
            <span>&copy; {new Date().getFullYear()} NEX. Todos os direitos reservados.</span>
            <span className="mt-4 md:mt-0 flex items-center bg-white/[0.03] px-3 py-1.5 rounded-full border border-white/5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-2 shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
              Operando em estabilidade máxima
            </span>
          </div>

        </div>
      </footer>

    </main>
  );
}

function CardWrapper({ card, index, progress, threshold }: any) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    return progress.on("change", (latest: number) => {
      if (latest >= threshold && !isActive) setIsActive(true);
      if (latest < threshold && isActive) setIsActive(false);
    });
  }, [progress, threshold, isActive]);

  return (
    <SpotlightCard card={card} index={index} isActive={isActive} />
  );
}

function StackedMethodCards() {
  const methods = [
    {
      icon: Zap,
      title: "Performance",
      desc: "60 frames por segundo. Latência quase zero. A precisão técnica comunica inteligência e estabilidade antes da primeira palavra."
    },
    {
      icon: Layers,
      title: "Arquitetura",
      desc: "Fundações sólidas e modulares. Projetamos ecossistemas hiper-escaláveis onde o crescimento não rompe os limites operacionais."
    },
    {
      icon: Target,
      title: "Conversão",
      desc: "Cada decisão visual é fundamentada em dados de uso. Otimizamos fluxos para transformar meros visitantes em participantes."
    }
  ];

  return (
    <div className="relative w-full max-w-[900px] mx-auto flex flex-col gap-6 md:gap-0 md:pb-[30vh] mt-10 z-30">
      {methods.map((item, index) => {
        // Offset progressivo para o sticky formar um 'baralho'
        const topOffset = `calc(20vh + ${index * 30}px)`;
        
        return (
          <motion.div 
            key={index}
            className="group relative p-6 md:p-8 rounded-[2rem] bg-[#0A0A0A]/90 border border-white/[0.04] backdrop-blur-3xl overflow-hidden shadow-[0_-15px_40px_rgba(0,0,0,0.4)] md:sticky transition-all duration-700 hover:bg-[#0C0C0C] hover:border-white/[0.08]"
            style={{ 
              top: topOffset,
              zIndex: 10 + index
            }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            {/* Linha reflexo no topo */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent opacity-50" />
            
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-center shrink-0 group-hover:bg-white/[0.05] transition-all duration-500 shadow-[inset_0_0_15px_rgba(255,255,255,0.02)]">
                <item.icon className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors duration-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-medium tracking-wide text-white/90 mb-2 group-hover:text-white transition-colors duration-500">
                  {item.title}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed font-light group-hover:text-zinc-400 transition-colors duration-500">
                  {item.desc}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
