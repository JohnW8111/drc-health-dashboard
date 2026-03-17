import { getCached, setCache } from "../cache";

export interface UNICEFDataPoint {
  year: number;
  value: number;
}

const BASE_URL = "https://sdmx.data.unicef.org/ws/public/sdmxapi/rest";

// Map indicator areas to UNICEF dataflow IDs
const DATAFLOW_MAP: Record<string, string> = {
  "CME_MRY0": "CME", // Child mortality
  "CME_MRY0T4": "CME",
  "NT_ANT_HAZ_NE2": "NUTRITION", // Stunting
  "NT_ANT_WHZ_NE2": "NUTRITION", // Wasting
};

export async function fetchUNICEFIndicator(
  indicatorCode: string
): Promise<UNICEFDataPoint[]> {
  const cacheKey = `unicef_${indicatorCode}`;
  const cached = getCached<UNICEFDataPoint[]>(cacheKey);
  if (cached) return cached;

  const dataflow = DATAFLOW_MAP[indicatorCode] || "GLOBAL_DATAFLOW";
  const url = `${BASE_URL}/data/${dataflow}/COD.${indicatorCode}..?format=sdmx-json&startPeriod=2000&endPeriod=2025`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`UNICEF API error: ${response.status} for ${indicatorCode}`);
      return [];
    }

    const json = await response.json();
    const observations = json?.data?.dataSets?.[0]?.observations;
    const timePeriods =
      json?.data?.structure?.dimensions?.observation?.[0]?.values;

    if (!observations || !timePeriods) return [];

    const data: UNICEFDataPoint[] = Object.entries(observations)
      .map(([key, val]) => {
        const timeIndex = parseInt(key.split(":").pop() || "0");
        const period = timePeriods[timeIndex];
        return {
          year: parseInt(period?.id || "0"),
          value: (val as number[])[0],
        };
      })
      .filter((d) => d.value !== null && !isNaN(d.year))
      .sort((a, b) => a.year - b.year);

    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`UNICEF API error for ${indicatorCode}:`, error);
    return [];
  }
}
