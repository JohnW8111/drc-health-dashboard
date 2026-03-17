"use client";

interface StatusBadgeProps {
  value: number | null;
  benchmark: number | undefined;
  higherIsBetter: boolean;
}

export function StatusBadge({ value, benchmark, higherIsBetter }: StatusBadgeProps) {
  if (value === null || benchmark === undefined) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
        No data
      </span>
    );
  }

  const ratio = value / benchmark;
  let status: "good" | "warning" | "poor";

  if (higherIsBetter) {
    if (ratio >= 1.0) status = "good";
    else if (ratio >= 0.7) status = "warning";
    else status = "poor";
  } else {
    if (ratio <= 1.0) status = "good";
    else if (ratio <= 1.3) status = "warning";
    else status = "poor";
  }

  const colors = {
    good: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    poor: "bg-red-100 text-red-800",
  };

  const labels = {
    good: "Better than SSA avg",
    warning: "Near SSA avg",
    poor: "Below SSA avg",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[status]}`}
    >
      {labels[status]}
    </span>
  );
}
