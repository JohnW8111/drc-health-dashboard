import { DIMENSION_LABELS, DIMENSION_COLORS, Dimension } from "@/lib/indicators";
import { IndicatorSummary } from "@/lib/api/fetch-indicator";
import { IndicatorCard } from "./IndicatorCard";

interface DimensionSectionProps {
  dimension: Dimension;
  indicators: IndicatorSummary[];
}

export function DimensionSection({
  dimension,
  indicators,
}: DimensionSectionProps) {
  const color = DIMENSION_COLORS[dimension];

  return (
    <section className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-1 h-8 rounded-full"
          style={{ backgroundColor: color }}
        />
        <h2 className="text-xl font-semibold text-gray-900">
          {DIMENSION_LABELS[dimension]}
        </h2>
        <span className="text-sm text-gray-400">
          {indicators.length} indicators
        </span>
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
    </section>
  );
}
