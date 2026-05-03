import { Lightbulb, Terminal, AlertTriangle, BookOpen } from "lucide-react";
import type { Lesson } from "@/content/curriculum-types";

export function LessonBody({ lesson }: { lesson: Lesson }) {
  return (
    <div className="text-(--ink)">
      {lesson.paragraphs.map((p, i) => (
        <p key={i} className="my-3 text-base leading-relaxed">
          {p}
        </p>
      ))}

      {lesson.keyPoints && lesson.keyPoints.length > 0 ? (
        <section
          id="key-points"
          aria-label="Key points"
          className="mt-6 scroll-mt-24 rounded-lg border border-(--border) bg-(--panel-2) p-4"
        >
          <h2 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-(--accent-2)">
            <Lightbulb className="h-3.5 w-3.5" aria-hidden />
            Key points
          </h2>
          <ul className="my-1 list-disc pl-5">
            {lesson.keyPoints.map((kp, i) => (
              <li key={i} className="my-1">
                {kp}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {lesson.examples && lesson.examples.length > 0 ? (
        <section
          id="examples"
          aria-label="Examples"
          className="mt-6 scroll-mt-24"
        >
          <h2 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-(--accent-2)">
            <Terminal className="h-3.5 w-3.5" aria-hidden />
            Examples
          </h2>
          {lesson.examples.map((ex, i) => (
            <div
              key={i}
              className="my-3 rounded-md border border-(--border) bg-(--panel-2) p-3 shadow-sm"
            >
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-(--accent-2)">
                {ex.title}
              </div>
              <p className="whitespace-pre-wrap text-sm">{ex.body}</p>
            </div>
          ))}
        </section>
      ) : null}

      {lesson.pitfalls && lesson.pitfalls.length > 0 ? (
        <section
          id="pitfalls"
          aria-label="Pitfalls"
          className="mt-6 scroll-mt-24 rounded-r-md border-l-4 border-(--bad) bg-(--bad)/8 p-3"
        >
          <h2 className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-(--bad)">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
            Pitfalls
          </h2>
          <ul className="list-disc pl-5">
            {lesson.pitfalls.map((p, i) => (
              <li key={i} className="my-1 text-sm">
                {p}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {lesson.notesRef ? (
        <p className="mt-6 border-t border-dashed border-(--border) pt-3 text-xs text-(--muted)">
          Source notes: <code>{lesson.notesRef}</code>
        </p>
      ) : null}
    </div>
  );
}

export function SimplifiedBody({
  simplified,
}: {
  simplified: NonNullable<Lesson["simplified"]>;
}) {
  return (
    <div className="text-(--ink)">
      {simplified.oneLiner ? (
        <p className="my-2 rounded-r-md border-l-4 border-(--accent) bg-(--panel-2) p-3 text-base leading-relaxed">
          {simplified.oneLiner}
        </p>
      ) : null}
      {simplified.analogy ? (
        <p className="my-3 leading-relaxed">{simplified.analogy}</p>
      ) : null}
      {simplified.paragraphs?.map((p, i) => (
        <p key={i} className="my-3 leading-relaxed">
          {p}
        </p>
      ))}
      {simplified.keyPoints && simplified.keyPoints.length > 0 ? (
        <ul className="my-2 list-disc pl-5">
          {simplified.keyPoints.map((kp, i) => (
            <li key={i} className="my-1">
              {kp}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function DeeperBody({
  deeper,
}: {
  deeper: NonNullable<Lesson["deeper"]>;
}) {
  return (
    <div className="text-(--ink)">
      {deeper.oneLiner ? (
        <p className="my-2 rounded-r-md border-l-4 border-(--accent-2) bg-(--panel-2) p-3 text-base leading-relaxed">
          {deeper.oneLiner}
        </p>
      ) : null}

      {deeper.paragraphs?.map((p, i) => (
        <p key={i} className="my-3 text-base leading-relaxed">
          {p}
        </p>
      ))}

      {deeper.keyPoints && deeper.keyPoints.length > 0 ? (
        <section
          aria-label="Deeper key points"
          className="mt-6 rounded-lg border border-(--border) bg-(--panel-2) p-4"
        >
          <h2 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-(--accent-2)">
            <Lightbulb className="h-3.5 w-3.5" aria-hidden />
            Deeper key points
          </h2>
          <ul className="my-1 list-disc pl-5">
            {deeper.keyPoints.map((kp, i) => (
              <li key={i} className="my-1">
                {kp}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {deeper.examples && deeper.examples.length > 0 ? (
        <section aria-label="Advanced examples" className="mt-6">
          <h2 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-(--accent-2)">
            <Terminal className="h-3.5 w-3.5" aria-hidden />
            Advanced examples
          </h2>
          {deeper.examples.map((ex, i) => (
            <div
              key={i}
              className="my-3 rounded-md border border-(--border) bg-(--panel-2) p-3 shadow-sm"
            >
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-(--accent-2)">
                {ex.title}
              </div>
              <p className="whitespace-pre-wrap text-sm">{ex.body}</p>
            </div>
          ))}
        </section>
      ) : null}

      {deeper.pitfalls && deeper.pitfalls.length > 0 ? (
        <section
          aria-label="Edge-case pitfalls"
          className="mt-6 rounded-r-md border-l-4 border-(--bad) bg-(--bad)/8 p-3"
        >
          <h2 className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-(--bad)">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
            Edge-case pitfalls
          </h2>
          <ul className="list-disc pl-5">
            {deeper.pitfalls.map((p, i) => (
              <li key={i} className="my-1 text-sm">
                {p}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {deeper.furtherReading && deeper.furtherReading.length > 0 ? (
        <section
          aria-label="Further reading"
          className="mt-6 rounded-md border border-dashed border-(--border) p-3"
        >
          <h2 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-(--accent-2)">
            <BookOpen className="h-3.5 w-3.5" aria-hidden />
            Further reading
          </h2>
          <ul className="list-disc pl-5 text-sm">
            {deeper.furtherReading.map((link, i) => (
              <li key={i} className="my-1">
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-(--accent-2) underline"
                >
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
