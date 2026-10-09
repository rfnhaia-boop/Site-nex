/* NEX — configuração única dos produtos. Trocar aqui vale para Blueprint, Squad, Context Agent e Studio. */
window.NEX_WHATSAPP_NUMBER = window.NEX_WHATSAPP_NUMBER || '5511953878155';
// Links wa.me escritos direto no HTML passam a usar o número configurado.
(function () {
  function fix() {
    var n = window.NEX_WHATSAPP_NUMBER;
    document.querySelectorAll('a[href*="wa.me/"]').forEach(function (a) {
      a.href = a.href.replace(/wa\.me\/\d*/, 'wa.me/' + n);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fix); else fix();
})();
