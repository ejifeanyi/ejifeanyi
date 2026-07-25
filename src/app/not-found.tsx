import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-24">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        404
      </h1>
      <p className="mt-3 text-[15px] text-muted">
        This page could not be found.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block text-[14px] text-muted hover:text-foreground"
      >
        &larr; Back home
      </Link>
    </div>
  );
}
