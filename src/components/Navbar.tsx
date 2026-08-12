"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
          
          {/* LOGO */}
          <Link href="/" className="relative z-50 flex items-center cursor-pointer">
            <div className={`relative transition-all duration-500 ${isScrolled ? 'w-[120px] h-[36px]' : 'w-[160px] h-[48px]'}`}>
              <Image 
                src="/logo-nex-neon.png" 
                alt="NEX Logo" 
                fill 
                className="object-contain" 
                priority
              />
            </div>
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link, idx) => (
              <a 
                key={idx} 
                href={link.href}
                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors tracking-wide"
              >
                {link.label}
              </a>
            ))}
            {/* USER AVATAR */}
            <div className="flex items-center space-x-4 pl-4 border-l border-white/10">
              {/* CTA DESKTOP */}
              <button 
                onClick={() => router.push("/ia")}
                className="px-6 py-2.5 rounded-full border border-nex-orange/30 bg-nex-orange/10 text-nex-orange font-bold text-xs tracking-widest uppercase hover:bg-nex-orange hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(255,106,0,0.2)] hover:shadow-[0_0_30px_rgba(255,106,0,0.5)] flex items-center gap-2 group hidden lg:flex"
              >
                Acessar IA
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="w-10 h-10 shrink-0 rounded-full bg-[#FF6A00] flex items-center justify-center text-black font-black text-sm tracking-widest hover:scale-105 hover:shadow-[0_0_25px_rgba(255,106,0,0.5)] transition-all duration-300 cursor-pointer">
                RA
              </button>
            </div>
          </div>

          {/* MOBILE CONTROLS */}
          <div className="md:hidden flex items-center gap-3 relative z-50">
            <button className="w-10 h-10 shrink-0 rounded-full bg-[#FF6A00] flex items-center justify-center text-black font-black text-sm tracking-widest hover:scale-105 hover:shadow-[0_0_25px_rgba(255,106,0,0.5)] transition-all duration-300 cursor-pointer">
              RA
            </button>
            <button 
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="text-3xl font-light text-zinc-300 hover:text-white"
                >
                  {link.label}
                </motion.a>
              ))}
              
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={() => {
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
