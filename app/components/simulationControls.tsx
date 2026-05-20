"use client";

import React from "react";

import Card from "./ui/card";

type ManualInputs = {
  bandwidth: number;
  buffer: number;
  delay: number;
};

type SimulationControlsProps = {
  manualInputs: ManualInputs;
  setManualInputs: React.Dispatch<React.SetStateAction<ManualInputs>>;
  isEnabled: boolean;
};

type SliderProps = {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  unit: string;
  isEnabled: boolean;
};

const Slider = ({
  label,
  min,
  max,
  step,
  value,
  onChange,
  unit,
  isEnabled,
}: SliderProps) => (
  <div className="flex flex-col">
    <label
      htmlFor={label}
      className="flex justify-between text-sm font-medium text-gray-300"
    >
      <span>{label}</span>
      <span className="font-bold text-[#00d9ff]">
        {value} {unit}
      </span>
    </label>
    <input
      id={label}
      type="range"
      name={label.toLowerCase()}
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
      disabled={!isEnabled}
      className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-cyan-400
                 disabled:opacity-50 disabled:cursor-not-allowed
                 bg-gray-700"
    />
  </div>
);

const SimulationControls = ({
  manualInputs,
  setManualInputs,
  isEnabled,
}: SimulationControlsProps) => {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;
    setManualInputs((prev) => ({
      ...prev,
      [name]: parseFloat(value),
    }));
  };

  return (
    <Card className={`w-full ${!isEnabled ? "opacity-60 grayscale" : ""}`}>
      <h3 className="text-lg font-semibold text-white mb-3">
        Manual Simulation
      </h3>
      <div className="space-y-4">
        <Slider
          label="Bandwidth"
          min={1}
          max={10}
          step={0.5}
          value={manualInputs.bandwidth}
          onChange={handleChange}
          unit="Mbps"
          isEnabled={isEnabled}
        />
        <Slider
          label="Buffer"
          min={0}
          max={10}
          step={0.5}
          value={manualInputs.buffer}
          onChange={handleChange}
          unit="sec"
          isEnabled={isEnabled}
        />
        <Slider
          label="Delay"
          min={10}
          max={400}
          step={10}
          value={manualInputs.delay}
          onChange={handleChange}
          unit="ms"
          isEnabled={isEnabled}
        />
      </div>
    </Card>
  );
};

export default SimulationControls;
