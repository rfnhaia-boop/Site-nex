"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function FloatingBot() {
  const router = useRouter();

  return (
    <motion.div 
      className="fixed bottom-6 right-[85px] z-[100] flex items-center justify-center cursor-pointer"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.8 }}
      onClick={() => router.push("/ia")}
    >
      <div className="group relative w-14 h-14 rounded-full border border-nex-orange/20 bg-black/60 backdrop-blur-xl flex items-center justify-center text-nex-orange hover:bg-nex-orange/10 hover:border-nex-orange/40 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(255,106,0,0.4)] transition-all duration-500 overflow-hidden">
        {/* Anel giratório permanente */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-dashed border-nex-orange/40"
        />
        <div className="relative w-9 h-9 shrink-0 rounded-full overflow-hidden border border-nex-orange/50 shadow-[0_0_10px_rgba(255,106,0,0.5)] z-10">
          <Image src="/ravi-avatar.png" alt="Havi" fill className="object-cover" />
        </div>
      </div>
    </motion.div>
  );
}
