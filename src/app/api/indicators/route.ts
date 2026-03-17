import { NextResponse } from "next/server";
import { indicators } from "@/lib/indicators";
import { fetchIndicatorData } from "@/lib/api/fetch-indicator";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const subnational = searchParams.get("subnational") === "true";

  // If specific indicator requested
  if (id) {
    const indicator = indicators.find((i) => i.id === id);
    if (!indicator) {
      return NextResponse.json({ error: "Indicator not found" }, { status: 404 });
    }

    try {
      const data = await fetchIndicatorData(indicator, subnational);
      return NextResponse.json({
        indicator: {
          id: indicator.id,
          name: indicator.name,
          dimension: indicator.dimension,
          unit: indicator.unit,
          definition: indicator.definition,
          hasSubnational: indicator.hasSubnational,
          higherIsBetter: indicator.higherIsBetter,
          ssaBenchmark: indicator.ssaBenchmark,
          sourceUrl: indicator.sourceUrl,
          apiSource: indicator.apiSource,
        },
        data,
      });
    } catch (error) {
      console.error(`Error fetching ${id}:`, error);
      return NextResponse.json(
        { error: "Failed to fetch data", indicator: { id, name: indicator.name } },
        { status: 500 }
      );
    }
  }

  // Fetch all indicators (latest value only for overview)
  const results = await Promise.allSettled(
    indicators.map(async (indicator) => {
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
          sourceUrl: indicator.sourceUrl,
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
          sourceUrl: indicator.sourceUrl,
          apiSource: indicator.apiSource,
          error: true,
        };
      }
    })
  );

  const data = results.map((r) =>
    r.status === "fulfilled" ? r.value : null
  ).filter(Boolean);

  return NextResponse.json({ indicators: data });
}
