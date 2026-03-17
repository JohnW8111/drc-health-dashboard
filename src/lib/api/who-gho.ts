import { getCached, setCache } from "../cache";

export interface GHODataPoint {
  year: number;
  value: number;
}

const BASE_URL = "https://ghoapi.azureedge.net/api";
const COUNTRY_CODE = "COD"; // DRC

export async function fetchGHOIndicator(
  indicatorCode: string
): Promise<GHODataPoint[]> {
  const cacheKey = `gho_${indicatorCode}`;
  const cached = getCached<GHODataPoint[]>(cacheKey);
  if (cached) return cached;

  const url = `${BASE_URL}/${indicatorCode}?$filter=SpatialDim eq '${COUNTRY_CODE}'&$orderby=TimeDim`;

  const response = await fetch(url);
  if (!response.ok) {
    console.error(`WHO GHO API error: ${response.status} for ${indicatorCode}`);
    return [];
  }

  const json = await response.json();

  if (!json.value || !Array.isArray(json.value)) {
    return [];
  }

  const data: GHODataPoint[] = json.value
    .filter(
      (d: { NumericValue: number | null }) => d.NumericValue !== null
    )
    .map((d: { TimeDim: number; NumericValue: number }) => ({
      year: d.TimeDim,
      value: d.NumericValue,
    }))
    .sort((a: GHODataPoint, b: GHODataPoint) => a.year - b.year);

  setCache(cacheKey, data);
  return data;
}
