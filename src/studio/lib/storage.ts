import { promises as fs } from "node:fs";
import path from "node:path";
import { auth } from "@/lib/auth";
import { nexdb } from "@/lib/nexdb";

// Camada de armazenamento do Site Studio no site oficial.
// Original (Cloudflare): D1 + R2 e login via cabeçalhos do ChatGPT. Aqui:
//  - banco: SQLite do site (nexdb, mesma interface do D1)
//  - arquivos: disco da VPS (STUDIO_UPLOAD_DIR), nunca dentro de public/
//  - identidade: sessão NextAuth (Google ou e-mail/senha); sem login, cookie anônimo como antes

const sessionPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const UPLOAD_DIR = process.env.STUDIO_UPLOAD_DIR || path.join(process.cwd(), ".data", "studio-files");
const ADMIN_EMAILS = (process.env.STUDIO_ADMIN_EMAILS || "new.company.sys@gmail.com,new.flow.sys@gmail.com")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

function safeKey(key: string) {
  // chave é sempre "<uuid>/<uuid>"; qualquer outra coisa é recusada (evita sair da pasta)
  if (!/^[0-9a-f-]{36}\/[0-9a-f-]{36}$/i.test(key)) throw new Error("Chave de arquivo inválida");
  return path.join(UPLOAD_DIR, key);
}

const bucket = {
  async put(key: string, data: ArrayBuffer, options?: { httpMetadata?: { contentType?: string } }) {
    void options;
    const file = safeKey(key);
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, Buffer.from(data));
  },
  async get(key: string) {
    try {
      const data = await fs.readFile(safeKey(key));
      return { body: new Uint8Array(data) };
    } catch {
      return null;
    }
  },
  async delete(key: string) {
    await fs.rm(safeKey(key), { force: true });
  },
};

export function storage() {
  return { db: nexdb(), bucket };
}

export function anonymousSession(request: Request) {
  const raw = request.headers.get("cookie") || "";
  for (const item of raw.split(";")) {
    const [name, ...value] = item.trim().split("=");
    if (name === "nex_studio_session") {
      const id = decodeURIComponent(value.join("="));
      if (sessionPattern.test(id)) return id;
    }
  }
  return null;
}

export async function sessionEmail() {
  try {
    return ((await auth())?.user?.email || "").toLowerCase() || null;
  } catch {
    return null;
  }
}

// Dono do projeto: e-mail da conta (se logado) ou o cookie anônimo.
export async function user(request: Request) {
  const email = await sessionEmail();
  return email ? `u:${email}` : anonymousSession(request);
}

export function sessionCookie(id: string) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `nex_studio_session=${encodeURIComponent(id)}; Path=/; Max-Age=31536000; HttpOnly; SameSite=Lax${secure}`;
}

export async function isAdmin(request: Request) {
  void request;
  const email = await sessionEmail();
  return !!email && ADMIN_EMAILS.includes(email);
}

export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === (request.headers.get("host") ?? new URL(request.url).host);
  } catch {
    return false;
  }
}

export function unavailable(error: unknown) {
  console.error("Studio storage error", error);
  return Response.json({ error: "Não foi possível salvar agora. Suas respostas continuam na tela. Tente novamente." }, { status: 503 });
}

// Quando a pessoa faz login, os projetos criados como anônimo passam para a conta dela.
export async function claimAnonymousProjects(request: Request) {
  const email = await sessionEmail();
  const anon = anonymousSession(request);
  if (!email || !anon) return;
  try {
    await nexdb().prepare("UPDATE projects SET owner=? WHERE owner=?").bind(`u:${email}`, anon).run();
  } catch (error) {
    console.error("claimAnonymousProjects", error);
  }
}
