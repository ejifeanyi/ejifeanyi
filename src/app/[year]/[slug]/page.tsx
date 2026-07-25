import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, getPostYear } from "@/lib/posts";
import { markdownToHtml } from "@/lib/markdown";
import { getViews } from "@/lib/views";
import { ViewCounter } from "@/components/view-counter";
import { siteConfig } from "@/lib/config";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ year: getPostYear(post), slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string; slug: string }>;
}): Promise<Metadata> {
  const { year, slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const path = `/${year}/${slug}`;
  const ogImage = `${path}/opengraph-image`;
  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.date,
      url: `${siteConfig.url}${path}`,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: [ogImage],
    },
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Compact relative time, Rauch-style: "3d ago", "9m ago", "2y ago". */
function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const day = diffMs / 86_400_000;
  if (day < 1) return "today";
  if (day < 30) return `${Math.floor(day)}d ago`;
  const month = day / 30;
  if (month < 12) return `${Math.max(1, Math.floor(month))}m ago`;
  return `${Math.floor(day / 365)}y ago`;
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ year: string; slug: string }>;
}) {
  const { year, slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || getPostYear(post) !== year) notFound();

  const [html, initialViews] = await Promise.all([
    markdownToHtml(post.markdown),
    getViews(slug),
  ]);

  return (
    <article>
      <Link
        href="/"
        className="text-[13px] text-muted hover:text-foreground"
      >
        &larr; Back
      </Link>

      <header className="mt-6">
        <h1 className="text-2xl font-semibold leading-tight tracking-tight text-foreground">
          {post.title}
        </h1>
        <div className="mt-3 flex items-baseline justify-between gap-4 text-[13px] text-muted-dark">
          <div className="flex items-center gap-1.5">
            <span>{siteConfig.handle}</span>
            <span aria-hidden>|</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>({relativeTime(post.date)})</span>
          </div>
          <ViewCounter slug={slug} initialViews={initialViews} />
        </div>
      </header>

      <div
        className="prose-post prose prose-invert mt-10 max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}
