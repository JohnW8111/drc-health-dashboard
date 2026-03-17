import { getCached, setCache } from "../cache";

export interface DHSDataPoint {
  year: number;
  value: number;
  region?: string;
  surveyId?: string;
}

const BASE_URL = "https://api.dhsprogram.com/rest/dhs";
const COUNTRY_CODE = "CD"; // DRC in DHS system

export async function fetchDHSIndicator(
  indicatorId: string,
  breakdown: "national" | "subnational" = "national"
): Promise<DHSDataPoint[]> {
  const cacheKey = `dhs_${indicatorId}_${breakdown}`;
  const cached = getCached<DHSDataPoint[]>(cacheKey);
  if (cached) return cached;

  // For national, filter to Total category; for subnational use all and filter to Region
  const url = `${BASE_URL}/data?countryIds=${COUNTRY_CODE}&indicatorIds=${indicatorId}&breakdown=all&f=json`;

  const response = await fetch(url);
  if (!response.ok) {
    console.error(`DHS API error: ${response.status} for ${indicatorId}`);
    return [];
  }

  const json = await response.json();

  if (!json.Data || !Array.isArray(json.Data)) {
    return [];
  }

  let data: DHSDataPoint[];

  if (breakdown === "subnational") {
    // Filter to Region category, exclude sub-provinces (those starting with "..")
    data = json.Data
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
    // National: get Total category (label may be "Total" or "Total 15-49" etc.)
    const totalRecords = json.Data.filter(
      (d: { CharacteristicCategory: string; CharacteristicLabel: string }) =>
        (d.CharacteristicCategory === "Total" ||
         d.CharacteristicCategory === "Total 15-49") &&
        d.CharacteristicLabel.startsWith("Total")
    );

    if (totalRecords.length > 0) {
      // Deduplicate by year (some indicators have multiple Total rows per survey)
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
      // Fallback: get one record per survey year (first "0-4" period)
      const seen = new Set<number>();
      data = json.Data
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
