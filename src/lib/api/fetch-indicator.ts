import { Indicator, Dimension, ApiSource } from "../indicators";
import { fetchWorldBankIndicator } from "./worldbank";
import { fetchDHSIndicator, fetchDHSSubnational } from "./dhs";
import { fetchGHOIndicator } from "./who-gho";
import { fetchUNICEFIndicator } from "./unicef";

export interface DataPoint {
  year: number;
  value: number;
  region?: string;
}

export interface IndicatorSummary {
  id: string;
  name: string;
  dimension: Dimension;
  unit: string;
  hasSubnational: boolean;
  higherIsBetter: boolean;
  ssaBenchmark?: number;
  latestValue: number | null;
  latestYear: number | null;
  apiSource: ApiSource;
  error?: boolean;
}

export async function fetchIndicatorSummaries(
  indicatorList: Indicator[]
): Promise<IndicatorSummary[]> {
  const results = await Promise.allSettled(
    indicatorList.map(async (indicator) => {
      try {
        const data = await fetchIndicatorData(indicator);
        const latest = data.length > 0 ? data[data.length - 1] : null;
        return {
          id: indicator.id,
          name: indicator.name,
          dimension: indicator.dimension,
          unit: indicator.unit,
          hasSubnational: indicator.hasSubnational,
          higherIsBetter: indicator.higherIsBetter,
          ssaBenchmark: indicator.ssaBenchmark,
          latestValue: latest?.value ?? null,
          latestYear: latest?.year ?? null,
          apiSource: indicator.apiSource,
        };
      } catch {
        return {
          id: indicator.id,
          name: indicator.name,
          dimension: indicator.dimension,
          unit: indicator.unit,
          hasSubnational: indicator.hasSubnational,
          higherIsBetter: indicator.higherIsBetter,
          ssaBenchmark: indicator.ssaBenchmark,
          latestValue: null,
          latestYear: null,
          apiSource: indicator.apiSource,
          error: true,
        };
      }
    })
  );

  return results
    .map((r) => (r.status === "fulfilled" ? r.value : null))
    .filter((r): r is NonNullable<typeof r> => r !== null);
}

export async function fetchIndicatorData(
  indicator: Indicator,
  subnational = false
): Promise<DataPoint[]> {
  // If subnational requested and available, use DHS
  if (subnational && indicator.hasSubnational) {
    const data = await fetchDHSSubnational(indicator.apiCode);
    return data.map((d) => ({
      year: d.year,
      value: d.value,
      region: d.region,
    }));
  }

  // Try primary source
  let data = await fetchFromSource(indicator.apiSource, indicator.apiCode);

  // Fall back to backup if primary returns nothing
  if (data.length === 0 && indicator.backupSource && indicator.backupCode) {
    data = await fetchFromSource(indicator.backupSource, indicator.backupCode);
  }

  return data;
}

async function fetchFromSource(
  source: string,
  code: string
): Promise<DataPoint[]> {
  switch (source) {
    case "worldbank": {
      const wbData = await fetchWorldBankIndicator(code);
      return wbData
        .filter((d) => d.value !== null)
        .map((d) => ({ year: d.year, value: d.value! }));
    }
    case "dhs": {
      const dhsData = await fetchDHSIndicator(code, "national");
      return dhsData.map((d) => ({ year: d.year, value: d.value }));
    }
    case "who-gho": {
      const ghoData = await fetchGHOIndicator(code);
      return ghoData.map((d) => ({ year: d.year, value: d.value }));
    }
    case "unicef": {
      const unicefData = await fetchUNICEFIndicator(code);
      return unicefData.map((d) => ({ year: d.year, value: d.value }));
    }
    default:
      return [];
  }
}
