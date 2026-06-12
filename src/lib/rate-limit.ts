// A simple in-memory rate limiter for Next.js App Router APIs.
// Note: In a multi-instance production environment, use Redis (e.g., Upstash) instead.

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitCache = new Map<string, RateLimitEntry>();

export function rateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000 // default 1 minute
) {
  const now = Date.now();
  const entry = rateLimitCache.get(identifier);

  if (!entry) {
    rateLimitCache.set(identifier, { count: 1, resetAt: now + windowMs });
    return { success: true, limit, remaining: limit - 1 };
  }

  if (now > entry.resetAt) {
    rateLimitCache.set(identifier, { count: 1, resetAt: now + windowMs });
    return { success: true, limit, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { success: false, limit, remaining: 0 };
  }

  entry.count += 1;
  return { success: true, limit, remaining: limit - entry.count };
}
