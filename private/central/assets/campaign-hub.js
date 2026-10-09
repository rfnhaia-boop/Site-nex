(() => {
  const assets = [
    {
      id: "meeting-offer-01",
      campaign: "campaign1",
      type: "paid",
      label: "ANÚNCIO · REUNIÃO ESTRATÉGICA",
      title: "Sua próxima decisão começa aqui",
      image: "/central/assets/campaign2/NEX-Anuncio-Reuniao-Oferta-01.png",
      purpose: "Apresentar a oferta de entrada da Campanha 01 e gerar agendamentos.",
      destination: "/blueprint",
      copy: "Sua próxima decisão de crescimento começa aqui.\n\nAgende uma reunião estratégica com a NEX. Ao confirmar, você recebe o primeiro e-book. Depois da reunião, recebe o segundo material e o NEX Growth Scan para continuar a análise.\n\nAgende sua reunião.",
    },
    {
      id: "organic-01",
      type: "organic",
      label: "CONSCIÊNCIA",
      title: "O futuro continua avançando",
      image: "/central/assets/campaign/organic-01.png",
      purpose: "Abrir consciência sobre adaptação e futuro empresarial.",
      destination: "/context-agent",
      copy: "Uma empresa não fica para trás de uma hora para outra.\n\nA distância aparece quando o mercado muda, o concorrente aprende e a operação continua funcionando do mesmo jeito.\n\nA pergunta é simples: sua empresa está construindo o próximo nível ou apenas mantendo o presente funcionando?",
    },
    {
      id: "organic-02",
      type: "organic",
      label: "CONSCIÊNCIA",
      title: "Ferramentas demais, operação desconectada",
      image: "/central/assets/campaign/organic-02.png",
      purpose: "Mostrar que tecnologia isolada não gera evolução.",
      destination: "/context-agent",
      copy: "Sua empresa pode ter ferramentas, dados e boas pessoas.\n\nMas, quando vendas, marketing e operação não conversam, cada decisão recomeça do zero.\n\nAcumular ferramentas não é evoluir. Conectar a operação é.",
    },
    {
      id: "organic-03",
      type: "organic",
      label: "CONSCIÊNCIA",
      title: "O concorrente aprende antes",
      image: "/central/assets/campaign/organic-03.png",
      purpose: "Criar urgência competitiva sem apelar para medo vazio.",
      destination: "/context-agent",
      copy: "Seu concorrente não precisa ser maior.\n\nEle precisa perceber antes, aprender antes e transformar o que aprende em decisões melhores.\n\nA vantagem começa na velocidade do aprendizado.",
    },
    {
      id: "organic-04",
      type: "organic",
      label: "MECANISMO",
      title: "Tecnologia transformada em direção",
      image: "/central/assets/campaign/organic-04.png",
      purpose: "Apresentar o papel da NEX na conexão da estrutura.",
      destination: "/blueprint",
      copy: "Tecnologia gera valor quando ajuda a empresa a entender o cenário, escolher prioridades e executar o próximo passo com clareza.",
    },
    {
      id: "organic-action",
      type: "organic",
      label: "AÇÃO",
      title: "Crescer sem estrutura também custa",
      image: "/central/assets/campaign/organic-action.png",
      purpose: "Levar a audiência orgânica para a análise gratuita.",
      destination: "/context-agent",
      copy: "Talvez sua empresa não esteja atrasada. Talvez ela tenha crescido sem uma estrutura que acompanhe.\n\nInicie a análise gratuita e organize o cenário antes do próximo investimento.",
    },
    {
      id: "carousel",
      type: "carousel",
      label: "CARROSSEL · 7 TELAS",
      title: "A estrutura NEX por dentro",
      image: "/central/assets/campaign/carousel-01.png",
      purpose:
        "Explicar direção, aquisição, NEX Core, operação e evolução contínua.",
      destination: "/blueprint",
      copy: "Como a NEX transforma tecnologia em uma operação preparada para evoluir.\n\nPasse pelas sete telas para entender como estratégia, aquisição e tecnologia passam a funcionar dentro da mesma estrutura.",
      gallery: true,
    },
    {
      id: "ad-01",
      type: "paid",
      label: "ANÚNCIO · DESEJO",
      title: "Empresa preparada para o futuro",
      image: "/central/assets/campaign/ad-01.png",
      purpose: "Atrair quem deseja modernizar e organizar a empresa.",
      destination:
        "/context-agent?utm_source=meta&utm_medium=paid&utm_campaign=nex_launch&utm_content=desejo",
      copy: "O futuro não chega de uma vez.\n\nEle aparece quando o cliente muda, quando o concorrente aprende mais rápido e quando a operação começa a exigir esforço demais.\n\nA análise guiada da NEX organiza o contexto da sua empresa e mostra quais áreas merecem atenção primeiro.\n\nLeva cerca de 8 minutos. Inicie gratuitamente.",
    },
    {
      id: "ad-02",
      type: "paid",
      label: "ANÚNCIO · DOR",
      title: "O concorrente aprende mais rápido",
      image: "/central/assets/campaign/ad-02.png",
      purpose: "Ativar urgência competitiva e consciência do problema.",
      destination:
        "/context-agent?utm_source=meta&utm_medium=paid&utm_campaign=nex_launch&utm_content=dor",
      copy: "Seu concorrente não precisa ter uma empresa maior.\n\nEle precisa identificar oportunidades antes, aprender com os dados e transformar esse aprendizado em decisões melhores.\n\nDescubra onde sua empresa pode estar perdendo clareza. Inicie a análise gratuita da NEX.",
    },
    {
      id: "ad-03",
      type: "paid",
      label: "ANÚNCIO · MECANISMO",
      title: "A estrutura trabalha conectada",
      image: "/central/assets/campaign/ad-03.png",
      purpose: "Explicar como direção, aquisição e tecnologia operam juntas.",
      destination:
        "/context-agent?utm_source=meta&utm_medium=paid&utm_campaign=nex_launch&utm_content=mecanismo",
      copy: "Crescimento não acontece em partes.\n\nUma campanha pode gerar atenção, mas não corrige uma oferta confusa. Tecnologia começa a gerar valor quando direção, aquisição e operação trabalham dentro da mesma lógica.\n\nConheça a estrutura NEX.",
    },
    {
      id: "ad-04",
      type: "paid",
      label: "ANÚNCIO · AÇÃO",
      title: "Iniciar análise gratuita",
      image: "/central/assets/campaign/ad-04.png",
      purpose: "Converter diretamente para o Context Agent.",
      destination:
        "/context-agent?utm_source=meta&utm_medium=paid&utm_campaign=nex_launch&utm_content=acao",
      copy: "Onde sua empresa precisa evoluir primeiro?\n\nResponda à análise guiada da NEX e organize informações sobre sua oferta, aquisição, processo comercial, operação e objetivos.\n\nA análise leva cerca de 8 minutos e pode ser iniciada gratuitamente.",
    },
    {
      id: "deliverable-blueprint",
      campaign: "campaign1",
      type: "deliverable",
      label: "SITE · BLUEPRINT",
      title: "Landing page Blueprint NEX",
      image: "/central/assets/hero-glass.png",
      purpose: "Tese, oferta, condição de lançamento e chamada para reunião.",
      destination: "/blueprint",
      copy: "Página comercial do Blueprint NEX, conectada ao Context Agent e ao agendamento.",
      actionLabel: "Abrir landing",
    },
    {
      id: "deliverable-context-agent",
      campaign: "campaign2",
      type: "deliverable",
      label: "FERRAMENTA · CAPTURA",
      title: "NEX Context Agent",
      image: "context-agent/assets/context-master.png",
      purpose: "Captura contato, organiza o contexto e entrega uma leitura inicial.",
      destination: "/context-agent",
      copy: "Ferramenta de entrada do funil: contato, briefing guiado, leitura inicial e prompts de contexto.",
      actionLabel: "Abrir ferramenta",
    },
    {
      id: "deliverable-growth-scan",
      campaign: "campaign1",
      type: "deliverable",
      label: "FERRAMENTA · ANÁLISE",
      title: "NEX Growth Scan",
      image: "/central/assets/growth-scan.png",
      purpose: "Exploração de marca, comercial, operação e experiência.",
      destination: "/blueprint/growth-scan",
      copy: "Ativo entregue após a reunião para aprofundar as áreas que merecem atenção.",
      actionLabel: "Abrir Growth Scan",
    },
    {
      id: "deliverable-booking",
      campaign: "campaign1",
      type: "deliverable",
      label: "CONVERSÃO · AGENDA",
      title: "Questionário e agendamento",
      image: "/central/assets/closing-path-v2.png",
      purpose: "Qualificação em 12 perguntas, escolha de horário e confirmação.",
      destination: "/blueprint/agendar",
      copy: "Fluxo de agendamento conectado ao WhatsApp para confirmar a preferência do lead.",
      actionLabel: "Abrir agendamento",
    },
    {
      id: "deliverable-gu-deck",
      campaign: "campaign1",
      type: "deliverable",
      label: "APRESENTAÇÃO · OPERAÇÃO",
      title: "Funil consolidado para o Gu",
      image: "/central/assets/campaign-hub-background.png",
      purpose: "Visão visual do funil, entregáveis e responsabilidades da operação.",
      destination: "/central/assets/deliverables/NEX-Funil-Consolidado-para-Gu.pptx",
      download: "/central/assets/deliverables/NEX-Funil-Consolidado-para-Gu.pptx",
      filename: "NEX-Funil-Consolidado-para-Gu.pptx",
      copy: "Apresentação consolidada para alinhamento da campanha e execução.",
      actionLabel: "Baixar apresentação",
    },
    {
      id: "deliverable-guide-meeting",
      campaign: "campaign1",
      type: "deliverable",
      label: "E-BOOK 01 · 12 PÁGINAS",
      title: "Guia antes da reunião",
      image: "/central/assets/campaign2/NEX-01-Guia-para-a-Reuniao-capa.png",
      purpose: "Primeiro material entregue após a confirmação do agendamento.",
      destination: "/central/assets/campaign2/NEX-01-Guia-para-a-Reuniao.pdf",
      download: "/central/assets/campaign2/NEX-01-Guia-para-a-Reuniao.pdf",
      filename: "NEX-01-Guia-para-a-Reuniao.pdf",
      copy: "NEX / Guia antes da reunião — material prático para organizar o cenário da empresa antes da conversa estratégica.",
      actionLabel: "Baixar primeiro e-book",
    },
    {
      id: "deliverable-caderno-40",
      campaign: "campaign1",
      type: "deliverable",
      label: "CADERNO · 40 PÁGINAS",
      title: "Da conversa à decisão",
      image: "/central/assets/deliverables/NEX-02-Caderno-de-Decisoes-capa.png",
      purpose: "Segundo material entregue depois da reunião, junto do NEX Growth Scan.",
      destination: "/central/assets/deliverables/NEX-02-Caderno-de-Decisoes-40-paginas.pdf",
      download: "/central/assets/deliverables/NEX-02-Caderno-de-Decisoes-40-paginas.pdf",
      filename: "NEX-02-Caderno-de-Decisoes-40-paginas.pdf",
      copy: "NEX / Caderno após a reunião — Da conversa à decisão. Quarenta páginas para investigar marca, comercial, operação e experiência com mais clareza.",
      actionLabel: "Baixar caderno",
    },
  ];

  assets.unshift(...[{"id": "blueprint-post-01", "campaign": "campaign1", "type": "organic", "label": "POST · BLUEPRINT", "title": "Você conhece sua empresa?", "image": "/central/assets/campaign1/post-01.png", "purpose": "Conteúdo orgânico da primeira campanha, conectado ao Blueprint NEX.", "destination": "/blueprint", "copy": "Peça original enviada por Rafael. Direcionamento: site da Campanha 01."}, {"id": "blueprint-carousel", "campaign": "campaign1", "type": "carousel", "label": "CARROSSEL · 3 PEÇAS", "title": "Visão completa da empresa", "image": "/central/assets/campaign1/carousel-01.png", "purpose": "Conteúdo orgânico da primeira campanha, conectado ao Blueprint NEX.", "destination": "/blueprint", "copy": "Peça original enviada por Rafael. Direcionamento: site da Campanha 01.", "images": ["/central/assets/campaign1/carousel-01.png", "/central/assets/campaign1/carousel-02.png", "/central/assets/campaign1/carousel-03.png"], "download": "/central/assets/campaign1/NEX-Carrossel-3-pecas.zip", "filename": "NEX-Carrossel-3-pecas.zip"}, {"id": "blueprint-post-03", "campaign": "campaign1", "type": "organic", "label": "POST · BLUEPRINT", "title": "Blueprint NEX · fechamento", "image": "/central/assets/campaign1/post-03.png", "purpose": "Conteúdo orgânico da primeira campanha, conectado ao Blueprint NEX.", "destination": "/blueprint", "copy": "Peça original enviada por Rafael. Direcionamento: site da Campanha 01."}, {"id": "blueprint-ad-01", "campaign": "campaign1", "type": "paid", "label": "ANÚNCIO · OFERTA", "title": "Uma reunião, novos caminhos para pensar sua empresa.", "image": "/central/assets/campaign1/NEX-Anuncio-01-oferta.png", "purpose": "Gerar agendamentos para a primeira campanha.", "destination": "/blueprint?utm_source=meta&utm_medium=paid&utm_campaign=nex_blueprint&utm_content=oferta", "copy": "— Oferta completa\n**Texto do anúncio:** Agende uma reunião estratégica com a NEX e receba um e-book com ideias para evoluir sua marca. Depois de participar, receba o segundo e-book e acesso ao NEX Growth Scan para explorar oportunidades. Na conversa, você conhece como o Blueprint pode aprofundar a análise e organizar próximos passos.\n**Título:** Uma reunião, novos caminhos para pensar sua empresa."}, {"id": "blueprint-ad-02", "campaign": "campaign1", "type": "paid", "label": "ANÚNCIO · GARGALO", "title": "O crescimento travou. Mas onde?", "image": "/central/assets/campaign1/NEX-Anuncio-02-gargalo.png", "purpose": "Gerar agendamentos para a primeira campanha.", "destination": "/blueprint?utm_source=meta&utm_medium=paid&utm_campaign=nex_blueprint&utm_content=gargalo", "copy": "— Gargalo\n**Texto do anúncio:** O crescimento travou, mas aumentar o investimento sem identificar o gargalo pode não resolver. Comece por uma conversa estratégica. Receba o primeiro e-book ao agendar; após participar, receba o segundo e-book e o NEX Growth Scan.\n**Título:** O crescimento travou. Mas onde?"}, {"id": "blueprint-ad-03", "campaign": "campaign1", "type": "paid", "label": "ANÚNCIO · JORNADA", "title": "Comece com conteúdo e clareza.", "image": "/central/assets/campaign1/NEX-Anuncio-03-jornada.png", "purpose": "Gerar agendamentos para a primeira campanha.", "destination": "/blueprint?utm_source=meta&utm_medium=paid&utm_campaign=nex_blueprint&utm_content=jornada", "copy": "— Jornada de valor\n**Texto do anúncio:** São três passos para começar: agende e receba o primeiro e-book; participe da reunião e receba o segundo; depois, explore oportunidades no NEX Growth Scan. Conheça também a proposta do Blueprint NEX para aprofundar esse trabalho.\n**Título:** Comece com conteúdo e clareza."}, {"id": "blueprint-ad-04", "campaign": "campaign1", "type": "paid", "label": "ANÚNCIO · GROWTH-SCAN", "title": "Conheça o NEX Growth Scan.", "image": "/central/assets/campaign1/NEX-Anuncio-04-growth-scan.png", "purpose": "Gerar agendamentos para a primeira campanha.", "destination": "/blueprint?utm_source=meta&utm_medium=paid&utm_campaign=nex_blueprint&utm_content=growth-scan", "copy": "— Ferramenta interativa\n**Texto do anúncio:** E se você pudesse explorar oportunidades do seu negócio de forma interativa? Agende uma reunião NEX e receba o primeiro e-book. Ao participar, você também recebe o segundo e-book e acesso ao Growth Scan. O Blueprint é a etapa aprofundada para transformar análise em plano de ação.\n**Título:** Conheça o NEX Growth Scan.\n\n**CTA de plataforma:** Saiba mais. **Destino:** landing page da reunião e do Blueprint, quando estiver pronta. Registrar o criativo em `utm_content`: `oferta`, `gargalo`, `jornada`, `growth_scan`."}, {"id": "ebook-methodology-original", "campaign": "campaign1", "type": "deliverable", "label": "E-BOOK · EM REVISÃO", "title": "A metodologia NEX", "image": "/central/assets/campaign1/ebook-capa.png", "purpose": "Originais recebidos: 14 de 15 páginas. Falta a página 03; identidade visual em revisão.", "unavailable": true, "copy": "Material original recebido para revisão de marca e conteúdo. Este pacote contém 14 imagens e ainda não é o e-book final para enviar ao empresário."}]);

  assets.unshift(...[{"id":"squad-post-01","campaign":"campaign3","type":"organic","label":"POST · SQUAD NEX","title":"Tecnologia além do expediente","image":"/central/assets/campaign3/post-01.png","destination":"/squad","purpose":"Apresentar a operação híbrida do Squad NEX.","copy":"Tecnologia além do expediente"},{"id":"squad-post-02","campaign":"campaign3","type":"organic","label":"POST · SQUAD NEX","title":"A próxima equipe é híbrida","image":"/central/assets/campaign3/post-02.png","destination":"/squad","purpose":"Apresentar a operação híbrida do Squad NEX.","copy":"A próxima equipe é híbrida"},{"id":"squad-post-03","campaign":"campaign3","type":"organic","label":"POST · SQUAD NEX","title":"Tecnologia parada, fila crescente","image":"/central/assets/campaign3/post-03.png","destination":"/squad","purpose":"Apresentar a operação híbrida do Squad NEX.","copy":"Tecnologia parada, fila crescente"},{"id":"squad-carousel","campaign":"campaign3","type":"carousel","label":"CARROSSEL · 5 PÁGINAS","title":"Quem cuida da evolução da sua tecnologia?","image":"/central/assets/campaign3/carousel-1-1.png","images":["/central/assets/campaign3/carousel-1-1.png","/central/assets/campaign3/carousel-1-2.png","/central/assets/campaign3/carousel-1-3.png","/central/assets/campaign3/carousel-1-4.png","/central/assets/campaign3/carousel-1-5.png"],"download":"/central/assets/campaign3/NEX-Squad-Carrossel-1.zip","filename":"NEX-Squad-Carrossel-1.zip","destination":"/squad","purpose":"Explicar o Squad, suas demandas e a jornada de execução.","copy":"Quem cuida da evolução da sua tecnologia?"},{"id":"squad-carousel-2","campaign":"campaign3","type":"carousel","label":"CARROSSEL · 5 PÁGINAS","title":"Demandas que o Squad resolve","image":"/central/assets/campaign3/carousel-2-1.png","images":["/central/assets/campaign3/carousel-2-1.png","/central/assets/campaign3/carousel-2-2.png","/central/assets/campaign3/carousel-2-3.png","/central/assets/campaign3/carousel-2-4.png","/central/assets/campaign3/carousel-2-5.png"],"download":"/central/assets/campaign3/NEX-Squad-Carrossel-2.zip","filename":"NEX-Squad-Carrossel-2.zip","destination":"/squad","purpose":"Explicar o Squad, suas demandas e a jornada de execução.","copy":"Demandas que o Squad resolve"},{"id":"squad-carousel-3","campaign":"campaign3","type":"carousel","label":"CARROSSEL · 5 PÁGINAS","title":"Como funciona trabalhar com o Squad NEX","image":"/central/assets/campaign3/carousel-3-1.png","images":["/central/assets/campaign3/carousel-3-1.png","/central/assets/campaign3/carousel-3-2.png","/central/assets/campaign3/carousel-3-3.png","/central/assets/campaign3/carousel-3-4.png","/central/assets/campaign3/carousel-3-5.png"],"download":"/central/assets/campaign3/NEX-Squad-Carrossel-3.zip","filename":"NEX-Squad-Carrossel-3.zip","destination":"/squad","purpose":"Explicar o Squad, suas demandas e a jornada de execução.","copy":"Como funciona trabalhar com o Squad NEX"},{"id":"squad-ad-01","campaign":"campaign3","type":"paid","label":"ANÚNCIO · 01","title":"Sua tecnologia tem demanda. Falta quem faça acontecer?","image":"/central/assets/campaign3/ad-01.png","destination":"/squad?utm_source=meta&utm_medium=paid&utm_campaign=nex_squad&utm_content=ad_01","purpose":"Gerar conversas qualificadas sobre demandas de tecnologia.","copy":"Sua tecnologia tem demanda. Falta quem faça acontecer?"},{"id":"squad-ad-02","campaign":"campaign3","type":"paid","label":"ANÚNCIO · 02","title":"Sua empresa cresceu. A tecnologia ficou para trás?","image":"/central/assets/campaign3/ad-02.png","destination":"/squad?utm_source=meta&utm_medium=paid&utm_campaign=nex_squad&utm_content=ad_02","purpose":"Gerar conversas qualificadas sobre demandas de tecnologia.","copy":"Sua empresa cresceu. A tecnologia ficou para trás?"},{"id":"squad-ad-03","campaign":"campaign3","type":"paid","label":"ANÚNCIO · 03","title":"Sua próxima equipe de tecnologia pode ser híbrida.","image":"/central/assets/campaign3/ad-03.png","destination":"/squad?utm_source=meta&utm_medium=paid&utm_campaign=nex_squad&utm_content=ad_03","purpose":"Gerar conversas qualificadas sobre demandas de tecnologia.","copy":"Sua próxima equipe de tecnologia pode ser híbrida."},{"id":"squad-ad-04","campaign":"campaign3","type":"paid","label":"ANÚNCIO · 04","title":"O próximo passo da sua tecnologia começa com uma conversa.","image":"/central/assets/campaign3/ad-04.png","destination":"/squad?utm_source=meta&utm_medium=paid&utm_campaign=nex_squad&utm_content=ad_04","purpose":"Gerar conversas qualificadas sobre demandas de tecnologia.","copy":"O próximo passo da sua tecnologia começa com uma conversa."},{"id":"squad-landing","campaign":"campaign3","type":"deliverable","label":"SITE · SQUAD NEX","title":"Squad de Tecnologia Agêntica","image":"/central/assets/campaign3/ad-04.png","destination":"/squad","purpose":"Apresentar estrutura, jornada e diagnóstico.","copy":"Site atualizado com a campanha Squad.","actionLabel":"Abrir landing"}]);

  // Absolute, versioned URLs avoid stale failed image responses after publication.
  assets.unshift({
    id: "squad-site-pack", campaign: "campaign3", type: "deliverable",
    label: "SITE · COPY E PNGS", title: "Materiais do site Squad NEX",
    image: "/central/assets/squad-site/hero.png",
    download: "/central/assets/squad-site/NEX-Squad-Site-PNGs.zip",
    filename: "NEX-Squad-Site-PNGs.zip",
    purpose: "Copy atualizada, fotos aprovadas, fundo cinematográfico, PNG da jornada e logo oficial.",
    copy: "Site Squad NEX: nova composição, frentes interativas e jornada visual. As fotos aprovadas e a logo oficial foram preservadas.",
  });
  const squadLanding = assets.find((asset) => asset.id === "squad-landing");
  squadLanding.image = "/central/assets/squad-site/hero.png";
  squadLanding.destination = "/squad/";
  const squadAssetUrl = (path) => `/${path}?v=squad-20261001b`;
  assets.filter((asset) => asset.campaign === "campaign3").forEach((asset) => {
    asset.image = squadAssetUrl(asset.image);
    if (asset.images) asset.images = asset.images.map(squadAssetUrl);
    if (asset.download) asset.download = squadAssetUrl(asset.download);
  });

  const campaignTwoIds = new Set([
    "organic-01", "organic-02", "organic-03", "organic-04", "organic-action",
    "carousel", "ad-01", "ad-02", "ad-03", "ad-04", "deliverable-context-agent",
  ]);
  assets.forEach((asset) => {
    if (!asset.campaign) asset.campaign = campaignTwoIds.has(asset.id) ? "campaign2" : "campaign1";
  });

  const campaigns = {
    campaign1: {
      title: "Campanha 01",
      eyebrow: "CAMPANHA 01 · OPERAÇÃO COMPLETA",
      hero: "A primeira campanha, com todos os ativos no lugar certo.",
      copy: "Dois posts, um carrossel de três peças e quatro anúncios conectados ao Blueprint, ao agendamento e ao Growth Scan. O e-book enviado está em revisão.",
      destination: "/blueprint",
      funnel: "blueprint",
      showcase: "blueprint-post-01",
      metrics: [["CAMPANHA", "01", "primeira operação"], ["MATERIAIS", "2", "e-books entregáveis"], ["FERRAMENTA", "1", "Growth Scan"]],
    },
    campaign2: {
      title: "Campanha 02",
      eyebrow: "CAMPANHA 02 · OPERAÇÃO COMPLETA",
      hero: "A segunda campanha, separada da primeira.",
      copy: "Reúne os posts, anúncios e o segundo site que já foram produzidos, sem misturar Growth Scan ou materiais da Campanha 01.",
      destination: "/context-agent",
      funnel: "direct",
      showcase: "ad-04",
      metrics: [["CAMPANHA", "02", "segunda operação"], ["TRÁFEGO", "4", "criativos já feitos"], ["SITE", "1", "segundo destino"]],
    },
    campaign3: {
      title: "Campanha 03 · Squad",
      eyebrow: "CAMPANHA 03 · SQUAD",
      hero: "Tecnologia que continua trabalhando.",
      copy: "Especialistas humanos e agentes em nuvem para desenvolver, integrar, automatizar, acompanhar e evoluir a tecnologia das empresas.",
      destination: "/squad",
      funnel: "squad",
      showcase: "squad-post-01",
      metrics: [["POSTS", "3", "peças soltas"], ["CARROSSÉIS", "3", "15 páginas"], ["ANÚNCIOS", "4", "criativos prontos"]],
    },
  };
  let activeCampaign = "campaign1";

  const funnels = {
    blueprint: {
      eyebrow: "FUNIL BLUEPRINT NEX",
      title: "A operação inteira, da atenção ao aprendizado.",
      name: "Blueprint NEX · Funil principal",
      description:
        "Conecta atração, captura, reunião, materiais, diagnóstico, venda e aprendizado em uma única jornada.",
      stages: [
        ["01", "Conteúdo / anúncio", "Atrair"],
        ["02", "Landing", "Conscientizar"],
        ["03", "Context Agent", "Capturar"],
        ["04", "Agenda", "Qualificar"],
        ["05", "Reunião", "Entender"],
        ["06", "E-books + Scan", "Entregar valor"],
        ["07", "Diagnóstico", "Priorizar"],
        ["08", "Blueprint", "Vender"],
        ["09", "Dados", "Aprender"],
      ],
      loop: "Os dados de origem, peça, comportamento e venda retornam para a próxima decisão.",
      details: [
        ["ENTRADA", "Atenção com intenção", "Conteúdo e anúncios abrem consciência e conduzem para uma análise concreta."],
        ["VALOR", "Contexto antes da oferta", "A reunião e os materiais organizam a empresa antes de apresentar o Blueprint."],
        ["EVOLUÇÃO", "Venda que gera aprendizado", "Cada proposta, objeção e venda melhora a tese e o próximo ciclo."],
      ],
    },
    direct: {
      eyebrow: "FUNIL DIRETO + REMARKETING",
      title: "O caminho mais curto até uma conversa qualificada.",
      name: "Aquisição direta · Meta",
      description:
        "Criativos diferentes levam para a mesma análise. Quem não conclui volta por remarketing com outro ângulo.",
      stages: [
        ["01", "Anúncio", "Interromper"],
        ["02", "Landing", "Explicar"],
        ["03", "Context Agent", "Capturar"],
        ["04", "Agenda", "Qualificar"],
        ["05", "WhatsApp", "Confirmar"],
        ["06", "Reunião", "Converter"],
      ],
      loop: "VISITOU E NÃO CONCLUIU → remarketing de dor, desejo ou mecanismo → nova entrada.",
      details: [
        ["TESTE", "Quatro ângulos", "Desejo, dor competitiva, mecanismo e ação direta disputam a atenção do público comprador."],
        ["CONVERSÃO", "Uma jornada simples", "Landing, análise e agenda reduzem a distância entre interesse e conversa."],
        ["RECUPERAÇÃO", "Remarketing por comportamento", "A mensagem muda conforme a etapa em que o lead interrompeu a jornada."],
      ],
    },
    postmeeting: {
      eyebrow: "FUNIL PÓS-REUNIÃO",
      title: "Valor percebido antes da proposta.",
      name: "Reunião → diagnóstico → fechamento",
      description:
        "Depois da conversa, os materiais sustentam a percepção de valor e preparam uma proposta mais contextualizada.",
      stages: [
        ["01", "Reunião", "Diagnosticar"],
        ["02", "E-book 02", "Educar"],
        ["03", "Growth Scan", "Aprofundar"],
        ["04", "Apresentação", "Demonstrar"],
        ["05", "Proposta", "Decidir"],
        ["06", "Follow-up", "Resolver"],
        ["07", "Venda", "Iniciar"],
      ],
      loop: "Objeções e dúvidas alimentam o roteiro comercial e as próximas versões dos materiais.",
      details: [
        ["CONTEXTO", "Nada genérico", "A conversa define quais pontos precisam aparecer no diagnóstico e na apresentação."],
        ["PERCEPÇÃO", "Material que continua trabalhando", "E-book e Growth Scan mantêm a tese viva depois da reunião."],
        ["FECHAMENTO", "Oferta no momento certo", "A proposta entra apenas quando problema, direção e valor já estão claros."],
      ],
    },
    squad: {
      eyebrow: "CAMPANHA 03 · SQUAD",
      title: "Da demanda parada à evolução contínua.",
      name: "Squad NEX · Tecnologia Agêntica",
      description: "Conteúdo e anúncios conduzem ao diagnóstico tecnológico, à reunião de priorização e ao ciclo inicial de 90 dias.",
      stages: [["01", "Conteúdo / anúncio", "Atrair"], ["02", "Landing Squad", "Explicar"], ["03", "Diagnóstico", "Qualificar"], ["04", "Reunião", "Priorizar"], ["05", "Mapa de demandas", "Demonstrar"], ["06", "Proposta 90 dias", "Converter"], ["07", "Squad NEX", "Evoluir"]],
      loop: "ENTREGAS, DADOS E APRENDIZADOS VOLTAM PARA O BACKLOG E DEFINEM O PRÓXIMO CICLO.",
      details: [
        ["ENTRADA", "Diagnóstico antes da proposta", "A empresa identifica demandas paradas e entende se precisa de um projeto ou de uma operação contínua."],
        ["MECANISMO", "Pessoas + agentes", "Especialistas definem direção e responsabilidade; agentes ampliam pesquisa, execução, revisão e monitoramento."],
        ["OFERTA", "Ciclo inicial de 90 dias", "O Squad começa com backlog, prioridades, primeiras entregas e documentação da evolução."],
      ],
    },
  };
  const defaultWeek = [
    {
      day: "SEG",
      date: "Início",
      asset: "organic-01",
      objective: "Abrir consciência",
      status: "Pronto",
    },
    {
      day: "TER",
      date: "Consciência",
      asset: "organic-02",
      objective: "Mostrar desconexão",
      status: "Pronto",
    },
    {
      day: "QUA",
      date: "Educação",
      asset: "carousel",
      objective: "Explicar a estrutura",
      status: "Pronto",
    },
    {
      day: "QUI",
      date: "Desejo",
      asset: "ad-01",
      objective: "Iniciar tráfego",
      status: "Pronto",
    },
    {
      day: "SEX",
      date: "Dor",
      asset: "ad-02",
      objective: "Testar urgência",
      status: "Pronto",
    },
    {
      day: "SÁB",
      date: "Mecanismo",
      asset: "ad-03",
      objective: "Explicar a oferta",
      status: "Pronto",
    },
    {
      day: "DOM",
      date: "Ação",
      asset: "ad-04",
      objective: "Converter para análise",
      status: "Pronto",
    },
  ];
  let week;
  try {
    week =
      JSON.parse(localStorage.getItem("nex-campaign-week-v1")) ||
      structuredClone(defaultWeek);
  } catch {
    week = structuredClone(defaultWeek);
  }
  const $ = (s) => document.querySelector(s),
    $$ = (s) => [...document.querySelectorAll(s)],
    byId = (id) => assets.find((a) => a.id === id),
    campaignAssets = () => assets.filter((a) => a.campaign === activeCampaign);
  function openView(view) {
    $$(".view").forEach((v) =>
      v.classList.toggle("is-active", v.id === `${view}-view`),
    );
    $$(".nav-tab").forEach((b) =>
      b.classList.toggle("is-active", b.dataset.view === view),
    );
    scrollTo({ top: 0, behavior: "smooth" });
  }
  $$(".nav-tab").forEach((b) => (b.onclick = () => openView(b.dataset.view)));
  $$("[data-open-view]").forEach(
    (b) =>
      (b.onclick = () => {
        openView(b.dataset.openView);
        if (b.dataset.filterJump) filterAssets(b.dataset.filterJump);
      }),
  );
  function renderPreview() {
    $("#week-preview").innerHTML = week
      .slice(0, 4)
      .map((w) => {
        const a = byId(w.asset);
        return `<div class="preview-day"><small>${w.day}</small><b>${a.title}</b><span>${w.objective}</span></div>`;
      })
      .join("");
  }
  function options(selected) {
    return campaignAssets()
      .filter((asset) => asset.type !== "deliverable")
      .map(
        (a) =>
          `<option value="${a.id}" ${a.id === selected ? "selected" : ""}>${a.title}</option>`,
      )
      .join("");
  }
  function renderWeek() {
    $("#week-board").innerHTML = week
      .map((w, i) => {
        const a = byId(w.asset);
        return `<article class="day-row" data-index="${i}"><div class="day-label"><small>${w.day}</small><b>${w.date}</b></div><img class="day-thumb" src="${a.image}" alt="${a.title}"><div class="day-fields"><select class="asset-select">${options(w.asset)}</select><input class="objective-input" value="${w.objective}" aria-label="Objetivo"></div><select class="status-select"><option ${w.status === "Pronto" ? "selected" : ""}>Pronto</option><option ${w.status === "Agendado" ? "selected" : ""}>Agendado</option><option ${w.status === "Publicado" ? "selected" : ""}>Publicado</option><option ${w.status === "Pendente" ? "selected" : ""}>Pendente</option></select></article>`;
      })
      .join("");
    $$(".day-row").forEach((row) => {
      const i = +row.dataset.index;
      row.querySelector(".asset-select").onchange = (e) => {
        week[i].asset = e.target.value;
        renderWeek();
      };
      row.querySelector(".objective-input").oninput = (e) => {
        week[i].objective = e.target.value;
        renderSummary();
      };
      row.querySelector(".status-select").onchange = (e) => {
        week[i].status = e.target.value;
        renderSummary();
      };
    });
    renderSummary();
    renderPreview();
  }
  function renderSummary() {
    $("#summary-list").innerHTML = week
      .map((w) => {
        const a = byId(w.asset);
        return `<div><small>${w.day} · ${w.status}</small><b>${a.title}</b><span>${w.objective}</span></div>`;
      })
      .join("");
  }
  $("#save-week").onclick = () => {
    localStorage.setItem("nex-campaign-week-v1", JSON.stringify(week));
    $("#save-note").textContent = "Semana salva ✓";
    setTimeout(
      () =>
        ($("#save-note").textContent =
          "As alterações ficam salvas neste navegador."),
      1800,
    );
  };
  $("#reset-week").onclick = () => {
    week = structuredClone(defaultWeek);
    localStorage.removeItem("nex-campaign-week-v1");
    renderWeek();
  };
  $("#copy-week").onclick = async (e) => {
    const t = [
      "PLANO DA SEMANA · NEX",
      ...week.map(
        (w) =>
          `${w.day} — ${byId(w.asset).title}\nObjetivo: ${w.objective}\nStatus: ${w.status}`,
      ),
    ].join("\n\n");
    await navigator.clipboard.writeText(t);
    e.target.textContent = "Resumo copiado ✓";
    setTimeout(() => (e.target.textContent = "Copiar resumo da semana"), 1700);
  };
  function renderAssets(filter = "all") {
    const scopedAssets = campaignAssets();
    const list =
      filter === "all" ? scopedAssets : scopedAssets.filter((a) => a.type === filter);
    const campaignCount = scopedAssets.filter((a) => a.type !== "deliverable").length;
    const deliverableCount = scopedAssets.filter((a) => a.type === "deliverable").length;
    $("#library-summary").innerHTML =
      `<span><b>${campaignCount}</b> peças de campanha</span><i></i><span><b>${deliverableCount}</b> entregáveis mapeados</span><i></i><span><b>${scopedAssets.filter((a) => !a.unavailable).length}</b> itens acessíveis agora</span>`;
    $("#asset-grid").innerHTML = list
      .map(
        (a) => `<article class="asset-card ${a.unavailable ? "is-pending" : ""}">
          <button class="asset-preview" data-asset="${a.id}">
            <span class="asset-visual"><img src="${a.image}" alt="${a.title}"><em>${a.unavailable ? "ARQUIVO PENDENTE" : "ABRIR"}</em></span>
            <span class="asset-meta"><small>${a.label}</small><b>${a.title}</b><span>${a.purpose}</span></span>
          </button>
          ${
            a.unavailable
              ? `<span class="asset-quick is-disabled">Aguardando arquivo final</span>`
              : a.type === "deliverable" && !a.download
                ? `<a class="asset-quick" href="${a.destination}" target="_blank">Abrir entregável</a>`
                : `<button class="asset-quick" data-download="${a.id}">Baixar ${a.download ? "arquivo" : "PNG"}</button>`
          }
        </article>`,
      )
      .join("");
    $$(".asset-preview").forEach(
      (c) => (c.onclick = () => openAsset(c.dataset.asset)),
    );
    $$("[data-download]").forEach(
      (button) =>
        (button.onclick = () => {
          const asset = byId(button.dataset.download);
          forceDownload(
            asset.download || asset.image,
            asset.filename || `nex-${asset.id}.png`,
          );
        }),
    );
  }
  function filterAssets(filter) {
    $$(".filter").forEach((b) =>
      b.classList.toggle("is-active", b.dataset.filter === filter),
    );
    renderAssets(filter);
  }
  $$(".filter").forEach(
    (b) => (b.onclick = () => filterAssets(b.dataset.filter)),
  );
  const modal = $("#asset-modal");
  async function forceDownload(url, filename) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("download");
      const blobUrl = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1500);
    } catch {
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
    }
  }
  function openAsset(id) {
    const a = byId(id);
    $("#modal-image").src = a.image;
    document.getElementById("modal-gallery")?.remove();
    if (a.images) {
      const gallery = document.createElement("div");
      gallery.id = "modal-gallery";
      gallery.style.cssText = "display:flex;gap:8px;padding:12px;justify-content:center";
      a.images.forEach((src, index) => {
        const button = document.createElement("button");
        button.textContent = `Peça ${index + 1}`;
        button.onclick = () => { $("#modal-image").src = src; };
        gallery.append(button);
      });
      $("#modal-image").after(gallery);
    }
    $("#modal-type").textContent = a.label;
    $("#modal-title").textContent = a.title;
    $("#modal-purpose").textContent = a.purpose;
    $("#modal-text").textContent = a.copy;
    $("#modal-destination").href = a.destination || "#";
    $("#modal-destination").textContent = a.destination || "Arquivo final ainda não anexado";
    $("#modal-destination").classList.toggle("is-disabled", !a.destination);
    const downloadButton = $("#download-asset");
    downloadButton.hidden = Boolean(a.unavailable);
    downloadButton.textContent = a.download ? "Baixar arquivo ↓" : "Baixar peça em PNG ↓";
    downloadButton.onclick = (event) => {
      event.preventDefault();
      forceDownload(
        a.download || a.image,
        a.filename || `nex-${a.id}.png`,
      );
    };
    $("#copy-asset").onclick = async (e) => {
      await navigator.clipboard.writeText(a.copy);
      e.target.textContent = "Copy copiada ✓";
      setTimeout(() => (e.target.textContent = "Copiar copy"), 1600);
    };
    modal.showModal();
  }
  $(".modal-close").onclick = () => modal.close();
  $$("[data-asset-open]").forEach((button) => {
    button.onclick = () => openAsset(button.dataset.assetOpen);
  });
  modal.onclick = (e) => {
    if (e.target === modal) modal.close();
  };
  $("#funnel-switcher").innerHTML = Object.entries(funnels)
    .map(
      ([id, funnel], index) =>
        `<button class="funnel-choice ${index === 0 ? "is-active" : ""}" data-funnel="${id}"><small>0${index + 1}</small><span>${funnel.name}</span></button>`,
    )
    .join("");
  $("#funnel-switcher").hidden = true;
  function renderFunnel(id) {
    const funnel = funnels[id];
    $("#funnel-eyebrow").textContent = funnel.eyebrow;
    $("#funnel-title").textContent = funnel.title;
    $("#active-funnel-name").textContent = funnel.name;
    $("#active-funnel-description").textContent = funnel.description;
    $("#funnel-line").innerHTML = funnel.stages
      .map(
        (stage, index) =>
          `<div class="funnel-step" style="--delay:${index * 70}ms"><i>${stage[0]}</i><b>${stage[1]}</b><span>${stage[2]}</span></div>`,
      )
      .join("");
    $("#funnel-line").style.setProperty("--funnel-count", funnel.stages.length);
    $("#remarketing-loop").textContent = funnel.loop;
    funnel.details.forEach((detail, index) => {
      const n = index + 1;
      $(`#funnel-detail-${n}-label`).textContent = detail[0];
      $(`#funnel-detail-${n}-title`).textContent = detail[1];
      $(`#funnel-detail-${n}-copy`).textContent = detail[2];
    });
    $$(".funnel-choice").forEach((button) =>
      button.classList.toggle("is-active", button.dataset.funnel === id),
    );
  }
  $$(".funnel-choice").forEach(
    (button) => (button.onclick = () => renderFunnel(button.dataset.funnel)),
  );
  renderFunnel("blueprint");

  function selectCampaign(id) {
    activeCampaign = id;
    const campaign = campaigns[id];
    $("#funnel-view").classList.remove("is-empty-campaign");
    $$(".campaign-pill").forEach((button) =>
      button.classList.toggle("is-active", button.dataset.campaign === id),
    );
    $(".hero-shell .eyebrow").textContent = campaign.eyebrow;
    $(".hero-shell h1").textContent = campaign.hero;
    $(".hero-copy").textContent = campaign.copy;
    const headerAction = $(".header-action");
    headerAction.href = campaign.destination;
    headerAction.textContent = "Abrir site ↗";
    headerAction.classList.remove("is-disabled");
    const showcase = campaign.showcase ? byId(campaign.showcase) : null;
    const showcaseImage = $("#showcase-image");
    const showcaseButton = $("#showcase-open");
    if (showcase) {
      showcaseImage.hidden = false;
      showcaseImage.src = showcase.image;
      showcaseImage.alt = showcase.title;
      $("#showcase-label").textContent = showcase.label;
      showcaseButton.hidden = false;
      showcaseButton.dataset.assetOpen = showcase.id;
      showcaseButton.onclick = () => openAsset(showcase.id);
    } else {
      showcaseImage.hidden = true;
      showcaseImage.removeAttribute("src");
      showcaseImage.alt = "";
      $("#showcase-label").textContent = "CAMPANHA 03 · EM ESTRUTURAÇÃO";
      showcaseButton.hidden = true;
    }
    campaign.metrics.forEach((metric, index) => {
      const n = ["one", "two", "three"][index];
      $(`#metric-${n}-label`).textContent = metric[0];
      $(`#metric-${n}-value`).textContent = metric[1];
      $(`#metric-${n}-copy`).textContent = metric[2];
    });
    if (id === "campaign1") {
      week = [
        { day: "SEG", date: "Oferta", asset: "blueprint-post-01", objective: "Apresentar a campanha", status: "Pronto" },
      ];
    } else if (id === "campaign2") {
      week = structuredClone(defaultWeek);
    } else {
      week = [
        { day: "SEG", date: "Abertura", asset: "squad-post-01", objective: "Apresentar a nova categoria", status: "Pronto" },
        { day: "QUA", date: "Mecanismo", asset: "squad-carousel", objective: "Explicar pessoas + agentes", status: "Pronto" },
        { day: "SEX", date: "Oferta", asset: "squad-post-03", objective: "Gerar diagnósticos", status: "Pronto" },
      ];
    }
    renderWeek();
    renderAssets("all");
    renderFunnel(campaign.funnel);
  }
  $$(".campaign-pill").forEach((button) => {
    button.onclick = () => selectCampaign(button.dataset.campaign);
  });

  const canvas = $("#ambient-canvas");
  const ctx = canvas.getContext("2d");
  let pointerX = innerWidth * 0.72;
  let pointerY = innerHeight * 0.3;
  let canvasWidth = 0;
  let canvasHeight = 0;
  const particles = Array.from({ length: 32 }, (_, index) => ({
    x: Math.random(),
    y: Math.random(),
    speed: 0.00005 + Math.random() * 0.00011,
    size: index % 7 === 0 ? 1.8 : 0.7 + Math.random(),
    phase: Math.random() * Math.PI * 2,
  }));
  function resizeCanvas() {
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvasWidth = innerWidth;
    canvasHeight = innerHeight;
    canvas.width = canvasWidth * ratio;
    canvas.height = canvasHeight * ratio;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }
  function drawAmbient(time) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    const glow = ctx.createRadialGradient(pointerX, pointerY, 0, pointerX, pointerY, 260);
    glow.addColorStop(0, "rgba(249,91,7,.09)");
    glow.addColorStop(1, "rgba(249,91,7,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    particles.forEach((particle, index) => {
      const x = (particle.x * canvasWidth + time * particle.speed * canvasWidth) % canvasWidth;
      const y = particle.y * canvasHeight + Math.sin(time * 0.00035 + particle.phase) * 28;
      ctx.beginPath();
      ctx.fillStyle = index % 5 === 0 ? "rgba(249,91,7,.48)" : "rgba(255,255,255,.16)";
      ctx.arc(x, y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(drawAmbient);
  }
  addEventListener("resize", resizeCanvas);
  addEventListener("pointermove", (event) => {
    pointerX += (event.clientX - pointerX) * 0.16;
    pointerY += (event.clientY - pointerY) * 0.16;
    document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
    document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);
  });
  resizeCanvas();
  requestAnimationFrame(drawAmbient);
  renderWeek();
  renderAssets();
  selectCampaign("campaign1");
})();
