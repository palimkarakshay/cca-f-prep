import { ALL_PACKS } from "@/content/pack-registry";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-static";

export async function GET(): Promise<Response> {
  const base = siteConfig.url.replace(/\/$/, "");
  const lines: string[] = [];
  lines.push(`# Learning journeys`);
  lines.push("");
  lines.push(
    `> Pick a learning journey at ${base}/. Each journey is self-contained — sections + applied practice + a way to verify mastery.`
  );
  lines.push("");

  for (const pack of ALL_PACKS) {
    const c = pack.config;
    lines.push(`## ${c.name}`);
    lines.push("");
    lines.push(`URL: ${base}/${c.id}`);
    lines.push(c.description);
    lines.push("");
    lines.push("### Sections");
    for (const section of pack.curriculum.sections) {
      lines.push("");
      lines.push(`#### Section ${section.n}: ${section.title}`);
      if (section.sourceCourse) lines.push(`Source: ${section.sourceCourse}`);
      lines.push(section.blurb);
      for (const concept of section.concepts) {
        const url = `${base}/${c.id}/concept/${section.id}/${concept.id}`;
        const bloom = concept.bloom ? ` — Bloom ${concept.bloom}` : "";
        lines.push(`- [${concept.code} ${concept.title}](${url})${bloom}`);
      }
    }
    if (pack.curriculum.mockExams && pack.curriculum.mockExams.length > 0) {
      lines.push("");
      lines.push(
        `### ${(c.copy?.mockExamsHeading ?? "Mock exams")}`
      );
      for (const m of pack.curriculum.mockExams) {
        lines.push(`- [${m.title}](${base}/${c.id}/mock/${m.id}) — ${m.blurb}`);
      }
    }
    lines.push("");
  }
  return new Response(lines.join("\n") + "\n", {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
