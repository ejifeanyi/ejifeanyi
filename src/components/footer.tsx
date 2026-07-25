import { siteConfig } from "@/lib/config";

type SocialLink = { label: string; href: string };

function buildSocials(): SocialLink[] {
  const { social } = siteConfig;
  const items: SocialLink[] = [];
  if (social.twitter) items.push({ label: "X", href: social.twitter });
  if (social.github) items.push({ label: "GitHub", href: social.github });
  if (social.linkedin) items.push({ label: "LinkedIn", href: social.linkedin });
  if (social.email)
    items.push({ label: "Email", href: `mailto:${social.email}` });
  return items;
}

export function Footer() {
  const socials = buildSocials();
  return (
    <footer className="mt-24 pt-8 pb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-muted-dark">
          &copy; {new Date().getFullYear()} {siteConfig.fullName}
        </p>
        <nav className="flex flex-wrap gap-4 text-[13px] text-muted">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith("/") ? undefined : "_blank"}
              rel="noreferrer"
              className="hover:text-foreground"
            >
              {s.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
