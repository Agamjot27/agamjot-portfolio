"use client";

import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import type { Theme } from "@/lib/theme";

interface ThemeSwitcherProps {
  theme: Theme;
  onChange: (theme: Theme) => void;
  compact?: boolean;
}

export default function ThemeSwitcher({ theme, onChange, compact = false }: ThemeSwitcherProps) {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => onChange(isDark ? "light" : "dark")}
      className={[
        "theme-switcher group relative inline-flex items-center overflow-hidden rounded-full border border-theme-custom bg-theme-card/80 text-theme-primary shadow-[var(--shadow-soft)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--accent-color)_44%,var(--border-color))]",
        compact ? "h-10 w-10 justify-center" : "h-11 gap-2 px-3",
      ].join(" ")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light theme" : "Dark theme"}
    >
      <motion.span
        className="absolute inset-0 opacity-70"
        animate={{
          background: isDark
            ? "radial-gradient(circle at 35% 35%, rgba(138,180,248,0.34), transparent 42%)"
            : "radial-gradient(circle at 65% 35%, rgba(37,99,235,0.18), transparent 42%)",
        }}
        transition={{ duration: 0.42 }}
      />
      <motion.span
        className="relative grid h-7 w-7 place-items-center rounded-full bg-theme-elevated text-theme-accent"
        animate={{ rotate: isDark ? 0 : 180, scale: [1, 1.08, 1] }}
        transition={{ duration: 0.42, ease: "easeOut" }}
      >
        <motion.span
          className="absolute"
          animate={{ opacity: isDark ? 1 : 0, scale: isDark ? 1 : 0.55 }}
          transition={{ duration: 0.26 }}
        >
          <Moon className="h-4 w-4" />
        </motion.span>
        <motion.span
          className="absolute"
          animate={{ opacity: isDark ? 0 : 1, scale: isDark ? 0.55 : 1 }}
          transition={{ duration: 0.26 }}
        >
          <Sun className="h-4 w-4" />
        </motion.span>
      </motion.span>
      {!compact ? (
        <span className="relative pr-1 text-xs font-semibold uppercase tracking-[0.2em] text-theme-secondary">
          {isDark ? "Dark" : "Light"}
        </span>
      ) : null}
    </button>
  );
}
