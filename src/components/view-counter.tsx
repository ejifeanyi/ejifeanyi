"use client";

import { useEffect, useState } from "react";

function formatCount(n: number): string {
  return n.toLocaleString("en-US");
}

export function ViewCounter({
  slug,
  initialViews,
}: {
  slug: string;
  initialViews: number;
}) {
  const [views, setViews] = useState<number>(initialViews);

  useEffect(() => {
    let cancelled = false;
    const sessionKey = `viewed:${slug}`;
    const alreadyViewed =
      typeof window !== "undefined" && sessionStorage.getItem(sessionKey);

    async function sync() {
      try {
        let res: Response;
        if (alreadyViewed) {
          res = await fetch(`/api/views?slug=${encodeURIComponent(slug)}`);
        } else {
          res = await fetch("/api/views", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug }),
          });
          sessionStorage.setItem(sessionKey, "1");
        }
        const data = await res.json();
        if (!cancelled && typeof data.views === "number") {
          setViews(data.views);
        }
      } catch {
        // keep the server-rendered initial value
      }
    }

    sync();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <span className="shrink-0 tabular-nums">{formatCount(views)} views</span>
  );
}
