"use client";

import { Navbar } from "@/components/Navbar";
import { ArrowLeft, ShieldCheck, Database, Eye, Lock, UserCheck, Mail } from "lucide-react";
import Link from "next/link";

export default function PrivacidadePage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-nex-orange/30 selection:text-white font-sans relative overflow-x-hidden">
      <Navbar />

      {/* Luz Ambiental de Fundo */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-nex-orange/[0.04] rounded-full blur-[140px]" />
        <div className="absolute bottom-[20%] right-1/4 w-[500px] h-[400px] bg-white/[0.02] rounded-full blur-[120px]" />
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
          <ShieldCheck className="w-3.5 h-3.5 text-nex-orange" />
          <span className="text-[10px] font-mono text-nex-orange tracking-[0.2em] uppercase">Conformidade LGPD</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-4 drop-shadow-lg">
          Política de <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-500">Privacidade</span>
        </h1>
        <p className="text-sm font-mono text-zinc-500 uppercase tracking-widest mb-12">
          Última atualização: {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </p>

        {/* Card Liquid Glass com o Conteúdo */}
        <div className="w-full bg-[#080808]/80 backdrop-blur-3xl border border-white/[0.08] rounded-[2rem] p-8 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-12 leading-relaxed text-zinc-300 font-light">
          
          {/* Seção 1 */}
          <section className="space-y-4">
            <div className="flex items-center space-x-3 text-white">
              <ShieldCheck className="w-5 h-5 text-nex-orange" />
              <h2 className="text-xl font-bold uppercase tracking-wide">1. Compromisso com a Privacidade</h2>
            </div>
            <p className="text-sm md:text-base leading-relaxed text-zinc-400">
              A <strong className="text-white font-medium">NEX</strong> assume o compromisso intransigente com a proteção de dados e a privacidade de seus usuários, clientes e parceiros. Esta Política descreve de forma transparente como coletamos, tratamos, armazenamos e protegemos seus dados pessoais em estrita conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD).
            </p>
          </section>

          {/* Seção 2 */}
          <section className="space-y-4 border-t border-white/5 pt-8">
            <div className="flex items-center space-x-3 text-white">
              <Database className="w-5 h-5 text-nex-orange" />
              <h2 className="text-xl font-bold uppercase tracking-wide">2. Dados Pessoais Coletados</h2>
            </div>
            <p className="text-sm md:text-base leading-relaxed text-zinc-400">
              Coletamos apenas as informações estritamente necessárias para a prestação e aprimoramento de nossos serviços:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl">
                <h3 className="text-xs font-mono uppercase text-white font-bold mb-1">Dados de Contato e Diagnóstico</h3>
                <p className="text-xs text-zinc-400">Nome, e-mail corporativo, telefone/WhatsApp, faturamento e informações sobre a operação da empresa.</p>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl">
                <h3 className="text-xs font-mono uppercase text-white font-bold mb-1">Dados Técnicos de Navegação</h3>
                <p className="text-xs text-zinc-400">Endereço IP anonimizado, tipo de navegador, latência, resolução e eventos de interação para telemetria de 60 FPS.</p>
              </div>
            </div>
          </section>

          {/* Seção 3 */}
          <section className="space-y-4 border-t border-white/5 pt-8">
            <div className="flex items-center space-x-3 text-white">
              <Eye className="w-5 h-5 text-nex-orange" />
              <h2 className="text-xl font-bold uppercase tracking-wide">3. Finalidades do Tratamento</h2>
            </div>
            <p className="text-sm md:text-base leading-relaxed text-zinc-400">
              Seus dados são utilizados exclusivamente para:
            </p>
            <ul className="space-y-2 text-sm text-zinc-400 pl-4 border-l border-nex-orange/30">
              <li>• Realização de diagnósticos estratégicos e geração de relatórios de ecossistema digital.</li>
              <li>• Interação conversacional via inteligência artificial (assistente Havi).</li>
              <li>• Comunicação direta sobre agendamentos de reuniões e soluções NEX.</li>
              <li>• Segurança operacional, prevenção a fraudes e garantia de integridade da infraestrutura.</li>
            </ul>
          </section>

          {/* Seção 4 */}
          <section className="space-y-4 border-t border-white/5 pt-8">
            <div className="flex items-center space-x-3 text-white">
              <Lock className="w-5 h-5 text-nex-orange" />
              <h2 className="text-xl font-bold uppercase tracking-wide">4. Segurança e Criptografia</h2>
            </div>
            <p className="text-sm md:text-base leading-relaxed text-zinc-400">
              Implementamos camadas de segurança de ponta a ponta: tráfego 100% criptografado (TLS 1.3/HTTPS), isolamento de bancos de dados via Prisma ORM e controle rígido de acessos privilegiados. Seus dados nunca são comercializados com terceiros.
            </p>
          </section>

          {/* Seção 5 */}
          <section className="space-y-4 border-t border-white/5 pt-8">
            <div className="flex items-center space-x-3 text-white">
              <UserCheck className="w-5 h-5 text-nex-orange" />
              <h2 className="text-xl font-bold uppercase tracking-wide">5. Seus Direitos como Titular</h2>
            </div>
            <p className="text-sm md:text-base leading-relaxed text-zinc-400">
              Você pode a qualquer momento solicitar: confirmação da existência de tratamento, acesso aos dados, correção de dados incompletos ou a revogação do consentimento e exclusão definitiva de seus registros.
            </p>
          </section>

          {/* Seção 6 */}
          <section className="space-y-4 border-t border-white/5 pt-8">
            <div className="flex items-center space-x-3 text-white">
              <Mail className="w-5 h-5 text-nex-orange" />
              <h2 className="text-xl font-bold uppercase tracking-wide">6. Canal de Contato com o DPO</h2>
            </div>
            <p className="text-sm md:text-base leading-relaxed text-zinc-400">
              Para exercer seus direitos de titular ou sanar dúvidas sobre esta Política, entre em contato diretamente com o nosso Encarregado de Proteção de Dados (DPO) através do e-mail:
            </p>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-nex-orange/30 inline-flex items-center space-x-3">
              <Mail className="w-4 h-4 text-nex-orange" />
              <span className="text-sm font-mono text-white">new.flow.sys@gmail.com</span>
            </div>
          </section>

        </div>

        {/* Rodapé Interno da Página */}
        <div className="w-full mt-12 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-zinc-500 border-t border-white/5 pt-6">
          <span>&copy; {new Date().getFullYear()} NEX. Todos os direitos reservados.</span>
          <Link href="/termos" className="mt-2 sm:mt-0 text-zinc-400 hover:text-white transition-colors">
            Ver Termos de Uso &rarr;
          </Link>
        </div>
      </div>
    </main>
  );
}
