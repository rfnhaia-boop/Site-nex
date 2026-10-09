"use client";

import { Navbar } from "@/components/Navbar";
import { ArrowLeft, Shield, FileText, Lock, CheckCircle2, Scale } from "lucide-react";
import Link from "next/link";

export default function TermosPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-nex-orange/30 selection:text-white font-sans relative overflow-x-hidden">
      <Navbar />

      {/* Luz Ambiental de Fundo */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-nex-orange/[0.04] rounded-full blur-[140px]" />
        <div className="absolute bottom-[20%] left-1/4 w-[500px] h-[400px] bg-white/[0.02] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-36 pb-28 flex flex-col items-start">
        {/* Voltar */}
        <Link 
          href="/"
          className="inline-flex items-center space-x-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors duration-300 mb-8 group bg-white/[0.02] border border-white/5 px-4 py-2 rounded-full backdrop-blur-md"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span>VOLTAR AO INÍCIO</span>
        </Link>

        {/* Header da Página */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-nex-orange/30 bg-nex-orange/10 backdrop-blur-sm mb-6">
          <Scale className="w-3.5 h-3.5 text-nex-orange" />
          <span className="text-[10px] font-mono text-nex-orange tracking-[0.2em] uppercase">Documento Oficial</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-4 drop-shadow-lg">
          Termos de <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-500">Uso</span>
        </h1>
        <p className="text-sm font-mono text-zinc-500 uppercase tracking-widest mb-12">
          Última atualização: {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </p>

        {/* Card Liquid Glass com o Conteúdo */}
        <div className="w-full bg-[#080808]/80 backdrop-blur-3xl border border-white/[0.08] rounded-[2rem] p-8 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-12 leading-relaxed text-zinc-300 font-light">
          
          {/* Seção 1 */}
          <section className="space-y-4">
            <div className="flex items-center space-x-3 text-white">
              <FileText className="w-5 h-5 text-nex-orange" />
              <h2 className="text-xl font-bold uppercase tracking-wide">1. Aceitação dos Termos</h2>
            </div>
            <p className="text-sm md:text-base leading-relaxed text-zinc-400">
              Ao acessar, navegar ou utilizar os serviços, sistemas e interfaces desenvolvidos pela <strong className="text-white font-medium">NEX</strong>, você expressa sua concordância irrevogável com estes Termos de Uso e com nossa Política de Privacidade. Caso não concorde com qualquer disposição aqui estabelecida, recomendamos a descontinuidade do uso de nossas plataformas.
            </p>
          </section>

          {/* Seção 2 */}
          <section className="space-y-4 border-t border-white/5 pt-8">
            <div className="flex items-center space-x-3 text-white">
              <Shield className="w-5 h-5 text-nex-orange" />
              <h2 className="text-xl font-bold uppercase tracking-wide">2. Propriedade Intelectual</h2>
            </div>
            <p className="text-sm md:text-base leading-relaxed text-zinc-400">
              Todo o código-fonte, arquitetura de sistemas, algoritmos de inteligência artificial (incluindo o assistente Havi), interfaces visuais, identidades de marca, layouts e metodologias proprietárias constituem patrimônio exclusivo da NEX ou de seus respectivos licenciadores, protegidos pela Lei de Direitos Autorais e normas internacionais de propriedade industrial.
            </p>
            <ul className="space-y-2 text-sm text-zinc-400 pl-4 border-l border-nex-orange/30">
              <li>• É expressamente vedada a engenharia reversa, descompilação ou cópia de interfaces.</li>
              <li>• Nenhum conteúdo pode ser reproduzido para fins comerciais sem autorização prévia por escrito.</li>
            </ul>
          </section>

          {/* Seção 3 */}
          <section className="space-y-4 border-t border-white/5 pt-8">
            <div className="flex items-center space-x-3 text-white">
              <Lock className="w-5 h-5 text-nex-orange" />
              <h2 className="text-xl font-bold uppercase tracking-wide">3. Escopo e Limitação de Responsabilidade</h2>
            </div>
            <p className="text-sm md:text-base leading-relaxed text-zinc-400">
              A NEX atua como infraestrutura de tecnologia, estratégia e ecossistemas de alta performance. Embora apliquemos rigorosas diretrizes de engenharia com 99.9% de uptime e 60 FPS, não nos responsabilizamos por instabilidades decorrentes de terceiros (provedores de nuvem, APIs externas ou conexões de rede do usuário).
            </p>
          </section>

          {/* Seção 4 */}
          <section className="space-y-4 border-t border-white/5 pt-8">
            <div className="flex items-center space-x-3 text-white">
              <CheckCircle2 className="w-5 h-5 text-nex-orange" />
              <h2 className="text-xl font-bold uppercase tracking-wide">4. Confidencialidade e Dados Estratégicos</h2>
            </div>
            <p className="text-sm md:text-base leading-relaxed text-zinc-400">
              Informações estratégicas compartilhadas durante etapas de diagnóstico ou reuniões de alinhamento são tratadas sob estrito dever de sigilo profissional, em conformidade com as melhores práticas de governança corporativa e proteção de dados.
            </p>
          </section>

          {/* Seção 5 */}
          <section className="space-y-4 border-t border-white/5 pt-8">
            <div className="flex items-center space-x-3 text-white">
              <Scale className="w-5 h-5 text-nex-orange" />
              <h2 className="text-xl font-bold uppercase tracking-wide">5. Legislação Aplicável e Foro</h2>
            </div>
            <p className="text-sm md:text-base leading-relaxed text-zinc-400">
              Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o Foro da Comarca de São Paulo/SP como o único competente para dirimir quaisquer controvérsias oriundas deste instrumento.
            </p>
          </section>

        </div>

        {/* Rodapé Interno da Página */}
        <div className="w-full mt-12 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-zinc-500 border-t border-white/5 pt-6">
          <span>&copy; {new Date().getFullYear()} NEX. Todos os direitos reservados.</span>
          <Link href="/privacidade" className="mt-2 sm:mt-0 text-zinc-400 hover:text-white transition-colors">
            Ver Política de Privacidade &rarr;
          </Link>
        </div>
      </div>
    </main>
  );
}
