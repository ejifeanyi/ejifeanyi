import { siteConfig } from "@/lib/config";
import { getAllPosts } from "@/lib/posts";
import { getViews, isViewsConfigured } from "@/lib/views";
import { PostList, type PostListItem } from "@/components/post-list";

export const revalidate = 300;

export default async function HomePage() {
  const posts = await getAllPosts();
  const showViews = isViewsConfigured();

  const withViews: PostListItem[] = await Promise.all(
    posts.map(async (post) => ({
      ...post,
      views: showViews ? await getViews(post.slug) : null,
    })),
  );

  return (
      <section className="mt-4">
        <PostList posts={withViews} />
      </section>
  );
}
