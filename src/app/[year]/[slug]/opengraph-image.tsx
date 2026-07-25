import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/posts";
import { siteConfig } from "@/lib/config";

export const alt = "Blog post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ year: string; slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const title = post?.title ?? siteConfig.name;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          padding: "80px",
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: "#8f8f8f",
            fontFamily: "sans-serif",
          }}
        >
          {siteConfig.name}
        </div>
        <div
          style={{
            fontSize: 68,
            fontWeight: 600,
            color: "#ededed",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            fontFamily: "sans-serif",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 26,
            color: "#666666",
            fontFamily: "sans-serif",
          }}
        >
          {siteConfig.url.replace(/^https?:\/\//, "")}
        </div>
      </div>
    ),
    { ...size },
  );
}
