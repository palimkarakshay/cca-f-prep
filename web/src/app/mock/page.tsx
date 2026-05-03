import type { Metadata } from "next";
import Link from "next/link";
import { getMockExams } from "@/content/curriculum-loader";
import { Breadcrumbs } from "@/components/primitives/Breadcrumbs";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Mock exams",
  description: "Independent calibration exams across all five CCA-F domains.",
};

export default function MockIndexPage() {
  const mocks = getMockExams();
  return (
    <Container width="prose" className="py-2">
      <Breadcrumbs trail={[{ label: "Dashboard", href: "/" }, { label: "Mock exams" }]} />
      <header className="mb-4">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-(--ink)">
          Mock exams
        </h1>
        <p className="mt-1 text-sm text-(--muted)">
          Independent of section progress. Use for calibration before the real
          exam.
        </p>
      </header>

      {mocks.length === 0 ? (
        <p className="text-sm text-(--muted)">
          No mock exams authored yet. They live at the top level of
          <code className="mx-1 rounded-sm bg-(--panel-2) px-1.5 py-0.5">
            CURRICULUM.mockExams
          </code>
          and surface here automatically.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {mocks.map((m) => (
            <li key={m.id}>
              <Card>
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h2 className="text-base font-semibold text-(--ink)">{m.title}</h2>
                  <span className="text-xs text-(--muted)">
                    {m.questions.length} Q · {m.timeMinutes}m ·{" "}
                    {Math.round(m.passPct * 100)}% pass
                  </span>
                </div>
                <p className="mt-1 text-sm text-(--muted)">{m.blurb}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    href={`/mock/${m.id}`}
                    className={cn(
                      buttonVariants({ variant: "default", size: "sm" }),
                      "no-underline"
                    )}
                  >
                    Start
                  </Link>
                  <Link
                    href={`/mock/${m.id}/result`}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }),
                      "no-underline"
                    )}
                  >
                    Review last attempt
                  </Link>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
