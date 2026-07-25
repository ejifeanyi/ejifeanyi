import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { getPostUrl, getPostYear } from "@/lib/posts";

export type PostListItem = PostMeta & { views: number };

function formatViews(n: number): string {
  return n.toLocaleString("en-US");
}

export function PostList({ posts }: { posts: PostListItem[] }) {
  if (posts.length === 0) {
    return (
      <p className="text-[14px] text-muted-dark">No posts yet. Check back soon.</p>
    );
  }

  return (
    <ul className="flex flex-col">
      {posts.map((post, i) => {
        const year = getPostYear(post);
        const showYear = i === 0 || getPostYear(posts[i - 1]) !== year;
        return (
          <li key={post.slug}>
            <Link
              href={getPostUrl(post)}
              className="group flex items-baseline justify-between gap-4 py-2.5"
            >
              <div className="flex min-w-0 items-baseline gap-4">
                <span className="w-10 shrink-0 font-mono text-[12px] tabular-nums text-muted-dark">
                  {showYear ? year : ""}
                </span>
                <span className="truncate text-[15px] text-foreground/90 group-hover:text-foreground">
                  {post.title}
                </span>
              </div>
              <div className="shrink-0 font-mono text-[12px] tabular-nums text-muted-dark">
                {formatViews(post.views)} views
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
