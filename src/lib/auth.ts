import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// Sessão via JWT (sem persistir usuário no banco) — o site não tem conta/perfil
// de verdade ainda, login com Google serve só pra identificar o visitante.
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  session: { strategy: "jwt" },
  pages: {},
});
