import type { MetadataRoute } from "next";
import { SEO_PAGES } from "@/lib/seoPages";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nex.newflowsys.cloud";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...SEO_PAGES.map((page) => ({
      url: `${SITE_URL}${page.path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    {
      url: `${SITE_URL}/havi`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/links`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // Produtos NEX (Blueprint, Context Agent, Squad, Site Studio)
    ...[
      ["/blueprint", 0.9],
      ["/context-agent", 0.8],
      ["/squad", 0.8],
      ["/studio", 0.8],
      ["/studio/briefing", 0.6],
    ].map(([path, priority]) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: priority as number,
    })),
    // /ia é ferramenta interativa (chat), não conteúdo — não entra no sitemap nem é indexada
    // (ver robots: false em src/app/ia/layout.tsx). /login também não entra (robots: false).
  ];
}
