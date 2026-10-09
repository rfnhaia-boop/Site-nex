(() => {
  const questions = [
    {id:'name',category:'SEU CONTATO',title:'Como podemos chamar você?',description:'Seu nome para começarmos a conversa.',kind:'text',placeholder:'Seu nome',max:80},
    {id:'phone',category:'SEU CONTATO',title:'Qual é o seu WhatsApp?',description:'Para confirmar o horário e combinar o envio do primeiro e-book.',kind:'tel',placeholder:'(11) 99999-9999'},
    {id:'company',category:'SUA EMPRESA',title:'Qual é o nome da sua empresa?',description:'Se ainda estiver construindo a marca, pode usar o nome provisório.',kind:'text',placeholder:'Nome da empresa',max:100},
    {id:'sector',category:'SUA EMPRESA',title:'Em que área sua empresa atua?',description:'Conte o setor ou o tipo de negócio.',kind:'text',placeholder:'Ex.: serviços, varejo, indústria...',max:120},
    {id:'offer',category:'SUA OFERTA',title:'O que você vende hoje?',description:'Descreva o principal produto ou serviço em poucas palavras.',kind:'textarea',placeholder:'Ex.: projetos de esquadrias sob medida para residências',max:300},
    {id:'goal',category:'SEU OBJETIVO',title:'O que você quer melhorar primeiro?',description:'Escolha o ponto que mais pesa neste momento.',kind:'choices',options:['Atrair clientes mais alinhados','Converter mais oportunidades','Deixar a marca e a oferta mais claras','Organizar o crescimento','Outro objetivo']},
    {id:'challenge',category:'SEU DESAFIO',title:'O que mais trava o crescimento hoje?',description:'Pode escolher o principal gargalo percebido.',kind:'choices',options:['Pouca procura','Leads chegam, mas não fecham','Preço vira a maior objeção','Falta de processo ou acompanhamento','Ainda não sei']},
    {id:'source',category:'AQUISIÇÃO',title:'De onde vêm seus clientes atualmente?',description:'Escolha o canal que mais traz oportunidades.',kind:'choices',options:['Indicações','Instagram ou redes sociais','Anúncios pagos','Site ou Google','Prospecção ativa','Outro canal']},
    {id:'loss',category:'JORNADA DE VENDA',title:'Em que ponto você sente que perde oportunidades?',description:'Sua percepção já ajuda a orientar a primeira conversa.',kind:'choices',options:['Antes de entrarem em contato','Depois do primeiro contato','Na proposta ou negociação','Após a primeira compra','Ainda não consigo identificar']},
    {id:'routine',category:'PROCESSO COMERCIAL',title:'Como você acompanha quem demonstra interesse?',description:'Queremos entender a rotina atual, sem julgar o estágio da empresa.',kind:'choices',options:['Tenho CRM e rotina definida','Acompanho por WhatsApp ou planilha','Faço quando consigo','Ainda não acompanho']},
    {id:'date',category:'PREFERÊNCIA DE AGENDA',title:'Qual dia seria melhor para conversar?',description:'É uma preferência. A NEX confirma a disponibilidade pelo WhatsApp.',kind:'date'},
    {id:'time',category:'PREFERÊNCIA DE AGENDA',title:'Qual horário você prefere?',description:'Indique o horário de Brasília. A reunião depende de confirmação.',kind:'time'}
  ];
  const values = {};
  let step = 0;
  const $ = id => document.getElementById(id);
  const inputArea = $('question-input');
  const escapeHTML = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const dateParts = Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).filter(part=>part.type!=='literal').map(part=>[part.type,part.value]));
  const today = `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
  let visibleMonth = new Date(Number(dateParts.year),Number(dateParts.month)-1,1);
  const isoDate = (year,month,day) => `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  const paintCalendar = () => {
    const year=visibleMonth.getFullYear(),month=visibleMonth.getMonth();
    const first=(new Date(year,month,1).getDay()+6)%7;
    const count=new Date(year,month+1,0).getDate();
    const monthTitle=new Intl.DateTimeFormat('pt-BR',{month:'long',year:'numeric'}).format(visibleMonth);
    $('calendar-month').textContent=monthTitle.charAt(0).toUpperCase()+monthTitle.slice(1);
    $('calendar-prev').disabled=isoDate(year,month,1)<=isoDate(Number(dateParts.year),Number(dateParts.month)-1,1);
    $('calendar-days').innerHTML=Array(first).fill('<span class="calendar-blank" aria-hidden="true"></span>').join('')+Array.from({length:count},(_,i)=>{
      const date=isoDate(year,month,i+1),disabled=date<today,selected=$('answer').value===date;
      return `<button type="button" class="calendar-day" data-date="${date}" ${disabled?'disabled':''} aria-label="${i+1} de ${monthTitle}" aria-pressed="${selected}">${i+1}</button>`;
    }).join('');
  };
  const render = () => {
    const q = questions[step];
    const artwork = step < 2 ? 'hero-glass.webp' : step < 4 ? 'focus-marker.webp' : step < 6 ? 'journey-visual.png' : step < 10 ? 'growth-scan.webp' : 'closing-path-v2.webp';
    document.querySelector('.booking-art img').src = `/blueprint/assets/${artwork}`;
    $('step-label').textContent = `PERGUNTA ${String(step+1).padStart(2,'0')} DE 12`;
    $('step-percent').textContent = `${Math.round((step+1)/12*100)}%`;
    $('progress-fill').style.width = `${(step+1)/12*100}%`;
    window.NEXTracking?.track('booking_step_view',{step:step+1,total:12,question:q.id});
    $('question-category').textContent = q.category;
    $('question-title').textContent = q.title;
    $('question-description').textContent = q.description;
    $('question-error').textContent = '';
    $('previous-button').hidden = step === 0;
    $('next-button').textContent = step === 11 ? 'Revisar solicitação ↗' : 'Continuar ↗';
    if(q.kind === 'choices') {
      inputArea.innerHTML = `<div class="choice-list">${q.options.map((option,i)=>`<div class="choice"><input id="choice-${i}" name="answer" type="radio" value="${escapeHTML(option)}" ${values[q.id] === option || (values[q.id+'Other'] && i === q.options.length-1) ? 'checked' : ''}><label for="choice-${i}">${escapeHTML(option)}</label></div>`).join('')}</div><input id="other-answer" class="question-field other-field" type="text" maxlength="180" placeholder="Escreva em poucas palavras" value="${escapeHTML(values[q.id+'Other'] || '')}" style="display:none" aria-label="Especifique sua resposta">`;
      const radios = [...inputArea.querySelectorAll('input[type=radio]')];
      const other = $('other-answer');
      const showOther = () => {const active = radios.at(-1).checked && /^(Outro|Outra)/.test(radios.at(-1).value);other.style.display = active ? 'block':'none';if(active)other.focus()};
      radios.forEach(radio => radio.addEventListener('change',showOther));
      if(values[q.id+'Other'])other.style.display='block';
    } else if(q.kind === 'date') {
      if(values.date){const [year,month]=values.date.split('-').map(Number);visibleMonth=new Date(year,month-1,1)}
      inputArea.innerHTML='<div class="calendar-picker" aria-label="Escolha um dia para a conversa"><div class="calendar-top"><div><span class="calendar-caption">SUA PREFERÊNCIA</span><h3 id="calendar-month"></h3></div><div class="calendar-nav"><button id="calendar-prev" type="button" aria-label="Mês anterior">←</button><button id="calendar-next" type="button" aria-label="Próximo mês">→</button></div></div><div class="calendar-weekdays" aria-hidden="true"><span>SEG</span><span>TER</span><span>QUA</span><span>QUI</span><span>SEX</span><span>SÁB</span><span>DOM</span></div><div id="calendar-days" class="calendar-days"></div><p class="calendar-selection" id="calendar-selection"></p><input id="answer" type="hidden"></div>';
      $('answer').value=values.date||'';
      const setSelection=()=>{$('calendar-selection').textContent=$('answer').value ? `Dia escolhido: ${formatDate($('answer').value)}` : 'Selecione um dia no calendário.'};
      $('calendar-prev').addEventListener('click',()=>{visibleMonth=new Date(visibleMonth.getFullYear(),visibleMonth.getMonth()-1,1);paintCalendar()});
      $('calendar-next').addEventListener('click',()=>{visibleMonth=new Date(visibleMonth.getFullYear(),visibleMonth.getMonth()+1,1);paintCalendar()});
      $('calendar-days').addEventListener('click',event=>{const day=event.target.closest('button[data-date]');if(!day||day.disabled)return;$('answer').value=day.dataset.date;paintCalendar();setSelection()});
      paintCalendar();setSelection();
    } else if(q.kind === 'time') {
      const nowParts=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:'America/Sao_Paulo',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date()).filter(part=>part.type!=='literal').map(part=>[part.type,part.value]));
      const currentMinutes=Number(nowParts.hour)*60+Number(nowParts.minute);
      const slots=Array.from({length:25},(_,i)=>{
        const minutes=600+i*30;
        return {label:`${String(Math.floor(minutes/60)).padStart(2,'0')}:${String(minutes%60).padStart(2,'0')}`,minutes};
      });
      const groups=[['MANHÃ',slots.slice(0,4)],['TARDE',slots.slice(4,16)],['NOITE',slots.slice(16)]];
      const selectedSlot=slots.find(slot=>slot.label===values.time);
      if(values.date===today && selectedSlot && selectedSlot.minutes<=currentMinutes)values.time='';
      inputArea.innerHTML=`<div class="time-picker"><div class="time-picker-heading"><span class="calendar-caption">HORÁRIO DE BRASÍLIA</span><span>10h às 22h · a cada 30 min</span></div><div class="time-groups">${groups.map(([label,items])=>`<div class="time-group"><p>${label}</p><div class="time-grid">${items.map(slot=>`<button type="button" class="time-slot" data-time="${slot.label}" aria-pressed="${values.time===slot.label}" ${values.date===today && slot.minutes<=currentMinutes?'disabled':''}>${slot.label}</button>`).join('')}</div></div>`).join('')}</div><p class="calendar-selection" id="time-selection">${values.time?`Horário escolhido: ${values.time}`:'Selecione o horário que você prefere.'}</p><input id="answer" type="hidden" value="${values.time||''}"></div>`;
      inputArea.querySelector('.time-groups').addEventListener('click',event=>{
        const slot=event.target.closest('button[data-time]');if(!slot||slot.disabled)return;
        $('answer').value=slot.dataset.time;
        inputArea.querySelectorAll('.time-slot').forEach(button=>button.setAttribute('aria-pressed',String(button===slot)));
        $('time-selection').textContent=`Horário escolhido: ${slot.dataset.time}`;
      });
    } else if(q.kind === 'textarea') {
      inputArea.innerHTML = `<textarea id="answer" class="question-field" rows="4" maxlength="${q.max}" placeholder="${escapeHTML(q.placeholder)}"></textarea>`;
      $('answer').value=values[q.id]||'';
    } else {
      const min = q.kind === 'date' ? `min="${today}"` : '';
      const max = q.max ? `maxlength="${q.max}"` : '';
      const mode = q.kind === 'tel' ? 'inputmode="tel" autocomplete="tel"' : q.kind === 'text' ? 'autocomplete="off"' : '';
      inputArea.innerHTML = `<input id="answer" class="question-field" type="${q.kind}" ${min} ${max} ${mode} placeholder="${escapeHTML(q.placeholder||'')}" aria-label="${escapeHTML(q.title)}">`;
      $('answer').value=values[q.id]||'';
    }
  };
  const collect = () => {
    const q=questions[step];
    if(q.kind === 'choices'){
      const chosen=inputArea.querySelector('input[name=answer]:checked');
      if(!chosen)return 'Escolha uma opção para continuar.';
      const other=$('other-answer');
      if(other.style.display!=='none'){
        if(!other.value.trim())return 'Conte em poucas palavras qual é a sua resposta.';
        values[q.id+'Other']=other.value.trim();values[q.id]=`Outro: ${other.value.trim()}`;
      }else{delete values[q.id+'Other'];values[q.id]=chosen.value}
    }else{
      const field=$('answer');const value=field.value.trim();
      if(!value)return 'Preencha este campo para continuar.';
      if(q.kind==='tel' && value.replace(/\D/g,'').length<10)return 'Informe um número com DDD.';
      if(q.kind==='date' && value<today)return 'Escolha uma data a partir de hoje.';
      values[q.id]=value;
    }
    return '';
  };
  const saveCurrent = () => {
    const q=questions[step];
    if(q.kind==='choices'){
      const chosen=inputArea.querySelector('input[name=answer]:checked');
      if(chosen){values[q.id]=chosen.value;if($('other-answer').style.display!=='none')values[q.id+'Other']=$('other-answer').value.trim()}
    }else values[q.id]=$('answer').value.trim();
  };
  const formatDate = date => {const [y,m,d]=date.split('-');return `${d}/${m}/${y}`};
  const attributionLine = () => {const a=window.NEXTracking?.attribution?.().last_touch||{};return `Origem da visita: ${a.utm_source||'direct'} / ${a.utm_medium||'none'}${a.utm_campaign?` / ${a.utm_campaign}`:''}${a.utm_content?` / ${a.utm_content}`:''}`};
  const makeMessage = () => `Olá, NEX! Respondi ao questionário do Blueprint e gostaria de solicitar uma reunião.\n\nNome: ${values.name}\nWhatsApp: ${values.phone}\nEmpresa: ${values.company}\nSetor: ${values.sector}\nO que vendemos: ${values.offer}\nObjetivo: ${values.goal}\nDesafio: ${values.challenge}\nOrigem dos clientes: ${values.source}\nPonto de perda: ${values.loss}\nAcompanhamento: ${values.routine}\nDia preferido: ${formatDate(values.date)}\nHorário preferido: ${values.time} (Brasília)\n${attributionLine()}\nCódigo da sessão: ${window.NEXTracking?.sessionId||'indisponível'}\n\nPodem confirmar a disponibilidade? Após a confirmação, gostaria de receber o primeiro e-book da NEX.`;
  const finish = () => {
    $('question-state').hidden=true;$('complete-state').hidden=false;
    $('booking-summary').innerHTML=`<p><b>Empresa:</b> ${escapeHTML(values.company)}</p><p><b>Dia solicitado:</b> ${escapeHTML(formatDate(values.date))}</p><p><b>Horário:</b> ${escapeHTML(values.time)} (Brasília)</p>`;
    const number=(window.NEX_WHATSAPP_NUMBER||'').replace(/\D/g,'');
    $('whatsapp-link').dataset.href=`https://wa.me/${number ? number : ''}?text=${encodeURIComponent(makeMessage())}`;
    $('whatsapp-link').textContent=number ? 'Enviar solicitação pelo WhatsApp ↗' : 'Abrir WhatsApp e selecionar a NEX ↗';
    $('whatsapp-link').setAttribute('aria-label',number ? 'Enviar solicitação ao WhatsApp da NEX' : 'Abrir WhatsApp com mensagem pronta; escolha o contato da NEX');
    window.NEXTracking?.track('booking_completed',{preferred_date:values.date,preferred_time:values.time,goal:values.goal,challenge:values.challenge});
    window.scrollTo({top:0,behavior:'smooth'});
  };
  $('booking-form').addEventListener('submit',event=>{event.preventDefault();const error=collect();if(error){$('question-error').textContent=error;return}if(step===0)window.NEXTracking?.track('booking_started');window.NEXTracking?.track('booking_step_completed',{step:step+1,question:questions[step].id});if(step<11){step++;render()}else finish()});
  $('previous-button').addEventListener('click',()=>{saveCurrent();if(step>0){step--;render()}});
  $('edit-answers').addEventListener('click',()=>{$('complete-state').hidden=true;$('question-state').hidden=false;step=0;render();window.scrollTo({top:0,behavior:'smooth'})});
  $('copy-message').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(makeMessage());$('copy-message').textContent='Mensagem copiada ✓'}catch{$('copy-message').textContent='Abra o WhatsApp para enviar'}});
  $('whatsapp-link').addEventListener('click',async()=>{
    if(!$('booking-consent').checked){$('consent-error').textContent='Autorize o armazenamento das respostas para enviar sua solicitação.';$('booking-consent').focus();return}
    $('consent-error').textContent='';
    const button=$('whatsapp-link');button.disabled=true;$('submission-status').textContent='Registrando sua solicitação com segurança…';
    const payload={product:'blueprint',source:'booking',name:values.name,phone:values.phone,company:values.company,status:'submitted',consent:true,answers:{sector:values.sector,offer:values.offer,goal:values.goal,challenge:values.challenge,customer_source:values.source,loss_point:values.loss,commercial_routine:values.routine,preferred_date:values.date,preferred_time:values.time}};
    try{await window.NEXLeads.submit(payload);$('submission-status').textContent='Solicitação registrada. Abrindo o WhatsApp…'}catch{$('submission-status').textContent='Sua solicitação ficou salva neste navegador e será reenviada automaticamente.'}
    window.NEXTracking?.track('booking_whatsapp_opened',{preferred_date:values.date,preferred_time:values.time});
    location.href=button.dataset.href;
    setTimeout(()=>{button.disabled=false},1200);
  });
  render();
})();
