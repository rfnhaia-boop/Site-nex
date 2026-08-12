"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import Image from "next/image";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import {
  Plus,
  ArrowUp,
  SlidersHorizontal,
  Mic,
  AudioLines,
  Trash2,
  Pause,
  Play,
  Square,
  X,
  TrendingUp,
  BrainCircuit,
  Target,
  Lightbulb
} from "lucide-react";

export function GlassIconButton({ icon: Icon, onClick, className = "", iconClassName = "" }: { icon: any, onClick?: () => void, className?: string, iconClassName?: string }) {
  return (
    <button 
      type="button"
      onClick={onClick}
      className={`w-10 h-10 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:bg-white/[0.08] hover:border-white/20 transition-all hover:scale-105 active:scale-95 shadow-[0_4px_10px_rgba(0,0,0,0.2)] ${className}`}
    >
      <Icon className={`w-4 h-4 ${iconClassName}`} />
    </button>
  );
}

export function PopupMenuItem({ icon: Icon, label, onClick }: { icon: any, label: string, onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-left group">
      <Icon className="w-4 h-4 text-zinc-400 group-hover:text-nex-orange transition-colors shrink-0" />
      <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors leading-tight">{label}</span>
    </button>
  );
}

const QUICK_SKILLS = [
  {
    icon: TrendingUp,
    label: "Plano de Crescimento",
    section: "plano-crescimento",
    text: "Quero um plano de crescimento prático pra minha empresa.",
  },
  {
    icon: BrainCircuit,
    label: "Análise de IA",
    section: "analise-ia",
    text: "Quero uma análise real de como minha empresa está posicionada digitalmente e onde a IA pode ajudar.",
  },
  {
    icon: Target,
    label: "Raio-X de Funil",
    section: "raio-x-funil",
    text: "Quero entender onde meu funil de vendas está perdendo clientes.",
  },
  {
    icon: Lightbulb,
    label: "Ajudar com algo Específico",
    section: "",
    text: "Tenho uma dúvida específica sobre a NEX.",
  },
];

interface ChatComposerProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  isStreaming: boolean;
  onHaviClick?: () => void;
  onSettingsClick?: () => void;
  settingsMenuContent?: React.ReactNode;
  // Quando informado, os atalhos do menu "+" ativam a skill de verdade (guiada, com currentSection
  // certo) em vez de só mandar o texto solto. Sem isso, cai no fallback sendQuickOption abaixo.
  onQuickSkill?: (text: string, section: string) => void;
}

