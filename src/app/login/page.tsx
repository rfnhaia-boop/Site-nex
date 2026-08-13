"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useTransform, useMotionTemplate } from "framer-motion";
import {
  User,
  Phone,
  ArrowRight,
  ArrowLeft,
  Lock,
  Check
} from "lucide-react";
import { Suspense, useState, MouseEvent, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

// Mesma chave que IAChatInterface.tsx (/ia e /havi) e /links usam pra saber,
// ao voltar do login, se deve retomar a conversa sozinho e mostrar o aviso.
function resumeKeyFor(path: string) {
  return path.startsWith("/links") ? "havi_post_login_resume_links" : "havi_post_login_resume_ia";
}

function markPendingResume(path: string) {
  try {
    sessionStorage.setItem(resumeKeyFor(path), "1");
  } catch {
    // sessionStorage indisponível -- sem retomada automática, sem problema.
  }
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  );
}

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/ia";

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loginName, setLoginName] = useState("");
  const [loginPhone, setLoginPhone] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Efeito Spotlight e Tilt 3D
  const mouseX = useMotionValue(400);
  const mouseY = useMotionValue(400);
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

  function handleGoogle() {
    markPendingResume(returnTo);
    signIn("google", { callbackUrl: returnTo });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (isLoginMode) {
      setLoading(true);
      const result = await signIn("credentials", {
        email: loginEmail,
        password: loginPassword,
        redirect: false,
      });
      setLoading(false);
      if (result?.error) {
        setErrorMsg("E-mail ou senha inválidos.");
        return;
      }
      markPendingResume(returnTo);
      router.push(returnTo);
      return;
    }

    if (!loginName.trim()) {
      setErrorMsg("Preenche seu nome.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: loginName,
          phone: loginPhone,
          email: loginEmail,
          password: loginPassword,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setErrorMsg(data?.error || "Não consegui criar sua conta.");
        setLoading(false);
        return;
      }

      const result = await signIn("credentials", {
        email: loginEmail,
        password: loginPassword,
        redirect: false,
      });
      setLoading(false);
      if (result?.error) {
        setErrorMsg("Conta criada, mas o login automático falhou. Tenta entrar de novo.");
        setIsLoginMode(true);
        return;
      }
      markPendingResume(returnTo);
      router.push(returnTo);
    } catch {
      setLoading(false);
      setErrorMsg("Não consegui criar sua conta agora. Tenta de novo em instantes.");
    }
  }

  return (
    <main className="min-h-screen w-full font-sans text-white flex items-center justify-center relative overflow-hidden bg-[#010101] p-4 md:p-8">

      {/* 1. FUNDO COM IMAGEM E LUZ AMBIENTAL */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center z-0">
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen">
          <Image src="/fundo.jpeg" fill className="object-cover" alt="Fundo NEX" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#010101] via-transparent to-[#010101] opacity-90" />

        {/* Círculos de luz orgânicos */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute w-[100vw] h-[100vw] rounded-[40%_60%_70%_30%] border border-[#FF6A00]/10 pointer-events-none"
          style={{ boxShadow: 'inset 0 0 100px rgba(255, 106, 0, 0.1)' }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute w-[90vw] h-[90vw] rounded-[60%_40%_30%_70%] border border-[#FF6A00]/5 pointer-events-none"
          style={{ boxShadow: '0 0 150px rgba(255, 106, 0, 0.05)' }}
        />
      </div>

      {/* 2. CARD DE LOGIN 3D TILT */}
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
        className="w-full max-w-[460px] relative z-10 rounded-[3rem] bg-[#030303]/70 backdrop-blur-2xl border-[1.5px] border-[#FF6A00]/40 shadow-[0_0_60px_rgba(255,106,0,0.15),inset_0_0_30px_rgba(255,106,0,0.05)] overflow-hidden"
      >
        {/* Efeito Spotlight seguindo o mouse */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: spotlightBackground,
            zIndex: 0
          }}
        />

        {/* Container Scrollável Interno */}
        <div className="w-full max-h-[88vh] overflow-y-auto scrollbar-hide flex flex-col items-center pt-14 pb-8 px-8 md:px-12 relative z-10">

          {/* Botão Voltar */}
          <Link
            href={returnTo}
            className="absolute top-10 left-8 z-50 flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-md shadow-lg group transform"
            style={{ transform: 'translateZ(30px)' }}
            title="Voltar"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </Link>

          {/* Logo Neon NEX */}
          <div className="mb-4 mt-2 relative z-10 transform" style={{ transform: 'translateZ(30px)' }}>
            <Image
              src="/logo-nex-neon.png"
              alt="NEX"
              width={150}
              height={50}
              className="opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-500 drop-shadow-[0_0_15px_rgba(255,106,0,0.8)]"
              priority
            />
          </div>

          <div className="text-center mb-8 w-full relative z-10 transform" style={{ transform: 'translateZ(20px)' }}>
            <h1 className="text-2xl font-bold text-white mb-1.5 tracking-wide">
              {isLoginMode ? "Bem-vindo de volta." : "Crie sua conta NEX."}
            </h1>
            <p className="text-[#a1a1aa] text-xs font-light">
              {isLoginMode ? "Acesse sua conta e continue evoluindo." : "Junte-se à revolução e acesse a inteligência."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
            <div className="flex flex-col gap-4 w-full mb-6 relative z-10 transform" style={{ transform: 'translateZ(40px)' }}>
              {/* Nome e Telefone (Only in Register Mode) */}
              {!isLoginMode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col gap-4 overflow-hidden"
                >
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white text-xs font-medium ml-1">Nome Completo</label>
                    <div className="relative flex items-center">
                      <div className="absolute left-4 text-white/40 pointer-events-none">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={loginName}
                        onChange={(e) => setLoginName(e.target.value)}
                        placeholder="Seu nome"
                        className="w-full h-[50px] pl-11 pr-4 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00] transition-all font-light"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-white text-xs font-medium ml-1">WhatsApp / Telefone</label>
                    <div className="relative flex items-center">
                      <div className="absolute left-4 text-white/40 pointer-events-none">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        value={loginPhone}
                        onChange={(e) => setLoginPhone(e.target.value)}
                        placeholder="(11) 99999-9999"
                        className="w-full h-[50px] pl-11 pr-4 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00] transition-all font-light"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Email Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-white text-xs font-medium ml-1">E-mail</label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-white/40 pointer-events-none">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full h-[50px] pl-11 pr-4 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00] transition-all font-light"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-white text-xs font-medium ml-1">Senha</label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-white/40 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={isLoginMode ? undefined : 8}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-[50px] pl-11 pr-4 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00] transition-all font-light"
                  />
                </div>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            {isLoginMode && (
              <div className="flex items-center justify-between w-full mb-6 px-1 relative z-10 transform" style={{ transform: 'translateZ(30px)' }}>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="hidden" />
                  <div className="w-3.5 h-3.5 rounded border border-white/20 bg-white/5 flex items-center justify-center group-hover:border-white/40 transition-colors">
                    <Check className="w-2.5 h-2.5 text-[#FF6A00] opacity-0 group-hover:opacity-50 transition-opacity" />
                  </div>
                  <span className="text-[11px] text-[#a1a1aa] group-hover:text-white transition-colors">
                    Lembrar de mim
                  </span>
                </label>
              </div>
            )}

            {errorMsg && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full mb-4 text-center text-red-400 text-xs font-medium relative z-10"
              >
                {errorMsg}
              </motion.p>
            )}

            {/* Entrar Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[54px] rounded-2xl bg-gradient-to-r from-[#FFA733] via-[#FF6A00] to-[#CC4400] text-black font-black flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all group relative overflow-hidden mb-6 shadow-[0_0_30px_rgba(255,106,0,0.4)] z-10 transform tracking-widest uppercase text-sm disabled:opacity-60 disabled:pointer-events-none"
              style={{ transform: 'translateZ(50px)' }}
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative z-10">
                {loading ? "Um instante..." : isLoginMode ? "Entrar" : "Criar Conta"}
              </span>
              {!loading && <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center w-full gap-4 mb-6 relative z-10 transform" style={{ transform: 'translateZ(20px)' }}>
            <div className="h-[1px] flex-1 bg-white/10" />
            <span className="text-white/30 text-[10px] uppercase tracking-wider">ou continue com</span>
            <div className="h-[1px] flex-1 bg-white/10" />
          </div>

          {/* Google Login Oficial */}
          <div className="w-full mb-6 relative z-10 transform" style={{ transform: 'translateZ(30px)' }}>
            <button
              type="button"
              onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-3 h-[50px] bg-[#0a0a0a]/60 border border-white/10 hover:border-white/30 hover:bg-white/5 rounded-2xl transition-all shadow-sm group"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-white/90 text-xs font-medium group-hover:text-white transition-colors">Continuar com Google</span>
            </button>
          </div>

          {/* Toggle Login / Register */}
          <div className="w-full relative z-10 transform" style={{ transform: 'translateZ(20px)' }}>
            <div className="h-[1px] w-full bg-white/5 mb-4" />
            <div className="flex flex-col items-center justify-center gap-2">
              <span className="text-[#a1a1aa] text-xs">
                {isLoginMode ? "Novo no ecossistema NEX?" : "Já faz parte do ecossistema?"}
              </span>
              <button
                type="button"
                onClick={() => { setIsLoginMode(!isLoginMode); setErrorMsg(""); }}
                className="px-5 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white text-xs font-medium transition-all shadow-sm active:scale-95"
              >
                {isLoginMode ? "Criar minha conta agora" : "Acessar minha conta"}
              </button>
            </div>
          </div>

        </div>
      </motion.div>
    </main>
  );
}
