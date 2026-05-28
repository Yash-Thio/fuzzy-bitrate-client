"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import { motion } from "framer-motion";
import { FaQuestionCircle } from "react-icons/fa";

import SimulationControls from "./simulationControls";
import HelpModal from "./ui/helpModal";

type ManualInputs = {
  bandwidth: number;
  buffer: number;
  delay: number;
};

type ControlsProps = {
  mode: "random" | "real" | "manual";
  setMode: Dispatch<SetStateAction<"random" | "real" | "manual">>;
  manualInputs: ManualInputs;
  setManualInputs: Dispatch<SetStateAction<ManualInputs>>;
  engineSelection?: "fuzzy" | "baseline";
  setEngineSelection?: Dispatch<SetStateAction<"fuzzy" | "baseline">>;
};

const Controls = ({
  mode,
  setMode,
  manualInputs,
  setManualInputs,
  engineSelection = "fuzzy",
  setEngineSelection,
}: ControlsProps) => {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const isManual = mode === "manual";

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="md:col-span-2 flex flex-col md:flex-row gap-3 md:gap-4">
          <ToggleButton
            label="Random Sim"
            isActive={mode === "random"}
            onClick={() => setMode("random")}
          />
          <ToggleButton
            label="Real Network"
            isActive={mode === "real"}
            onClick={() => setMode("real")}
          />
          <ToggleButton
            label="Manual Sim"
            isActive={isManual}
            onClick={() => setMode("manual")}
          />

          <div className="flex items-center justify-center gap-6 mt-2 md:mt-0 md:ml-4 w-full md:w-auto">
            <motion.button
              whileHover={{ scale: 1.1, color: "#00d9ff" }}
              onClick={() => setIsHelpModalOpen(true)}
              className="flex items-center justify-center gap-2 text-sm text-gray-400 transition-colors"
            >
              <FaQuestionCircle /> Help
            </motion.button>
            {setEngineSelection && (
              <select
                aria-label="Engine selection"
                value={engineSelection}
                onChange={(e) =>
                  setEngineSelection(e.target.value as "fuzzy" | "baseline")
                }
                className="ml-2 rounded-md border bg-black/30 px-2 py-1 text-sm text-white"
              >
                <option value="fuzzy">Fuzzy Engine</option>
                <option value="baseline">Baseline Engine</option>
              </select>
            )}
          </div>
        </div>

        <div className="md:col-span-1 row-start-1 md:row-start-auto">
          {isManual && (
            <SimulationControls
              manualInputs={manualInputs}
              setManualInputs={setManualInputs}
              isEnabled={isManual}
            />
          )}
        </div>
      </div>

      <HelpModal
        isOpen={isHelpModalOpen}
        onRequestClose={() => setIsHelpModalOpen(false)}
      />
    </>
  );
};

type ToggleButtonProps = {
  label: string;
  isActive: boolean;
  onClick: () => void;
};

const ToggleButton = ({ label, isActive, onClick }: ToggleButtonProps) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    onClick={onClick}
    className={`btn-neon w-full ${isActive ? "btn-neon-active" : ""}`}
  >
    {label}
  </motion.button>
);

export default Controls;
