"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import type { SkillAsset } from "@/data/skillAssets";

const SkillModelCanvas = dynamic(() => import("./SkillModelCanvas"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse bg-transparent" aria-hidden />
  ),
});

type SkillOrbProps = {
  skill: SkillAsset;
  isActive: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: (hovered: boolean) => void;
};

export default function SkillOrb({
  skill,
  isActive,
  isHovered,
  onSelect,
  onHover,
}: SkillOrbProps) {
  const engaged = isActive || isHovered;

  return (
    <motion.button
      type="button"
      layout
      onClick={onSelect}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onFocus={() => onHover(true)}
      onBlur={() => onHover(false)}
      className="group relative flex w-full flex-col items-stretch outline-none"
      aria-label={skill.name}
      whileTap={{ scale: 0.98 }}
      animate={{ scale: engaged ? 1.03 : 1 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
    >
      <div
        className={`relative h-[200px] w-full sm:h-[220px] transition-[filter] duration-300 ${
          isActive
            ? "drop-shadow-[0_12px_32px_rgba(138,180,248,0.45)]"
            : isHovered
              ? "drop-shadow-[0_8px_24px_rgba(255,255,255,0.12)]"
              : ""
        }`}
      >
        <SkillModelCanvas
          modelPath={skill.modelPath}
          rotation={skill.rotation}
          fitMargin={skill.fitMargin}
          active={engaged}
        />
      </div>

      <motion.div
        className="h-0.5 w-full rounded-full bg-theme-accent origin-left"
        initial={false}
        animate={{ scaleX: engaged ? skill.level / 100 : 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        aria-hidden
      />

      <motion.span
        initial={false}
        animate={{
          opacity: engaged ? 1 : 0,
          y: engaged ? 0 : 4,
        }}
        className="mt-2 text-center text-xs text-theme-secondary pointer-events-none"
      >
        {skill.name}
      </motion.span>
    </motion.button>
  );
}
