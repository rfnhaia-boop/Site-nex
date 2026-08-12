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

// Docs sempre presentes no contexto: identidade, regras de raciocínio e guardrail comercial.
// Retrieval por assunto (cases, faq, nex-os...) entra depois, sob demanda.
const CORE_DOCS = ['nex-company', 'methodology', 'capabilities', 'commercial', 'policies', 'faq', 'projects', 'nex-os', 'lari'];

export function loadCoreKnowledge() {
  return CORE_DOCS.map((id) => ({ id, content: readKnowledgeDoc(id) }));
}
