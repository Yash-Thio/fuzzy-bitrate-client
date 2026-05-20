"use client";

import React, { type ComponentType } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";
import { FiCode, FiTrendingUp, FiCpu } from "react-icons/fi";

type SocialLinkProps = {
  href: string;
  icon: ComponentType<{ size?: number }>;
  label: string;
};

type TechPillProps = {
  name: string;
};

const SocialLink = ({ href, icon: Icon, label }: SocialLinkProps) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.15, color: "#00d9ff" }}
    className="text-gray-500 hover:text-[#00d9ff] transition-colors"
    aria-label={label}
  >
    <Icon size={20} />
  </motion.a>
);

const TechPill = ({ name }: TechPillProps) => (
  <motion.span
    whileHover={{ scale: 1.05, borderColor: "#00d9ff" }}
    className="inline-block bg-[rgba(0,217,255,0.08)] border border-[rgba(0,217,255,0.2)] text-[#00d9ff] text-xs font-mono px-2.5 py-1 rounded transition-colors"
  >
    {name}
  </motion.span>
);

const FeatureCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: ComponentType<{ size?: number }>;
  title: string;
  description: string;
}) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="flex gap-3 p-3 rounded border border-[rgba(0,217,255,0.1)] bg-[rgba(0,217,255,0.02)]"
  >
    <div className="w-5 h-5 text-[#00b8a3] shrink-0 mt-1 flex items-center justify-center">
      <Icon size={20} />
    </div>
    <div>
      <h4 className="text-sm font-semibold text-white">{title}</h4>
      <p className="text-xs text-gray-500 mt-0.5">{description}</p>
    </div>
  </motion.div>
);

const Footer = () => {
  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL || "";
  const linkedinUrl = process.env.NEXT_PUBLIC_LINKEDIN_URL || "";

  return (
    <footer className="w-full mt-24 pt-12">
      {/* Top divider line */}
      <div className="h-px bg-linear-to-r from-transparent via-[rgba(0,217,255,0.2)] to-transparent mb-12" />

      <div className="max-w-7xl mx-auto px-3 md:px-6 lg:px-12">
        {/* Header Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-[rgba(0,217,255,0.1)]">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-[#00d9ff]" />
              <h3 className="text-lg font-bold text-white">FuzzyStream</h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              An intelligent Adaptive Bitrate (ABR) system using Fuzzy Logic to
              maximize quality of experience while minimizing rebuffering events
              in real-time video streaming.
            </p>
            <div className="flex items-center gap-4">
              <SocialLink href={githubUrl} icon={FaGithub} label="GitHub" />
              <SocialLink
                href={linkedinUrl}
                icon={FaLinkedin}
                label="LinkedIn"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-3 rounded border border-[rgba(0,217,255,0.15)] bg-[rgba(0,217,255,0.02)] flex flex-col items-center justify-center min-h-20"
            >
              <div className="text-[#00d9ff] font-bold text-lg">3</div>
              <div className="text-xs text-gray-500 mt-1">Modes</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-3 rounded border border-[rgba(0,217,255,0.15)] bg-[rgba(0,217,255,0.02)] flex flex-col items-center justify-center min-h-20"
            >
              <div className="text-[#00b8a3] font-bold text-lg">1080p</div>
              <div className="text-xs text-gray-500 mt-1">Max Quality</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-3 rounded border border-[rgba(0,217,255,0.15)] bg-[rgba(0,217,255,0.02)] flex flex-col items-center justify-center min-h-20"
            >
              <div className="text-[#00d9ff] font-bold text-lg">HLS</div>
              <div className="text-xs text-gray-500 mt-1">Protocol</div>
            </motion.div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12 pb-12 border-b border-[rgba(0,217,255,0.1)]">
          <FeatureCard
            icon={FiTrendingUp}
            title="Fuzzy Logic ABR"
            description="Mamdani inference system for adaptive decisions"
          />
          <FeatureCard
            icon={FiCode}
            title="Real-time Analytics"
            description="QoE scores, bitrate tracking, rebuffer monitoring"
          />
          <FeatureCard
            icon={FiCpu}
            title="Multi-Mode Simulation"
            description="Random, manual, or real network conditions"
          />
        </div>

        {/* Tech Stack */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-[#00b8a3]" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wide">
              Technology
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            <TechPill name="React" />
            <TechPill name="Next.js" />
            <TechPill name="Python" />
            <TechPill name="Flask" />
            <TechPill name="scikit-fuzzy" />
            <TechPill name="HLS.js" />
            <TechPill name="Tailwind" />
            <TechPill name="Framer Motion" />
          </div>
        </div>

        {/* Architecture */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-[#00d9ff]" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wide">
              Architecture
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded border border-[rgba(0,217,255,0.1)] bg-[rgba(0,217,255,0.02)]">
              <div className="text-[#00d9ff] text-xs font-mono font-bold">
                CLIENT LAYER
              </div>
              <div className="text-sm text-gray-400 mt-2">
                Next.js Frontend + API Proxy
              </div>
            </div>
            <div className="p-4 rounded border border-[rgba(0,217,255,0.1)] bg-[rgba(0,217,255,0.02)]">
              <div className="text-[#00b8a3] text-xs font-mono font-bold">
                ENGINE LAYER
              </div>
              <div className="text-sm text-gray-400 mt-2">
                Python Flask + Fuzzy Inference
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom divider and copyright */}
      <div className="h-px bg-linear-to-r from-transparent via-[rgba(0,217,255,0.2)] to-transparent mb-6" />
      <div className="text-center pb-6 px-4">
        <p className="text-xs text-gray-600 font-mono">
          [ fuzzystream ] • Fuzzy Logic Adaptive Bitrate © 2025
        </p>
      </div>
    </footer>
  );
};

export default Footer;
