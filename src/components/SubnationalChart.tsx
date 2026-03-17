"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface RegionData {
  region: string;
  value: number;
}

interface SubnationalChartProps {
  data: RegionData[];
  unit: string;
  color?: string;
  benchmark?: number;
  height?: number;
}

export function SubnationalChart({
  data,
  unit,
  color = "#2563eb",
  benchmark,
  height = 400,
}: SubnationalChartProps) {
  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-gray-400"
        style={{ height }}
      >
        No sub-national data available
      </div>
    );
  }

  const sorted = [...data].sort((a, b) => b.value - a.value);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={sorted}
        layout="vertical"
        margin={{ top: 5, right: 20, left: 120, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis type="number" tick={{ fontSize: 11 }} />
        <YAxis
          type="category"
          dataKey="region"
          tick={{ fontSize: 11 }}
          width={110}
        />
        <Tooltip
          formatter={(value) => [`${Number(value).toFixed(1)} ${unit}`, "Value"]}
        />
        <Bar dataKey="value" fill={color} radius={[0, 4, 4, 0]} />
        {benchmark !== undefined && (
          <ReferenceLine
            x={benchmark}
            stroke="#ef4444"
            strokeDasharray="5 5"
            label={{
              value: "SSA Avg",
              position: "top",
              style: { fontSize: 10, fill: "#ef4444" },
            }}
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}
