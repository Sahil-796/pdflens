// app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://zendrapdf.app/",
      lastModified: new Date().toISOString(),
      priority: 1.0,
    },
    {
      url: "https://zendrapdf.app/tools",
      lastModified: new Date().toISOString(),
      priority: 0.8,
    },
  ];
}
