import { getCached, setCache } from "../cache";

export interface WorldBankDataPoint {
  year: number;
  value: number | null;
}

const BASE_URL = "https://api.worldbank.org/v2";
const COUNTRY_CODE = "COD"; // DRC
const FETCH_TIMEOUT_MS = 10_000;

export async function fetchWorldBankIndicator(
  indicatorCode: string
): Promise<WorldBankDataPoint[]> {
  const cacheKey = `wb_${indicatorCode}`;
  const cached = getCached<WorldBankDataPoint[]>(cacheKey);
  if (cached) return cached;

  const url = `${BASE_URL}/country/${COUNTRY_CODE}/indicator/${indicatorCode}?format=json&per_page=50&mrv=20`;

  const response = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
  if (!response.ok) {
    console.error(`World Bank API error: ${response.status} for ${indicatorCode}`);
    return [];
  }

  const json = await response.json();

  // World Bank returns [metadata, data] array
  if (!Array.isArray(json) || json.length < 2 || !json[1]) {
    return [];
  }

  const data: WorldBankDataPoint[] = json[1]
    .filter((d: { value: number | null }) => d.value !== null)
    .map((d: { date: string; value: number }) => ({
      year: parseInt(d.date),
      value: d.value,
    }))
    .sort((a: WorldBankDataPoint, b: WorldBankDataPoint) => a.year - b.year);

  setCache(cacheKey, data);
  return data;
}
