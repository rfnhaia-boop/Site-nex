import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// Sessão via JWT (sem persistir usuário no banco) — o site não tem conta/perfil
// de verdade ainda, login com Google serve só pra identificar o visitante.
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      // Sem isso o Google pula a tela de escolher conta quando o navegador já
      // tem uma sessão ativa -- loga direto na conta errada sem o visitante
      // conseguir escolher.
      authorization: {
        params: { prompt: "select_account" },
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {},
  trustHost: true,
});
