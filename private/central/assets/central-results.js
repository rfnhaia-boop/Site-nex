// Aba "Resultados" da Central: números reais dos últimos 30 dias (visitas, leads, onde cada pessoa parou).
// A Central só é servida a administradores, então a API de admin responde com a sessão atual.
(() => {
  const root = document.getElementById("results-root");
  if (!root) return;
  const NAMES = { blueprint: "Blueprint", squad: "Squad", "context-agent": "Context Agent", context: "Context Agent", studio: "Site Studio", site: "Site NEX", havi: "Havi", central: "Central" };
  Object.assign(NAMES, { "site-studio": "Site Studio", booking: "Agendamento (Blueprint)", briefing: "Briefing (Site Studio)", "squad-quiz": "Diagnóstico (Squad)", scan: "Growth Scan (Blueprint)", "growth-scan": "Growth Scan (Blueprint)" });
  const STEPS = { name: "Nome", phone: "WhatsApp", company: "Empresa", sector: "Setor", date: "Data", time: "Horário", email: "E-mail", contact: "Contato", review: "Revisão", materials: "Materiais", goal: "Objetivo", offer: "Oferta", challenge: "Desafio", source: "Origem", loss: "Perdas", routine: "Rotina" };
  const label = (p) => NAMES[p] || p || "Outros";
  const stepLabel = (s) => STEPS[s] || s;
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  };
  const get = async (view) => {
    const r = await fetch("/api/studio/admin?view=" + view, { credentials: "include", cache: "no-store" });
    if (!r.ok) throw new Error(String(r.status));
    return r.json();
  };
  const when = (iso) => {
    const d = new Date(String(iso).replace(" ", "T") + (String(iso).includes("Z") ? "" : "Z"));
    return isNaN(d) ? "" : d.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  };
  const card = (title, sub) => {
    const s = el("section", "glass res-card");
    s.append(el("h2", "", title));
    if (sub) s.append(el("p", "res-sub", sub));
    return s;
  };

  function renderTotals(data) {
    const s = card("Visão dos últimos 30 dias");
    const g = el("div", "res-kpis");
    const t = data.totals || {};
    const leadRows = data.leadSummary || [];
    const leads = leadRows.reduce((a, r) => a + (r.submitted || 0), 0) + ((data.studio && data.studio.submitted) || 0);
    [["Visitantes", t.visitors || 0], ["Páginas vistas", t.views || 0], ["Cliques em botões", t.clicks || 0], ["Pedidos enviados", leads]].forEach(([k, v]) => {
      const b = el("div", "res-kpi");
      b.append(el("strong", "", String(v)), el("span", "", k));
      g.append(b);
    });
    s.append(g);
    const rows = data.summary || [];
    if (rows.length) {
      const tbl = el("table", "res-table");
      const head = el("tr");
      ["Produto", "Visitantes", "Páginas", "Cliques", "Pedidos enviados"].forEach((h) => head.append(el("th", "", h)));
      tbl.append(head);
      rows.forEach((r) => {
        const tr = el("tr");
        const lead = leadRows.find((l) => l.product === r.product);
        const sub = r.product === "studio" ? (data.studio && data.studio.submitted) || 0 : lead ? lead.submitted : 0;
        [label(r.product), r.visitors, r.views, r.clicks, sub].forEach((c) => tr.append(el("td", "", String(c))));
        tbl.append(tr);
      });
      s.append(tbl);
    } else s.append(el("p", "res-empty", "Ainda não há visitas registradas. Os números aparecem assim que o site receber tráfego."));
    return s;
  }

  function renderFunnels(data) {
    const s = card("Onde as pessoas pararam", "Cada barra mostra quantas pessoas chegaram naquela pergunta. “Parou aqui” é quem saiu sem enviar.");
    const list = (data.funnels || []).filter((f) => f.started > 0);
    if (!list.length) {
      s.append(el("p", "res-empty", "Nenhum formulário foi iniciado ainda."));
      return s;
    }
    list.forEach((f) => {
      const box = el("div", "res-funnel");
      const rate = f.started ? Math.round((f.done / f.started) * 100) : 0;
      box.append(el("h3", "", label(f.name) + " · " + f.started + " começaram, " + f.done + " enviaram (" + rate + "%)"));
      const max = Math.max(1, ...f.steps.map((x) => x.visitors));
      f.steps.forEach((st) => {
        const row = el("div", "res-step");
        row.append(el("span", "res-step-name", stepLabel(st.step)));
        const bar = el("div", "res-bar");
        const fill = el("i");
        fill.style.width = Math.max(4, Math.round((st.visitors / max) * 100)) + "%";
        bar.append(fill);
        row.append(bar, el("span", "res-step-n", st.visitors + (st.stoppedHere ? " · parou aqui: " + st.stoppedHere : "")));
        box.append(row);
      });
      s.append(box);
    });
    return s;
  }

  function renderLeads(data) {
    const s = card("Últimos contatos", "Pessoas que deixaram dados (com autorização). Rascunhos são quem começou e não enviou.");
    const leads = (data.leads || []).slice(0, 15);
    if (!leads.length) {
      s.append(el("p", "res-empty", "Nenhum contato ainda."));
      return s;
    }
    const tbl = el("table", "res-table");
    const head = el("tr");
    ["Quando", "Produto", "Nome", "Contato", "Situação"].forEach((h) => head.append(el("th", "", h)));
    tbl.append(head);
    leads.forEach((l) => {
      const tr = el("tr");
      [when(l.updated || l.created), label(l.product), l.name || "—", l.phone || l.email || "—", l.status === "submitted" ? "Enviado" : "Rascunho"].forEach((c) => tr.append(el("td", "", String(c))));
      tbl.append(tr);
    });
    s.append(tbl);
    return s;
  }

  async function load() {
    root.replaceChildren(el("p", "res-empty", "Carregando…"));
    try {
      const [a, f, l] = await Promise.all([get("analytics"), get("funnel"), get("leads")]);
      root.replaceChildren(renderTotals(a), renderFunnels(f), renderLeads(l));
    } catch {
      root.replaceChildren(el("p", "res-empty", "Não foi possível carregar os números agora. Atualize a página; se continuar, entre de novo como administrador."));
    }
  }
  document.getElementById("results-refresh")?.addEventListener("click", load);
  document.querySelector('.nav-tab[data-view="results"]')?.addEventListener("click", load);
  load();
})();
