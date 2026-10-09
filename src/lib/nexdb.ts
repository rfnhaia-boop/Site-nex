import { prisma } from "@/lib/prisma";

// Camada de dados dos produtos NEX (Site Studio, Blueprint, Context Agent, Squad).
// O pacote original rodava em Cloudflare D1 (db.prepare(...).bind(...).first/all/run).
// Aqui a mesma interface roda em cima do SQLite do Prisma, para o código portado
// continuar igual. As tabelas são criadas na primeira chamada (IF NOT EXISTS).

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS projects (id TEXT PRIMARY KEY NOT NULL, owner TEXT NOT NULL, answers TEXT NOT NULL DEFAULT '{}', cursor INTEGER NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'draft', updated TEXT NOT NULL)`,
  `CREATE INDEX IF NOT EXISTS projects_owner ON projects (owner)`,
  `CREATE TABLE IF NOT EXISTS files (id TEXT PRIMARY KEY NOT NULL, project TEXT NOT NULL REFERENCES projects(id), name TEXT NOT NULL, mime TEXT NOT NULL, size INTEGER NOT NULL, key TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS project_operations (project TEXT PRIMARY KEY NOT NULL REFERENCES projects(id), stage TEXT NOT NULL DEFAULT 'analysis', message TEXT NOT NULL DEFAULT '', internal_note TEXT NOT NULL DEFAULT '', preview TEXT NOT NULL DEFAULT '', meeting TEXT NOT NULL DEFAULT '', payment_reference TEXT NOT NULL DEFAULT '', paid_at TEXT NOT NULL DEFAULT '', agreed_amount INTEGER NOT NULL DEFAULT 0, materials_ready INTEGER NOT NULL DEFAULT 0, due TEXT NOT NULL DEFAULT '', updated TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS project_events (id TEXT PRIMARY KEY NOT NULL, project TEXT NOT NULL REFERENCES projects(id), actor TEXT NOT NULL, kind TEXT NOT NULL, message TEXT NOT NULL, created TEXT NOT NULL)`,
  `CREATE INDEX IF NOT EXISTS events_project ON project_events (project)`,
  `CREATE TABLE IF NOT EXISTS analytics_events (id TEXT PRIMARY KEY NOT NULL, visitor TEXT NOT NULL, session TEXT NOT NULL, product TEXT NOT NULL, kind TEXT NOT NULL, path TEXT NOT NULL, target TEXT NOT NULL DEFAULT '', referrer TEXT NOT NULL DEFAULT '', created TEXT NOT NULL, step TEXT NOT NULL DEFAULT '', meta TEXT NOT NULL DEFAULT '', email TEXT NOT NULL DEFAULT '')`,
  `CREATE INDEX IF NOT EXISTS analytics_created ON analytics_events (created)`,
  `CREATE INDEX IF NOT EXISTS analytics_visitor ON analytics_events (visitor)`,
  `CREATE INDEX IF NOT EXISTS analytics_product_created ON analytics_events (product, created)`,
  `CREATE TABLE IF NOT EXISTS centralized_leads (id TEXT PRIMARY KEY NOT NULL, product TEXT NOT NULL, source TEXT NOT NULL, visitor TEXT NOT NULL, session TEXT NOT NULL, status TEXT NOT NULL, name TEXT NOT NULL DEFAULT '', email TEXT NOT NULL DEFAULT '', phone TEXT NOT NULL DEFAULT '', company TEXT NOT NULL DEFAULT '', answers TEXT NOT NULL DEFAULT '{}', consent INTEGER NOT NULL DEFAULT 0, origin TEXT NOT NULL, created TEXT NOT NULL, updated TEXT NOT NULL, submitted TEXT NOT NULL DEFAULT '')`,
  `CREATE INDEX IF NOT EXISTS centralized_leads_product ON centralized_leads (product, updated)`,
  `CREATE INDEX IF NOT EXISTS centralized_leads_visitor ON centralized_leads (visitor)`,
  `CREATE INDEX IF NOT EXISTS centralized_leads_status ON centralized_leads (status, updated)`,
];

let ready: Promise<void> | null = null;
function ensureSchema() {
  if (!ready) {
    ready = (async () => {
      for (const sql of SCHEMA) await prisma.$executeRawUnsafe(sql);
    })().catch((error) => {
      ready = null;
      throw error;
    });
  }
  return ready;
}

// Prisma devolve INTEGER do SQLite como BigInt; o código portado espera number.
function plain<T>(row: Record<string, unknown>): T {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) out[key] = typeof value === "bigint" ? Number(value) : value;
  return out as T;
}

type Tx = { $executeRawUnsafe: (sql: string, ...args: unknown[]) => Promise<number> };

class Statement {
  constructor(
    private sql: string,
    private args: unknown[] = [],
  ) {}
  bind(...args: unknown[]) {
    return new Statement(this.sql, args);
  }
  async first<T = Record<string, unknown>>(): Promise<T | null> {
    await ensureSchema();
    const rows = (await prisma.$queryRawUnsafe(this.sql, ...this.args)) as Record<string, unknown>[];
    return rows[0] ? plain<T>(rows[0]) : null;
  }
  async all<T = Record<string, unknown>>(): Promise<{ results: T[] }> {
    await ensureSchema();
    const rows = (await prisma.$queryRawUnsafe(this.sql, ...this.args)) as Record<string, unknown>[];
    return { results: rows.map((row) => plain<T>(row)) };
  }
  async run() {
    await ensureSchema();
    const changes = await prisma.$executeRawUnsafe(this.sql, ...this.args);
    return { success: true, meta: { changes } };
  }
  // usado pelo batch
  exec(tx: Tx) {
    return tx.$executeRawUnsafe(this.sql, ...this.args);
  }
}

export function nexdb() {
  return {
    prepare: (sql: string) => new Statement(sql),
    // Mesmo contrato do D1: devolve um resultado por comando (meta.changes = linhas afetadas),
    // usado pelo Studio para detectar edição concorrente.
    batch: async (statements: Statement[]) => {
      await ensureSchema();
      return (await prisma.$transaction(async (tx: Tx) => {
        const results: { success: boolean; meta: { changes: number } }[] = [];
        for (const statement of statements) results.push({ success: true, meta: { changes: Number(await statement.exec(tx)) } });
        return results;
      })) as { success: boolean; meta: { changes: number } }[];
    },
  };
}
