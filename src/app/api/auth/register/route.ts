import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export async function POST(request: Request) {
  const { allowed } = checkRateLimit(`register:${getClientIp(request)}`, 10);
  if (!allowed) {
    return Response.json({ error: "Muitas tentativas. Espera um instante." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!name) {
    return Response.json({ error: "Nome é obrigatório." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return Response.json({ error: "E-mail inválido." }, { status: 400 });
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return Response.json({ error: `Senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.` }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return Response.json({ error: "Já existe uma conta com esse e-mail." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: { name, phone, email, passwordHash },
  });

  return Response.json({ ok: true });
}
