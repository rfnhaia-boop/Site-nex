(() => {
  // Em páginas React o cabeçalho aparece depois do carregamento: tenta de novo até ele existir.
  const init = () => {

  const header = document.querySelector('body > header, .app > header, header.topbar, header');
  if (!header) return false;
  const logo = header.querySelector('img[alt="NEX"],img.logo,.brand img');
  if (!logo) return false;
  header.classList.add('nex-standard-nav');
  const inner = header.querySelector('.header-inner');
  if (inner) inner.classList.add('nex-standard-inner');
  const brand = logo.closest('a,button') || logo;
  brand.classList.add('nex-brand-switch');
  brand.setAttribute('role','button'); brand.setAttribute('tabindex','0');
  brand.setAttribute('aria-label','Escolher site NEX');
  brand.setAttribute('aria-expanded','false'); brand.setAttribute('aria-controls','nex-site-picker');
  const nav = header.querySelector('nav');
  if (nav) {
    nav.classList.add('nex-local-nav');
    const cta=header.querySelector('.nav-cta,.header-action,.button.small');
    if(cta&&!nav.contains(cta)){const copy=cta.cloneNode(true);copy.classList.add('nex-mobile-cta');nav.append(copy);}
  }
  const popup = document.createElement('div'); popup.id='nex-site-picker';
  popup.className='nex-site-picker'; popup.hidden=true;
  popup.setAttribute('aria-label','Sites NEX');
  const heading=document.createElement('div');heading.className='nex-picker-heading';
  heading.innerHTML='<span>EXPLORE A NEX</span><span class="nex-picker-hint">Escolha seu próximo passo</span>';popup.append(heading);
  const choices=document.createElement('div');choices.className='nex-picker-choices';popup.append(choices);
  const sites=[['01','Site Studio','Criação de sites','/studio','<path d="M7 8h28v21H7zM14 35h14M21 29v6"/>'],['02','Blueprint','Estratégia e direção','/blueprint/','<path d="M7 25V17h6v8m5 0V12h6v13m5 0V6h6v19M6 32h30"/>'],['03','Context Agent','Contexto e diagnóstico','/context-agent','<circle cx="21" cy="21" r="6"/><path d="M21 5v7m0 18v7M5 21h7m18 0h7M10 10l5 5m12 12 5 5M10 32l5-5m12-12 5-5"/>'],['04','Squad','Tecnologia e execução','/squad/','<path d="m21 7 15 8-15 8-15-8 15-8Zm-15 16 15 8 15-8M6 30l15 8 15-8"/>']];
  for (const [number,name,description,url,motif] of sites) {
    const link=document.createElement('a');link.href=url;link.className='nex-site-option';
    const circle=document.createElement('span');circle.className='nex-site-orb';
    circle.innerHTML='<svg viewBox="0 0 42 42" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+motif+'</svg>';
    const label=document.createElement('strong');label.textContent=name;
    const detail=document.createElement('span');detail.className='nex-site-detail';detail.textContent=description;
    const indicator=document.createElement('span');indicator.className='nex-site-status';indicator.textContent='Explorar';
    const base='/'+url.split('/').filter(Boolean)[0];const current=location.pathname===base||location.pathname.startsWith(base+'/');
    if(current){link.setAttribute('aria-current','page');indicator.textContent='Você está aqui';}
    link.append(circle,label,detail,indicator);choices.append(link);
  }
  const foot=document.createElement('div');foot.className='nex-picker-foot';
  foot.innerHTML='<a href="/">Site principal NEX</a><a href="#havi" data-open-havi>Falar com o Havi</a><a href="https://wa.me/5511936202934" target="_blank" rel="noopener">WhatsApp</a>';
  popup.append(foot);
  const footCss=document.createElement('style');footCss.textContent='.nex-picker-foot{display:flex;flex-wrap:wrap;gap:8px 18px;justify-content:center;margin-top:20px;padding-top:16px;border-top:1px solid #ffffff12;font-family:Inter,Arial,sans-serif}.nex-picker-foot a{font-size:11px;color:#b9bbc0;text-decoration:none}.nex-picker-foot a:hover{color:#ff8b54}';document.head.append(footCss);
  document.body.append(popup);
  const place=()=>{const r=brand.getBoundingClientRect();const width=popup.getBoundingClientRect().width||440;popup.style.left=Math.max(12,Math.min(r.left,innerWidth-width-12))+'px';popup.style.top=(r.bottom+20)+'px';};
  const close=()=>{popup.hidden=true;brand.setAttribute('aria-expanded','false');};
  const toggle=(e)=>{e.preventDefault();e.stopImmediatePropagation();popup.hidden=!popup.hidden;brand.setAttribute('aria-expanded',String(!popup.hidden));if(!popup.hidden)place();};
  brand.addEventListener('click',toggle,true);
  brand.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){toggle(e);if(!popup.hidden)popup.querySelector('a').focus();}});
  document.addEventListener('click',e=>{if(!popup.contains(e.target)&&!brand.contains(e.target))close();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){const open=!popup.hidden;close();header.classList.remove('nex-nav-open');if(menu)menu.setAttribute('aria-expanded','false');if(open)brand.focus();}});
  addEventListener('resize',place);addEventListener('scroll',close,{passive:true});
  let menu=null;
  if(nav){menu=document.createElement('button');menu.type='button';menu.className='nex-mobile-toggle';menu.textContent='☰';menu.setAttribute('aria-label','Abrir navegação');menu.setAttribute('aria-expanded','false');
    (inner||header).append(menu);menu.addEventListener('click',()=>{const open=header.classList.toggle('nex-nav-open');menu.setAttribute('aria-expanded',String(open));close();});
    nav.addEventListener('click',()=>{header.classList.remove('nex-nav-open');menu.setAttribute('aria-expanded','false');});
  }
    return true;
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  function start() {
    if (init()) return;
    const observer = new MutationObserver(() => { if (init()) observer.disconnect(); });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(() => observer.disconnect(), 15000);
  }
})();
