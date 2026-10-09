import { auth } from "@/lib/auth";
import { nexdb } from "@/lib/nexdb";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

// Captura central de leads dos produtos NEX. Cada produto manda o progresso (status "progress")
// e o envio final (status "submitted", só com consentimento). Um registro por visitante/produto/fonte.

const PRODUCTS = new Set(["site-studio", "blueprint", "context-agent", "squad"]);
const field = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === (request.headers.get("host") ?? new URL(request.url).host);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Origem inválida." }, { status: 403 });
  if (!checkRateLimit(`leads:${getClientIp(request)}`, 60).allowed) return Response.json({ error: "Muitas requisições." }, { status: 429 });
  if (Number(request.headers.get("content-length") || 0) > 96000) return Response.json({ error: "Respostas excedem o limite." }, { status: 413 });

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return Response.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const product = field(body.product, 40);
  const source = field(body.source, 80);
  const status = field(body.status, 20);
  const visitor = field(body.visitor, 80);
  const session = field(body.session, 80);
  if (
    !PRODUCTS.has(product) ||
    !source ||
    !["progress", "submitted"].includes(status) ||
    !/^[-a-zA-Z0-9]{12,80}$/.test(visitor) ||
    !/^[-a-zA-Z0-9]{12,80}$/.test(session) ||
    (status === "submitted" && body.consent !== true)
  ) {
    return Response.json({ error: "Envio inválido." }, { status: 400 });
  }
  if (!body.answers || typeof body.answers !== "object" || Array.isArray(body.answers)) {
    return Response.json({ error: "Respostas inválidas." }, { status: 400 });
  }
  const entries = Object.entries(body.answers as Record<string, unknown>);
  if (entries.length > 80) return Response.json({ error: "Respostas excedem o limite." }, { status: 413 });
  const answers: Record<string, string> = {};
  for (const [key, value] of entries) {
    if (!/^[a-zA-Z0-9_-]{1,80}$/.test(key) || typeof value !== "string" || value.length > 6000) {
      return Response.json({ error: "Confira as respostas." }, { status: 400 });
    }
    answers[key] = value.trim();
  }

  let email = field(body.email, 254);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ error: "E-mail inválido." }, { status: 400 });
  // Visitante logado: o e-mail verificado vem da sessão (não do formulário).
  try {
    const sessionEmail = (await auth())?.user?.email;
    if (sessionEmail && !email) email = sessionEmail;
  } catch {
    /* sem sessão */
  }

  const origin = request.headers.get("origin") || new URL(request.url).origin;
  const now = new Date().toISOString();
  try {
    const db = nexdb();
    const existing = await db
      .prepare("SELECT id,status FROM centralized_leads WHERE product=? AND visitor=? AND source=? ORDER BY updated DESC LIMIT 1")
      .bind(product, visitor, source)
      .first<{ id: string; status: string }>();
    const id = existing?.id || crypto.randomUUID();
    const consent = body.consent === true ? 1 : 0;
    if (existing) {
      await db
        .prepare(
          // depois de enviado, um "progress" atrasado não rebaixa o status
          "UPDATE centralized_leads SET session=?,status=CASE WHEN status='submitted' THEN 'submitted' ELSE ? END,name=?,email=?,phone=?,company=?,answers=?,consent=?,origin=?,updated=?,submitted=CASE WHEN ?='submitted' AND submitted='' THEN ? ELSE submitted END WHERE id=?",
        )
        .bind(session, status, field(body.name, 160), email, field(body.phone, 80), field(body.company, 200), JSON.stringify(answers), consent, origin, now, status, now, id)
        .run();
    } else {
      await db
        .prepare(
          "INSERT INTO centralized_leads(id,product,source,visitor,session,status,name,email,phone,company,answers,consent,origin,created,updated,submitted) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        )
        .bind(id, product, source, visitor, session, status, field(body.name, 160), email, field(body.phone, 80), field(body.company, 200), JSON.stringify(answers), consent, origin, now, now, status === "submitted" ? now : "")
        .run();
    }

    // Aviso opcional (n8n/CRM) quando o lead é enviado pela primeira vez. Nunca bloqueia a resposta.
    const hook = process.env.LEAD_WEBHOOK_URL;
    if (hook && status === "submitted" && existing?.status !== "submitted") {
      fetch(hook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, product, source, name: field(body.name, 160), email, phone: field(body.phone, 80), company: field(body.company, 200), answers }),
      }).catch((error) => console.error("[leads] webhook falhou:", error));
    }

    return Response.json({ ok: true, id }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[leads]", error);
    return Response.json({ error: "Não foi possível receber as respostas agora." }, { status: 503 });
  }
}
