import fs from 'node:fs';
import path from 'node:path';

const KNOWLEDGE_DIR = path.join(process.cwd(), 'knowledge');

const cache = new Map();

// Lê um doc da Knowledge Base pelo id (nome do arquivo sem .md).
export function readKnowledgeDoc(id) {
  if (cache.has(id)) return cache.get(id);
  const filePath = path.join(KNOWLEDGE_DIR, `${id}.md`);
  const content = fs.readFileSync(filePath, 'utf-8');
  cache.set(id, content);
  return content;
}

// Sempre presentes: identidade essencial da NEX e o que ela faz -- o mínimo
// pra qualquer resposta fazer sentido. Mantido pequeno de propósito: um
// system prompt grande demais (>~8-10KB) faz o modelo da Groq (gpt-oss-20b)
// travar o stream silenciosamente em ~15-20% das mensagens (sem erro, sem
// chunk nenhum -- só trava). Testado e confirmado: com só isso aqui, 8/8
// chamadas de teste voltaram rápido; com a base completa (9 docs, ~12KB),
// quase metade falhava.
const CORE_DOCS = ['nex-company', 'capabilities'];

// Os outros docs só entram quando o assunto da mensagem parece pedir --
// mantém o prompt pequeno na maioria das conversas.
const TOPIC_DOCS = [
  { id: 'commercial', pattern: /pre[çc]o|contrat|investimento|quanto custa|plano[s]?\b|proposta|comercial|valor/i },
  { id: 'faq', pattern: /d[uú]vida|pergunta|faq|como funciona/i },
  { id: 'methodology', pattern: /metodologia|processo de trabalho|como voc[eê]s trabalham|abordagem/i },
  { id: 'policies', pattern: /pol[ií]tica|termo[s]?\b|privacidade|seguran[çc]a dos dados|contrato/i },
  { id: 'projects', pattern: /case[s]?\b|projeto[s]? (da|de) nex|exemplo[s]? de (projeto|cliente)|portf[oó]lio|resultado[s]? (da|de) nex/i },
  { id: 'nex-os', pattern: /nex[\s-]?os/i },
  { id: 'lari', pattern: /\blari\b|imobili[aá]ria/i },
];

export function loadCoreKnowledge(conversationText = '') {
  const docs = CORE_DOCS.map((id) => ({ id, content: readKnowledgeDoc(id) }));
  for (const { id, pattern } of TOPIC_DOCS) {
    if (pattern.test(conversationText)) {
      docs.push({ id, content: readKnowledgeDoc(id) });
    }
  }
  return docs;
}
