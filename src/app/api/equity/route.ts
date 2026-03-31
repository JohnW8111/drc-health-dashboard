import { NextResponse } from "next/server";
import { indicators } from "@/lib/indicators";
import { fetchDHSEquity } from "@/lib/api/dhs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  // Single indicator equity data
  if (id) {
    const indicator = indicators.find((i) => i.id === id);
    if (!indicator) {
      return NextResponse.json({ error: "Indicator not found" }, { status: 404 });
    }
    if (indicator.apiSource !== "dhs") {
      return NextResponse.json({ error: "Equity data only available for DHS indicators" }, { status: 400 });
    }

    try {
      const data = await fetchDHSEquity(indicator.apiCode);
      return NextResponse.json({
        indicator: {
          id: indicator.id,
          name: indicator.name,
          unit: indicator.unit,
          higherIsBetter: indicator.higherIsBetter,
        },
        data,
      });
    } catch (error) {
      console.error(`Error fetching equity for ${id}:`, error);
      return NextResponse.json({ error: "Failed to fetch equity data" }, { status: 500 });
    }
  }

  // All DHS indicators equity summary (latest year only)
  const dhsIndicators = indicators.filter((i) => i.apiSource === "dhs");

  const results = await Promise.allSettled(
    dhsIndicators.map(async (indicator) => {
      const data = await fetchDHSEquity(indicator.apiCode);
      if (data.length === 0) return null;

      // Get latest year
      const maxYear = Math.max(...data.map((d) => d.year));
      const latestData = data.filter((d) => d.year === maxYear);

      const q1 = latestData.find((d) => d.quintile === "Lowest")?.value;
      const q5 = latestData.find((d) => d.quintile === "Highest")?.value;

      if (q1 === undefined || q5 === undefined || q1 === 0 || q5 === 0) return null;

      const ratio = indicator.higherIsBetter ? q5 / q1 : q1 / q5;

      return {
        id: indicator.id,
        name: indicator.name,
        unit: indicator.unit,
        higherIsBetter: indicator.higherIsBetter,
        dimension: indicator.dimension,
        year: maxYear,
        q1,
        q5,
        ratio: Math.round(ratio * 10) / 10,
        quintiles: latestData,
      };
    })
  );

  const summaries = results
    .map((r) => (r.status === "fulfilled" ? r.value : null))
    .filter(Boolean);

  return NextResponse.json({ indicators: summaries });
}
