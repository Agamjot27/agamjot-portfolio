"use client";

import { motion } from "framer-motion";

export default function AmbientBackground() {
  return (
    <div className="ambient-stage" aria-hidden>
      <motion.div
        className="ambient-mesh ambient-mesh-one"
        animate={{ x: [0, 26, -10, 0], y: [0, -18, 12, 0], scale: [1, 1.08, 0.98, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="ambient-mesh ambient-mesh-two"
        animate={{ x: [0, -22, 16, 0], y: [0, 20, -8, 0], scale: [1, 0.94, 1.05, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="ambient-grid"
        animate={{ backgroundPosition: ["0px 0px", "36px 28px"] }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
