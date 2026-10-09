/* NEX — botão do Havi nos produtos: abre o chat (iframe de /havi-embed) num painel, sem sair da página. */
(() => {
  if (window.__nexHavi) return;
  window.__nexHavi = true;
  const path = location.pathname;
  const from = path.startsWith('/blueprint') ? 'blueprint'
    : path.startsWith('/context-agent') ? 'context-agent'
    : path.startsWith('/squad') ? 'squad'
    : 'studio';

  const css = document.createElement('style');
  css.textContent = `
  .nex-havi-fab{position:fixed;right:18px;bottom:18px;z-index:2147483000;display:flex;align-items:center;gap:10px;border:1px solid rgba(255,106,0,.45);background:rgba(8,10,12,.82);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);color:#fff;border-radius:999px;padding:6px 16px 6px 6px;cursor:pointer;font:600 13px/1 Inter,system-ui,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.45),0 0 18px rgba(255,106,0,.25);transition:transform .2s,box-shadow .2s}
  .nex-havi-fab:hover{transform:translateY(-2px);box-shadow:0 14px 34px rgba(0,0,0,.5),0 0 26px rgba(255,106,0,.4)}
  .nex-havi-fab img{width:38px;height:38px;border-radius:50%;object-fit:cover;border:1px solid rgba(255,106,0,.6)}
  .nex-havi-fab span{white-space:nowrap}
  .nex-havi-panel{position:fixed;right:18px;bottom:18px;z-index:2147483001;width:min(400px,calc(100vw - 24px));height:min(640px,calc(100dvh - 36px));border:1px solid rgba(255,255,255,.14);border-radius:20px;overflow:hidden;background:#07090b;box-shadow:0 24px 70px rgba(0,0,0,.65);display:none}
  .nex-havi-panel.open{display:block}
  .nex-havi-panel iframe{width:100%;height:100%;border:0;display:block}
  .nex-havi-close{position:absolute;top:10px;right:10px;z-index:2;width:30px;height:30px;border-radius:50%;border:1px solid rgba(255,255,255,.18);background:rgba(0,0,0,.55);color:#fff;font-size:16px;line-height:1;cursor:pointer}
  @media (max-width:520px){.nex-havi-panel{right:0;bottom:0;width:100vw;height:100dvh;border-radius:0;border:0}.nex-havi-fab{right:12px;bottom:12px}.nex-havi-fab span{display:none}.nex-havi-fab{padding:5px}}
  @media print{.nex-havi-fab,.nex-havi-panel{display:none!important}}`;
  document.head.appendChild(css);

  const fab = document.createElement('button');
  fab.type = 'button';
  fab.className = 'nex-havi-fab';
  fab.setAttribute('aria-label', 'Falar com o Havi, a IA da NEX');
  fab.innerHTML = '<img src="/ravi-avatar-sm.webp" alt=""><span>Fale com o Havi</span>';

  const panel = document.createElement('div');
  panel.className = 'nex-havi-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Chat com o Havi');
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'nex-havi-close';
  close.setAttribute('aria-label', 'Fechar chat');
  close.textContent = '×';
  panel.appendChild(close);

  let frame = null;
  const open = () => {
    if (!frame) {
      frame = document.createElement('iframe');
      frame.title = 'Havi, a IA da NEX';
      frame.src = '/havi-embed?from=' + from;
      frame.allow = 'microphone';
      panel.appendChild(frame);
    }
    panel.classList.add('open');
    fab.style.display = 'none';
    if (window.NEX_TRACK) window.NEX_TRACK.send('havi_open', from);
  };
  const shut = () => { panel.classList.remove('open'); fab.style.display = ''; };
  fab.addEventListener('click', open);
  close.addEventListener('click', shut);
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && panel.classList.contains('open')) shut(); });
  addEventListener('message', (e) => {
    if (e.origin !== location.origin || !e.data || e.data.type !== 'havi_message') return;
    if (window.NEX_TRACK) window.NEX_TRACK.send('havi_message', from);
  });

  // Links de CTA da página podem abrir o Havi: <a data-open-havi> ou #havi
  document.addEventListener('click', (e) => {
    const t = e.target && e.target.closest ? e.target.closest('[data-open-havi],a[href="#havi"]') : null;
    if (t) { e.preventDefault(); open(); }
  });

  const mount = () => { document.body.appendChild(fab); document.body.appendChild(panel); };
  if (document.body) mount(); else addEventListener('DOMContentLoaded', mount);
})();
