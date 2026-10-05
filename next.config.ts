import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Política de segurança de conteúdo (CSP): só roda script/estilo/conexão das
// origens listadas — um script injetado de fora não executa nem manda dado
// pra lugar nenhum. 'unsafe-inline' em script é exigido pelo Next sem nonce;
// 'unsafe-eval' só em dev (hot reload). O NEX Core entra no connect-src pro
// rastreamento. Login Google é redirecionamento (form-action).
const nexCoreOrigin = (() => {
  try {
    return process.env.NEXT_PUBLIC_NEX_CORE_URL ? new URL(process.env.NEXT_PUBLIC_NEX_CORE_URL).origin : "";
  } catch {
    return "";
  }
})();

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "media-src 'self' blob: data:",
  `connect-src 'self'${nexCoreOrigin ? ` ${nexCoreOrigin}` : ""}${isDev ? " ws: wss:" : ""}`,
  "worker-src 'self' blob:",
  "frame-ancestors 'self'",
  "form-action 'self' https://accounts.google.com",
  "base-uri 'self'",
  "object-src 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(self), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  // Não anunciar "X-Powered-By: Next.js" (auditoria de segurança do NEX OS).
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
