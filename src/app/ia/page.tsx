"use client";

import Image from "next/image";
import { IAChatInterface } from "@/components/IAChatInterface";

export default function IAPage() {
  return (
    <main className="h-screen w-full font-sans text-nex-white flex items-center justify-center relative overflow-hidden bg-[#010101] p-4 md:p-8">
      
      {/* 1. FUNDO COM IMAGEM E LUZ AMBIENTAL */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image 
          src="/fundo.jpeg" 
          alt="NEX AI Environment" 
          fill 
          className="object-cover opacity-100" 
        />
        <div className="absolute inset-0 bg-[#010101]/40" />
      </div>

      {/* 2. INTERFACE COMPLETA DO CHAT DA IA */}
      <IAChatInterface />

    </main>
  );
}
