type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

class SimpleMemoryCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultTtl: number; // in milliseconds

  constructor(defaultTtlSeconds = 600) {
    this.defaultTtl = defaultTtlSeconds * 1000;
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > this.defaultTtl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  set<T>(key: string, data: T): void {
    // Prevent unbounded memory growth
    if (this.cache.size > 1000) {
      this.cache.clear();
    }
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }
}

export const apiCache = new SimpleMemoryCache(600); // 10 minutes cache
