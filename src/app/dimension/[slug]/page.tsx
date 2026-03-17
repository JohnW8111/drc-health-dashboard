"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Dimension,
  DIMENSION_LABELS,
  DIMENSION_COLORS,
} from "@/lib/indicators";
import { IndicatorCard } from "@/components/IndicatorCard";
import { LoadingGrid } from "@/components/LoadingGrid";

interface IndicatorSummary {
  id: string;
  name: string;
  dimension: Dimension;
  unit: string;
  hasSubnational: boolean;
  higherIsBetter: boolean;
  ssaBenchmark?: number;
  latestValue: number | null;
  latestYear: number | null;
  apiSource: string;
}

export default function DimensionPage() {
  const params = useParams();
  const slug = params.slug as Dimension;
  const [indicators, setIndicators] = useState<IndicatorSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/indicators")
      .then((res) => res.json())
      .then((json) => {
        const filtered = (json.indicators || []).filter(
          (i: IndicatorSummary) => i.dimension === slug
        );
        setIndicators(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const label = DIMENSION_LABELS[slug] || slug;
  const color = DIMENSION_COLORS[slug] || "#2563eb";

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

      {loading ? (
        <LoadingGrid count={6} />
      ) : (
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
      )}
    </div>
  );
}
