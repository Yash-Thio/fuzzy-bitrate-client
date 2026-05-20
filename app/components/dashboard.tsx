"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot,
} from "recharts";
import Card from "./ui/card";

type NetworkDataPoint = {
  time: string;
  bandwidth: number;
  buffer: number;
  delay: number;
  event: "rebuffer" | "switch" | null;
};

type DashboardProps = {
  data: NetworkDataPoint[];
};

const Dashboard = ({ data }: DashboardProps) => {
  const rebufferEvents = data.filter((datum) => datum.event === "rebuffer");
  const switchEvents = data.filter((datum) => datum.event === "switch");

  return (
    <Card className="w-full">
      <h3 className="text-lg font-semibold text-white mb-4">
        Network Simulation
      </h3>

      <div className="h-80 md:h-90 lg:h-100 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#00d9ff"
              strokeOpacity={0.2}
            />
            <XAxis dataKey="time" stroke="#9CA3AF" />
            <YAxis
              yAxisId="left"
              label={{
                value: "Mbps / Sec",
                angle: -90,
                position: "insideLeft",
                fill: "#9CA3AF",
              }}
              stroke="#9CA3AF"
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{
                value: "ms",
                angle: 90,
                position: "insideRight",
                fill: "#9CA3AF",
              }}
              stroke="#9CA3AF"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f1731",
                border: "1px solid rgba(0, 217, 255, 0.45)",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#F9FAFB" }}
            />
            <Legend wrapperStyle={{ color: "#F9FAFB" }} />

            <ReferenceLine
              yAxisId="left"
              y={3}
              label={{ value: "Low BW", fill: "#EF4444" }}
              stroke="#EF4444"
              strokeDasharray="4 4"
            />
            <ReferenceLine
              yAxisId="left"
              y={7}
              label={{ value: "High BW", fill: "#00d9ff" }}
              stroke="#00d9ff"
              strokeDasharray="4 4"
            />

            {rebufferEvents.map((event, index) => (
              <ReferenceDot
                key={`rebuffer-${event.time}-${index}`}
                x={event.time}
                y={event.buffer}
                yAxisId="left"
                r={6}
                fill="#EF4444"
                stroke="white"
                label={{
                  value: "Rebuffer!",
                  fill: "#EF4444",
                  position: "top",
                }}
              />
            ))}

            {switchEvents.map((event, index) => (
              <ReferenceDot
                key={`switch-${event.time}-${index}`}
                x={event.time}
                y={event.bandwidth}
                yAxisId="left"
                r={6}
                fill="#3B82F6"
                stroke="white"
                label={{
                  value: "Switch",
                  fill: "#3B82F6",
                  position: "bottom",
                }}
              />
            ))}

            <Line
              yAxisId="left"
              type="monotone"
              dataKey="bandwidth"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="buffer"
              stroke="#00d9ff"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="delay"
              stroke="#ffc658"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default Dashboard;
