/* NEX — rastreio unificado dos produtos (Site Studio, Blueprint, Context Agent, Squad, Central).
   Mesma origem do site oficial: grava em /api/track (sem CORS). Mantém a API antiga
   (window.NEXTracking.track / attribution / sessionId e window.NEX_TRACK) para os scripts dos produtos. */
(() => {
  if (window.NEX_TRACK && window.NEX_TRACK.__ready) return;

  const API = '/api/track';
  const path = location.pathname;
  const product = path.startsWith('/blueprint') ? 'blueprint'
    : path.startsWith('/context-agent') ? 'context-agent'
    : path.startsWith('/squad') ? 'squad'
    : path.startsWith('/central') ? 'central'
    : 'site-studio';

  const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}-${Math.random().toString(16).slice(2)}`);
  const store = (area, key) => {
    try { let v = area.getItem(key); if (!v) { v = uuid(); area.setItem(key, v); } return v; } catch { return uuid(); }
  };
  const params = new URLSearchParams(location.search);
  const visitor = store(localStorage, 'nex_visitor');
  const session = store(sessionStorage, 'nex_session');

  // ---- atribuição (UTM / gclid / fbclid), primeiro e último toque ----
  const ATTR = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'ad_id', 'gclid', 'fbclid'];
  const readJSON = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; } };
  const incoming = Object.fromEntries(ATTR.map(k => [k, params.get(k)]).filter(([, v]) => v));
  const direct = { utm_source: 'direct', utm_medium: 'none' };
  try {
    if (!localStorage.getItem('nex_first_touch_v1')) localStorage.setItem('nex_first_touch_v1', JSON.stringify({ ...(Object.keys(incoming).length ? incoming : direct), landing_path: path, captured_at: new Date().toISOString() }));
    if (Object.keys(incoming).length) localStorage.setItem('nex_last_touch_v1', JSON.stringify({ ...incoming, landing_path: path, captured_at: new Date().toISOString() }));
  } catch { /* storage indisponível */ }
  const attribution = () => ({ first_touch: readJSON('nex_first_touch_v1', direct), last_touch: readJSON('nex_last_touch_v1', readJSON('nex_first_touch_v1', direct)) });

  // ---- envio ----
  const clean = (v, n = 180) => String(v ?? '').slice(0, n);
  const post = (body) => {
    const json = JSON.stringify(body);
    try {
      if (navigator.sendBeacon && navigator.sendBeacon(API, new Blob([json], { type: 'application/json' }))) return;
    } catch { /* cai pro fetch */ }
    fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: json, keepalive: true }).catch(() => {});
  };
  const send = (kind, target = '', extra = {}) => {
    const a = attribution().last_touch || {};
    post({
      visitor, session, product, kind,
      path: location.pathname + location.search,
      target: clean(target, 500),
      referrer: clean(document.referrer, 500),
      step: clean(extra.step || '', 80),
      meta: { ...(extra.meta || {}), src: a.utm_source, med: a.utm_medium, camp: a.utm_campaign },
    });
  };

  // ---- funil: etapa atual (para registrar onde o visitante parou) ----
  let funnel = null; // { name, step, n, total }
  const funnelStep = (name, step, n, total) => {
    funnel = { name, step: String(step), n, total };
    send('step_view', name, { step: String(step), meta: { n, total } });
  };
  const funnelDone = () => { funnel = null; };
  const abandon = () => {
    if (!funnel) return;
    send('abandon', funnel.name, { step: funnel.step, meta: { n: funnel.n, total: funnel.total } });
    funnel = null;
  };
  addEventListener('pagehide', abandon);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') abandon(); });

  // ---- compat com o contrato antigo: track(nome, props) ----
  const NAME_MAP = {
    booking_started: ['form_start', 'booking'],
    booking_step_view: ['step_view', 'booking'],
    booking_step_completed: ['step_answer', 'booking'],
    booking_completed: ['form_submit', 'booking'],
    booking_whatsapp_opened: ['whatsapp_click', 'booking'],
    schedule_cta_click: ['cta_click', 'agendar'],
    whatsapp_click: ['whatsapp_click', ''],
    growth_scan_started: ['form_start', 'growth-scan'],
    growth_scan_step_view: ['step_view', 'growth-scan'],
    growth_scan_step_completed: ['step_answer', 'growth-scan'],
    growth_scan_completed: ['form_submit', 'growth-scan'],
    studio_briefing_sent: ['form_submit', 'briefing'],
    squad_quiz_started: ['form_start', 'squad-quiz'],
    squad_quiz_change: ['step_answer', 'squad-quiz'],
    squad_quiz_submitted: ['form_submit', 'squad-quiz'],
  };
  const track = (name, props = {}) => {
    const payload = { event: 'nex_event', event_name: clean(name), event_time: new Date().toISOString(), session_id: session, page_path: path, page_title: document.title, ...attribution(), properties: props };
    (window.dataLayer = window.dataLayer || []).push(payload);
    window.dispatchEvent(new CustomEvent('nex:tracked', { detail: payload }));
    const [kind, funnelName] = NAME_MAP[name] || ['click', ''];
    const step = props.question || props.step || '';
    if (kind === 'step_view' && funnelName) {
      funnel = { name: funnelName, step: String(step), n: props.step, total: props.total };
    }
    if (kind === 'form_submit') funnelDone();
    send(kind, funnelName || name, { step: String(step), meta: props });
    return payload;
  };

  window.NEXTracking = { track, attribution, sessionId: session, funnelStep, funnelDone };
  // NEX_TRACK.send é a API usada pelo Context Agent: nomes próprios viram os tipos de evento do funil
  const ALIAS = { context_answer: 'step_answer', context_complete: 'form_submit', whatsapp: 'whatsapp_click' };
  const KNOWN = new Set(['page_view', 'click', 'cta_click', 'whatsapp_click', 'step_view', 'step_answer', 'form_start', 'form_submit', 'scroll_depth', 'abandon', 'havi_open', 'havi_message', 'client_error']);
  window.NEX_TRACK = {
    __ready: true, visitor, session, product,
    send: (kind, target) => {
      const mapped = ALIAS[kind] || (KNOWN.has(kind) ? kind : 'click');
      if (kind === 'context_answer') send('step_answer', 'context', { step: String(target || '') });
      else if (kind === 'context_complete') send('form_submit', 'context');
      else if (mapped === 'click' && kind !== 'click') send('click', kind + (target ? ':' + target : '')); // ação própria do produto (ex.: deliverable_copy:context_master)
      else send(mapped, target || '');
      if (mapped === 'form_submit') funnelDone();
      return Promise.resolve();
    },
  };

  // ---- automático: visita, cliques, rolagem, erros ----
  send('page_view');

  addEventListener('click', (event) => {
    const el = event.target && event.target.closest ? event.target.closest('a[href],button') : null;
    if (!el) return;
    const href = el.tagName === 'A' ? el.href : '';
    const label = clean((el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim(), 80);
    if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) { send('whatsapp_click', label || href); return; }
    if (el.tagName === 'A') {
      let u; try { u = new URL(href, location.href); } catch { return; }
      const isButton = /(^|\s)(button|btn|cta|primary|nav-cta|glass)(\s|$)/.test(el.className || '') || el.hasAttribute('data-cta');
      send(isButton ? 'cta_click' : 'click', (u.origin === location.origin ? u.pathname + u.search : u.href) + (label ? ` | ${label}` : ''));
    } else if (el.hasAttribute('data-cta')) {
      // botões de formulário (Continuar, Voltar) já são cobertos pelos eventos de etapa
      send('cta_click', label);
    }
  }, { capture: true });

  const marks = [25, 50, 75, 100]; const reached = new Set();
  addEventListener('scroll', () => {
    const doc = document.documentElement;
    const room = doc.scrollHeight - innerHeight;
    const pct = room <= 0 ? 100 : Math.min(100, Math.round((scrollY / room) * 100));
    for (const m of marks) if (pct >= m && !reached.has(m)) { reached.add(m); send('scroll_depth', String(m), { meta: { percent: m } }); }
  }, { passive: true });

  addEventListener('error', (e) => send('client_error', clean(e.message, 200), { meta: { file: clean(e.filename, 200), line: e.lineno } }));
})();
