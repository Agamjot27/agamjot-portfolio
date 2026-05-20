"use client";

import React from "react";

interface GoogleLogoProps {
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
}

export default function GoogleLogo({ size = "md", interactive = true }: GoogleLogoProps) {
  const letters = [
    { char: "A", color: "text-[#4285F4]" },
    { char: "g", color: "text-[#EA4335]" },
    { char: "a", color: "text-[#FBBC05]" },
    { char: "m", color: "text-[#4285F4]" },
    { char: "j", color: "text-[#34A853]" },
    { char: "o", color: "text-[#EA4335]" },
    { char: "t", color: "text-[#4285F4]" },
  ];

  const sizeClasses = {
    sm: "text-[22px] leading-none",
    md: "text-[32px] leading-none",
    lg: "text-[92px] leading-none max-md:text-[64px]",
  };

  return (
    <div
      className={`font-google-logo flex items-baseline select-none ${interactive ? "cursor-pointer" : ""}`}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      <span className={sizeClasses[size]} aria-label="Agamjot">
        {letters.map((l, idx) => (
          <span key={idx} className={l.color}>
            {l.char}
          </span>
        ))}
      </span>
    </div>
  );
}
