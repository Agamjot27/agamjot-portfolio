"use client";

import { useEffect, useMemo, useState } from "react";
import { useGLTF } from "@react-three/drei";
import {
  skill3DShowcase,
  filter3DSkills,
  preloadSkillModels,
} from "@/data/skillAssets";
import { type SkillCategory } from "@/data/portfolioData";
import SkillOrb from "./SkillOrb";

interface SkillsGridProps {
  filteredSkills?: SkillCategory[];
}

export default function SkillsGrid({ filteredSkills }: SkillsGridProps) {
  const items = useMemo(() => {
    if (!filteredSkills?.length) return skill3DShowcase;
    const names = filteredSkills.flatMap((c) => c.items.map((i) => i.name));
    return filter3DSkills(names);
  }, [filteredSkills]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    preloadSkillModels(useGLTF.preload);
  }, []);

  if (!items.length) return null;

  const selectedId = items.some((s) => s.id === activeId) ? activeId : items[0]?.id;

  return (
    <div className="w-full max-w-3xl py-4">
      <p className="sr-only">
        Interactive 3D skills. Hover or tap a model; drag to rotate when selected.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
        {items.map((skill) => (
          <SkillOrb
            key={skill.id}
            skill={skill}
            isActive={selectedId === skill.id}
            isHovered={hoveredId === skill.id}
            onSelect={() => {
              setActiveId(skill.id);
            }}
            onHover={(hovered) => setHoveredId(hovered ? skill.id : null)}
          />
        ))}
      </div>
    </div>
  );
}
