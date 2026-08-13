import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// Sessão via JWT (sem adapter) -- funciona tanto pro login com Google (não
// persiste usuário) quanto pra conta e-mail/senha (persiste em User, senha
// sempre com hash bcrypt, nunca texto puro).
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
    Credentials({
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const email = typeof credentials?.email === "string" ? credentials.email.trim().toLowerCase() : "";
        const password = typeof credentials?.password === "string" ? credentials.password : "";
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  session: { strategy: "jwt" },
  // Sem isso, qualquer fluxo que o NextAuth precise redirecionar sozinho (erro,
  // ou /api/auth/signin acessado direto) caía na tela genérica dele em vez da
  // nossa /login de verdade.
  pages: {
    signIn: "/login",
    error: "/login",
  },
  trustHost: true,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = (token.name as string) ?? session.user.name;
        session.user.email = (token.email as string) ?? session.user.email;
      }
      return session;
    },
  },
});
