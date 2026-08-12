// Rate limit simples em memória, por IP — suficiente pra barrar abuso básico num lançamento.
// Limitação conhecida: reseta se o processo reiniciar, e não é compartilhado entre instâncias
// (se algum dia isso rodar em múltiplos servidores/serverless replicado, trocar por algo
// centralizado tipo Redis/Upstash). Pra um único servidor, funciona de verdade.

const buckets = new Map();
const WINDOW_MS = 60_000;

// Limpa entradas velhas de tempos em tempos pra não vazar memória.
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of buckets) {
    if (now - entry.windowStart > WINDOW_MS) buckets.delete(key);
  }
}, WINDOW_MS).unref?.();

export function getClientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}

// Retorna { allowed: boolean, remaining: number }. `limit` = requisições permitidas por minuto.
export function checkRateLimit(key, limit = 20) {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    buckets.set(key, { windowStart: now, count: 1 });
    return { allowed: true, remaining: limit - 1 };
  }

  entry.count += 1;
  if (entry.count > limit) {
    return { allowed: false, remaining: 0 };
  }
  return { allowed: true, remaining: limit - entry.count };
}
