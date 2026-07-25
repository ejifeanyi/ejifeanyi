import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAllPosts, getPostUrl } from "@/lib/posts";

/**
 * On-demand revalidation endpoint.
 *
 * Call this after publishing/editing in Notion so changes appear immediately
 * instead of waiting for the ISR window. Protect it with REVALIDATE_SECRET.
 *
 * Example:
 *   POST /api/revalidate?secret=YOUR_SECRET
 *   (optional body: { "slug": "my-post" } to also revalidate that post)
 */
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (!process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { revalidated: false, message: "REVALIDATE_SECRET is not set" },
      { status: 500 },
    );
  }

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { revalidated: false, message: "Invalid secret" },
      { status: 401 },
    );
  }

  let slug: string | undefined;
  try {
    const body = await request.json();
    slug = body?.slug;
  } catch {
    // no body is fine
  }

  revalidatePath("/");

  let postPath: string | undefined;
  if (slug) {
    const posts = await getAllPosts();
    const match = posts.find((p) => p.slug === slug);
    if (match) {
      postPath = getPostUrl(match);
      revalidatePath(postPath);
    }
  }

  return NextResponse.json({
    revalidated: true,
    now: Date.now(),
    paths: ["/", ...(postPath ? [postPath] : [])],
  });
}
