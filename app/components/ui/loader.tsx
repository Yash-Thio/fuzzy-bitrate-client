import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-2 h-2 rounded-full bg-[#00d9ff] animate-pulse [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 rounded-full bg-[#00d9ff] animate-pulse [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 rounded-full bg-[#00d9ff] animate-pulse"></div>
      <span className="text-xs text-[#00d9ff]/80">Connecting...</span>
    </div>
  );
};

export default Loader;
