type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

class SimpleCacheEngine {
  private cache = new Map<string, CacheEntry<any>>();
  private DEFAULT_TTL = 5 * 60 * 1000;

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > this.DEFAULT_TTL;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  invalidate(keyPattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(keyPattern)) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }
}

export const rbacCache = new SimpleCacheEngine();
export const auditCache = new SimpleCacheEngine();
export const sessionCache = new SimpleCacheEngine();
export const campusCache = new SimpleCacheEngine();
export const screeningCache = new SimpleCacheEngine();
