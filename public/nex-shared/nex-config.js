/* NEX — configuração única dos produtos. Trocar aqui vale para Blueprint, Squad, Context Agent e Studio. */
window.NEX_WHATSAPP_NUMBER = window.NEX_WHATSAPP_NUMBER || '5511936202934';
// Identificação da empresa no rodapé (LGPD/CDC). Preencher o CNPJ aqui faz a linha aparecer em todos os produtos.
window.NEX_COMPANY = window.NEX_COMPANY || { legal: 'NEW', cnpj: '' };

(function () {
  function fixWhatsApp() {
    var n = window.NEX_WHATSAPP_NUMBER;
    document.querySelectorAll('a[href*="wa.me/"]').forEach(function (a) {
      a.href = a.href.replace(/wa\.me\/\d*/, 'wa.me/' + n);
    });
  }
  function companyLine() {
    var c = window.NEX_COMPANY;
    if (!c || !c.cnpj || document.querySelector('.nex-company-id')) return;
    var footers = document.querySelectorAll('footer');
    var target = footers[footers.length - 1];
    if (!target) return;
    var p = document.createElement('p');
    p.className = 'nex-company-id';
    p.style.cssText = 'margin:14px 0 0;font-size:11px;line-height:1.5;color:#9aa0a8;text-align:center';
    p.textContent = 'NEX é uma marca da ' + c.legal + ' · CNPJ ' + c.cnpj + ' · Jundiaí, SP';
    target.appendChild(p);
  }
  function run() { fixWhatsApp(); companyLine(); setTimeout(function () { fixWhatsApp(); companyLine(); }, 1500); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
