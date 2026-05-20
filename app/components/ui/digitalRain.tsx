import React from "react";

const columns = Array.from({ length: 18 }, (_, index) => index);

const DigitalRain = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-[0.06]"
    >
      {columns.map((column) => (
        <span
          key={column}
          className="absolute top-0 block h-full w-px bg-linear-to-b from-transparent via-neon-green to-transparent"
          style={{
            left: `${(column / columns.length) * 100}%`,
            animation: `digital-rain 11s linear ${column * 0.15}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

export default DigitalRain;
