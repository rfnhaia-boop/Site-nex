const NEX_CORE_URL = process.env.NEXT_PUBLIC_NEX_CORE_URL;
const TRACKING_KEY = process.env.NEXT_PUBLIC_NEX_TRACKING_KEY;

export const nexTrackingConfigured = Boolean(NEX_CORE_URL && TRACKING_KEY);

const VISITOR_ID_KEY = "nex_visitor_id";
const SESSION_ID_KEY = "nex_session_id";
const UTM_KEY = "nex_utm";

const UTM_PARAMS = ["source", "medium", "campaign", "content", "term"] as const;
type Utm = Partial<Record<(typeof UTM_PARAMS)[number], string>>;

function getOrCreateId(storageKey: string, storage: Storage): string {
  const existing = storage.getItem(storageKey);
  if (existing) return existing;
  const id = crypto.randomUUID();
  storage.setItem(storageKey, id);
  return id;
}

function getVisitorId(): string {
  return getOrCreateId(VISITOR_ID_KEY, window.localStorage);
}

function getBrowserSessionId(): string {
  return getOrCreateId(SESSION_ID_KEY, window.sessionStorage);
}

// UTM vale pra sessão inteira: captura na página de entrada e guarda, porque as
// páginas seguintes da navegação já não têm os parâmetros na URL.
function getSessionUtm(): Utm | undefined {
  try {
    const params = new URLSearchParams(window.location.search);
    const fromUrl: Utm = {};
    for (const key of UTM_PARAMS) {
      const value = params.get(`utm_${key}`);
      if (value) fromUrl[key] = value.slice(0, 200);
    }
    if (Object.keys(fromUrl).length > 0) {
      window.sessionStorage.setItem(UTM_KEY, JSON.stringify(fromUrl));
      return fromUrl;
    }
    const stored = window.sessionStorage.getItem(UTM_KEY);
    return stored ? (JSON.parse(stored) as Utm) : undefined;
  } catch {
    return undefined;
  }
}

// Navegador interno de app (link da bio do Instagram, anúncio do Facebook...):
// esses apps costumam abrir o site SEM referrer, então sem isso a visita vira
// "Direto". O user-agent deles se identifica; o NEX Core usa como origem.
function inAppBrowser(): string | undefined {
  const ua = navigator.userAgent;
  if (/Instagram/i.test(ua)) return "instagram-app";
  if (/FBAN|FBAV|FB_IAB|FBIOS/i.test(ua)) return "facebook-app";
  if (/LinkedInApp/i.test(ua)) return "linkedin-app";
  if (/musical_ly|BytedanceWebview|TikTok/i.test(ua)) return "tiktok-app";
  return undefined;
}

type EventOptions = {
  metadata?: Record<string, unknown>;
};

export function trackEvent(eventName: string, options: EventOptions = {}) {
  if (!nexTrackingConfigured || typeof window === "undefined") return;

  const width = window.innerWidth;
  const height = window.innerHeight;
  // innerWidth/innerHeight podem vir 0 em momentos raros (aba oculta, tab
  // ainda não pintada) — o schema do NEX Core exige > 0, então só manda
  // viewport quando o valor é utilizável; nunca deixa isso derrubar o evento inteiro.
  const hasValidViewport = width > 0 && height > 0;
  const utm = getSessionUtm();

  const body = {
    eventName,
    sessionId: getBrowserSessionId(),
    anonymousVisitorId: getVisitorId(),
    pageUrl: window.location.href,
    referrer: document.referrer || undefined,
    metadata: options.metadata,
    context: {
      ...(hasValidViewport ? { viewport: { width, height } } : {}),
      ...(utm ? { utm } : {}),
      ...(inAppBrowser() ? { browser: inAppBrowser() } : {}),
      deviceClass: width === 0 ? undefined : width < 768 ? "mobile" : width < 1024 ? "tablet" : "desktop",
    },
    occurredAt: new Date().toISOString(),
  };

  fetch(`${NEX_CORE_URL}/api/sites/${TRACKING_KEY}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {
    // Best-effort — nunca deixa o tracking quebrar a experiência do site.
  });
}

// page_view idempotente: o mesmo caminho em menos de 2s conta uma vez só
// (evita contagem dupla do React em desenvolvimento e re-render de rota).
let lastPageView: { path: string; at: number } | null = null;
export function trackPageView(path: string) {
  const now = Date.now();
  if (lastPageView && lastPageView.path === path && now - lastPageView.at < 2000) return;
  lastPageView = { path, at: now };
  trackEvent("page_view");
}

// Profundidade de rolagem: manda cada marco (25/50/75/100%) uma vez por página.
// Devolve a função de limpeza pra ser chamada na troca de rota.
export function trackScrollDepth(): () => void {
  if (!nexTrackingConfigured || typeof window === "undefined") return () => {};
  const marks = [25, 50, 75, 100];
  const reached = new Set<number>();

  const onScroll = () => {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;
    const percent = scrollable <= 0 ? 100 : Math.min(100, Math.round((window.scrollY / scrollable) * 100));
    for (const mark of marks) {
      if (percent >= mark && !reached.has(mark)) {
        reached.add(mark);
        trackEvent("scroll_depth", { metadata: { percent: mark } });
      }
    }
    if (reached.size === marks.length) window.removeEventListener("scroll", onScroll);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}

// Web Vitals de usuário real (biblioteca oficial do Google). Registra uma vez por
// carregamento de página — a própria lib reporta cada métrica no momento certo.
let webVitalsStarted = false;
export async function trackWebVitals() {
  if (webVitalsStarted || !nexTrackingConfigured || typeof window === "undefined") return;
  webVitalsStarted = true;
  const { onLCP, onINP, onCLS, onFCP, onTTFB } = await import("web-vitals");
  const send = (metric: { name: string; value: number; rating: string; id: string }) =>
    trackEvent("web_vital", {
      metadata: { metric: metric.name, value: metric.value, rating: metric.rating, id: metric.id },
    });
  onLCP(send);
  onINP(send);
  onCLS(send);
  onFCP(send);
  onTTFB(send);
}

// Erros de JavaScript reais dos visitantes (aba Saúde do NEX OS). Só a mensagem
// técnica e o arquivo — nunca conteúdo digitado. Cada mensagem vai 1x por página.
let errorTrackingStarted = false;
export function trackClientErrors() {
  if (errorTrackingStarted || !nexTrackingConfigured || typeof window === "undefined") return;
  errorTrackingStarted = true;
  const sent = new Set<string>();
  const report = (message: string, source?: string) => {
    const key = `${message}|${source ?? ""}`;
    if (sent.has(key) || sent.size >= 10) return;
    sent.add(key);
    trackEvent("client_error", { metadata: { message: message.slice(0, 300), source: source?.slice(0, 300) } });
  };
  window.addEventListener("error", (e) => report(e.message || "erro de script", e.filename));
  window.addEventListener("unhandledrejection", (e) =>
    report(e.reason instanceof Error ? e.reason.message : String(e.reason ?? "promise rejeitada")),
  );
}

export function getVisitorRefForServer(): string {
  return getOrCreateId(VISITOR_ID_KEY, window.localStorage);
}
