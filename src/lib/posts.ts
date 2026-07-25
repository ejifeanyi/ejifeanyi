import { getNotionPosts, getNotionPostBySlug, isNotionConfigured } from "@/lib/notion";
import { mockPosts } from "@/lib/mock-posts";

export type PostMeta = {
  slug: string;
  title: string;
  date: string; // ISO date string
  summary: string;
  tags?: string[];
};

export type Post = PostMeta & {
  /** Raw markdown content of the post body. */
  markdown: string;
};

/** Return post metadata for all published posts, newest first. */
export async function getAllPosts(): Promise<PostMeta[]> {
  if (isNotionConfigured()) {
    const posts = await getNotionPosts();
    return sortByDate(posts);
  }
  return sortByDate(mockPosts.map(stripContent));
}

/** Return a single published post (with content) by slug, or null. */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (isNotionConfigured()) {
    return getNotionPostBySlug(slug);
  }
  return mockPosts.find((p) => p.slug === slug) ?? null;
}

/** All slugs — used for static generation. */
export async function getAllSlugs(): Promise<string[]> {
  const posts = await getAllPosts();
  return posts.map((p) => p.slug);
}

/** The year a post was published, as a string (used in the URL). */
export function getPostYear(post: { date: string }): string {
  return new Date(post.date).getFullYear().toString();
}

/** Canonical path for a post, Rauch-style: /2025/the-ai-cloud */
export function getPostUrl(post: PostMeta): string {
  return `/${getPostYear(post)}/${post.slug}`;
}

function stripContent(post: Post): PostMeta {
  const { markdown: _markdown, ...meta } = post;
  void _markdown;
  return meta;
}

function sortByDate<T extends { date: string }>(posts: T[]): T[] {
  return [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

/** Group posts by year for the index listing. */
export function groupByYear<T extends { date: string }>(
  posts: T[],
): { year: string; posts: T[] }[] {
  const groups = new Map<string, T[]>();
  for (const post of posts) {
    const year = new Date(post.date).getFullYear().toString();
    const bucket = groups.get(year) ?? [];
    bucket.push(post);
    groups.set(year, bucket);
  }
  return [...groups.entries()]
    .sort((a, b) => Number(b[0]) - Number(a[0]))
    .map(([year, posts]) => ({ year, posts }));
}
