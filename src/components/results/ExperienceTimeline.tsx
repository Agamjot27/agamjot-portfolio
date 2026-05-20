"use client";

import React from "react";
import { experience, education, Experience, Education } from "@/data/portfolioData";
import { Briefcase, GraduationCap, MapPin, Calendar, Award } from "lucide-react";

interface ExperienceTimelineProps {
  filteredExp?: Experience[];
  filteredEdu?: Education[];
}

export default function ExperienceTimeline({ filteredExp, filteredEdu }: ExperienceTimelineProps) {
  const exps = filteredExp || experience;
  const edus = filteredEdu || education;

  // Interleave experience and education or list them side-by-side/top-to-bottom.
  // A vertical timeline is beautiful and clean.
  return (
    <div className="space-y-8 max-w-3xl py-4">
      {/* Experience Section */}
      <div className="space-y-6">
        <h3 className="text-sm text-theme-secondary pb-2">Work history</h3>

        <div className="relative border-l border-theme-custom ml-2 pl-6 space-y-8">
          {exps.map((e) => (
            <div key={e.id} className="relative">
              <div className="absolute -left-[25px] top-2 w-2.5 h-2.5 rounded-full bg-theme-accent" />
              
              <div className="space-y-1.5">
                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-theme-tertiary">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {e.duration}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {e.location}</span>
                </div>

                {/* Job Title & Company */}
                <div>
                  <h4 className="text-lg font-normal text-theme-primary leading-tight">
                    {e.role} <span className="text-theme-secondary">— {e.company}</span>
                  </h4>
                </div>

                {/* Description Bullets */}
                <ul className="list-disc list-inside text-xs text-theme-muted space-y-1 pl-1">
                  {e.description.map((desc, idx) => (
                    <li key={idx} className="leading-relaxed"><span className="text-theme-primary">{desc}</span></li>
                  ))}
                </ul>

                {/* Tech chips */}
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  {e.tech.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded text-[10px] bg-theme-card text-theme-muted border border-theme-custom">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education Section */}
      <div className="space-y-6 pt-4">
        <h3 className="text-sm font-semibold tracking-wider text-theme-muted uppercase flex items-center gap-1.5 border-b border-theme-custom pb-2">
          <GraduationCap className="w-4 h-4 text-emerald-450" /> Academic Foundation
        </h3>

        <div className="relative border-l-2 border-theme-custom ml-3 pl-6 space-y-6">
          {edus.map((edu) => (
            <div key={edu.id} className="relative group">
              {/* Timeline Marker */}
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-theme-main border-2 border-emerald-500 group-hover:bg-emerald-500 group-hover:scale-110 transition-all duration-300" />

              <div className="space-y-2">
                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-theme-tertiary">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {edu.duration}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {edu.location}</span>
                  {edu.gpa && <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-450 font-bold text-[10px]">GPA: {edu.gpa}</span>}
                </div>

                {/* Institution & Degree */}
                <div>
                  <h4 className="text-base md:text-lg font-bold text-theme-primary leading-tight">
                    {edu.degree}
                  </h4>
                  <p className="text-xs text-theme-muted font-medium">{edu.institution}</p>
                </div>

                {/* Details */}
                {edu.details && edu.details.length > 0 && (
                  <ul className="list-disc list-inside text-xs text-theme-muted space-y-1 pl-1">
                    {edu.details.map((dt, idx) => (
                      <li key={idx} className="leading-relaxed"><span className="text-theme-primary">{dt}</span></li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
