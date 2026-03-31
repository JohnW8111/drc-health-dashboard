"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DIMENSION_LABELS, DIMENSION_COLORS, Dimension } from "@/lib/indicators";
import { TrendChart } from "@/components/TrendChart";
import { SubnationalChart } from "@/components/SubnationalChart";
import { EquityChart } from "@/components/EquityChart";
import { StatusBadge } from "@/components/StatusBadge";
import { LoadingChart } from "@/components/LoadingGrid";

interface IndicatorMeta {
  id: string;
  name: string;
  dimension: Dimension;
  unit: string;
  definition: string;
  hasSubnational: boolean;
  higherIsBetter: boolean;
  ssaBenchmark?: number;
  sourceUrl: string;
  apiSource: string;
}

interface DataPoint {
  year: number;
  value: number;
  region?: string;
}

const SOURCE_LABELS: Record<string, string> = {
  dhs: "DHS Program",
  worldbank: "World Bank",
  "who-gho": "WHO Global Health Observatory",
  unicef: "UNICEF",
};

export default function IndicatorDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [indicator, setIndicator] = useState<IndicatorMeta | null>(null);
  const [nationalData, setNationalData] = useState<DataPoint[]>([]);
  const [subnationalData, setSubnationalData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubnational, setShowSubnational] = useState(false);
  const [showEquity, setShowEquity] = useState(false);
  const [equityData, setEquityData] = useState<{ quintile: string; value: number }[]>([]);
  const [equityYear, setEquityYear] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    // Fetch national data
    fetch(`/api/indicators?id=${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.error) {
          setError(json.error);
        } else {
          setIndicator(json.indicator);
          setNationalData(json.data || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  // Fetch subnational when toggled
  useEffect(() => {
    if (showSubnational && indicator?.hasSubnational && subnationalData.length === 0) {
      fetch(`/api/indicators?id=${id}&subnational=true`)
        .then((res) => res.json())
        .then((json) => {
          setSubnationalData(json.data || []);
        })
        .catch(console.error);
    }
  }, [showSubnational, indicator, id, subnationalData.length]);

  // Fetch equity data when toggled
  useEffect(() => {
    if (showEquity && indicator?.apiSource === "dhs" && equityData.length === 0) {
      fetch(`/api/equity?id=${id}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.data && json.data.length > 0) {
            const maxYear = Math.max(...json.data.map((d: { year: number }) => d.year));
            const latest = json.data
              .filter((d: { year: number }) => d.year === maxYear)
              .map((d: { quintile: string; value: number }) => ({
                quintile: d.quintile,
                value: d.value,
              }));
            setEquityData(latest);
            setEquityYear(maxYear);
          }
        })
        .catch(console.error);
    }
  }, [showEquity, indicator, id, equityData.length]);

  if (loading) {
    return (
      <div>
        <div className="h-4 bg-gray-200 rounded w-24 mb-4 animate-pulse" />
        <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse" />
        <LoadingChart />
      </div>
    );
  }

  if (error || !indicator) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-red-800">Error</h2>
        <p className="text-red-600 mt-1">{error || "Indicator not found"}</p>
        <a href="/" className="text-blue-600 text-sm mt-3 inline-block">
          &larr; Back to Overview
        </a>
      </div>
    );
  }

  const latestValue =
    nationalData.length > 0
      ? nationalData[nationalData.length - 1].value
      : null;
  const latestYear =
    nationalData.length > 0
      ? nationalData[nationalData.length - 1].year
      : null;

  const color = DIMENSION_COLORS[indicator.dimension];

  // For subnational bar chart, get latest survey year's data
  const subnationalRegions = showSubnational
    ? getLatestSubnationalData(subnationalData)
    : [];

  return (
    <div>
      <a
        href={`/dimension/${indicator.dimension}`}
        className="text-sm text-blue-600 hover:text-blue-800 mb-3 inline-block"
      >
        &larr; {DIMENSION_LABELS[indicator.dimension]}
      </a>

      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {indicator.name}
            </h1>
            <p className="text-gray-500 mt-1">{indicator.definition}</p>
          </div>
          <StatusBadge
            value={latestValue}
            benchmark={indicator.ssaBenchmark}
            higherIsBetter={indicator.higherIsBetter}
          />
        </div>

        <div className="flex items-center gap-4 mt-4">
          {latestValue !== null && (
            <div>
              <span className="text-4xl font-bold">{formatValue(latestValue, indicator.unit)}</span>
              <span className="ml-2 text-gray-500">{indicator.unit}</span>
              {latestYear && (
                <span className="ml-2 text-sm text-gray-400">({latestYear})</span>
              )}
            </div>
          )}
          {indicator.ssaBenchmark !== undefined && (
            <div className="text-sm text-gray-400 border-l border-gray-200 pl-4">
              SSA Average: {indicator.ssaBenchmark} {indicator.unit}
            </div>
          )}
        </div>
      </div>

      {/* Trend chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Trend Over Time</h2>
        <TrendChart
          data={nationalData}
          unit={indicator.unit}
          color={color}
          benchmark={indicator.ssaBenchmark}
        />
      </div>

      {/* Subnational toggle */}
      {indicator.hasSubnational && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Provincial Comparison</h2>
            <button
              onClick={() => setShowSubnational(!showSubnational)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                showSubnational
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {showSubnational ? "Hide Provincial Data" : "Show Provincial Data"}
            </button>
          </div>
          {showSubnational && (
            <SubnationalChart
              data={subnationalRegions}
              unit={indicator.unit}
              color={color}
              benchmark={indicator.ssaBenchmark}
            />
          )}
        </div>
      )}

      {/* Equity by wealth quintile */}
      {indicator.apiSource === "dhs" && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Health Equity — Wealth Quintiles</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                WHO Health Inequality framework — outcomes by household wealth
              </p>
            </div>
            <button
              onClick={() => setShowEquity(!showEquity)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                showEquity
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {showEquity ? "Hide Equity Data" : "Show Equity Data"}
            </button>
          </div>
          {showEquity && (
            <div>
              {equityYear && (
                <p className="text-sm text-gray-500 mb-3">
                  Survey year: {equityYear}
                </p>
              )}
              <EquityChart
                data={equityData}
                unit={indicator.unit}
                higherIsBetter={indicator.higherIsBetter}
              />
            </div>
          )}
        </div>
      )}

      {/* Metadata */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-3">Data Source</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-500">Source</dt>
            <dd className="font-medium">
              {SOURCE_LABELS[indicator.apiSource] || indicator.apiSource}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Data points</dt>
            <dd className="font-medium">{nationalData.length} observations</dd>
          </div>
          <div>
            <dt className="text-gray-500">Provincial data</dt>
            <dd className="font-medium">
              {indicator.hasSubnational ? "Available" : "Not available"}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Source URL</dt>
            <dd>
              <a
                href={indicator.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 break-all"
              >
                {indicator.sourceUrl}
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

function formatValue(value: number, unit: string): string {
  if (unit === "%" || unit === "years") return value.toFixed(1);
  if (unit === "USD") return `$${value.toFixed(0)}`;
  if (value >= 1000)
    return value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return value.toFixed(1);
}

function getLatestSubnationalData(
  data: DataPoint[]
): { region: string; value: number }[] {
  if (data.length === 0) return [];

  // Get the latest year
  const maxYear = Math.max(...data.map((d) => d.year));
  return data
    .filter((d) => d.year === maxYear && d.region)
    .map((d) => ({ region: d.region!, value: d.value }));
}
