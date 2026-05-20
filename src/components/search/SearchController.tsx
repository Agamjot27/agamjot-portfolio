"use client";

import React, { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { runSearch, SearchResult } from "@/lib/search-engine";
import { applyTheme, getSavedTheme, persistTheme, type Theme } from "@/lib/theme";
import { bio, projects, education } from "@/data/portfolioData";
import GoogleLogo from "../ui/GoogleLogo";
import SearchBox from "./SearchBox";
import PredictivePreview from "./PredictivePreview";
import SnippetView from "../results/SnippetView";
import ProjectCard from "../results/ProjectCard";
import ExperienceTimeline from "../results/ExperienceTimeline";
import SkillsGrid from "../results/SkillsGrid";
import TerminalMode from "../results/TerminalMode";
import AmbientBackground from "../ui/AmbientBackground";
import StarBackground from "../ui/StarBackground";
import GoogleAppsMenu from "../ui/GoogleAppsMenu";
import {
  Search, Code, Briefcase, Award, User,
  ChevronDown, ChevronUp, Mail, FileText, Sun, Moon,
} from "lucide-react";

type TabType = "all" | "projects" | "experience" | "skills" | "about";

function SearchControllerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const urlQuery = searchParams.get("q") ?? "";
  const lastSyncedUrlQuery = useRef<string | null>(null);
  
  // State variables
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [view, setView] = useState<"home" | "results" | "terminal">("home");
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [theme, setTheme] = useState<Theme>(() => getSavedTheme() ?? "light");
  const [searchTime, setSearchTime] = useState(0);
  const [liveQuery, setLiveQuery] = useState("");
  
  // People Also Ask Accordion States
  const [paaOpen, setPaaOpen] = useState<Record<number, boolean>>({
    0: false,
    1: false,
    2: false,
    3: false
  });

  // Handle keypresses for terminal shortcut (Esc exits, ~ enters terminal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && view === "terminal") {
        setView("results");
      }
      if (e.key === "`") {
        setView(prev => prev === "terminal" ? "results" : "terminal");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [view]);

  // Sync the DOM class with the current React theme state.
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const updatePointer = (event: PointerEvent) => {
      document.body.style.setProperty("--cursor-x", `${event.clientX}px`);
      document.body.style.setProperty("--cursor-y", `${event.clientY}px`);
    };
    window.addEventListener("pointermove", updatePointer, { passive: true });
    return () => window.removeEventListener("pointermove", updatePointer);
  }, []);

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    persistTheme(newTheme);
    applyTheme(newTheme);
  };

  const handleSearch = useCallback((q: string) => {
    const startTime = performance.now();
    setQuery(q);
    setLiveQuery(q);
    lastSyncedUrlQuery.current = q;

    const params = new URLSearchParams();
    params.set("q", q);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });

    const results = runSearch(q);
    
    // If query is "enable terminal mode", enter terminal view
    if (results.intent === "TERMINAL") {
      setView("terminal");
      return;
    }

    setSearchResult(results);
    
    // Determine the active tab based on query intent
    if (results.intent === "PROJECTS") setActiveTab("projects");
    else if (results.intent === "EXPERIENCE" || results.intent === "TIMELINE") setActiveTab("experience");
    else if (results.intent === "SKILLS") setActiveTab("skills");
    else if (results.intent === "ABOUT") setActiveTab("about");
    else setActiveTab("all");

    setView("results");
    
    // Measure fake search latency
    const endTime = performance.now();
    setSearchTime(Number(((endTime - startTime) / 100).toFixed(2)) + 0.02);
  }, [pathname, router]);

  const resetSearch = useCallback(() => {
    setQuery("");
    setLiveQuery("");
    setSearchResult(null);
    setView("home");
    setActiveTab("all");
    lastSyncedUrlQuery.current = null;
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  // Handle URL query parameters (depend on string value, not searchParams object)
  useEffect(() => {
    if (!urlQuery) {
      lastSyncedUrlQuery.current = null;
      return;
    }
    if (lastSyncedUrlQuery.current === urlQuery) return;
    handleSearch(urlQuery);
  }, [urlQuery, handleSearch]);

  const togglePaa = (idx: number) => {
    setPaaOpen(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleLucky = () => {
    // Choose a random interesting suggestion
    const luckySuggestions = [
      "roast my code",
      "favorite tech stack",
      "Amazon HackOn",
      "ReVault encrypted marketplace",
      "plant disease ConvNeXt research",
      "hire agamjot"
    ];
    const rand = luckySuggestions[Math.floor(Math.random() * luckySuggestions.length)];
    handleSearch(rand);
  };

  // People Also Ask dataset
  const paaQuestions = [
    {
      q: "What is Agamjot's primary programming stack?",
      a: "Python and PyTorch for ML research (ConvNeXt, contrastive learning), plus JavaScript/React, Flutter, FastAPI, and SQL for full-stack apps. He has solved 300+ DSA problems on LeetCode and GeeksforGeeks."
    },
    {
      q: "Where is Agamjot studying?",
      a: "He is pursuing a B.Tech in Information Technology at Manipal Institute of Technology, Karnataka (GPA 7.99), graduating May 2027. He completed Class XII (90%) at S.S. Mota Singh Sr. Sec. Model School, Delhi."
    },
    {
      q: "Why should we hire Agamjot?",
      a: "He ships end-to-end: ML research with published-level rigor, secure backends (AES/RSA in ReVault), and user-facing apps (Streamlit, Flutter). Top 75 in Amazon HackOn (52k+ entrants) and SIH 2025 national waitlist."
    },
    {
      q: "How do I download Agamjot's resume?",
      a: "Search 'resume' or 'download cv', or use the Resume button in the sidebar. Place your PDF at public/resume.pdf if you are the site owner."
    }
  ];

  // Rendering conditions
  if (view === "terminal") {
    return <TerminalMode onExit={() => setView("results")} />;
  }

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden bg-theme-main text-theme-primary transition-colors duration-300">
      <AmbientBackground />
      {/* 1. HOMEPAGE VIEW */}
      {view === "home" && (
        <>
        <StarBackground />
        <GoogleAppsMenu onNavigate={handleSearch} />
        <motion.main
          className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-[12vh] pb-24"
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <motion.div
            className="mb-6"
            onClick={resetSearch}
            role="presentation"
            layoutId="portfolio-logo"
          >
            <GoogleLogo size="lg" interactive={true} />
          </motion.div>

          <motion.div layoutId="portfolio-search" className="w-full max-w-[584px]">
            <SearchBox onSearch={handleSearch} onQueryChange={setLiveQuery} variant="home" />
          </motion.div>

          <div className="mt-4 w-full max-w-[584px]">
            <PredictivePreview query={liveQuery} onSearch={handleSearch} />
          </div>

          <motion.div
            className="flex items-center justify-center gap-3 mt-[30px]"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <button type="button" onClick={() => handleSearch(query || "about")} className="google-btn">
              Google Search
            </button>
            <button type="button" onClick={handleLucky} className="google-btn">
              I&apos;m Feeling Lucky
            </button>
          </motion.div>

          <div className="mt-10 flex flex-wrap justify-center gap-x-3 gap-y-1 text-sm text-theme-secondary">
            <button type="button" onClick={() => handleSearch("about")} className="hover:underline">
              About
            </button>
            <span className="text-theme-tertiary">·</span>
            <button type="button" onClick={() => handleSearch("projects")} className="hover:underline">
              Projects
            </button>
            <span className="text-theme-tertiary">·</span>
            <button type="button" onClick={() => handleSearch("skills")} className="hover:underline">
              Skills
            </button>
            <span className="text-theme-tertiary">·</span>
            <button type="button" onClick={() => handleSearch("contact")} className="hover:underline">
              Contact
            </button>
            <span className="text-theme-tertiary">·</span>
            <button type="button" onClick={() => setView("terminal")} className="hover:underline">
              Terminal
            </button>
          </div>

          <div className="fixed bottom-0 left-0 right-0 flex items-center justify-end gap-4 px-6 py-3 text-xs text-theme-tertiary">
            <button
              type="button"
              onClick={() => changeTheme("light")}
              className={theme === "light" ? "text-theme-primary underline" : "hover:underline"}
            >
              Light
            </button>
            <button
              type="button"
              onClick={() => changeTheme("dark")}
              className={theme === "dark" ? "text-theme-primary underline" : "hover:underline"}
            >
              Dark
            </button>
          </div>
        </motion.main>
        </>
      )}

      {/* 2. RESULTS VIEW */}
      {view === "results" && (
        <motion.main
          className="relative z-10 flex-1 flex flex-col bg-theme-main/90 backdrop-blur-[2px]"
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        >
          {/* Top Bar Header */}
          <header className="border-b border-theme-custom bg-theme-main py-3 px-4 md:px-[180px] flex flex-col md:flex-row md:items-center gap-3 sticky top-0 z-30">
            <div className="flex items-center justify-between gap-4">
              {/* Colored Logo */}
              <motion.div onClick={resetSearch} layoutId="portfolio-logo">
                <GoogleLogo size="sm" interactive={true} />
              </motion.div>

              <div className="flex md:hidden items-center gap-2" />
            </div>

            {/* Input Search Box */}
            <motion.div layoutId="portfolio-search" className="flex-1 max-w-xl md:ml-4">
              <SearchBox
                key={query}
                initialValue={query}
                onSearch={handleSearch}
                onQueryChange={setLiveQuery}
                variant="top"
              />
            </motion.div>

            {/* Settings dropdown */}
            <div className="hidden md:flex items-center gap-2 ml-auto">
              <GoogleAppsMenu onNavigate={handleSearch} />
              <button
                type="button"
                onClick={() => changeTheme(theme === "light" ? "dark" : "light")}
                className="p-2 text-theme-secondary hover:bg-theme-elevated rounded-full transition-colors"
                title={theme === "light" ? "Dark theme" : "Light theme"}
                aria-label="Toggle theme"
              >
                {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
            </div>
          </header>

          {/* Google Search Tabs */}
          <nav className="border-b border-theme-custom bg-theme-main px-4 md:px-[180px] flex gap-8 overflow-x-auto scrollbar-none">
            {(
              [
                { id: "all" as const, label: "All", icon: Search },
                { id: "projects" as const, label: "Projects", icon: Code },
                { id: "experience" as const, label: "Experience", icon: Briefcase },
                { id: "skills" as const, label: "Skills", icon: Award },
                { id: "about" as const, label: "About", icon: User },
              ] as const
            ).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`google-tab flex items-center gap-1.5 whitespace-nowrap ${activeTab === id ? "is-active" : ""}`}
              >
                <Icon className="w-4 h-4 opacity-70" /> {label}
              </button>
            ))}
          </nav>

          {/* Results Main Area */}
          <motion.div
            className="flex-1 w-full mx-auto px-4 md:px-[180px] py-5 grid grid-cols-1 lg:grid-cols-12 gap-10"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08 } },
            }}
          >
            {/* Left Column: Search results */}
            <motion.div
              className="lg:col-span-8 space-y-6"
              variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
            >
              {/* Statistics */}
              <div className="text-sm text-theme-tertiary">
                About {searchResult?.generalResults.length || 0} results ({searchTime} seconds)
              </div>

              {/* A. Featured Snippet (if active tab is all/about and snippet matches) */}
              {activeTab === "all" && searchResult?.featuredSnippet && (
                <SnippetView snippet={searchResult.featuredSnippet} onQueryChange={handleSearch} />
              )}

              {/* B. Tab-Specific Rendering */}

              {/* 1. Projects Tab */}
              {activeTab === "projects" && (
                <div className="space-y-4">
                  <h3 className="text-sm text-theme-secondary pb-2">Projects</h3>
                  {searchResult?.projects && searchResult.projects.length > 0 ? (
                    searchResult.projects.map((p) => (
                      <ProjectCard key={p.id} project={p} />
                    ))
                  ) : (
                    projects.map((p) => <ProjectCard key={p.id} project={p} />)
                  )}
                </div>
              )}

              {/* 2. Experience Tab */}
              {activeTab === "experience" && (
                <ExperienceTimeline />
              )}

              {/* 3. Skills Tab */}
              {activeTab === "skills" && (
                <SkillsGrid />
              )}

              {/* 4. About Tab */}
              {activeTab === "about" && (
                <div className="space-y-6 max-w-3xl">
                  <div className="flex flex-col md:flex-row items-center gap-6 border-b border-theme-custom pb-6">
                    <img
                      src={bio.avatar}
                      alt={bio.name}
                      className="w-32 h-32 rounded-2xl border-4 border-theme-custom object-cover shadow-lg"
                    />
                    <div className="space-y-2 text-center md:text-left">
                      <h3 className="text-2xl font-normal text-theme-primary">{bio.name}</h3>
                      <p className="text-theme-secondary">{bio.title}</p>
                      <p className="text-sm text-theme-muted">{bio.location}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-sm text-theme-secondary">About</h4>
                    <p className="text-sm text-theme-primary leading-relaxed">{bio.aboutLong}</p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm text-theme-secondary">Highlights</h4>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-theme-primary">
                      {bio.strengths.map((str, idx) => (
                        <li key={idx}>{str}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* 5. General Web Search Results (Fallback when activeTab is all) */}
              {activeTab === "all" && (
                <div className="space-y-6">
                  {/* People Also Ask Block */}
                  <div className="google-paa google-panel max-w-[652px]">
                    <h4 className="text-sm text-theme-primary px-4 pt-4 pb-2">People also ask</h4>
                    <div className="divide-y divide-[var(--border-light)]">
                      {paaQuestions.map((paa, idx) => (
                        <div key={idx}>
                          <button
                            type="button"
                            onClick={() => togglePaa(idx)}
                            className="w-full flex justify-between items-center px-4 py-3.5 text-left text-sm text-theme-primary hover:bg-theme-elevated transition-colors"
                          >
                            <span>{paa.q}</span>
                            {paaOpen[idx] ? <ChevronUp className="w-5 h-5 text-theme-secondary shrink-0" /> : <ChevronDown className="w-5 h-5 text-theme-secondary shrink-0" />}
                          </button>
                          {paaOpen[idx] && (
                            <div className="px-4 pb-4 text-sm text-theme-secondary leading-relaxed">
                              {paa.a}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Standard Search Cards */}
                  <div className="space-y-4">
                    <h4 className="sr-only">Search results</h4>
                    
                    {searchResult?.generalResults && searchResult.generalResults.length > 0 ? (
                      searchResult.generalResults.map((res, idx) => {
                        let linkUrl = "#";
                        if (res.type === "project") linkUrl = res.data.github;
                        else if (res.type === "experience") linkUrl = bio.linkedin;
                        else if (res.type === "bio") linkUrl = bio.linkedin;

                        return (
                          <div key={idx} className="max-w-[600px] space-y-1 mb-7">
                            <div className="google-breadcrumb flex items-center gap-1 text-sm">
                              <span className="text-theme-secondary">Agamjot Singh</span>
                              <span className="text-theme-tertiary">›</span>
                              <span className="text-theme-secondary capitalize">{res.type}</span>
                            </div>
                            <a
                              href={linkUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="google-result-title block"
                            >
                              {res.title}
                            </a>
                            <p className="text-sm text-theme-secondary leading-snug line-clamp-2">
                              {res.description}
                            </p>
                          </div>
                        );
                      })
                    ) : (
                      // Default fallback: show projects
                      projects.map((p) => <ProjectCard key={p.id} project={p} />)
                    )}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Right Column: Knowledge Graph Card (Google-style sidebar) */}
            <motion.div
              className="lg:col-span-4 space-y-6"
              variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
            >
              <div className="google-panel p-4 space-y-4">
                {/* Photo & Name */}
                <div className="flex gap-4 items-center">
                  <img
                    src={bio.avatar}
                    alt={bio.name}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-theme-custom"
                  />
                  <div>
                    <h3 className="text-xl font-normal text-theme-primary">{bio.name}</h3>
                    <p className="text-sm text-theme-secondary mt-0.5">{bio.title}</p>
                  </div>
                </div>

                <p className="text-xs text-theme-primary leading-relaxed border-t border-theme-custom pt-4">
                  {bio.summary}
                </p>

                {/* Direct info list */}
                <div className="space-y-3 text-xs border-t border-theme-custom pt-4">
                  <div>
                    <span className="text-theme-muted font-semibold">Location: </span>
                    <span className="text-theme-primary">{bio.location}</span>
                  </div>
                  <div>
                    <span className="text-theme-muted font-semibold">Education: </span>
                    <span className="text-theme-primary">{education[0].institution}</span>
                  </div>
                  <div>
                    <span className="text-theme-muted font-semibold">Primary Focus: </span>
                    <span className="text-theme-primary">ML research, NLP, secure backends, Flutter & React</span>
                  </div>
                  <div>
                    <span className="text-theme-muted font-semibold">GitHub: </span>
                    <a href={bio.github} target="_blank" rel="noopener noreferrer" className="text-google-link hover:underline">
                      {bio.github.replace("https://", "")}
                    </a>
                  </div>
                  <div>
                    <span className="text-theme-muted font-semibold">LinkedIn: </span>
                    <a href={bio.linkedin} target="_blank" rel="noopener noreferrer" className="text-google-link hover:underline">
                      {bio.linkedin.replace("https://www.", "")}
                    </a>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-2 border-t border-theme-custom pt-4">
                  <a
                    href={`mailto:${bio.email}`}
                    className="google-btn flex items-center justify-center gap-1.5 text-xs no-underline"
                  >
                    <Mail className="w-3.5 h-3.5" /> Email
                  </a>
                  <a
                    href={bio.resumeUrl}
                    download
                    className="google-btn flex items-center justify-center gap-1.5 text-xs no-underline"
                  >
                    <FileText className="w-3.5 h-3.5" /> Resume
                  </a>
                </div>
              </div>

              {/* Related Searches */}
              <div className="google-panel p-4 space-y-3">
                <h4 className="text-sm text-theme-secondary">Related searches</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <button
                    type="button"
                    onClick={() => handleSearch("Amazon HackOn")}
                    className="p-3 rounded-lg border border-theme-custom text-left text-google-link hover:bg-theme-elevated transition-colors"
                  >
                    Amazon HackOn
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSearch("ConvNeXt PyTorch")}
                    className="p-3 rounded-lg border border-theme-custom text-left text-google-link hover:bg-theme-elevated transition-colors"
                  >
                    ConvNeXt PyTorch
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSearch("roast my code")}
                    className="p-3 rounded-lg border border-theme-custom text-left text-google-link hover:bg-theme-elevated transition-colors"
                  >
                    roast my code
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSearch("terminal mode")}
                    className="p-3 rounded-lg border border-theme-custom text-left text-google-link hover:bg-theme-elevated transition-colors"
                  >
                    terminal mode
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Footer */}
          <footer className="bg-theme-footer border-t border-theme-custom mt-auto py-4 px-8 md:px-[180px] text-xs text-theme-tertiary flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap justify-center gap-4">
              <span>India</span>
              <span>Manipal, Karnataka</span>
              <span className="cursor-pointer hover:underline">Update location</span>
            </div>
            <div>&copy; {new Date().getFullYear()} Agamjot Singh</div>
          </footer>
        </motion.main>
      )}

    </div>
  );
}

export default function SearchController() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-theme-main flex items-center justify-center text-theme-secondary">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-2 border-theme-custom border-t-theme-accent rounded-full mx-auto" />
          <p className="text-sm">Loading...</p>
        </div>
      </div>
    }>
      <SearchControllerContent />
    </Suspense>
  );
}

