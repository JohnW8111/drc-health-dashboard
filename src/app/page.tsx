import { indicators, Dimension, DIMENSION_LABELS } from "@/lib/indicators";
import { fetchIndicatorSummaries } from "@/lib/api/fetch-indicator";
import { DimensionSection } from "@/components/DimensionSection";

export const revalidate = 86400; // ISR: revalidate every 24 hours

const dimensions: Dimension[] = [
  "population-health",
  "access-quality",
  "resources-efficiency",
];

export default async function HomePage() {
  const data = await fetchIndicatorSummaries(indicators);

  const loadedCount = data.filter((d) => d.latestValue !== null).length;
  const errorCount = data.filter((d) => d.error).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Democratic Republic of Congo — Health Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          23 indicators across 3 dimensions of the modified Triple Aim
          framework, with data from international health databases.
        </p>
        <p className="text-sm text-blue-600 mt-2">
          Click any indicator to view its historical trend chart.
        </p>
        <div className="flex gap-4 mt-3">
          <span className="text-sm text-gray-500">
            {loadedCount} indicators with data
          </span>
          {errorCount > 0 && (
            <span className="text-sm text-red-500">
              {errorCount} failed to load
            </span>
          )}
        </div>
      </div>

      {/* Summary cards */}
      {data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {dimensions.map((dim) => {
            const dimIndicators = data.filter((d) => d.dimension === dim);
            const withData = dimIndicators.filter(
              (d) => d.latestValue !== null
            );
            return (
              <a
                key={dim}
                href={`/dimension/${dim}`}
                className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition"
              >
                <h3 className="text-sm font-medium text-gray-500">
                  {DIMENSION_LABELS[dim]}
                </h3>
                <p className="text-3xl font-bold mt-1">
                  {withData.length}
                  <span className="text-lg text-gray-400 font-normal">
                    /{dimIndicators.length}
                  </span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  indicators reporting data
                </p>
              </a>
            );
          })}
        </div>
      )}

      {dimensions.map((dim) => (
        <DimensionSection
          key={dim}
          dimension={dim}
          indicators={data.filter((d) => d.dimension === dim)}
        />
      ))}
    </div>
  );
}
