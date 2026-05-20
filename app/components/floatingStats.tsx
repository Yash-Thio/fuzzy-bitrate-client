"use client";

import { motion } from "framer-motion";

type FloatingStatsProps = {
  fuzzyDecision: number;
  currentPlayingBitrate: number;
};

const FloatingStats = ({
  fuzzyDecision,
  currentPlayingBitrate,
}: FloatingStatsProps) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed top-28 right-4 z-40 hidden md:block"
      >
        <div className="glass-card p-4 space-y-3">
          <StatBox
            label="FUZZY DECISION"
            value={`${Math.round(fuzzyDecision)}p`}
            color="text-[#00b8a3]"
          />
          <StatBox
            label="ACTUAL PLAYING"
            value={`${currentPlayingBitrate}p`}
            color="text-[#00d9ff]"
          />
        </div>
      </motion.div>

      <div className="md:hidden relative z-20 mb-4">
        <div className="glass-card p-3">
          <div className="grid grid-cols-2 gap-3">
            <StatBox
              label="FUZZY DECISION"
              value={`${Math.round(fuzzyDecision)}p`}
              color="text-[#00b8a3]"
            />
            <StatBox
              label="ACTUAL PLAYING"
              value={`${currentPlayingBitrate}p`}
              color="text-[#00d9ff]"
            />
          </div>
        </div>
      </div>
    </>
  );
};

type StatBoxProps = {
  label: string;
  value: string;
  color: string;
};

const StatBox = ({ label, value, color }: StatBoxProps) => (
  <div className="text-center">
    <div className="text-xs font-medium text-gray-400">{label}</div>
    <div className={`text-2xl font-bold ${color}`}>{value}</div>
  </div>
);

export default FloatingStats;
