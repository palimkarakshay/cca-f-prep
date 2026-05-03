import Link from "next/link";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container width="prose" className="py-12 text-center">
      <p className="font-mono text-xs text-(--muted)">404</p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-(--ink)">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-(--muted)">
        The section, concept, or mock exam you were looking for isn't here yet.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block text-sm text-(--accent-2) hover:underline"
      >
        ← Back to dashboard
      </Link>
    </Container>
  );
}
