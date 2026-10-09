import { auth } from "@/lib/auth";
import { nexdb } from "@/lib/nexdb";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

// Rastreio unificado dos produtos NEX (Site Studio, Blueprint, Context Agent, Squad, Central).
// Mesma origem do site, então não precisa de CORS: só aceitamos requisições do próprio domínio.
// Eventos de funil guardam a etapa (step) e metadados (meta) para sabermos ONDE o visitante parou.

const PRODUCTS = new Set(["site-studio", "blueprint", "context-agent", "squad", "central", "havi"]);
const KINDS = new Set([
  "page_view",
  "click",
  "cta_click",
  "whatsapp_click",
  "step_view", // visitante chegou numa etapa/pergunta
  "step_answer", // respondeu a etapa
  "form_start",
  "form_submit",
  "scroll_depth",
  "abandon", // saiu com o funil pela metade
  "havi_open",
  "havi_message",
  "client_error",
]);

const clean = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true; // sendBeacon/same-origin sem header
  try {
    return new URL(origin).host === (request.headers.get("host") ?? new URL(request.url).host);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Origem inválida." }, { status: 403 });
  if (!checkRateLimit(`track:${getClientIp(request)}`, 240).allowed) return Response.json({ error: "Muitas requisições." }, { status: 429 });

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return Response.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const visitor = clean(body.visitor, 80);
  const session = clean(body.session, 80);
  const product = clean(body.product, 40);
  const kind = clean(body.kind, 30);
  const path = clean(body.path, 500);
  if (
    !/^[-a-zA-Z0-9]{12,80}$/.test(visitor) ||
    !/^[-a-zA-Z0-9]{12,80}$/.test(session) ||
    !PRODUCTS.has(product) ||
    !KINDS.has(kind) ||
    !path.startsWith("/") ||
    path.startsWith("//")
  ) {
    return Response.json({ error: "Evento inválido." }, { status: 400 });
  }

  let meta = "";
  if (body.meta && typeof body.meta === "object") {
    try {
      meta = JSON.stringify(body.meta).slice(0, 1500);
    } catch {
      meta = "";
    }
  }

  // Se o visitante está logado, o evento ganha o e-mail (server-side, não dá pra forjar).
  let email = "";
  try {
    email = ((await auth())?.user?.email ?? "").slice(0, 254);
  } catch {
    email = "";
  }

  try {
    const now = new Date().toISOString();
    const step = clean(body.step, 80);
    await nexdb()
      .prepare(
        // page_view repetido no mesmo caminho em 5s conta uma vez (React em dev, re-render de rota)
        "INSERT INTO analytics_events(id,visitor,session,product,kind,path,target,referrer,created,step,meta,email) SELECT ?,?,?,?,?,?,?,?,?,?,?,? WHERE NOT (? = 'page_view' AND EXISTS (SELECT 1 FROM analytics_events WHERE visitor=? AND product=? AND kind='page_view' AND path=? AND created>=?))",
      )
      .bind(
        crypto.randomUUID(),
        visitor,
        session,
        product,
        kind,
        path,
        clean(body.target, 500),
        clean(body.referrer, 500),
        now,
        step,
        meta,
        email,
        kind,
        visitor,
        product,
        path,
        new Date(Date.now() - 5000).toISOString(),
      )
      .run();
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[track]", error);
    return Response.json({ error: "Não foi possível registrar o evento." }, { status: 503 });
  }
}
