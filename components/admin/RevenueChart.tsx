"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function RevenueChart({ data = [] }: any) {

  const safeData = Array.isArray(data) ? data : [];

  return (
    <div className="bg-black/40 border border-white/10 rounded-xl p-6">

      <h2 className="text-xl font-semibold mb-6">
        Revenue Trend
      </h2>

      {safeData.length === 0 ? (
        <p className="text-gray-400">No revenue data available</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>

          <LineChart data={safeData}>

            <CartesianGrid strokeDasharray="3 3" stroke="#333" />

            <XAxis
              dataKey="date"
              stroke="#aaa"
            />

            <YAxis stroke="#aaa" />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#22c55e"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>
      )}

    </div>
  );
}