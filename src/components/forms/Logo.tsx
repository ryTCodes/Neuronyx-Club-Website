"use client";

import React from "react";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export default function Logo({
  className = "w-12 h-12",
  showText = false,
}: LogoProps) {
  return (
    <div
      className={`flex flex-col items-center gap-2 ${className} ${
        showText ? "!h-auto" : ""
      }`}
    >
      <div
        className={`relative flex w-full items-center justify-center ${
          showText ? "aspect-square" : "h-full"
        }`}
      >
        <img
          src="/logo.png"
          alt="NeurOnyx Logo"
          className="h-full w-full object-contain drop-shadow-[0_0_15px_rgba(0,210,255,0.3)]"
          onError={(e) => {
            // Fallback to absolute or icon if relative path fails
            (e.target as HTMLImageElement).src =
              "https://neuronyx.aiktc.ac.in/neuronyx.png";
          }}
        />
      </div>

      {showText && (
        <div className="mt-1 text-center">
          <h1 className="flex items-center justify-center text-xl font-bold tracking-[0.3em] text-white sm:text-2xl">
            NEURONYX
          </h1>
        </div>
      )}
    </div>
  );
}
