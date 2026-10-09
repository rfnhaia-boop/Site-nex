import { createReadStream, promises as fs } from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { isAdmin } from "@/studio/lib/storage";

// Central de Campanhas (interna): criativos, copies, plano da semana e funil. Só administradores.
// Arquivos leves ficam em private/central (versionado); os pesados (campanhas, PDFs, zips) ficam
// fora do repositório, em CENTRAL_ASSETS_DIR (na VPS: /opt/nex-data/central).
export const dynamic = "force-dynamic";

const ROOTS = [path.join(process.cwd(), "private", "central"), process.env.CENTRAL_ASSETS_DIR].filter(Boolean) as string[];

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".zip": "application/zip",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".md": "text/plain; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

async function locate(parts: string[]) {
  const rel = parts.length ? parts.join("/") : "index.html";
  if (rel.split("/").some((p) => p === ".." || p === "." || p.includes("\\") || p.includes("\0"))) return null;
  for (const root of ROOTS) {
    const file = path.join(root, rel);
    if (!file.startsWith(root + path.sep)) continue;
    try {
      const stat = await fs.stat(file);
      if (stat.isFile()) return { file, size: stat.size };
    } catch {
      /* tenta a próxima raiz */
    }
  }
  return null;
}

export async function GET(request: Request, { params }: { params: Promise<{ path?: string[] }> }) {
  if (!(await isAdmin(request))) {
    const url = new URL(request.url);
    const back = encodeURIComponent(url.pathname + url.search);
    return new Response(null, {
      status: 302,
      headers: { Location: `/login?returnTo=${back}`, "Cache-Control": "private, no-store" },
    });
  }
  const { path: parts = [] } = await params;
  const found = await locate(parts);
  if (!found) return new Response("Arquivo não encontrado", { status: 404 });
  const type = TYPES[path.extname(found.file).toLowerCase()] || "application/octet-stream";
  const body = Readable.toWeb(createReadStream(found.file)) as unknown as ReadableStream;
  return new Response(body, {
    headers: {
      "Content-Type": type,
      "Content-Length": String(found.size),
      "Cache-Control": "private, max-age=300",
      "X-Robots-Tag": "noindex, nofollow",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
