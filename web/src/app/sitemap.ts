import type { MetadataRoute } from "next";
import { ALL_PACKS } from "@/content/pack-registry";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, "");
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
  ];
  for (const pack of ALL_PACKS) {
    const packId = pack.config.id;
    entries.push({
      url: `${base}/${packId}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    });
    entries.push({
      url: `${base}/${packId}/mock`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    });
    for (const section of pack.curriculum.sections) {
      entries.push({
        url: `${base}/${packId}/section/${section.id}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.6,
      });
      if (section.sectionTest) {
        entries.push({
          url: `${base}/${packId}/section/${section.id}/test`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.5,
        });
      }
      for (const concept of section.concepts) {
        if (!concept.lesson) continue;
        entries.push({
          url: `${base}/${packId}/concept/${section.id}/${concept.id}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.6,
        });
        if (concept.quiz) {
          entries.push({
            url: `${base}/${packId}/concept/${section.id}/${concept.id}/quiz`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.4,
          });
        }
      }
    }
    for (const mock of pack.curriculum.mockExams ?? []) {
      entries.push({
        url: `${base}/${packId}/mock/${mock.id}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.5,
      });
    }
  }
  return entries;
}
