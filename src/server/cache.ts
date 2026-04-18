type CacheItem = {
  html: string;
  timestamp: number;
};

const cache = new Map<string, CacheItem>();

export const getCache = (key: string) => {
  return cache.get(key);
};

export const setCache = (key: string, html: string) => {
  cache.set(key, { html, timestamp: Date.now() });
};
