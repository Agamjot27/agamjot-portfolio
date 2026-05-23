"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { projects, bio } from "@/data/portfolioData";

type PredictivePreviewProps = {
  query: string;
  onSearch: (query: string) => void;
};

function pickPreview(query: string) {
  const normalized = query.trim().toLowerCase();
  if (normalized.length < 2) return null;

  const project = projects.find((item) => {
    const haystack = [
      item.title,
      item.description,
      item.category,
      ...item.tech,
      ...item.keyFeatures,
    ]
      .join(" ")
      .toLowerCase();
    return normalized.split(/\s+/).some((part) => part.length > 1 && haystack.includes(part));
  });

  if (project) {
    return {
      type: "Project signal",
      title: project.title,
      description: project.description,
      query: project.title,
      metric: project.metrics?.[0],
      tags: project.tech.slice(0, 3),
    };
  }

  if (["hire", "resume", "contact", " "].some((term) => normalized.includes(term))) {
    return {
      type: "Profile shortcut",
      title: "Quick profile",
      description: bio.summary,
      query: normalized.includes("resume") ? "resume" : "hire agamjot",
      metric: { label: "Signal", value: "Ready" },
      tags: ["Resume", "Contact", "Highlights"],
    };
  }

  return null;
}

export default function PredictivePreview({ query, onSearch }: PredictivePreviewProps) {
  const preview = pickPreview(query);

  return (
    <AnimatePresence mode="wait">
      {preview ? (
        <motion.button
          key={preview.title}
          type="button"
          onClick={() => onSearch(preview.query)}
          className="predictive-preview text-left"
          initial={{ opacity: 0, y: 14, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 150, damping: 18 }}
        >
          <span className="predictive-kicker">
            <Sparkles className="h-3.5 w-3.5" />
            {preview.type}
          </span>
          <span className="predictive-title">{preview.title}</span>
          <span className="predictive-copy">{preview.description}</span>
          <span className="predictive-footer">
            <span className="predictive-tags">
              {preview.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </span>
            {preview.metric ? (
              <span className="predictive-metric">
                {preview.metric.label}: {preview.metric.value}
              </span>
            ) : null}
            <ArrowRight className="h-4 w-4" />
          </span>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
