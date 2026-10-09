"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/nexTracking";
import { PRODUCTS } from "@/lib/products";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const router = useRouter();

  // Handle scroll to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!pickerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPickerOpen(false);
    const onClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("[data-nex-picker]")) setPickerOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [pickerOpen]);

  const navLinks = [
    { label: "O Método", href: "/#metodo" },
    { label: "Infraestrutura", href: "/#infra" },
    { label: "Resultados", href: "/#resultados" },
    { label: "Conheça o Havi", href: "/havi" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled 
            ? "py-3 bg-black/60 backdrop-blur-3xl shadow-[0_10px_40px_rgba(0,0,0,0.5)]" 
            : "py-6 bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* LOGO: um clique abre os produtos NEX (mesmo seletor dos produtos) */}
          <div className="relative z-50" data-nex-picker>
            <button
              type="button"
              aria-label="Escolher site NEX"
              aria-expanded={pickerOpen}
              aria-haspopup="true"
              onClick={() => {
                setPickerOpen((v) => !v);
                trackEvent("cta_click", { metadata: { cta: "navbar_logo_picker" } });
              }}
              className="flex items-center cursor-pointer"
            >
              <div className={`relative transition-all duration-500 ${isScrolled ? 'w-[120px] h-[36px]' : 'w-[160px] h-[48px]'}`}>
                <Image
                  src="/logo-nex-neon.png"
                  alt="NEX Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </button>
            <AnimatePresence>
              {pickerOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 top-full mt-4 w-[min(92vw,540px)] rounded-3xl border border-white/15 bg-[#090b0d]/95 p-5 shadow-[0_28px_75px_rgba(0,0,0,0.65)] backdrop-blur-2xl"
                >
                  <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4 text-[10px] tracking-[0.14em] text-zinc-200">
                    <span>EXPLORE A NEX</span>
                    <span className="tracking-normal text-zinc-500">Escolha seu próximo passo</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {PRODUCTS.map((p) => (
                      <a
                        key={p.href}
                        href={p.href}
                        onClick={() => trackEvent("cta_click", { metadata: { cta: `picker_${p.href.slice(1)}` } })}
                        className="group flex flex-col items-center rounded-2xl border border-transparent px-2 py-4 text-center transition hover:border-white/15 hover:bg-white/[0.03]"
                      >
                        <span className="mb-3 grid h-14 w-14 place-items-center rounded-full border border-white/25 bg-gradient-to-br from-white/10 to-nex-orange/10 text-sm font-semibold text-zinc-200 transition group-hover:-translate-y-1 group-hover:border-nex-orange/60 group-hover:text-nex-orange">
                          {p.n}
                        </span>
                        <strong className="text-xs font-semibold text-zinc-100">{p.name}</strong>
                        <span className="mt-1 text-[10px] leading-snug text-zinc-500">{p.detail}</span>
                      </a>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-1 border-t border-white/10 pt-4 text-[11px]">
                    <Link href="/" className="text-zinc-400 hover:text-nex-orange" onClick={() => setPickerOpen(false)}>Início</Link>
                    <Link href="/ia" className="text-zinc-400 hover:text-nex-orange" onClick={() => setPickerOpen(false)}>Falar com o Havi</Link>
                    <Link href="/links" className="text-zinc-400 hover:text-nex-orange" onClick={() => setPickerOpen(false)}>Todos os links</Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link, idx) => (
              <a 
                key={idx} 
                href={link.href}
                translate="no"
                className="notranslate text-sm font-medium text-zinc-400 hover:text-white transition-colors tracking-wide"
              >
                {link.label}
              </a>
            ))}
            {/* USER AVATAR */}
            <div className="flex items-center space-x-4 pl-4 border-l border-white/10">
              {/* CTA DESKTOP */}
              <button
                onClick={() => { trackEvent("cta_click", { metadata: { cta: "navbar_acessar_ia" } }); router.push("/ia"); }}
                className="px-6 py-2.5 rounded-full border border-nex-orange/30 bg-nex-orange/10 text-nex-orange font-bold text-xs tracking-widest uppercase hover:bg-nex-orange hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(255,106,0,0.2)] hover:shadow-[0_0_30px_rgba(255,106,0,0.5)] flex items-center gap-2 group hidden lg:flex"
              >
                Acessar IA
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={() => router.push("/login")}
                className="w-10 h-10 shrink-0 rounded-full bg-[#FF6A00] flex items-center justify-center text-black font-black text-sm tracking-widest hover:scale-105 hover:shadow-[0_0_25px_rgba(255,106,0,0.5)] transition-all duration-300 cursor-pointer"
                title="Acessar Conta NEX"
              >
                RA
              </button>
            </div>
          </div>

          {/* MOBILE CONTROLS */}
          <div className="md:hidden flex items-center gap-3 relative z-50">
            <button 
              onClick={() => router.push("/login")}
              className="w-10 h-10 shrink-0 rounded-full bg-[#FF6A00] flex items-center justify-center text-black font-black text-sm tracking-widest hover:scale-105 hover:shadow-[0_0_25px_rgba(255,106,0,0.5)] transition-all duration-300 cursor-pointer"
              title="Acessar Conta NEX"
            >
              RA
            </button>
            <button 
              aria-label="Abrir menu"
              className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-zinc-300 backdrop-blur-md"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE MENU FULLSCREEN OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-black/90 backdrop-blur-[60px] flex flex-col items-center justify-center px-6"
          >
            <div className="flex flex-col items-center space-y-8 w-full max-w-sm">
              {navLinks.map((link, idx) => (
                <motion.a
                  key={idx}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  translate="no"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="notranslate text-3xl font-light text-zinc-300 hover:text-white"
                >
                  {link.label}
                </motion.a>
              ))}
              
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={() => {
                  trackEvent("cta_click", { metadata: { cta: "navbar_acessar_ia_mobile" } });
                  setMobileMenuOpen(false);
                  router.push("/ia");
                }}
                className="mt-8 w-full py-4 rounded-2xl bg-gradient-to-r from-nex-orange to-[#FF9040] text-black font-black tracking-widest uppercase flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,106,0,0.3)]"
              >
                Acessar IA
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
