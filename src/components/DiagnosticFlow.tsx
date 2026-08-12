"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

const MOMENTO_OPTIONS = [
  "Ainda validando a ideia",
  "Já fatura, quer crescer",
  "Preciso resolver um gargalo específico",
];

const SINTOMA_OPTIONS = [
  "Site desatualizado",
  "Sem automação",
  "Marketing não converte",
  "Operação manual demais",
  "Falta de dados pra decidir",
];

const WHATSAPP_NUMBER = "5511936202934";

type FormState = {
  empresa: string;
  nome: string;
  whatsapp: string;
  momento: string;
  gargalo: string;
  sintomas: string[];
  resultado_desejado: string;
};

const INITIAL_FORM: FormState = {
  empresa: "",
  nome: "",
  whatsapp: "",
  momento: "",
  gargalo: "",
  sintomas: [],
  resultado_desejado: "",
};

const TOTAL_STEPS = 3;

export default function DiagnosticFlow({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleSintoma(s: string) {
    setForm((prev) => ({
      ...prev,
      sintomas: prev.sintomas.includes(s) ? prev.sintomas.filter((x) => x !== s) : [...prev.sintomas, s],
    }));
  }

  const canAdvanceStep1 = form.empresa.trim() && form.nome.trim() && form.whatsapp.trim();
  const canAdvanceStep2 = form.momento && form.gargalo.trim();

  async function handleSubmit() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/diagnostico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || "Não consegui enviar agora.");
      }
      setSuccess(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não consegui enviar agora. Tenta de novo.");
    } finally {
      setSubmitting(false);
    }
  }

  const resumoWhatsApp = encodeURIComponent(
    `Oi! Acabei de fazer o Diagnóstico NEX. Empresa: ${form.empresa}. Gargalo: ${form.gargalo}.`
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-[2rem] bg-[#0A0A0A]/95 backdrop-blur-[40px] border border-white/10 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.8)]"
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {!success ? (
          <>
            <div className="flex items-center gap-2 mb-8">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                    i < step ? "bg-nex-orange" : "bg-white/10"
                  }`}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                  <h2 className="text-xl font-bold text-white">Diagnóstico NEX</h2>
                  <p className="text-sm text-zinc-400 font-light">Rápido, direto ao ponto. Vamos começar com o básico.</p>
                  <FormInput label="Empresa" value={form.empresa} onChange={(v) => update("empresa", v)} placeholder="Nome da sua empresa" />
                  <FormInput label="Seu nome" value={form.nome} onChange={(v) => update("nome", v)} placeholder="Como podemos te chamar" />
                  <FormInput label="WhatsApp" value={form.whatsapp} onChange={(v) => update("whatsapp", v)} placeholder="(11) 99999-9999" type="tel" />
                  <NextButton disabled={!canAdvanceStep1} onClick={() => setStep(2)} />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                  <h2 className="text-xl font-bold text-white">Onde você está agora?</h2>
                  <div className="space-y-2">
                    {MOMENTO_OPTIONS.map((opt) => (
                      <PillOption key={opt} label={opt} active={form.momento === opt} onClick={() => update("momento", opt)} />
                    ))}
                  </div>
                  <FormTextarea label="Qual o principal gargalo hoje?" value={form.gargalo} onChange={(v) => update("gargalo", v)} placeholder="O que mais trava o crescimento agora?" />
                  <div className="space-y-2">
                    <span className="text-xs text-zinc-500 font-medium uppercase tracking-wide">Sintomas (opcional)</span>
                    <div className="flex flex-wrap gap-2">
                      {SINTOMA_OPTIONS.map((s) => (
                        <ChipOption key={s} label={s} active={form.sintomas.includes(s)} onClick={() => toggleSintoma(s)} />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <BackButton onClick={() => setStep(1)} />
                    <NextButton disabled={!canAdvanceStep2} onClick={() => setStep(3)} />
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                  <h2 className="text-xl font-bold text-white">O que você quer alcançar?</h2>
                  <FormTextarea
                    label="Resultado desejado"
                    value={form.resultado_desejado}
                    onChange={(v) => update("resultado_desejado", v)}
                    placeholder="Onde você quer chegar nos próximos meses?"
                  />
                  {error && <p className="text-sm text-red-400">{error}</p>}
                  <div className="flex gap-3">
                    <BackButton onClick={() => setStep(2)} />
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-nex-orange to-[#FF9040] text-black font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50"
                    >
                      {submitting ? "Enviando..." : "Concluir Diagnóstico"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center py-6 space-y-5">
            <div className="w-16 h-16 rounded-full bg-nex-orange/10 border border-nex-orange/30 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-nex-orange" />
            </div>
            <h2 className="text-xl font-bold text-white">Diagnóstico enviado!</h2>
            <p className="text-sm text-zinc-400 font-light leading-relaxed">
              Recebemos suas respostas. Pra acelerar, fala com a gente agora mesmo no WhatsApp.
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${resumoWhatsApp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-nex-orange to-[#FF9040] text-black font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              Falar no WhatsApp agora
            </a>
            <button onClick={onClose} className="text-sm text-zinc-500 hover:text-white transition-colors">
              Fechar
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

function FormInput({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs text-zinc-500 font-medium uppercase tracking-wide">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-zinc-600 text-sm outline-none focus:border-nex-orange/40 transition-colors"
      />
    </label>
  );
}

function FormTextarea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs text-zinc-500 font-medium uppercase tracking-wide">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-zinc-600 text-sm outline-none focus:border-nex-orange/40 transition-colors resize-none"
      />
    </label>
  );
}

function PillOption({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors ${
        active ? "bg-nex-orange/10 border-nex-orange/40 text-nex-orange" : "bg-white/[0.02] border-white/10 text-zinc-300 hover:border-white/20"
      }`}
    >
      {label}
    </button>
  );
}

function ChipOption({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full border text-xs transition-colors ${
        active ? "bg-nex-orange/10 border-nex-orange/40 text-nex-orange" : "bg-white/[0.02] border-white/10 text-zinc-400 hover:border-white/20"
      }`}
    >
      {label}
    </button>
  );
}

function NextButton({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-nex-orange to-[#FF9040] text-black font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-40 disabled:hover:scale-100"
    >
      Continuar <ArrowRight className="w-4 h-4" />
    </button>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="shrink-0 w-12 py-3.5 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 flex items-center justify-center transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
    </button>
  );
}
