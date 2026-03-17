"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface DataPoint {
  year: number;
  value: number;
  region?: string;
}

interface TrendChartProps {
  data: DataPoint[];
  unit: string;
  color?: string;
  benchmark?: number;
  benchmarkLabel?: string;
  height?: number;
}

export function TrendChart({
  data,
  unit,
  color = "#2563eb",
  benchmark,
  benchmarkLabel = "SSA Average",
  height = 300,
}: TrendChartProps) {
  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-gray-400"
        style={{ height }}
      >
        No trend data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 12 }}
          tickFormatter={(v) => String(v)}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={(v) => `${v}`}
          label={{
            value: unit,
            angle: -90,
            position: "insideLeft",
            style: { fontSize: 11, fill: "#6b7280" },
          }}
        />
        <Tooltip
          formatter={(value) => [
            `${Number(value).toFixed(1)} ${unit}`,
            "DRC",
          ]}
          labelFormatter={(label) => `Year: ${label}`}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
        {benchmark !== undefined && (
          <ReferenceLine
            y={benchmark}
            stroke="#9ca3af"
            strokeDasharray="5 5"
            label={{
              value: benchmarkLabel,
              position: "right",
              style: { fontSize: 10, fill: "#6b7280" },
            }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
