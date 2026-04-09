import {
  indicators as allIndicators,
  Dimension,
  DIMENSION_LABELS,
  DIMENSION_COLORS,
} from "@/lib/indicators";
import { fetchIndicatorSummaries } from "@/lib/api/fetch-indicator";
import { IndicatorCard } from "@/components/IndicatorCard";

export const revalidate = 86400; // ISR: revalidate every 24 hours

export function generateStaticParams() {
  return [
    { slug: "population-health" },
    { slug: "access-quality" },
    { slug: "resources-efficiency" },
  ];
}

export default async function DimensionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dimension = slug as Dimension;
  const dimIndicators = allIndicators.filter((i) => i.dimension === dimension);
  const indicators = await fetchIndicatorSummaries(dimIndicators);

  const label = DIMENSION_LABELS[dimension] || slug;
  const color = DIMENSION_COLORS[dimension] || "#2563eb";

  return (
    <div>
      <div className="mb-8">
        <a
          href="/"
          className="text-sm text-blue-600 hover:text-blue-800 mb-2 inline-block"
        >
          &larr; Back to Overview
        </a>
        <div className="flex items-center gap-3">
          <div
            className="w-1.5 h-10 rounded-full"
            style={{ backgroundColor: color }}
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{label}</h1>
            <p className="text-gray-500 text-sm">
              {indicators.length} indicators in this dimension
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {indicators.map((ind) => (
          <IndicatorCard
            key={ind.id}
            id={ind.id}
            name={ind.name}
            unit={ind.unit}
            latestValue={ind.latestValue}
            latestYear={ind.latestYear}
            ssaBenchmark={ind.ssaBenchmark}
            higherIsBetter={ind.higherIsBetter}
            hasSubnational={ind.hasSubnational}
            apiSource={ind.apiSource}
          />
        ))}
      </div>
    </div>
  );
}