export default function ChatComposer({
  value,
  onChange,
  onSubmit,
  isStreaming,
  onHaviClick,
  onSettingsClick,
  settingsMenuContent,
  onQuickSkill,
}: ChatComposerProps) {
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState("00:00");
  const [speechSupported, setSpeechSupported] = useState(true);
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const [showSettingsInternal, setShowSettingsInternal] = useState(false);
  const uploadMenuRef = useRef<HTMLDivElement>(null);
  const settingsMenuRef = useRef<HTMLDivElement>(null);
  // Ditado por voz de verdade via Web Speech API — sem isso, o botão de mic só
  // mostrava uma animação de onda falsa e não gravava nada de fato.
  const recognitionRef = useRef<any>(null);
  const baseTextRef = useRef("");

  useEffect(() => {
    const SpeechRecognitionCtor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSpeechSupported(!!SpeechRecognitionCtor);
  }, []);

  function createRecognition() {
    const SpeechRecognitionCtor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "pt-BR";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      onChange([baseTextRef.current, transcript].filter(Boolean).join(" "));
    };
    recognition.onerror = () => {
      setIsRecordingAudio(false);
      setIsPaused(false);
    };
    return recognition;
  }

  function startRecording() {
    if (!speechSupported || isStreaming) return;
    baseTextRef.current = value.trim();
    const recognition = createRecognition();
    recognitionRef.current = recognition;
    recognition.start();
    setIsRecordingAudio(true);
    setIsPaused(false);
  }

  function togglePauseRecording() {
    if (isPaused) {
      baseTextRef.current = value.trim();
      const recognition = createRecognition();
      recognitionRef.current = recognition;
      recognition.start();
      setIsPaused(false);
    } else {
      recognitionRef.current?.stop();
      setIsPaused(true);
    }
  }

  function stopRecording() {
    if (recognitionRef.current) {
      recognitionRef.current.onresult = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecordingAudio(false);
    setIsPaused(false);
  }

  function cancelRecording() {
    if (recognitionRef.current) {
      recognitionRef.current.onresult = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    onChange(baseTextRef.current);
    setIsRecordingAudio(false);
    setIsPaused(false);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (uploadMenuRef.current && !uploadMenuRef.current.contains(event.target as Node)) {
        setShowUploadMenu(false);
      }
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target as Node)) {
        setShowSettingsInternal(false);
      }
    }
    if (showUploadMenu || showSettingsInternal) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUploadMenu, showSettingsInternal]);

  useEffect(() => {
    let interval: any;
    if (isRecordingAudio) {
      let seconds = 0;
      interval = setInterval(() => {
        seconds++;
        const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
        const secs = (seconds % 60).toString().padStart(2, "0");
        setRecordingTime(`${mins}:${secs}`);
      }, 1000);
    } else {
      setRecordingTime("00:00");
    }
    return () => clearInterval(interval);
  }, [isRecordingAudio]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const sendQuickOption = (option: string) => {
    onChange(option);
    setShowUploadMenu(false);
    // Timeout to let state update before submitting
    setTimeout(() => {
      onSubmit();
    }, 50);
  };

  const handleQuickSkill = (text: string, section: string) => {
    setShowUploadMenu(false);
    if (onQuickSkill) {
      onQuickSkill(text, section);
    } else {
      sendQuickOption(text);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative w-full rounded-[2rem] sm:rounded-[3.5rem] bg-[#050505]/80 backdrop-blur-3xl border border-white/10 flex flex-col justify-between group transition-all duration-500"
      style={{ 
        boxShadow: '0 20px 50px rgba(0,0,0,0.8), inset 0 1px 0px rgba(255,255,255,0.1), inset 0 -2px 15px -2px rgba(255,106,0,0.4)' 
      }}
    >
      {/* Ondas Orgânicas de Luz Animadas (JavaScript/Framer Motion) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2rem] sm:rounded-[3.5rem]">
        {/* Núcleo de luz animado 1 */}
        <motion.div 
          animate={{ 
            x: ["-5%", "5%", "-5%"],
            opacity: [0.08, 0.15, 0.08],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/2 -left-1/4 w-[150%] h-[200%] bg-[radial-gradient(ellipse_at_center,rgba(255,106,0,0.6)_0%,transparent_50%)] blur-[40px] mix-blend-screen"
        />
        
        {/* Núcleo de luz animado 2 */}
        <motion.div 
          animate={{ 
            x: ["5%", "-5%", "5%"],
            opacity: [0.05, 0.1, 0.05],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-1/2 -right-1/4 w-[120%] h-[150%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15)_0%,transparent_50%)] blur-[40px] mix-blend-screen"
        />
      </div>
      
      {/* Borda Glow (Aparece no topo) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-nex-orange/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <div className="relative z-10 w-full flex-1 rounded-t-[2rem] sm:rounded-t-[3.5rem] flex flex-col justify-center min-h-[72px]">
      
      {!isRecordingAudio ? (
        <div className="w-full flex flex-col h-full">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="O que vamos otimizar hoje?"
            disabled={isStreaming}
            className="w-full bg-transparent border-none outline-none text-white placeholder-zinc-500 px-6 sm:px-9 pt-5 sm:pt-6 pb-2 text-base sm:text-lg font-light resize-none tracking-wide [&::-webkit-scrollbar]:hidden disabled:opacity-60 relative z-10"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            rows={1}
          />
          <div className="relative z-10 flex justify-between items-end w-full px-5 sm:px-7 pb-4 pt-1">
            {/* Left Icons */}
            <div className="flex items-center gap-2 sm:gap-3 relative">
              {/* Plus Button with Upload Popup */}
              <div className="relative" ref={uploadMenuRef}>
                <GlassIconButton icon={Plus} onClick={() => setShowUploadMenu(!showUploadMenu)} />
                {showUploadMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute bottom-full left-0 mb-6 w-64 rounded-[1.5rem] bg-[#0a0a0a]/90 backdrop-blur-[40px] border border-white/10 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(255,255,255,0.02)] z-50 flex flex-col gap-1"
                  >
                    {QUICK_SKILLS.map((skill) => (
                      <PopupMenuItem
                        key={skill.label}
                        icon={skill.icon}
                        label={skill.label}
                        onClick={() => handleQuickSkill(skill.text, skill.section)}
                      />
                    ))}
                  </motion.div>
                )}
              </div>
              
              {/* Botão Especial IA (Havi) */}
              {onHaviClick ? (
                <button
                  type="button"
                  onClick={onHaviClick}
                  className="relative h-10 rounded-full border border-nex-orange/20 bg-nex-orange/[0.02] backdrop-blur-md flex items-center justify-center text-nex-orange hover:bg-nex-orange/10 hover:border-nex-orange/40 hover:shadow-[0_0_15px_rgba(255,106,0,0.3)] transition-all duration-500 group overflow-hidden px-1.5 z-10 shrink-0 cursor-pointer"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border border-dashed border-nex-orange/40"
                  />
                  <div className="flex items-center justify-center z-10">
                    <Image
                      src="/ravi-avatar.png"
                      alt="Havi"
                      width={32}
                      height={32}
                      className="shrink-0 rounded-full relative z-10 object-cover"
                    />
                    <span className="max-w-0 opacity-0 group-hover:max-w-[110px] group-hover:opacity-100 group-hover:ml-1.5 whitespace-nowrap overflow-hidden transition-all duration-500 text-xs font-bold tracking-wide text-white">
                      Falar com Havi
                    </span>
                  </div>
                </button>
              ) : (
                <div
                  className="relative h-10 w-10 rounded-full border border-nex-orange/20 bg-nex-orange/[0.02] backdrop-blur-md flex items-center justify-center text-nex-orange overflow-hidden z-10 shrink-0"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border border-dashed border-nex-orange/40"
                  />
                  <Image
                    src="/ravi-avatar.png"
                    alt="Havi"
                    width={32}
                    height={32}
                    className="shrink-0 rounded-full relative z-10 object-cover"
                  />
                </div>
              )}

              {/* Settings Button */}
              <div className="relative" ref={settingsMenuRef}>
                <GlassIconButton 
                  icon={SlidersHorizontal} 
                  onClick={() => {
                    if (onSettingsClick) onSettingsClick();
                    if (settingsMenuContent) setShowSettingsInternal(!showSettingsInternal);
                  }} 
                />
                {showSettingsInternal && settingsMenuContent && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute bottom-full left-0 mb-6 w-60 rounded-[1.5rem] bg-[#0a0a0a]/90 backdrop-blur-[40px] border border-white/10 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(255,255,255,0.02)] z-50 flex flex-col gap-1"
                  >
                    {settingsMenuContent}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Right Icons (Mic + Glowing Send) */}
            <div className="flex items-center gap-2 sm:gap-3">
              <GlassIconButton
                icon={Mic}
                onClick={startRecording}
                className={!speechSupported ? "opacity-30 cursor-not-allowed" : ""}
              />
              <button
                type="button"
                onClick={onSubmit}
                disabled={isStreaming || !value.trim()}
                aria-label="Enviar pro Havi"
                className="w-10 h-10 sm:w-[52px] sm:h-[52px] rounded-full flex justify-center items-center transition-all duration-300 bg-gradient-to-b from-[#FFA733] via-[#FF6600] to-[#CC4400] shadow-[0_5px_20px_rgba(255,106,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.6),inset_0_-4px_8px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 group/send disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 shrink-0"
              >
                <ArrowUp className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-transform group-hover/send:-translate-y-1" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 h-full">
          {/* Left: Mic Icon & Status */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 pr-2">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-nex-orange/30 flex items-center justify-center bg-nex-orange/10 shadow-[0_0_20px_rgba(255,106,0,0.3)] shrink-0">
              <AudioLines className="w-4 h-4 sm:w-5 sm:h-5 text-nex-orange" />
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <span className="hidden lg:block text-white text-base lg:text-lg font-light tracking-wide truncate">
                {isPaused ? "Pausado" : "Ouvindo..."}
              </span>
              {!isPaused && <div className="w-1.5 h-1.5 rounded-full bg-nex-orange animate-ping shrink-0" />}
              <span className="text-nex-orange font-mono tracking-widest text-xs sm:text-sm shrink-0">{recordingTime}</span>
            </div>
          </div>
          
          {/* Center: Waveform Graphic (Desktop only) */}
          <div className="hidden md:flex flex-1 items-center justify-center px-6 opacity-80 h-10 overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)" }}>
            <div className="flex items-center gap-[3px]">
              {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-[2px] bg-nex-orange rounded-full"
                  animate={{ height: ["20%", "100%", "20%"] }}
                  transition={{
                    duration: Math.random() * 0.4 + 0.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: Math.random() * 0.5
                  }}
                  style={{ height: "20%" }}
                />
              ))}
            </div>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            <GlassIconButton icon={Trash2} onClick={cancelRecording} className="w-8 h-8 sm:w-10 sm:h-10" iconClassName="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <GlassIconButton icon={isPaused ? Play : Pause} onClick={togglePauseRecording} className="w-8 h-8 sm:w-10 sm:h-10" iconClassName="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <button
              type="button"
              onClick={stopRecording}
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center bg-gradient-to-br from-[#FF4000] to-[#FF8000] shadow-[0_0_20px_rgba(255,106,0,0.6)] hover:scale-105 active:scale-95 transition-all mx-0.5 sm:mx-1 shrink-0"
            >
              <Square className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white fill-white" />
            </button>
            <GlassIconButton icon={X} onClick={cancelRecording} className="w-8 h-8 sm:w-10 sm:h-10" iconClassName="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
      )}
    </div>
    </motion.div>
  );
}
