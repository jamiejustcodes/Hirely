import { NextRequest } from "next/server";

interface RateLimitRecord {
  count: number;
  resetAt: number; // Unix timestamp in milliseconds
}

// In-memory store for IP rate limits
// Key: `${ip}_${dateKey}`
const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup stale entries every 1 hour
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetAt) {
        rateLimitStore.delete(key);
      }
    }
  }, 1000 * 60 * 60);
}

/**
 * Extracts the real client IP address from request headers.
 */
export function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const ips = forwardedFor.split(",").map((ip) => ip.trim());
    if (ips[0]) return ips[0];
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  const vercelIp = req.headers.get("x-vercel-forwarded-for");
  if (vercelIp) return vercelIp.trim();

  return "127.0.0.1";
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: number;
  resetDateString: string;
}

/**
 * Checks and updates rate limit for a client IP.
 * Default: 3 submissions per IP per 24-hour day.
 */
export function checkRateLimit(
  ip: string,
  limit: number = 3
): RateLimitResult {
  const now = new Date();
  
  // Calculate midnight end of day (UTC) for daily reset
  const endOfDay = new Date(now);
  endOfDay.setUTCHours(23, 59, 59, 999);
  const resetAt = endOfDay.getTime();
  
  // Date key for calendar day scoping: e.g. "2026-08-14"
  const dateKey = now.toISOString().split("T")[0];
  const storeKey = `${ip}_${dateKey}`;

  const record = rateLimitStore.get(storeKey);

  if (!record || Date.now() > record.resetAt) {
    // First request of the day
    rateLimitStore.set(storeKey, {
      count: 1,
      resetAt,
    });

    return {
      allowed: true,
      remaining: limit - 1,
      limit,
      resetAt,
      resetDateString: endOfDay.toUTCString(),
    };
  }

  if (record.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      limit,
      resetAt: record.resetAt,
      resetDateString: new Date(record.resetAt).toUTCString(),
    };
  }

  // Increment usage count
  record.count += 1;
  rateLimitStore.set(storeKey, record);

  return {
    allowed: true,
    remaining: Math.max(0, limit - record.count),
    limit,
    resetAt: record.resetAt,
    resetDateString: new Date(record.resetAt).toUTCString(),
  };
}
