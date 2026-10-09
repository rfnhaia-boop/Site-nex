(() => {
  const pillars = [
    {id:'marca',title:'Marca e oferta',questions:[
      {text:'Uma pessoa nova entende rapidamente o que você oferece e para quem?',context:'Pense no que aparece primeiro no seu site, perfil ou apresentação comercial.',next:'Peça a alguém que não conhece sua empresa para explicar a oferta após olhar a primeira tela por alguns segundos.'},
      {text:'Você consegue mostrar por que alguém escolheria sua empresa além do preço?',context:'Considere diferenciais que o cliente consegue perceber, não apenas qualidades que a empresa afirma ter.',next:'Separe três propostas recentes e observe como o valor foi explicado antes do investimento.'}
    ]},
    {id:'comercial',title:'Comercial',questions:[
      {text:'Você sabe de onde veio cada oportunidade e em que etapa da conversa ela está?',context:'Inclua indicações, redes sociais, site, anúncios e prospecção.',next:'Mapeie os últimos contatos: origem, estágio atual e próximo responsável por cada conversa.'},
      {text:'Quando uma proposta fica sem resposta, existe um próximo contato planejado?',context:'Pense no acompanhamento real da equipe, mesmo quando a rotina aperta.',next:'Revise propostas recentes sem retorno e registre quando e como houve acompanhamento.'}
    ]},
    {id:'operacao',title:'Operação',questions:[
      {text:'Você consegue identificar onde a entrega costuma atrasar ou exigir retrabalho?',context:'Observe o caminho entre a venda, a execução e a entrega ao cliente.',next:'Desenhe as etapas de uma entrega recente e marque onde houve espera, dúvida ou retrabalho.'},
      {text:'Quem atende o cliente consegue consultar o que foi prometido e o status da entrega?',context:'A resposta deve refletir o acesso prático da equipe às informações.',next:'Teste se uma pessoa da equipe consegue responder a um pedido de status sem procurar mensagens antigas.'}
    ]},
    {id:'experiencia',title:'Experiência',questions:[
      {text:'Você escuta o cliente depois da entrega para entender a experiência real?',context:'Considere dúvidas, fricções, elogios e expectativas que surgem após a compra.',next:'Converse com clientes recentes sobre expectativa, entrega e o que poderia ter sido mais claro.'},
      {text:'Existe um caminho definido para manter contato após a primeira compra?',context:'Pense em relacionamento, recompra e indicação, respeitando o momento do cliente.',next:'Observe o que acontece nos 30 dias após uma entrega e quem cuida do relacionamento.'}
    ]}
  ];
  const questions=pillars.flatMap(pillar=>pillar.questions.map((question,index)=>({...question,pillar:pillar.title,pillarId:pillar.id,ordinal:index+1})));
  const labels={yes:'Sim, de forma consistente',partial:'Em parte',no:'Ainda não',unknown:'Não sei responder'};
  const responses={};let step=0;let person='';let company='';
  const $=id=>document.getElementById(id);
  const safe=text=>String(text).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const reference=new URLSearchParams(location.search).get('ref')?.replace(/[^\w-]/g,'').slice(0,40)||'';
  const emit=name=>window.dispatchEvent(new CustomEvent(name,{detail:{reference:reference||undefined}}));
  const show=id=>['intro-screen','questions-screen','result-screen'].forEach(name=>$(name).hidden=name!==id);
  const render=()=>{
    const question=questions[step];show('questions-screen');
    window.NEXTracking?.track('growth_scan_step_view',{step:step+1,total:8,question:`${question.pillarId}_${question.ordinal}`});
    $('tool-stage').textContent=question.pillar.toUpperCase();$('tool-step').textContent=`${String(step+1).padStart(2,'0')} / 08`;
    $('tool-progress-fill').style.width=`${(step+1)/8*100}%`;
    $('tool-pillar').textContent=`${question.pillar.toUpperCase()} · PERGUNTA ${question.ordinal} DE 2`;
    $('tool-question').textContent=question.text;$('tool-context').textContent=question.context;
    $('answer-options').innerHTML=Object.entries(labels).map(([value,label],index)=>`<div class="answer-option"><input type="radio" name="scan-answer" id="scan-option-${index}" value="${value}" ${responses[step]===value?'checked':''}><label for="scan-option-${index}">${label}</label></div>`).join('');
    $('answer-error').textContent='';$('tool-back').textContent=step===0?'← Início':'← Voltar';
    $('tool-next').textContent=step===7?'Ver meu mapa ↗':'Continuar ↗';
    window.scrollTo({top:0,behavior:'smooth'});
  };
  const orderedPillars=()=>pillars.map((pillar,index)=>{
    const answers=[responses[index*2],responses[index*2+1]];
    const attention=answers.filter(answer=>answer==='no'||answer==='partial').length;
    const unknown=answers.filter(answer=>answer==='unknown').length;
    const state=attention?'attention':unknown?'unknown':'observed';
    const label=attention?'Vale investigar':unknown?'Falta informação':'Prática percebida';
    return {...pillar,index,attention,unknown,state,label};
  }).sort((a,b)=>(b.attention*2+b.unknown)-(a.attention*2+a.unknown)||a.index-b.index);
  const buildText=(ordered)=>{
    const lines=[`NEX Growth Scan — ${person} | ${company}`];if(reference)lines.push(`Referência: ${reference}`);
    lines.push('','Mapa exploratório das minhas respostas:');
    pillars.forEach((pillar,index)=>{lines.push(`\n${pillar.title}:`);pillar.questions.forEach((question,i)=>lines.push(`• ${question.text} — ${labels[responses[index*2+i]]}`))});
    lines.push('','Perguntas para aprofundar:');
    const selected=ordered.filter(p=>p.state!=='observed').slice(0,3);
    (selected.length?selected:ordered.slice(0,2)).forEach(pillar=>{
      const originalIndex=pillars.findIndex(p=>p.id===pillar.id);
      pillar.questions.forEach((q,i)=>{if(responses[originalIndex*2+i]!=='yes'||!selected.length)lines.push(`• ${q.next}`)})
    });
    lines.push('','Este resumo organiza minhas percepções; não verifica dados do mercado nem substitui o diagnóstico aprofundado do Blueprint NEX.');
    return lines.join('\n');
  };
  const result=()=>{
    const ordered=orderedPillars();show('result-screen');
    $('result-title').innerHTML=`${safe(person)}, aqui está o que vale <strong>investigar.</strong>`;
    $('result-intro').textContent=`Seu mapa de ${company} reúne percepções sobre quatro áreas. Use-o para orientar perguntas e aprofundar a conversa com a NEX.`;
    $('result-highlights').innerHTML=pillars.map(pillar=>{
      const item=ordered.find(row=>row.id===pillar.id);
      return `<article class="pillar-card" data-state="${item.state}"><span>${String(item.index+1).padStart(2,'0')} / ÁREA</span><h3>${safe(item.title)}</h3><p>${item.label}</p></article>`
    }).join('');
    const priority=ordered.filter(item=>item.state!=='observed').slice(0,3);
    const focused=priority.length?priority:ordered.slice(0,2);
    $('result-priorities').innerHTML=focused.map(item=>`<article class="priority-item"><span>${item.state==='observed'?'VALIDAR':'APROFUNDAR'} / ${safe(item.title.toUpperCase())}</span><h4>${item.state==='unknown'?'Há perguntas sem resposta clara.':item.state==='observed'?'Você percebe uma prática estabelecida.':'Suas respostas indicam um ponto de atenção.'}</h4><p>${item.state==='observed'?'Vale confirmar essa percepção com exemplos reais e com a visão do cliente.':item.state==='unknown'?'Encontre evidências antes de decidir se é uma prioridade.':'Investigue o processo e os exemplos concretos antes de propor uma solução.'}</p></article>`).join('');
    const actions=[];
    for(const item of focused){const index=pillars.findIndex(p=>p.id===item.id);item.questions.forEach((q,i)=>{if(responses[index*2+i]!=='yes'||!priority.length)actions.push(q.next)})}
    $('result-actions').innerHTML=actions.slice(0,4).map(action=>`<li>${safe(action)}</li>`).join('');
    $('copy-result').textContent='Copiar meu resumo ↗';
    const answerPayload={};
    questions.forEach((question,index)=>{answerPayload[`${question.pillarId}_${question.ordinal}`]=`${question.text} — ${labels[responses[index]]}`});
    $('scan-submission-status').textContent='Registrando seu Growth Scan na NEX…';
    window.NEXLeads.submit({product:'blueprint',source:'growth-scan',name:person,company,status:'submitted',consent:true,answers:answerPayload})
      .then(()=>{$('scan-submission-status').textContent='Growth Scan registrado. A NEX já pode consultar suas respostas.'})
      .catch(()=>{$('scan-submission-status').textContent='Seu resultado ficou salvo neste navegador e será reenviado automaticamente.'});
    emit('nex:scan-completed');window.scrollTo({top:0,behavior:'smooth'});
  };
  $('intro-form').addEventListener('submit',event=>{event.preventDefault();person=$('scan-name').value.trim();company=$('scan-company').value.trim();if(!person||!company){$('intro-error').textContent='Preencha seu nome e o nome da empresa para começar.';return}if(!$('scan-consent').checked){$('intro-error').textContent='Autorize o armazenamento das respostas para começar.';$('scan-consent').focus();return}$('intro-error').textContent='';step=0;emit('nex:scan-started');render()});
  $('tool-next').addEventListener('click',()=>{const choice=document.querySelector('input[name=scan-answer]:checked');if(!choice){$('answer-error').textContent='Escolha a resposta mais próxima da sua realidade.';return}responses[step]=choice.value;window.NEXTracking?.track('growth_scan_step_completed',{step:step+1,total:8,question:`${questions[step].pillarId}_${questions[step].ordinal}`});if(step<7){step++;render()}else result()});
  window.addEventListener('nex:scan-started',()=>{window.NEXLeads.submit({product:'blueprint',source:'growth-scan',name:person,company,status:'progress',consent:true,answers:{etapa:'iniciou o Growth Scan'}}).catch(()=>{})});
  $('tool-back').addEventListener('click',()=>{const choice=document.querySelector('input[name=scan-answer]:checked');if(choice)responses[step]=choice.value;if(step===0){show('intro-screen');window.scrollTo({top:0,behavior:'smooth'})}else{step--;render()}});
  $('edit-result').addEventListener('click',()=>{step=0;render()});
  $('copy-result').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(buildText(orderedPillars()));$('copy-result').textContent='Resumo copiado ✓';window.NEXTracking?.track('growth_scan_summary_copied')}catch{$('copy-result').textContent='Não foi possível copiar'}});
  $('print-result').addEventListener('click',()=>{window.NEXTracking?.track('growth_scan_printed');window.print()});
})();
