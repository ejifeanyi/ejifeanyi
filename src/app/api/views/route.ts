import { NextRequest, NextResponse } from "next/server";
import { getViews, incrementViews } from "@/lib/views";

export const dynamic = "force-dynamic";

// Read the current view count: GET /api/views?slug=my-post
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }
  const views = await getViews(slug);
  return NextResponse.json({ views });
}

// Increment on a new view: POST /api/views { "slug": "my-post" }
export async function POST(request: NextRequest) {
  let slug: string | undefined;
  try {
    const body = await request.json();
    slug = body?.slug;
  } catch {
    // ignore
  }
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }
  const views = await incrementViews(slug);
  return NextResponse.json({ views });
}
