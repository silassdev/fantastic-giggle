type Entry = { count: number; firstSeen: number };

const store = new Map<string, Entry>();

export interface RateLimitOptions {
    windowMs?: number;
    max?: number;
}

const DEFAULTS: RateLimitOptions = { windowMs: 60 * 60 * 1000, max: 10 };

export function isRateLimited(key: string, opts?: RateLimitOptions) {
    const { windowMs, max } = { ...DEFAULTS, ...(opts || {}) };
    const now = Date.now();
    const e = store.get(key);
    if (!e) {
        store.set(key, { count: 1, firstSeen: now });
        return { limited: false, remaining: max! - 1, resetAfterMs: windowMs! };
    }
    if (now - e.firstSeen > windowMs!) {
        // reset
        store.set(key, { count: 1, firstSeen: now });
        return { limited: false, remaining: max! - 1, resetAfterMs: windowMs! };
    }
    e.count += 1;
    const remaining = Math.max(0, max! - e.count);
    store.set(key, e);
    return { limited: e.count > max!, remaining, resetAfterMs: windowMs! - (now - e.firstSeen) };
}
