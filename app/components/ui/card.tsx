"use client";

import React from "react";
import { motion } from "framer-motion";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

const Card = ({ children, className = "" }: CardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`glass-card p-4 shadow-lg shadow-cyan-900/30 border border-[rgba(0,217,255,0.1)] ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;
