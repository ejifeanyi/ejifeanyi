import Link from "next/link";
import { siteConfig } from "@/lib/config";

const links = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
];

export function Nav() {
  return (
    <header className="flex items-baseline justify-between pt-5 pb-10 sm:pt-8">
      <Link
        href="/"
        className="text-[15px] font-semibold tracking-tight text-foreground hover:opacity-70"
      >
        {siteConfig.name}
      </Link>
      <nav className="flex items-center gap-5 text-[12px] text-muted">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
