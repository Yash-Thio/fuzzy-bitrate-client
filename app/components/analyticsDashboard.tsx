"use client";

import { motion } from "framer-motion";

type StatCardProps = {
  label: string;
  value: string | number;
  unit?: string;
};

type AnalyticsDashboardProps = {
  analytics: {
    playbackTime: number;
    rebufferCount: number;
    avgBitrate: number;
    qoeScore: number;
  };
};

const StatCard = ({ label, value, unit }: StatCardProps) => (
  <div className="glass-card p-3 md:p-4 text-center shadow-lg shadow-cyan-900/30 border border-[rgba(0,217,255,0.1)]">
    <div className="text-xs md:text-sm font-medium text-gray-400 uppercase tracking-wider">
      {label}
    </div>
    <div className="text-2xl md:text-3xl font-bold text-white mt-1">
      {value}
      {unit && (
        <span className="text-[#00d9ff] text-lg md:text-xl ml-1">{unit}</span>
      )}
    </div>
  </div>
);

const getClosestBitrateLabel = (avg: number) => {
  if (avg === 0) return 0;
  const levels = [144, 240, 360, 480, 720, 1080];
  const closest = levels.reduce((prev, curr) =>
    Math.abs(curr - avg) < Math.abs(prev - avg) ? curr : prev,
  );
  return closest;
};

const AnalyticsDashboard = ({ analytics }: AnalyticsDashboardProps) => {
  const { playbackTime, rebufferCount, avgBitrate, qoeScore } = analytics;

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="my-6 md:my-8"
    >
      <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
        Playback Analytics
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        <StatCard
          label="QoE Score (MOS)"
          value={qoeScore.toFixed(2)}
          unit="/ 5"
        />
        <StatCard
          label="Avg. Bitrate"
          value={getClosestBitrateLabel(avgBitrate)}
          unit="p"
        />
        <StatCard label="Total Rebuffers" value={rebufferCount} />
        <StatCard label="Playback Time" value={formatTime(playbackTime)} />
      </div>
    </motion.div>
  );
};

export default AnalyticsDashboard;
