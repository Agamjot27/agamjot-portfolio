"use client";

import React from "react";
import GradientText from "./GradientText";

interface GoogleLogoProps {
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
}

export default function GoogleLogo({ size = "md", interactive = true }: GoogleLogoProps) {
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
        <GradientText
          colors={["#ffffffff", "#353232ff"]}
          animationSpeed={3}
          direction="horizontal"
          pauseOnHover
          showBorder={false}
        >
          Agamjot
        </GradientText>
      </span>
    </div>
  );
}
