import { CURRICULUM } from "@/content/curriculum";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-static";

export async function GET(): Promise<Response> {
  const base = siteConfig.url.replace(/\/$/, "");
  const lines: string[] = [];
  lines.push(`# ${siteConfig.name}`);
  lines.push("");
  lines.push(`> ${siteConfig.description}`);
  lines.push("");
  lines.push("## Sections");
  for (const section of CURRICULUM.sections) {
    lines.push("");
    lines.push(
      `### Section ${section.n}: ${section.title}`
    );
    if (section.sourceCourse) lines.push(`Source: ${section.sourceCourse}`);
    lines.push(section.blurb);
    for (const c of section.concepts) {
      const url = `${base}/concept/${section.id}/${c.id}`;
      lines.push(`- [${c.code} ${c.title}](${url}) — Bloom ${c.bloom}`);
    }
  }
  if (CURRICULUM.mockExams && CURRICULUM.mockExams.length > 0) {
    lines.push("");
    lines.push("## Mock exams");
    for (const m of CURRICULUM.mockExams) {
      lines.push(`- [${m.title}](${base}/mock/${m.id}) — ${m.blurb}`);
    }
  }
  return new Response(lines.join("\n") + "\n", {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
