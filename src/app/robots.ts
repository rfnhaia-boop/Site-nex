import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nex.newflowsys.cloud";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/central", "/studio/admin", "/studio/painel", "/havi-embed", "/blueprint/agendar", "/blueprint/growth-scan"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
