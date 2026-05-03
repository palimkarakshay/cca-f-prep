import type { Lesson } from "@/content/curriculum-types";

/**
 * Lesson table-of-contents rail. Auto-derived from which lesson sections
 * are populated. Renders nothing if there are no anchored sections.
 */
export function LessonTOC({ lesson }: { lesson: Lesson }) {
  const items: { id: string; label: string }[] = [];
  if (lesson.keyPoints && lesson.keyPoints.length > 0) {
    items.push({ id: "key-points", label: "Key points" });
  }
  if (lesson.examples && lesson.examples.length > 0) {
    items.push({ id: "examples", label: "Examples" });
  }
  if (lesson.pitfalls && lesson.pitfalls.length > 0) {
    items.push({ id: "pitfalls", label: "Pitfalls" });
  }

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Lesson contents"
      className="hidden text-xs lg:block lg:sticky lg:top-6"
    >
      <h2 className="mb-2 font-semibold uppercase tracking-wide text-(--muted)">
        On this page
      </h2>
      <ol className="flex flex-col gap-1">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="block rounded-md px-2 py-1 text-(--muted) no-underline transition-colors hover:bg-(--panel-2) hover:text-(--ink)"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
