"use client";

import { type ComponentType } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FiZap, FiRadio } from "react-icons/fi";

import Loader from "./ui/loader";

type SocialLinkProps = {
  href: string;
  icon: ComponentType<{ size?: number }>;
  label: string;
};

type HeaderProps = {
  isLoading: boolean;
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
    <Icon size={18} />
  </motion.a>
);

const Header = ({ isLoading }: HeaderProps) => {
  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL || "";
  const linkedinUrl = process.env.NEXT_PUBLIC_LINKEDIN_URL || "";

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 md:mb-12"
    >
      {/* Top Status Bar */}
      <div className="flex items-center justify-between px-3 md:px-4 py-2 mb-4 border-b border-[rgba(0,217,255,0.15)] bg-linear-to-r from-[rgba(0,217,255,0.02)] to-transparent">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-[#00d9ff]"
          />
          <span className="text-xs text-gray-400">SYSTEM ONLINE</span>
        </div>
        <div className="text-xs text-gray-500">v1.0.0</div>
      </div>

      {/* Main Header Content */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6 px-2 md:px-0">
        {/* Left: Branding */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <FiRadio className="text-[#00d9ff] w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
              Fuzzy<span className="text-[#00d9ff]">Stream</span>
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              ABR • Fuzzy Logic • Real-time
            </p>
          </div>
        </div>

        {/* Center: Tagline */}
        <div className="hidden lg:flex items-center gap-2 text-sm text-gray-400">
          <FiZap className="w-4 h-4 text-[#00b8a3]" />
          <span>Adaptive Bitrate Intelligence</span>
        </div>

        {/* Right: Links & Status */}
        <div className="flex items-center justify-between md:justify-end gap-6 md:gap-8">
          <div className="flex items-center gap-4">
            <SocialLink href={githubUrl} icon={FaGithub} label="GitHub" />
            <SocialLink href={linkedinUrl} icon={FaLinkedin} label="LinkedIn" />
          </div>
          <div className="w-24 h-6 flex items-center justify-center">
            {isLoading ? (
              <Loader />
            ) : (
              <div className="flex gap-1">
                <motion.div
                  animate={{ opacity: [0.3, 1] }}
                  transition={{ duration: 0.6 }}
                  className="w-1.5 h-1.5 rounded-full bg-[#00b8a3]"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
