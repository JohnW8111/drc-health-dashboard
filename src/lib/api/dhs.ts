import { getCached, setCache } from "../cache";

export interface DHSDataPoint {
  year: number;
  value: number;
  region?: string;
  surveyId?: string;
}

export interface EquityDataPoint {
  year: number;
  quintile: string;
  value: number;
}

const BASE_URL = "https://api.dhsprogram.com/rest/dhs";
const COUNTRY_CODE = "CD"; // DRC in DHS system
const FETCH_TIMEOUT_MS = 10_000;
const QUINTILE_ORDER = ["Lowest", "Second", "Middle", "Fourth", "Highest"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DHSRawRecord = any;

// Shared raw fetch — single API call per indicator, cached and reused
async function fetchDHSRaw(indicatorId: string): Promise<DHSRawRecord[]> {
  const cacheKey = `dhs_raw_${indicatorId}`;
  const cached = getCached<DHSRawRecord[]>(cacheKey);
  if (cached) return cached;

  const url = `${BASE_URL}/data?countryIds=${COUNTRY_CODE}&indicatorIds=${indicatorId}&breakdown=all&f=json`;

  const response = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
  if (!response.ok) {
    console.error(`DHS API error: ${response.status} for ${indicatorId}`);
    return [];
  }

  const json = await response.json();
  if (!json.Data || !Array.isArray(json.Data)) return [];

  setCache(cacheKey, json.Data);
  return json.Data;
}

export async function fetchDHSIndicator(
  indicatorId: string,
  breakdown: "national" | "subnational" = "national"
): Promise<DHSDataPoint[]> {
  const cacheKey = `dhs_${indicatorId}_${breakdown}`;
  const cached = getCached<DHSDataPoint[]>(cacheKey);
  if (cached) return cached;

  const rawData = await fetchDHSRaw(indicatorId);
  if (rawData.length === 0) return [];

  let data: DHSDataPoint[];

  if (breakdown === "subnational") {
    data = rawData
      .filter(
        (d: { CharacteristicCategory: string; CharacteristicLabel: string }) =>
          d.CharacteristicCategory === "Region" &&
          !d.CharacteristicLabel.startsWith("..")
      )
      .map(
        (d: {
          SurveyYear: number;
          Value: number;
          CharacteristicLabel: string;
          SurveyId: string;
        }) => ({
          year: d.SurveyYear,
          value: d.Value,
          region: d.CharacteristicLabel,
          surveyId: d.SurveyId,
        })
      );
  } else {
    const totalRecords = rawData.filter(
      (d: { CharacteristicCategory: string; CharacteristicLabel: string }) =>
        (d.CharacteristicCategory === "Total" ||
         d.CharacteristicCategory === "Total 15-49") &&
        d.CharacteristicLabel.startsWith("Total")
    );

    if (totalRecords.length > 0) {
      const seenYears = new Set<number>();
      data = totalRecords
        .map(
          (d: { SurveyYear: number; Value: number; SurveyId: string }) => ({
            year: d.SurveyYear,
            value: d.Value,
            surveyId: d.SurveyId,
          })
        )
        .filter((d: { year: number }) => {
          if (seenYears.has(d.year)) return false;
          seenYears.add(d.year);
          return true;
        });
    } else {
      const seen = new Set<number>();
      data = rawData
        .filter((d: { CharacteristicLabel: string; SurveyYear: number }) => {
          if (d.CharacteristicLabel === "0-4" && !seen.has(d.SurveyYear)) {
            seen.add(d.SurveyYear);
            return true;
          }
          return false;
        })
        .map(
          (d: { SurveyYear: number; Value: number; SurveyId: string }) => ({
            year: d.SurveyYear,
            value: d.Value,
            surveyId: d.SurveyId,
          })
        );
    }
  }

  setCache(cacheKey, data);
  return data;
}

export async function fetchDHSSubnational(
  indicatorId: string
): Promise<DHSDataPoint[]> {
  return fetchDHSIndicator(indicatorId, "subnational");
}

export async function fetchDHSEquity(
  indicatorId: string
): Promise<EquityDataPoint[]> {
  const cacheKey = `dhs_equity_${indicatorId}`;
  const cached = getCached<EquityDataPoint[]>(cacheKey);
  if (cached) return cached;

  const rawData = await fetchDHSRaw(indicatorId);
  if (rawData.length === 0) return [];

  const data: EquityDataPoint[] = rawData
    .filter(
      (d: { CharacteristicCategory: string }) =>
        d.CharacteristicCategory === "Wealth quintile"
    )
    .map(
      (d: { SurveyYear: number; Value: number; CharacteristicLabel: string }) => ({
        year: d.SurveyYear,
        quintile: d.CharacteristicLabel,
        value: d.Value,
      })
    )
    .sort((a: EquityDataPoint, b: EquityDataPoint) => {
      if (a.year !== b.year) return a.year - b.year;
      return QUINTILE_ORDER.indexOf(a.quintile) - QUINTILE_ORDER.indexOf(b.quintile);
    });

  setCache(cacheKey, data);
  return data;
}
