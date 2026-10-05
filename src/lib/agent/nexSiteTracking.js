// Espelha o Lead/análise já capturados pela conversa do Havi também como uma
// SiteConversation no NEX Core (Inteligência do Site → Conversas) — mesmo
// padrão fire-and-forget de nexOsAnalysis.js: nunca bloqueia nem derruba o chat.
export function trackConversationToNexCore(sessionId, messages) {
  const baseUrl = process.env.NEXT_PUBLIC_NEX_CORE_URL;
  const trackingKey = process.env.NEXT_PUBLIC_NEX_TRACKING_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!baseUrl || !trackingKey) {
    console.error('[nexSiteTracking] NEXT_PUBLIC_NEX_CORE_URL/NEXT_PUBLIC_NEX_TRACKING_KEY não configurados.');
    return;
  }

  const now = Date.now();
  const trackedMessages = messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m, i, arr) => ({
      role: m.role === 'user' ? 'visitor' : 'ravi',
      text: m.content.slice(0, 4000),
      // Sem timestamp por mensagem na origem — aproxima em ordem, 1s de intervalo,
      // terminando "agora" na última mensagem (a resposta que acabou de fechar).
      at: new Date(now - (arr.length - 1 - i) * 1000).toISOString(),
    }));

  if (trackedMessages.length === 0) return;

  const headers = { 'Content-Type': 'application/json' };
  // Chamada servidor-a-servidor não tem Origin/Referer de browser — o NEX Core
  // autoriza por domínio, então declara explicitamente o domínio real do site.
  if (siteUrl) headers.Referer = `${siteUrl}/`;

  fetch(`${baseUrl}/api/sites/${trackingKey}/conversations`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ visitorRef: sessionId, messages: trackedMessages }),
  })
    .then(async (res) => {
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        console.error('[nexSiteTracking] NEX Core rejeitou a conversa:', res.status, data?.error);
      }
    })
    .catch((error) => {
      console.error('[nexSiteTracking] falha ao enviar conversa pro NEX Core:', error);
    });
}
