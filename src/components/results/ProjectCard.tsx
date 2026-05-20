"use client";

import React, { useState } from "react";
import { Project } from "@/data/portfolioData";
import { motion } from "framer-motion";
import { BarChart3, ExternalLink, Network } from "lucide-react";
import { Github } from "../ui/BrandIcons";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.article
      className="interactive-project-card max-w-[660px] mb-6"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      whileHover={{ y: -4, rotateX: 1.2, rotateY: -1.2 }}
      transition={{ type: "spring", stiffness: 140, damping: 18 }}
    >
      <div className="google-breadcrumb flex items-center gap-1 text-sm">
        <span className="text-theme-secondary">Agamjot Singh</span>
        <span className="text-theme-tertiary">&gt;</span>
        <span className="text-theme-secondary">projects</span>
      </div>

      <div className="mt-2 grid gap-4 md:grid-cols-[1fr_170px] md:items-start">
        <div className="min-w-0">
          <h4 className="m-0">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="google-result-title"
            >
              {project.title}
            </a>
          </h4>

          <p className="mt-1 text-sm text-theme-secondary leading-snug">{project.description}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            {project.tech.slice(0, expanded ? 7 : 4).map((t) => (
              <span key={t} className="project-chip">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="project-visual" aria-hidden>
          <span className="project-visual-orbit" />
          <span className="project-visual-node project-visual-node-a" />
          <span className="project-visual-node project-visual-node-b" />
          <span className="project-visual-node project-visual-node-c" />
          <BarChart3 className="h-8 w-8" />
        </div>
      </div>

      {project.metrics && project.metrics.length > 0 && (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {project.metrics.map((m, index) => (
            <div key={m.label} className="project-metric">
              <span>{m.label}</span>
              <strong>{m.value}</strong>
              <motion.i
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: index === 0 ? 0.86 : 0.68 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
            </div>
          ))}
        </div>
      )}

      {expanded ? (
        <motion.div
          className="project-architecture"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
        >
          {project.keyFeatures.slice(0, 3).map((feature, index) => (
            <div key={feature} className="architecture-step">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{feature}</p>
            </div>
          ))}
        </motion.div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3 pt-3 text-sm">
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="text-google-link hover:underline inline-flex items-center gap-1"
        >
          <Network className="w-3.5 h-3.5" /> {expanded ? "Hide architecture" : "View architecture"}
        </button>
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-google-link hover:underline inline-flex items-center gap-1"
        >
          <Github className="w-3.5 h-3.5" /> Code
        </a>
        {project.live ? (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="text-google-link hover:underline inline-flex items-center gap-1"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Demo
          </a>
        ) : null}
      </div>
    </motion.article>
  );
}
