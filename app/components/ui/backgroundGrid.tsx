import React from "react";

const BackgroundGrid = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.16]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 255, 65, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 65, 0.12) 1px, transparent 1px)",
        backgroundSize: "72px 72px",
        maskImage:
          "radial-gradient(circle at center, black 20%, transparent 90%)",
      }}
    />
  );
};

export default BackgroundGrid;
