/* NEX — envio de leads dos produtos para /api/leads (mesma origem), com fila offline e reenvio. */
(() => {
  const ENDPOINT = '/api/leads';
  const QUEUE_KEY = 'nex_lead_queue_v2';
  const readQueue = () => { try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]'); } catch { return []; } };
  const writeQueue = (queue) => { try { localStorage.setItem(QUEUE_KEY, JSON.stringify(queue.slice(-20))); } catch { /* navegação privada */ } };
  const identity = () => ({
    visitor: (window.NEX_TRACK && window.NEX_TRACK.visitor) || localStorage.getItem('nex_visitor') || '',
    session: (window.NEX_TRACK && window.NEX_TRACK.session) || sessionStorage.getItem('nex_session') || '',
  });
  const deliver = async (payload) => {
    const response = await fetch(ENDPOINT, {
      method: 'POST', keepalive: true,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...identity(), ...payload }),
    });
    if (!response.ok) {
      const error = new Error(`Lead endpoint returned ${response.status}`);
      error.status = response.status;
      throw error;
    }
    return response.json();
  };
  const flush = async () => {
    const queue = readQueue();
    if (!queue.length) return;
    const pending = [];
    for (const item of queue) {
      try { await deliver(item.payload); }
      catch (error) { if (!(error.status >= 400 && error.status < 500)) pending.push(item); } // 4xx = payload inválido, não adianta reenviar
    }
    writeQueue(pending);
  };
  const submit = async (payload) => {
    try { return await deliver(payload); }
    catch (error) {
      if (!(error.status >= 400 && error.status < 500)) {
        const queue = readQueue();
        queue.push({ queuedAt: new Date().toISOString(), payload });
        writeQueue(queue);
      }
      throw error;
    }
  };
  window.NEXLeads = { submit, flush };
  addEventListener('online', flush);
  setTimeout(flush, 800);
})();
