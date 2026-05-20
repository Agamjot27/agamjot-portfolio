"use client";

import React from "react";
import dynamic from "next/dynamic";
import { bio } from "@/data/portfolioData";
import { ExternalLink, Mail, Phone, MapPin, Award, Cpu, FileText } from "lucide-react";

const SkillsGrid = dynamic(() => import("./SkillsGrid"), { ssr: false });
import { Github, Linkedin } from "../ui/BrandIcons";

interface SnippetViewProps {
  snippet: {
    title: string;
    subtitle?: string;
    description?: string;
    type: "project" | "experience" | "skills" | "contact" | "easter-egg" | "bio";
    data?: any;
  };
  onQueryChange?: (q: string) => void;
}

export default function SnippetView({ snippet, onQueryChange }: SnippetViewProps) {
  const { title, subtitle, description, type, data } = snippet;

  const renderContent = () => {
    switch (type) {
      case "project":
        const proj = data;
        return (
          <div className="space-y-4">
            <p className="text-theme-primary text-sm leading-relaxed">{description || proj.longDescription}</p>
            
            {/* Project Metrics */}
            {proj.metrics && proj.metrics.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {proj.metrics.map((m: any, idx: number) => (
                  <div key={idx} className="bg-theme-main/40 border border-theme-custom/50 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-theme-muted font-semibold uppercase tracking-wider">{m.label}</p>
                    <p className="text-sm font-bold text-emerald-450 mt-1">{m.value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Key Features */}
            {proj.keyFeatures && proj.keyFeatures.length > 0 && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-theme-muted">Key Achievements</h4>
                <ul className="list-disc list-inside text-xs text-theme-muted space-y-1 pl-1">
                  {proj.keyFeatures.map((kf: string, idx: number) => (
                    <li key={idx} className="leading-relaxed"><span className="text-theme-primary">{kf}</span></li>
                  ))}
                </ul>
              </div>
            )}

            {/* Links & Tech */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-theme-custom">
              <div className="flex flex-wrap gap-1.5">
                {proj.tech.map((t: string) => (
                  <span key={t} className="px-2 py-0.5 rounded text-[10px] bg-theme-main border border-theme-custom text-theme-muted">
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <a
                  href={proj.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-theme-main hover:opacity-80 transition-colors text-xs font-semibold text-theme-primary border border-theme-custom"
                >
                  <Github className="w-3.5 h-3.5" /> GitHub
                </a>
                <a
                  href={proj.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-google-link hover:underline text-sm inline-flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                </a>
              </div>
            </div>
          </div>
        );

      case "experience":
        const exp = data;
        return (
          <div className="space-y-4">
            <p className="text-theme-primary text-sm leading-relaxed">{description}</p>
            {exp.highlights && exp.highlights.length > 0 && (
              <div className="bg-theme-main/20 border border-theme-custom rounded-xl p-4 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-theme-muted flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-yellow-500" /> Key Milestones
                </h4>
                <ul className="list-disc list-inside text-xs text-theme-muted space-y-1">
                  {exp.highlights.map((hl: string, idx: number) => (
                    <li key={idx} className="leading-relaxed"><span className="text-theme-primary">{hl}</span></li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-theme-custom">
              {exp.tech.map((t: string) => (
                <span key={t} className="px-2 py-0.5 rounded text-[10px] bg-theme-main border border-theme-custom text-theme-muted">
                  {t}
                </span>
              ))}
            </div>
          </div>
        );

      case "skills":
        return (
          <SkillsGrid
            filteredSkills={Array.isArray(data) ? data : undefined}
          />
        );

      case "contact":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <p className="text-theme-primary text-sm leading-relaxed">
                Open to internships and new-grad roles in ML, backend, and full-stack engineering. Based in Manipal, Karnataka.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 text-xs text-theme-muted">
                  <Mail className="w-4 h-4 text-blue-450" />
                  <a href={`mailto:${bio.email}`} className="text-theme-primary hover:text-blue-450 transition-colors">
                    {bio.email}
                  </a>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-theme-muted">
                  <Phone className="w-4 h-4 text-blue-450" />
                  <span className="text-theme-primary">{bio.phone}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-theme-muted">
                  <MapPin className="w-4 h-4 text-blue-450" />
                  <span className="text-theme-primary">{bio.location}</span>
                </div>
              </div>
            </div>

            <div className="bg-theme-main/20 border border-theme-custom rounded-xl p-4 flex flex-col justify-center space-y-3">
              <h4 className="text-xs font-bold text-theme-muted uppercase tracking-wider text-center">Social Pipelines</h4>
              <div className="flex flex-col gap-2">
                <a
                  href={bio.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 py-2 px-3 rounded-lg bg-theme-main hover:opacity-80 transition-colors text-xs text-theme-primary font-semibold border border-theme-custom"
                >
                  <Linkedin className="w-4 h-4 text-blue-450 fill-blue-450" /> LinkedIn
                </a>
                <a
                  href={bio.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 py-2 px-3 rounded-lg bg-theme-main hover:opacity-80 transition-colors text-xs text-theme-primary font-semibold border border-theme-custom"
                >
                  <Github className="w-4 h-4" /> GitHub
                </a>
                <a
                  href={bio.resumeUrl}
                  download
                  className="google-btn inline-flex items-center gap-2 text-xs no-underline"
                >
                  <FileText className="w-4 h-4" /> Download Resume (PDF)
                </a>
              </div>
            </div>
          </div>
        );

      case "easter-egg":
        return (
          <div className="space-y-4">
            <p className="text-theme-primary text-sm leading-relaxed whitespace-pre-wrap">{description}</p>
            {title.includes("Roast") && (
              <div className="border border-red-500/20 bg-red-500/5 rounded-lg p-3 text-[11px] font-mono text-red-400">
                [SYSTEM WARNING] Roasting script complete. 100+ style errors found. Please format your mind before pushing.
              </div>
            )}
            {title.includes("Recruitment") && onQueryChange && (
              <button
                onClick={() => onQueryChange("contact")}
                className="text-xs text-emerald-450 hover:underline font-semibold"
              >
                Execute system command: contact_information &rarr;
              </button>
            )}
          </div>
        );

      case "bio":
      default:
        return (
          <div className="space-y-4">
            <p className="text-theme-primary text-sm leading-relaxed">{description}</p>
            
            {/* Strengths bullet points */}
            {bio.strengths && bio.strengths.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-theme-muted flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-blue-400" /> Engineering Core Values
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {bio.strengths.map((str, idx) => (
                    <div key={idx} className="bg-theme-main/10 border border-theme-custom rounded-xl p-3 flex gap-2">
                      <span className="text-blue-400 text-xs font-bold">0{idx + 1}.</span>
                      <p className="text-xs text-theme-muted leading-relaxed">{str}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="google-snippet-box w-full max-w-[652px] p-4 mb-6">
      <div className="space-y-3">
        <h2 className="text-xl font-normal text-theme-primary m-0">{title}</h2>
        {subtitle && <p className="text-sm text-theme-secondary m-0">{subtitle}</p>}
        {renderContent()}
      </div>
    </div>
  );
}
