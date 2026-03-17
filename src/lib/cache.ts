import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import path from "path";

const CACHE_DIR = path.join(process.cwd(), ".cache");
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

function ensureCacheDir() {
  if (!existsSync(CACHE_DIR)) {
    mkdirSync(CACHE_DIR, { recursive: true });
  }
}

function getCachePath(key: string): string {
  return path.join(CACHE_DIR, `${key}.json`);
}

export function getCached<T>(key: string): T | null {
  const filepath = getCachePath(key);
  if (!existsSync(filepath)) return null;

  try {
    const raw = readFileSync(filepath, "utf-8");
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() - entry.timestamp > TTL_MS) return null;
    return entry.data;
  } catch {
    return null;
  }
}

export function setCache<T>(key: string, data: T): void {
  ensureCacheDir();
  const entry: CacheEntry<T> = { data, timestamp: Date.now() };
  writeFileSync(getCachePath(key), JSON.stringify(entry), "utf-8");
}
