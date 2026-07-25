import type { Post } from "@/lib/posts";

/**
 * Sample posts used when Notion isn't configured yet, so you can develop
 * and preview the blog locally. Once NOTION_TOKEN + NOTION_DATABASE_ID are
 * set, these are ignored and real posts are pulled from Notion.
 */
export const mockPosts: Post[] = [
  {
    slug: "hello-world",
    title: "Hello, world",
    date: "2025-10-17",
    summary: "Why I built this site and what I plan to write about here.",
    tags: ["meta"],
    markdown: `Welcome to my corner of the internet. This is a sample post rendered
from Markdown so you can see how writing will look before wiring up Notion.

## Why write?

Writing forces clarity. It's the best way I've found to think through an idea,
and occasionally it's useful to someone else too.

Here are a few things I care about:

- Fast, minimal interfaces
- Great developer experience
- Shipping small and often

## A little code

Code blocks are highlighted with [Shiki](https://shiki.style):

\`\`\`ts
type Post = {
  slug: string;
  title: string;
  date: string;
};

function isRecent(post: Post): boolean {
  const days = (Date.now() - +new Date(post.date)) / 86_400_000;
  return days < 30;
}
\`\`\`

You can also use inline code like \`npm run dev\`, **bold**, _italics_, and
[links](https://example.com).

> A well-placed blockquote can carry a lot of weight.

That's it for now. More soon.`,
  },
  {
    slug: "on-simplicity",
    title: "On simplicity",
    date: "2025-08-02",
    summary: "A short note on why simple systems win over time.",
    tags: ["essays"],
    markdown: `Simplicity is a feature. The simplest thing that works is usually the
thing that keeps working.

Complexity compounds quietly. Each clever abstraction feels justified in
isolation, but together they create a system nobody fully understands.

The goal isn't to be minimal for its own sake — it's to remove everything
that isn't earning its place.`,
  },
];
