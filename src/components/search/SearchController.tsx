"use client";

import React, { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { runSearch, SearchResult } from "@/lib/search-engine";
import { applyTheme, DEFAULT_THEME, getSavedTheme, persistTheme, type Theme } from "@/lib/theme";
import { bio, projects, education } from "@/data/portfolioData";
import GoogleLogo from "../ui/GoogleLogo";
import SearchBox from "./SearchBox";
import PredictivePreview from "./PredictivePreview";
import SnippetView from "../results/SnippetView";
import ProjectCard from "../results/ProjectCard";
import ExperienceTimeline from "../results/ExperienceTimeline";
import SkillsGrid from "../results/SkillsGrid";
import TerminalMode from "../results/TerminalMode";
import DotField from "../ui/DotField";
import GoogleAppsMenu from "../ui/GoogleAppsMenu";
import ThemeSwitcher from "../ui/ThemeSwitcher";
import LogoLoop from "../ui/LogoLoop";
import BorderGlow from "../ui/BorderGlow";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LogoLoopAny = LogoLoop as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BorderGlowAny = BorderGlow as any;
import {
  SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiNodedotjs,
  SiMongodb, SiPostgresql, SiPython, SiGit, SiExpress,
} from "react-icons/si";
import {
  Search, Code, Briefcase, Award, User, Handshake,
  ChevronDown, ChevronUp, Mail, FileText, Phone, MapPin,
} from "lucide-react";
import { Github, Linkedin } from "../ui/BrandIcons";

type TabType = "all" | "projects" | "experience" | "skills" | "about" | "hire";

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
  const [theme, setTheme] = useState<Theme>(() => getSavedTheme() ?? DEFAULT_THEME);
  const [searchTime, setSearchTime] = useState(0);
  const [liveQuery, setLiveQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Track scroll for floating pill header
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
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
      a: "He primarily works with the MERN stack — MongoDB, Express.js, React, and Node.js — for building full-stack web applications. He also uses PostgreSQL for relational database design, FastAPI for AI services, and Python/PyTorch for ML work, with 300+ DSA problems solved across LeetCode and GeeksforGeeks."
    },
    {
      q: "Where is Agamjot studying?",
      a: "He is pursuing a B.Tech in Information Technology at Manipal Institute of Technology, Karnataka (GPA 7.99), graduating May 2027. He completed Class XII (90%) at S.S. Mota Singh Sr. Sec. Model School, Delhi."
    },
    {
      q: "Why should we hire Agamjot?",
      a: "He is the best trust me I am google..jk. He ships end-to-end: MERN products, PostgreSQL/MongoDB data layers, secure backend systems, and ML research with published-level rigor. Top 75 in Amazon HackOn (52k+ entrants), SIH 2025 national waitlist, and targeting SDE internships."
    },
    {
      q: "How do I download Agamjot's resume?",
      a: "Search 'resume' or 'download cv', or use the Resume button in the sidebar to open the PDF."
    }
  ];

  // Rendering conditions
  if (view === "terminal") {
    return <TerminalMode onExit={() => setView("results")} />;
  }

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden bg-theme-main text-theme-primary transition-colors duration-300">
      {/* DotField background — fixed, full-screen, behind all content */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <DotField
          dotRadius={3}
          dotSpacing={35}
          bulgeStrength={67}
          glowRadius={160}
          sparkle={false}
          waveAmplitude={0}
        />
      </div>
      {/* 1. HOMEPAGE VIEW */}
      {view === "home" && (
        <>
        
        <GoogleAppsMenu onNavigate={handleSearch} />
        <motion.main
          className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-[12vh] pb-24"
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <motion.div
            className="mb-4"
            onClick={resetSearch}
            role="presentation"
            layoutId="portfolio-logo"
          >
            <GoogleLogo size="lg" interactive={true} />
          </motion.div>

          {/* Tech stack logo loop — same width as search bar */}
          <div className="w-full max-w-[584px] mb-4 overflow-hidden">
            <LogoLoopAny
              logos={[
                { node: <SiReact />,      title: "React",      href: "https://react.dev" },
                { node: <SiNextdotjs />,  title: "Next.js",    href: "https://nextjs.org" },
                { node: <SiTypescript />, title: "TypeScript", href: "https://www.typescriptlang.org" },
                { node: <SiTailwindcss />,title: "Tailwind",   href: "https://tailwindcss.com" },
                { node: <SiNodedotjs />,  title: "Node.js",    href: "https://nodejs.org" },
                { node: <SiMongodb />,    title: "MongoDB",    href: "https://mongodb.com" },
                { node: <SiPostgresql />, title: "PostgreSQL", href: "https://postgresql.org" },
                { node: <SiPython />,     title: "Python",     href: "https://python.org" },
                { node: <SiGit />,        title: "Git",        href: "https://git-scm.com" },
                { node: <SiExpress />,    title: "Express",    href: "https://expressjs.com" },
              ]}
              speed={60}
              direction="left"
              logoHeight={20}
              gap={36}
              hoverSpeed={0}
              fadeOut
              scaleOnHover
              ariaLabel="Tech stack"
              style={{ color: "var(--text-tertiary)" }}
            />
          </div>

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

          <div className="fixed bottom-0 left-0 right-0 flex items-center justify-end gap-4 px-6 py-4 text-xs text-theme-tertiary">
            <ThemeSwitcher theme={theme} onChange={changeTheme} />
          </div>
        </motion.main>
        </>
      )}

      {/* 2. RESULTS VIEW */}
      {view === "results" && (
        <>
          {/* Top Bar Header — fixed at top */}
          <header className="fixed top-0 left-0 right-0 z-30 border-b border-theme-custom bg-theme-main py-3 px-4 md:px-[180px] flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex items-center justify-between gap-4">
              <motion.div onClick={resetSearch} layoutId="portfolio-logo">
                <GoogleLogo size="sm" interactive={true} />
              </motion.div>
              <div className="flex md:hidden items-center gap-2" />
            </div>

            <motion.div layoutId="portfolio-search" className="flex-1 max-w-xl md:ml-4">
              <SearchBox
                key={query}
                initialValue={query}
                onSearch={handleSearch}
                onQueryChange={setLiveQuery}
                variant="top"
              />
            </motion.div>

            <div className="hidden md:flex items-center gap-2 ml-auto">
              <GoogleAppsMenu onNavigate={handleSearch} />
              <ThemeSwitcher theme={theme} onChange={changeTheme} compact />
            </div>
          </header>

          {/* Tabs Nav — fixed below header, morphs into pill on scroll */}
          <div className={`fixed left-0 right-0 z-20 flex justify-center transition-all duration-500 ease-in-out ${
            isScrolled ? "top-[108px] md:top-[57px] px-4 py-2" : "top-[108px] md:top-[57px] px-0 py-0"
          }`}>
            <nav className={`flex overflow-x-auto scrollbar-none transition-all duration-500 ease-in-out ${
              isScrolled
                ? "navbar-pill rounded-full px-4 py-1 gap-1"
                : "navbar-flat w-full border-b border-theme-custom px-4 md:px-[180px] gap-8 justify-center"
            }`}>
              {(
                [
                  { id: "all" as const, label: "All", icon: Search },
                  { id: "projects" as const, label: "Projects", icon: Code },
                  { id: "experience" as const, label: "Experience", icon: Briefcase },
                  { id: "skills" as const, label: "Skills", icon: Award },
                  { id: "about" as const, label: "About", icon: User },
                  { id: "hire" as const, label: "Hire", icon: Handshake },
                ] as const
              ).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => id === "hire" ? setActiveTab("hire") : setActiveTab(id)}
                  className={`google-tab flex items-center gap-1.5 whitespace-nowrap ${activeTab === id ? "is-active" : ""}`}
                >
                  <Icon className="w-4 h-4 opacity-70" /> {label}
                </button>
              ))}
            </nav>
          </div>

        <motion.main
          className="relative z-10 flex-1 flex flex-col bg-theme-main/90 backdrop-blur-[2px] pt-[170px] md:pt-[120px]"
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        >
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

              {/* 5. Hire Tab */}
              {activeTab === "hire" && (
                <div className="space-y-6 max-w-2xl">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-normal text-theme-primary">Want to hire Agamjot?</h3>
                    <p className="text-sm text-theme-secondary leading-relaxed">
                      You made the right decision :)
Looking for SDE internships where I can build scalable products, work on solid backend systems, and experiment with AI-powered experiences.                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Contact details */}
                    <div className="google-panel p-4 space-y-3">
                      <h4 className="text-xs font-bold text-theme-muted uppercase tracking-wider">Direct contact</h4>
                      <div className="space-y-3">
                        <a href={`mailto:${bio.email}`} className="flex items-center gap-3 text-sm text-theme-primary hover:text-google-link transition-colors group">
                          <Mail className="w-4 h-4 text-theme-accent shrink-0" />
                          <span className="group-hover:underline">{bio.email}</span>
                        </a>
                        <div className="flex items-center gap-3 text-sm text-theme-primary">
                          <Phone className="w-4 h-4 text-theme-accent shrink-0" />
                          <span>{bio.phone}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-theme-primary">
                          <MapPin className="w-4 h-4 text-theme-accent shrink-0" />
                          <span>{bio.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Social + Resume */}
                    <div className="google-panel p-4 space-y-3">
                      <h4 className="text-xs font-bold text-theme-muted uppercase tracking-wider">Profiles & Resume</h4>
                      <div className="flex flex-col gap-2">
                        <a href={bio.linkedin} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 py-2 px-3 rounded-lg bg-theme-elevated hover:bg-theme-card transition-colors text-sm text-theme-primary font-medium border border-theme-custom">
                          <Linkedin className="w-4 h-4 text-google-link" /> LinkedIn
                        </a>
                        <a href={bio.github} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 py-2 px-3 rounded-lg bg-theme-elevated hover:bg-theme-card transition-colors text-sm text-theme-primary font-medium border border-theme-custom">
                          <Github className="w-4 h-4" /> GitHub
                        </a>
                        <a href={bio.resumeUrl} download
                          className="google-btn flex items-center justify-center gap-2 text-sm no-underline mt-1">
                          <FileText className="w-4 h-4" /> Download Resume
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Why hire */}
                  <div className="google-panel p-4 space-y-3">
                    <h4 className="text-xs font-bold text-theme-muted uppercase tracking-wider">Why Agamjot?</h4>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-theme-primary">
                      {bio.strengths.map((str, idx) => (
                        <li key={idx} className="leading-relaxed">{str}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* 6. General Web Search Results (Fallback when activeTab is all) */}
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
                        if (res.type === "project") linkUrl = `/projects/${res.data.id}`;
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
              <BorderGlowAny
                edgeSensitivity={25}
                glowColor="260 60 70"
                backgroundColor="var(--bg-card)"
                borderRadius={8}
                glowRadius={32}
                glowIntensity={0.9}
                coneSpread={20}
                animated
                colors={['#a78bfa', '#818cf8', '#38bdf8']}
              >
              <div className="p-4 space-y-4">
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
                    <span className="text-theme-primary">MERN stack, PostgreSQL, secure backends, ML research</span>
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
              </BorderGlowAny>

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
        </>
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

