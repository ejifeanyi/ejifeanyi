import { Feed } from "feed";
import { getAllPosts, getPostUrl } from "@/lib/posts";
import { siteConfig } from "@/lib/config";

export const revalidate = 300;

export async function GET() {
  const posts = await getAllPosts();

  const feed = new Feed({
    title: siteConfig.fullName,
    description: siteConfig.tagline,
    id: siteConfig.url,
    link: siteConfig.url,
    language: "en",
    copyright: `© ${new Date().getFullYear()} ${siteConfig.fullName}`,
    feedLinks: {
      rss2: `${siteConfig.url}/rss.xml`,
    },
    author: {
      name: siteConfig.fullName,
      email: siteConfig.social.email,
      link: siteConfig.url,
    },
  });

  for (const post of posts) {
    const url = `${siteConfig.url}${getPostUrl(post)}`;
    feed.addItem({
      title: post.title,
      id: url,
      link: url,
      description: post.summary,
      date: new Date(post.date),
    });
  }

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
