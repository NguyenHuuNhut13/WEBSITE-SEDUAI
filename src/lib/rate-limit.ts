interface RateLimitBucket {
  count: number;
  resetAt: number;
}

interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

const globalStore = globalThis as typeof globalThis & {
  __seduaiRateLimits?: Map<string, RateLimitBucket>;
};

const buckets = globalStore.__seduaiRateLimits ?? new Map<string, RateLimitBucket>();
if (process.env.NODE_ENV !== 'production') globalStore.__seduaiRateLimits = buckets;

/**
 * Lightweight per-instance protection. Production deployments should also
 * enforce a distributed limit at the gateway/WAF because serverless instances
 * do not share memory.
 */
export function consumeRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (current.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1_000)),
    };
  }

  current.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}
