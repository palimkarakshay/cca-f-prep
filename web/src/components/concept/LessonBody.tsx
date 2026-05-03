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
        <>
          <h3 className="mt-6 text-xs font-semibold uppercase tracking-wide text-(--accent-2)">
            Key points
          </h3>
          <ul className="my-2 list-disc pl-5">
            {lesson.keyPoints.map((kp, i) => (
              <li key={i} className="my-1">
                {kp}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {lesson.examples && lesson.examples.length > 0 ? (
        <>
          <h3 className="mt-6 text-xs font-semibold uppercase tracking-wide text-(--accent-2)">
            Examples
          </h3>
          {lesson.examples.map((ex, i) => (
            <div
              key={i}
              className="my-3 rounded-md border border-(--border) bg-(--panel-2) p-3"
            >
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-(--accent-2)">
                {ex.title}
              </div>
              <p className="whitespace-pre-wrap text-sm">{ex.body}</p>
            </div>
          ))}
        </>
      ) : null}

      {lesson.pitfalls && lesson.pitfalls.length > 0 ? (
        <div className="mt-4 rounded-r-md border-l-2 border-(--bad) bg-(--bad)/5 p-3">
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-(--bad)">
            Pitfalls
          </h3>
          <ul className="list-disc pl-5">
            {lesson.pitfalls.map((p, i) => (
              <li key={i} className="my-1 text-sm">
                {p}
              </li>
            ))}
          </ul>
        </div>
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
