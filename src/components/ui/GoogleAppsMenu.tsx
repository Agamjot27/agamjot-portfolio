"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Briefcase,
  Code,
  FileText,
  Grid3X3,
  Mail,
  Search,
  User,
} from "lucide-react";
import { bio } from "@/data/portfolioData";

type GoogleAppsMenuProps = {
  onNavigate: (query: string) => void;
};

const apps = [
  { label: "About", query: "about", icon: User, color: "text-[#4285F4]" },
  { label: "Projects", query: "projects", icon: Code, color: "text-[#34A853]" },
  { label: "Skills", query: "skills", icon: Award, color: "text-[#FBBC05]" },
  { label: "Experience", query: "experience", icon: Briefcase, color: "text-[#EA4335]" },
  { label: "Resume", query: "resume", icon: FileText, color: "text-[#4285F4]" },
  { label: "Contact", query: "contact", icon: Mail, color: "text-[#34A853]" },
  { label: "Search", query: "who is Agamjot Singh", icon: Search, color: "text-[#EA4335]" },
  { label: "Hire Me", query: "hire agamjot", icon: Briefcase, color: "text-[#FBBC05]" },
  { label: "Timeline", query: "career timeline", icon: Award, color: "text-[#4285F4]" },
];

export default function GoogleAppsMenu({ onNavigate }: GoogleAppsMenuProps) {
  const [open, setOpen] = useState(false);

  const openQuery = (query: string) => {
    setOpen(false);
    onNavigate(query);
  };

  return (
    <div className="google-home-actions">
      <button type="button" onClick={() => onNavigate("projects")} className="google-home-link">
        Projects
      </button>
      <button type="button" onClick={() => onNavigate("skills")} className="google-home-link">
        Skills
      </button>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="google-apps-trigger"
          aria-label="Open portfolio apps"
          aria-expanded={open}
        >
          <Grid3X3 className="h-5 w-5" />
        </button>

        <AnimatePresence>
          {open ? (
            <motion.div
              className="google-apps-panel"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
            >
              <div className="google-apps-inner">
                <div className="google-apps-title">Your pages</div>
                <div className="google-apps-grid">
                  {apps.map(({ label, query, icon: Icon, color }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => openQuery(query)}
                      className="google-app-item"
                    >
                      <span className="google-app-icon">
                        <Icon className={`h-7 w-7 ${color}`} strokeWidth={2.4} />
                      </span>
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={() => onNavigate("about")}
        className="google-profile-button"
        aria-label="Open profile"
      >
        <img src={bio.avatar} alt="" />
      </button>
    </div>
  );
}
