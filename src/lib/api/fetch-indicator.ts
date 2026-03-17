import { Indicator } from "../indicators";
import { fetchWorldBankIndicator } from "./worldbank";
import { fetchDHSIndicator, fetchDHSSubnational } from "./dhs";
import { fetchGHOIndicator } from "./who-gho";
import { fetchUNICEFIndicator } from "./unicef";

export interface DataPoint {
  year: number;
  value: number;
  region?: string;
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
