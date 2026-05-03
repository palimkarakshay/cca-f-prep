import type { MetadataRoute } from "next";
import { CURRICULUM } from "@/content/curriculum";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, "");
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/mock`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  ];
  for (const section of CURRICULUM.sections) {
    entries.push({
      url: `${base}/section/${section.id}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    });
    if (section.sectionTest) {
      entries.push({
        url: `${base}/section/${section.id}/test`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.5,
      });
    }
    for (const concept of section.concepts) {
      if (!concept.lesson) continue;
      entries.push({
        url: `${base}/concept/${section.id}/${concept.id}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.6,
      });
      if (concept.quiz) {
        entries.push({
          url: `${base}/concept/${section.id}/${concept.id}/quiz`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.4,
        });
      }
    }
  }
  for (const mock of CURRICULUM.mockExams ?? []) {
    entries.push({
      url: `${base}/mock/${mock.id}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    });
  }
  return entries;
}
