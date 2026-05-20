"use client";

import React from "react";
import Modal from "react-modal";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";

if (typeof document !== "undefined") {
  Modal.setAppElement(document.body);
}

type MoreProps = {
  isOpen: boolean;
  onRequestClose: () => void;
};

const More = ({ isOpen, onRequestClose }: MoreProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="absolute z-[100] top-1/2 left-1/2 w-11/12 max-w-2xl -translate-x-1/2 -translate-y-1/2"
      overlayClassName="ReactModal__Overlay"
      closeTimeoutMS={300}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.96 }}
        className="glass-card relative border-[rgba(0,217,255,0.3)] p-6"
      >
        <button
          onClick={onRequestClose}
          className="absolute right-3 top-3 text-gray-400 transition-colors hover:text-[#00d9ff]"
          aria-label="Close modal"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="mb-4 text-2xl font-bold text-[#00d9ff]">How to Run</h2>

        <div className="space-y-4 text-sm text-gray-300">
          <p>
            Start the Next app with{" "}
            <span className="text-white">pnpm install</span> and then{" "}
            <span className="text-white">pnpm dev</span>.
          </p>
          <p>
            The client posts network samples to{" "}
            <span className="text-white">/api/network-status</span>, and the
            route proxies those values to the fuzzy engine before returning a
            bitrate decision.
          </p>
          <p>
            If you want to point at a different model server, set{" "}
            <span className="text-white">FUZZY_ENGINE_API</span> and{" "}
            <span className="text-white">FUZZY_HEALTH_API</span> in your
            environment.
          </p>
        </div>

        <button onClick={onRequestClose} className="btn-neon mt-6 w-full">
          Close
        </button>
      </motion.div>
    </Modal>
  );
};

export default More;
