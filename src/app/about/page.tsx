"use client";

import { useState } from "react";
import Link from "next/link";
import {
  indicators,
  DIMENSION_LABELS,
  DIMENSION_COLORS,
  Dimension,
} from "@/lib/indicators";

const SOURCE_INFO: Record<
  string,
  { name: string; api: string; code: string; subnational: string }
> = {
  dhs: {
    name: "DHS Program",
    api: "https://api.dhsprogram.com/",
    code: "CD",
    subnational: "Yes — provincial breakdowns from DRC surveys (2007, 2013, 2023)",
  },
  worldbank: {
    name: "World Bank WDI",
    api: "https://api.worldbank.org/v2/",
    code: "COD",
    subnational: "No",
  },
  "who-gho": {
    name: "WHO Global Health Observatory",
    api: "https://ghoapi.azureedge.net/api/",
    code: "COD",
    subnational: "No",
  },
  unicef: {
    name: "UNICEF SDMX",
    api: "https://sdmx.data.unicef.org/",
    code: "COD",
    subnational: "No",
  },
};

const DIMENSIONS: Dimension[] = [
  "population-health",
  "access-quality",
  "resources-efficiency",
];

export default function AboutPage() {
  const [openDimension, setOpenDimension] = useState<Dimension | null>(
    "population-health"
  );
  const [openIndicator, setOpenIndicator] = useState<string | null>(null);

  return (
    <div className="max-w-4xl">
      <a
        href="/"
        className="text-sm text-blue-600 hover:text-blue-800 mb-4 inline-block"
      >
        &larr; Back to Dashboard
      </a>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        About the Indicators
      </h1>
      <p className="text-gray-500 mb-8">
        23 health indicators organized by a modified Triple Aim framework
        (Berwick, Nolan, Whittington, 2008), adapted for the Democratic Republic
        of Congo. Click any dimension to explore its indicators, or click an
        indicator for full details.
      </p>

      {/* Framework explanation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-8">
        <h2 className="text-sm font-semibold text-blue-900 mb-2">
          Modified Triple Aim Framework
        </h2>
        <p className="text-sm text-blue-800 mb-3">
          The original Triple Aim (2008) proposed three simultaneous objectives:
          improving population health, improving the patient experience of care,
          and reducing per capita cost. For the DRC context, we modified the
          framework to reflect data availability and health system realities in a
          low-income country:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {DIMENSIONS.map((dim) => (
            <div
              key={dim}
              className="bg-white rounded-lg p-3 border border-blue-100"
            >
              <div
                className="w-2 h-2 rounded-full mb-1"
                style={{ backgroundColor: DIMENSION_COLORS[dim] }}
              />
              <p className="text-xs font-semibold text-gray-900">
                {DIMENSION_LABELS[dim]}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {dim === "population-health" &&
                  "Mortality, disease burden, nutrition, and prevention"}
                {dim === "access-quality" &&
                  "Replaces 'Experience of Care' — workforce, facilities, and clinical quality"}
                {dim === "resources-efficiency" &&
                  "Replaces 'Per Capita Cost' — expenditure, financing, and infrastructure"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Indicator accordions by dimension */}
      <div className="space-y-4 mb-10">
        {DIMENSIONS.map((dim) => {
          const dimIndicators = indicators.filter((i) => i.dimension === dim);
          const isOpen = openDimension === dim;

          return (
            <div
              key={dim}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Dimension header */}
              <button
                onClick={() =>
                  setOpenDimension(isOpen ? null : dim)
                }
                className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-1 h-6 rounded-full"
                    style={{ backgroundColor: DIMENSION_COLORS[dim] }}
                  />
                  <div className="text-left">
                    <h2 className="text-base font-semibold text-gray-900">
                      {DIMENSION_LABELS[dim]}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {dimIndicators.length} indicators
                    </p>
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
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
              </button>

              {/* Indicator list */}
              {isOpen && (
                <div className="border-t border-gray-200">
                  {dimIndicators.map((ind) => {
                    const isIndOpen = openIndicator === ind.id;
                    const source = SOURCE_INFO[ind.apiSource];

                    return (
                      <div
                        key={ind.id}
                        className="border-b border-gray-100 last:border-b-0"
                      >
                        <button
                          onClick={() =>
                            setOpenIndicator(isIndOpen ? null : ind.id)
                          }
                          className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-800">
                              {ind.name}
                            </span>
                            {ind.hasSubnational && (
                              <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                                Provincial
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-400">
                              {ind.unit}
                            </span>
                            <svg
                              className={`w-4 h-4 text-gray-400 transition-transform ${
                                isIndOpen ? "rotate-180" : ""
                              }`}
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
                        </button>

                        {isIndOpen && (
                          <div className="px-4 pb-4 bg-gray-50">
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                              <div className="sm:col-span-2">
                                <dt className="text-xs font-medium text-gray-500 mb-0.5">
                                  Definition
                                </dt>
                                <dd className="text-gray-700">
                                  {ind.definition}
                                </dd>
                              </div>
                              <div>
                                <dt className="text-xs font-medium text-gray-500 mb-0.5">
                                  Data Source
                                </dt>
                                <dd className="text-gray-700">
                                  {source?.name || ind.apiSource}
                                </dd>
                              </div>
                              <div>
                                <dt className="text-xs font-medium text-gray-500 mb-0.5">
                                  API Indicator Code
                                </dt>
                                <dd className="font-mono text-xs text-gray-600 bg-white px-2 py-1 rounded border border-gray-200 inline-block">
                                  {ind.apiCode}
                                </dd>
                              </div>
                              {ind.backupSource && ind.backupCode && (
                                <div>
                                  <dt className="text-xs font-medium text-gray-500 mb-0.5">
                                    Backup Source
                                  </dt>
                                  <dd className="text-gray-700">
                                    {SOURCE_INFO[ind.backupSource]?.name} (
                                    <span className="font-mono text-xs">
                                      {ind.backupCode}
                                    </span>
                                    )
                                  </dd>
                                </div>
                              )}
                              <div>
                                <dt className="text-xs font-medium text-gray-500 mb-0.5">
                                  SSA Benchmark
                                </dt>
                                <dd className="text-gray-700">
                                  {ind.ssaBenchmark !== undefined
                                    ? `${ind.ssaBenchmark} ${ind.unit}`
                                    : "Not available"}
                                </dd>
                              </div>
                              <div>
                                <dt className="text-xs font-medium text-gray-500 mb-0.5">
                                  Provincial Data
                                </dt>
                                <dd className="text-gray-700">
                                  {ind.hasSubnational
                                    ? "Available via DHS surveys"
                                    : "National level only"}
                                </dd>
                              </div>
                              <div>
                                <dt className="text-xs font-medium text-gray-500 mb-0.5">
                                  Direction
                                </dt>
                                <dd className="text-gray-700">
                                  {ind.higherIsBetter
                                    ? "Higher is better"
                                    : "Lower is better"}
                                </dd>
                              </div>
                            </dl>
                            <div className="mt-3 flex gap-3">
                              <Link
                                href={`/indicator/${ind.id}`}
                                className="text-xs text-blue-600 hover:text-blue-800"
                              >
                                View chart &rarr;
                              </Link>
                              <a
                                href={ind.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-gray-500 hover:text-gray-700"
                              >
                                Source URL &nearr;
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Data Sources Summary */}
      <h2 className="text-lg font-semibold text-gray-900 mb-3">
        Data Sources
      </h2>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-2 font-medium text-gray-600">
                Source
              </th>
              <th className="text-left px-4 py-2 font-medium text-gray-600">
                Country Code
              </th>
              <th className="text-left px-4 py-2 font-medium text-gray-600">
                Indicators
              </th>
              <th className="text-left px-4 py-2 font-medium text-gray-600">
                Sub-national
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(SOURCE_INFO).map(([key, src]) => {
              const count = indicators.filter(
                (i) => i.apiSource === key
              ).length;
              if (count === 0 && key === "unicef") return null;
              return (
                <tr key={key} className="border-b border-gray-100">
                  <td className="px-4 py-2">
                    <a
                      href={src.api}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {src.name}
                    </a>
                  </td>
                  <td className="px-4 py-2 font-mono text-xs text-gray-600">
                    {src.code}
                  </td>
                  <td className="px-4 py-2">{count}</td>
                  <td className="px-4 py-2 text-gray-600 text-xs">
                    {src.subnational}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Citation */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-2">
          Framework Citation
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          Berwick DM, Nolan TW, Whittington J. &ldquo;The Triple Aim: Care,
          Health, and Cost.&rdquo; <em>Health Affairs</em>. 2008
          May-Jun;27(3):759-69. DOI: 10.1377/hlthaff.27.3.759.
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Measurement guide: Stiefel M, Nolan K. <em>A Guide to Measuring the
          Triple Aim: Population Health, Experience of Care, and Per Capita
          Cost.</em> IHI Innovation Series white paper. Cambridge, MA: Institute
          for Healthcare Improvement; 2012.
        </p>
      </div>
    </div>
  );
}
