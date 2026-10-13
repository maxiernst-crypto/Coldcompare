import Link from "next/link";
import { Container } from "@/components/ui";

// Rendered inside the locale layout; language is not available here, so the text is bilingual.
export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="text-sm font-semibold text-accent-strong">404</p>
      <h1 className="mt-2 text-3xl font-bold">Page not found · Seite nicht gefunden</h1>
      <p className="mt-3 text-fg-muted">The page you were looking for does not exist or has moved.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/en" className="rounded-lg bg-fg px-4 py-2 font-semibold text-bg">
          Home
        </Link>
        <Link href="/de" className="rounded-lg border border-line-strong px-4 py-2 font-semibold">
          Startseite
        </Link>
      </div>
    </Container>
  );
}
