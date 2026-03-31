"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface EquityDataPoint {
  quintile: string;
  value: number;
}

interface EquityChartProps {
  data: EquityDataPoint[];
  unit: string;
  higherIsBetter: boolean;
  height?: number;
}

// Fixed gradient: red (worst outcome) to green (best outcome) per quintile position
const QUINTILE_COLORS = [
  "#ef4444", // Q1 (Poorest)
  "#f97316", // Q2
  "#eab308", // Q3
  "#84cc16", // Q4
  "#22c55e", // Q5 (Richest)
];

const QUINTILE_LABELS: Record<string, string> = {
  Lowest: "Q1 (Poorest)",
  Second: "Q2",
  Middle: "Q3",
  Fourth: "Q4",
  Highest: "Q5 (Richest)",
};

export function EquityChart({
  data,
  unit,
  higherIsBetter,
  height = 300,
}: EquityChartProps) {
  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-gray-400"
        style={{ height }}
      >
        No wealth quintile data available
      </div>
    );
  }

  const chartData = data.map((d) => ({
    ...d,
    label: QUINTILE_LABELS[d.quintile] || d.quintile,
  }));

  const colors = QUINTILE_COLORS;

  // Calculate equity ratio
  const q1 = data.find((d) => d.quintile === "Lowest")?.value;
  const q5 = data.find((d) => d.quintile === "Highest")?.value;

  return (
    <div>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip
            formatter={(value) => [
              `${Number(value).toFixed(1)} ${unit}`,
              "Value",
            ]}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {q1 !== undefined && q5 !== undefined && q5 > 0 && (
        <div className="mt-3 flex items-center gap-4 text-sm">
          <div className="bg-gray-50 rounded-lg px-3 py-2">
            <span className="text-gray-500">Equity Gap: </span>
            <span className="font-bold text-gray-900">
              {higherIsBetter
                ? `${(q5 / q1).toFixed(1)}x`
                : `${(q1 / q5).toFixed(1)}x`}
            </span>
            <span className="text-gray-400 ml-1">
              ({higherIsBetter ? "richest/poorest" : "poorest/richest"})
            </span>
          </div>
          <div className="text-gray-400">
            Q1: {q1.toFixed(1)} {unit} | Q5: {q5.toFixed(1)} {unit}
          </div>
        </div>
      )}
    </div>
  );
}
