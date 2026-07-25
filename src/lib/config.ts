/**
 * Central site configuration.
 *
 * Edit everything about "you" here — name, bio, socials, and projects.
 * These values are placeholders; swap in your real details.
 */

export const siteConfig = {
  // Displayed name / handle
  name: "Ifeanyi Emmanuel",
  fullName: "Ifeanyi Emmanuel",

  // Short role/title shown under your name
  role: "Software Engineer",

  // Where you're based
  location: "Lagos, Nigeria",

  // Production URL (used for SEO, RSS, sitemap, OG images).
  // Replace with your custom domain, e.g. "https://ejifeanyi.com"
  url: "https://ejifeanyi.com",

  // One-line bio — the first thing visitors read on the home page
  tagline:
    "Software engineer building fast, thoughtful products for the web.",

  // Longer intro used on the home page beneath the tagline (optional, keep short)
  intro:
    "I care about developer experience, clean interfaces, and shipping things that feel effortless to use.",

  // Social links — remove any you don't want shown
  social: {
    github: "https://github.com/ejifeanyi",
    twitter: "https://twitter.com/ejifeanyi",
    linkedin: "https://linkedin.com/in/ifeanyi-emmanuel",
    email: "ifeanyiemmanueljoseph@gmail.com",
  },

  // Handle shown in the byline (e.g. "@ejifeanyi")
  handle: "@ejifeanyi",
} as const;

/**
 * About page content. The `body` is plain Markdown — it supports links,
 * lists, headings, bold/italics, etc. Edit it freely.
 */
export const about = {
  heading: "About",
  body: `I'm a software engineer focused on building for the web. I owe much of
what I know to the Web and Open Source.

I started programming out of curiosity as a teenager and never stopped. Over the
years I've worked across the stack, but I keep coming back to the frontend and
the tools that make building faster.

These days I spend most of my time in TypeScript, [React](https://react.dev),
and [Next.js](https://nextjs.org), with a soft spot for design systems,
performance, and clean APIs. I care deeply about developer experience — the
abstractions that let people build more while thinking less about the boring parts.

## Technical contributions

- Built and maintain [Project One](https://github.com/ejifeanyi) — a short description of what it does and why it matters.
- Contributed to open source projects across the JavaScript ecosystem.
- Wrote about [a topic I care about](https://example.com) and shared what I learned along the way.
`,
  // Optional avatar. Drop an image in /public (e.g. /public/avatar.jpg)
  // and set this to its path. Replace avatar.png with your own photo.
  avatar: "/avatar.jpeg" as string | null,
};

export type Project = {
  name: string;
  description: string;
  href: string;
  // Optional short year/label shown on the left
  year?: string;
};

/**
 * Projects shown on /projects. Add, remove, and reorder freely.
 */
export const projects: Project[] = [
  {
    name: "Project One",
    description:
      "A short one-line description of what this project is and why it matters.",
    href: "https://github.com/ejifeanyi",
    year: "2025",
  },
  {
    name: "Project Two",
    description:
      "Another project — a CLI, library, or app you built and are proud of.",
    href: "https://github.com/ejifeanyi",
    year: "2024",
  },
  {
    name: "Project Three",
    description: "Something small and fun. Keep descriptions crisp.",
    href: "https://github.com/ejifeanyi",
    year: "2024",
  },
];
