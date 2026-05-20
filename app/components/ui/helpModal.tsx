"use client";

import React from "react";
import Modal from "react-modal";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";

if (typeof document !== "undefined") {
  Modal.setAppElement(document.body);
}

type HelpModalProps = {
  isOpen: boolean;
  onRequestClose: () => void;
};

const HelpModal = ({ isOpen, onRequestClose }: HelpModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="absolute z-100 top-1/2 left-1/2 w-11/12 max-w-lg -translate-x-1/2 -translate-y-1/2"
      overlayClassName="ReactModal__Overlay"
      closeTimeoutMS={300}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.7 }}
        className="glass-card relative border-[rgba(0,217,255,0.3)] p-6"
      >
        <button
          onClick={onRequestClose}
          className="absolute right-3 top-3 text-gray-400 transition-colors hover:text-[#00d9ff]"
          aria-label="Close modal"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="mb-4 text-2xl font-bold text-[#00d9ff]">Help & Info</h2>
        <div className="space-y-3 text-sm text-gray-300">
          <p>
            This app uses a{" "}
            <span className="text-[#00d9ff]">Fuzzy Logic Engine</span> to adapt
            video quality based on network conditions.
          </p>
          <div>
            <h3 className="font-bold text-white">Modes:</h3>
            <ul className="list-inside list-disc ml-2">
              <li>
                <span className="text-[#00d9ff]">Random Sim:</span> Simulates a
                fluctuating, unstable network.
              </li>
              <li>
                <span className="text-[#00d9ff]">Real Network:</span> Uses your
                browser&apos;s reported network data.
              </li>
              <li>
                <span className="text-[#00d9ff]">Manual Sim:</span> Use the
                sliders to control the inputs yourself.
              </li>
            </ul>
          </div>
          <p>
            The <span className="text-white">QoE Score</span> is a &quot;Quality
            of Experience&quot; metric from 0-5, calculated based on average
            bitrate and rebuffer events.
          </p>
        </div>

        <button onClick={onRequestClose} className="btn-neon mt-6 w-full">
          Close
        </button>
      </motion.div>
    </Modal>
  );
};

export default HelpModal;
