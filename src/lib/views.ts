import { Redis } from "@upstash/redis";

/**
 * View counting backed by Upstash Redis (serverless, works great on Vercel).
 *
 * Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to enable real,
 * persistent counts. Without them, a deterministic placeholder number is used
 * so the UI still looks right during local development.
 */

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

let redis: Redis | null = null;

export function isViewsConfigured(): boolean {
  return Boolean(url && token);
}

function getRedis(): Redis {
  if (!redis) {
    redis = new Redis({ url: url!, token: token! });
  }
  return redis;
}

const key = (slug: string) => `views:${slug}`;

export async function getViews(slug: string): Promise<number> {
  if (!isViewsConfigured()) return fallbackViews(slug);
  try {
    const value = await getRedis().get<number>(key(slug));
    return value ?? 0;
  } catch {
    return fallbackViews(slug);
  }
}

export async function incrementViews(slug: string): Promise<number> {
  if (!isViewsConfigured()) return fallbackViews(slug);
  try {
    return await getRedis().incr(key(slug));
  } catch {
    return fallbackViews(slug);
  }
}

/** Stable pseudo-count derived from the slug (used only when Redis is off). */
function fallbackViews(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return 1200 + (hash % 8800);
}
