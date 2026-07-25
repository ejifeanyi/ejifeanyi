import type { MetadataRoute } from "next";
import { getAllPosts, getPostUrl } from "@/lib/posts";
import { siteConfig } from "@/lib/config";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  const base = siteConfig.url;

  const staticRoutes = ["", "/about", "/projects"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const postRoutes = posts.map((post) => ({
    url: `${base}${getPostUrl(post)}`,
    lastModified: new Date(post.date),
  }));

  return [...staticRoutes, ...postRoutes];
}
