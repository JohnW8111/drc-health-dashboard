"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { EquityChart } from "@/components/EquityChart";
import { DIMENSION_LABELS, DIMENSION_COLORS, Dimension } from "@/lib/indicators";

interface EquitySummary {
  id: string;
  name: string;
  unit: string;
  higherIsBetter: boolean;
  dimension: Dimension;
  year: number;
  q1: number;
  q5: number;
  ratio: number;
  quintiles: { quintile: string; value: number }[];
}

export default function EquityPage() {
  const [data, setData] = useState<EquitySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/equity")
      .then((res) => res.json())
      .then((json) => {
        const sorted = (json.indicators || []).sort(
          (a: EquitySummary, b: EquitySummary) => b.ratio - a.ratio
        );
        setData(sorted);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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
          <div className="w-1.5 h-10 rounded-full bg-purple-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Health Equity Analysis
            </h1>
            <p className="text-gray-500 text-sm">
              Wealth quintile disparities across DHS indicators — WHO Health
              Inequality framework
            </p>
          </div>
        </div>
      </div>

      {/* Explainer */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-8">
        <p className="text-sm text-purple-800">
          <strong>What this shows:</strong> For each DHS indicator, we compare
          outcomes between the poorest (Q1) and richest (Q5) wealth quintiles.
          The equity gap ratio shows how many times worse off the disadvantaged
          group is. A ratio of 1.0 means perfect equity. Higher ratios indicate
          greater inequality.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-gray-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((item) => {
            const isExpanded = expandedId === item.id;
            const color = DIMENSION_COLORS[item.dimension];
            const ratioColor =
              item.ratio >= 3
                ? "text-red-600 bg-red-50"
                : item.ratio >= 2
                  ? "text-orange-600 bg-orange-50"
                  : item.ratio >= 1.5
                    ? "text-yellow-600 bg-yellow-50"
                    : "text-green-600 bg-green-50";

            return (
              <div
                key={item.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedId(isExpanded ? null : item.id)
                  }
                  className="w-full text-left p-5 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-1 h-10 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-400">
                          {DIMENSION_LABELS[item.dimension]} | Survey:{" "}
                          {item.year}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right text-sm">
                        <div className="text-gray-400">
                          Q1: {item.q1.toFixed(1)} | Q5: {item.q5.toFixed(1)}{" "}
                          {item.unit}
                        </div>
                      </div>
                      <div
                        className={`px-3 py-1.5 rounded-lg font-bold text-lg ${ratioColor}`}
                      >
                        {item.ratio}x
                      </div>
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-gray-100">
                    <div className="pt-4">
                      <EquityChart
                        data={item.quintiles}
                        unit={item.unit}
                        higherIsBetter={item.higherIsBetter}
                      />
                    </div>
                    <div className="mt-3 text-right">
                      <Link
                        href={`/indicator/${item.id}`}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        View full indicator details &rarr;
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {data.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              No equity data available. DHS wealth quintile data may not be
              accessible.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
