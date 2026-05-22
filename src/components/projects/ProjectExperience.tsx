"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Bot,
  Brain,
  ChevronRight,
  Database,
  ExternalLink,
  Eye,
  Gauge,
  Layers3,
  LockKeyhole,
  Play,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import type { Project } from "@/data/portfolioData";
import { projects } from "@/data/portfolioData";
import { Github } from "@/components/ui/BrandIcons";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import { applyTheme, DEFAULT_THEME, getSavedTheme, persistTheme, type Theme } from "@/lib/theme";

interface ProjectExperienceProps {
  project: Project;
}

type IconComponent = typeof Brain;

interface StackCard {
  name: string;
  logo: string;
  why: string;
  role: string;
  benefit: string;
}

interface ArchNode {
  id: string;
  label: string;
  detail: string;
  icon: IconComponent;
  x: number;
  y: number;
  group: "interface" | "logic" | "data" | "intelligence";
  links: string[];
}

const reveal = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const techCopy: Record<string, Omit<StackCard, "name">> = {
  Python: {
    logo: "Py",
    why: "Fast iteration across APIs, data processing, and ML orchestration.",
    role: "Owns pipeline logic, integrations, and backend computation.",
    benefit: "Keeps product experiments close to production logic.",
  },
  Streamlit: {
    logo: "St",
    why: "Ideal for turning NLP pipelines into demo-ready operator tools.",
    role: "Powers the transcript analysis command surface.",
    benefit: "Cuts UI build time while preserving interactive feedback loops.",
  },
  Pydantic: {
    logo: "PyD",
    why: "Typed validation keeps API contracts explicit around AI outputs.",
    role: "Validates request and response models across FastAPI routes.",
    benefit: "Reduces malformed payloads and makes docs clearer.",
  },
  "Llama3-8b": {
    logo: "L3",
    why: "Balances reasoning quality with fast, cost-effective inference.",
    role: "Runs sentiment, intent, generation, summaries, and transcript Q&A.",
    benefit: "Supports multiple NLP jobs behind one model interface.",
  },
  React: {
    logo: "Re",
    why: "Component architecture fits marketplace flows and admin surfaces.",
    role: "Builds listing, browsing, filtering, and dashboard screens.",
    benefit: "Keeps the UI modular as trust workflows expand.",
  },
  MongoDB: {
    logo: "MDB",
    why: "Flexible documents fit encrypted payloads and audit metadata.",
    role: "Stores users, assets, encrypted fields, status, and transaction records.",
    benefit: "Handles varied asset categories without rigid migrations.",
  },
  "AES-256-GCM": {
    logo: "AES",
    why: "Authenticated encryption protects credentials and detects tampering.",
    role: "Encrypts sensitive asset data before persistence.",
    benefit: "Combines confidentiality and integrity at the payload layer.",
  },
  "RSA-2048": {
    logo: "RSA",
    why: "Strong public-key encryption enables secure key transfer.",
    role: "Wraps per-asset AES keys for authorized decryption.",
    benefit: "Keeps plaintext access tied to approved parties.",
  },
  "SHA-256": {
    logo: "SHA",
    why: "Cryptographic hashes make asset changes detectable.",
    role: "Creates fingerprints for encrypted asset data.",
    benefit: "Gives buyers and admins a clear integrity check.",
  },
  JWT: {
    logo: "JWT",
    why: "Token auth keeps user and admin routes separated.",
    role: "Protects marketplace APIs and role-based operations.",
    benefit: "Makes sensitive admin workflows auditable and gated.",
  },
  "Web3.py": {
    logo: "W3",
    why: "Blockchain records add immutable transaction history.",
    role: "Connects asset verification and purchase records to chain events.",
    benefit: "Improves non-repudiation and auditability.",
  },
  NLP: {
    logo: "NLP",
    why: "Transforms noisy conversations into structured support signals.",
    role: "Extracts sentiment, urgency, intent, and summaries.",
    benefit: "Turns manual review into searchable operational intelligence.",
  },
  "Mistral AI": {
    logo: "Mi",
    why: "Strong language reasoning for summarization and classification.",
    role: "Handles high-level transcript interpretation.",
    benefit: "Improves insight quality without training a custom model.",
  },
  "Groq API": {
    logo: "Gq",
    why: "Low-latency inference keeps analysis feeling live.",
    role: "Accelerates LLM response generation.",
    benefit: "Makes the dashboard feel reactive instead of batch-driven.",
  },
  LLMs: {
    logo: "AI",
    why: "They capture nuance that keyword rules miss.",
    role: "Generate concise summaries and issue labels.",
    benefit: "Reduces repetitive transcript reading for support teams.",
  },
  FastAPI: {
    logo: "FA",
    why: "Typed, fast APIs with clean docs and Python-native security logic.",
    role: "Exposes upload, listing, transfer, and verification endpoints.",
    benefit: "Keeps marketplace flows auditable and easy to extend.",
  },
  MySQL: {
    logo: "SQL",
    why: "Relational integrity matters for ownership and transaction records.",
    role: "Stores listings, users, asset metadata, and transfer state.",
    benefit: "Makes secure resale workflows consistent and queryable.",
  },
  "AES-256": {
    logo: "AES",
    why: "Strong symmetric encryption for stored digital assets.",
    role: "Protects asset payloads before resale transfer.",
    benefit: "Limits exposure even if storage is inspected.",
  },
  RSA: {
    logo: "RSA",
    why: "Public-key exchange fits buyer-only decryption flows.",
    role: "Wraps keys so only the buyer can unlock assets.",
    benefit: "Separates marketplace trust from asset access.",
  },
  "REST APIs": {
    logo: "API",
    why: "Predictable endpoints keep clients and backend flows simple.",
    role: "Defines the product contract between UI and services.",
    benefit: "Easy to test, document, and integrate.",
  },
  Flutter: {
    logo: "Fl",
    why: "One codebase for polished mobile experiences across platforms.",
    role: "Builds the event and member app interface.",
    benefit: "Ships faster without splitting Android and iOS work.",
  },
  "Firebase Auth": {
    logo: "Auth",
    why: "Managed identity reduces security and account-management overhead.",
    role: "Handles secure login and session state.",
    benefit: "Lets the app focus on club operations, not auth plumbing.",
  },
  "Cloud Firestore": {
    logo: "DB",
    why: "Realtime documents match event/member collaboration flows.",
    role: "Stores events, members, updates, and live operational state.",
    benefit: "Keeps the UI fresh without building sync infrastructure.",
  },
  FCM: {
    logo: "FCM",
    why: "Reliable push delivery for time-sensitive club updates.",
    role: "Sends event reminders and member notifications.",
    benefit: "Improves participation without manual follow-up.",
  },
  Dart: {
    logo: "Da",
    why: "Flutter's language gives predictable UI and app logic.",
    role: "Implements client state, navigation, and feature behavior.",
    benefit: "Keeps mobile performance smooth on varied devices.",
  },
};

const fallbackTech = (name: string): StackCard => ({
  name,
  logo: name.slice(0, 3),
  why: "Chosen because it directly supports this product's delivery constraints.",
  role: "Fits into the project architecture as a focused capability layer.",
  benefit: "Keeps the system understandable while leaving room to scale.",
});

function getStack(project: Project): StackCard[] {
  return project.tech.map((name) => ({ name, ...(techCopy[name] ?? fallbackTech(name)) }));
}

function getArchitecture(project: Project): ArchNode[] {
  const isML = project.category === "ML/AI";
  const isMobile = project.tech.includes("Flutter");
  const isSecurity = project.tech.some((tech) => tech.includes("AES") || tech.includes("RSA"));
  const architecture = project.caseStudy?.architecture;

  return [
    {
      id: "interface",
      label: isMobile ? "Mobile command surface" : "Interactive project UI",
      detail: architecture?.interface ?? (isMobile
        ? "Touch-first workflows for events, members, and notifications."
        : "A focused interface that makes analysis and system actions visible."),
      icon: isMobile ? Smartphone : Layers3,
      x: 13,
      y: 42,
      group: "interface",
      links: ["orchestration", "auth"],
    },
    {
      id: "orchestration",
      label: isML ? "Analysis pipeline" : "API orchestration",
      detail: architecture?.orchestration ?? (isML
        ? "Routes transcript data through sentiment, urgency, classification, and summary passes."
        : "Coordinates listings, transfers, data reads, and client state changes."),
      icon: Workflow,
      x: 42,
      y: 26,
      group: "logic",
      links: ["data", "intelligence"],
    },
    {
      id: "auth",
      label: isSecurity ? "Buyer-only access" : "Identity layer",
      detail: architecture?.auth ?? (isSecurity
        ? "RSA exchange and role checks keep asset access tied to the verified buyer."
        : "Authentication protects user actions and personal operational data."),
      icon: isSecurity ? LockKeyhole : ShieldCheck,
      x: 42,
      y: 64,
      group: "logic",
      links: ["data"],
    },
    {
      id: "data",
      label: project.tech.includes("Cloud Firestore") ? "Realtime data store" : "Structured persistence",
      detail: architecture?.data ?? "Stores the durable project state that the interface and services depend on.",
      icon: Database,
      x: 70,
      y: 47,
      group: "data",
      links: ["intelligence"],
    },
    {
      id: "intelligence",
      label: isML ? "LLM intelligence layer" : "Decision and validation layer",
      detail: architecture?.intelligence ?? (isML
        ? "LLM providers transform raw transcripts into summaries, labels, and urgency signals."
        : "Business rules verify transfers, permissions, notifications, and final outcomes."),
      icon: isML ? Bot : Brain,
      x: 88,
      y: 34,
      group: "intelligence",
      links: [],
    },
  ];
}

function getJourney(project: Project) {
  if (project.caseStudy?.journey?.length) return project.caseStudy.journey;

  const ml = project.category === "ML/AI";
  const secure = project.tech.includes("AES-256");
  const mobile = project.tech.includes("Flutter");

  return [
    {
      phase: "Problem",
      title: ml ? "Manual review was too slow" : mobile ? "Club operations were scattered" : "Trust was the missing primitive",
      copy: ml
        ? "Support teams had transcript data, but not a fast way to convert it into decisions."
        : mobile
          ? "Events, reminders, and member updates needed one dependable interface."
          : "Digital resale needed secure ownership transfer without exposing the asset too early.",
    },
    {
      phase: "Research",
      title: "Mapped the highest-friction moments",
      copy: "The system was shaped around where users wait, repeat work, or lose confidence.",
    },
    {
      phase: "Failed attempts",
      title: "Avoided the overbuilt path",
      copy: "Early ideas leaned too heavy on generic dashboards; the final direction made the core workflow visible first.",
    },
    {
      phase: "Decisions",
      title: secure ? "Security became the architecture" : "Interaction became the architecture",
      copy: secure
        ? "Encryption, key exchange, and integrity checks were treated as product features, not backend details."
        : "The stack was selected to shorten the distance between data, feedback, and action.",
    },
    {
      phase: "Optimization",
      title: "Tuned for fast comprehension",
      copy: "The final surface prioritizes quick scanning, short feedback loops, and clear state transitions.",
    },
    {
      phase: "Outcome",
      title: project.metrics?.[0]?.value ? `${project.metrics[0].value} signal delivered` : "A sharper product loop",
      copy: project.description,
    },
  ];
}

function getGallery(project: Project) {
  const visual = project.screenshot ?? (project.id === "clubops" ? "/assets/public/images/project3.png" : project.id === "revault" ? "/assets/public/images/project2.png" : "/assets/public/images/project1.png");
  return [
    { title: "Product surface", image: visual },
    { title: "Architecture map", image: "/assets/public/images/devices.png" },
    { title: "Interaction flow", image: "/assets/public/images/readme.png" },
  ];
}

function percentFromMetric(value: string, index: number) {
  const match = value.match(/\d+/);
  if (!match) return index === 0 ? 82 : 68;
  const parsed = Number(match[0]);
  if (value.includes("%")) return Math.min(parsed, 98);
  if (parsed > 1000) return 92;
  if (parsed > 100) return 86;
  return Math.min(Math.max(parsed, 42), 96);
}

function codePanels(project: Project) {
  const isML = project.category === "ML/AI";
  const isMobile = project.tech.includes("Flutter");
  const isSecurity = project.tech.includes("AES-256");

  const fallback = {
    frontend: isMobile
      ? "StreamBuilder<QuerySnapshot>(\n  stream: eventsRef.snapshots(),\n  builder: (_, snapshot) => EventTimeline(\n    events: snapshot.data?.docs ?? [],\n  ),\n);"
      : "const insight = await analyzeTranscript(file);\nsetPanels((current) => hydrateDashboard(current, insight));\ntrackLatency(insight.provider, insight.elapsedMs);",
    backend: isSecurity
      ? "ciphertext = aes256.encrypt(asset_bytes, content_key)\nwrapped_key = rsa.encrypt(content_key, buyer_public_key)\nsignature = sha256.sign(ciphertext, seller_private_key)"
      : "router.post('/analyze', async (transcript) => {\n  const signals = await runPipeline(transcript)\n  return normalizeResponse(signals)\n})",
    data: isMobile
      ? "events/{eventId}\n  title, date, ownerId, attendees[]\nmembers/{memberId}\n  role, deviceToken, notificationPrefs"
      : "projects\n  id, owner, status, created_at\nanalysis_runs\n  project_id, provider, confidence, latency_ms",
    intelligence: isML
      ? "summary = llm.summarize(transcript)\nurgency = classifier.score(transcript)\nissue = router.classify(transcript, labels)"
      : "policy = verifyOwnership(listing, buyer)\nif policy.allowed:\n  createTransferReceipt(listing, buyer)",
  };

  return { ...fallback, ...project.caseStudy?.code };
}

function DetailButton({ children, href, primary = false }: { children: React.ReactNode; href: string; primary?: boolean }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={[
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition",
        primary
          ? "bg-white text-[#0b0f19] shadow-[0_0_34px_rgba(138,180,248,0.28)]"
          : "border border-white/15 bg-white/[0.06] text-white hover:border-[#8ab4f8]/55",
      ].join(" ")}
    >
      {children}
    </motion.a>
  );
}

function SectionTitle({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <motion.div
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="mx-auto mb-8 max-w-3xl text-center"
    >
      <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#8ab4f8]">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold leading-tight text-white md:text-5xl">{title}</h2>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[#9ca3af] md:text-base">{copy}</p>
    </motion.div>
  );
}

export default function ProjectExperience({ project }: ProjectExperienceProps) {
  const [theme, setTheme] = useState<Theme>(() => getSavedTheme() ?? DEFAULT_THEME);
  const [activeNode, setActiveNode] = useState("orchestration");
  const [activeFeature, setActiveFeature] = useState(project.keyFeatures[0] ?? "");
  const [activeCode, setActiveCode] = useState<keyof ReturnType<typeof codePanels>>("frontend");
  const [galleryItem, setGalleryItem] = useState<null | { title: string; image: string }>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 20 });
  const heroRotateX = useTransform(smoothY, [-0.5, 0.5], [5, -5]);
  const heroRotateY = useTransform(smoothX, [-0.5, 0.5], [-7, 7]);
  const heroTextX = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);

  const stack = useMemo(() => getStack(project), [project]);
  const architecture = useMemo(() => getArchitecture(project), [project]);
  const journey = useMemo(() => getJourney(project), [project]);
  const gallery = useMemo(() => getGallery(project), [project]);
  const panels = useMemo(() => codePanels(project), [project]);
  const related = useMemo(() => projects.filter((item) => item.id !== project.id).slice(0, 3), [project.id]);
  const activeArchNode = architecture.find((node) => node.id === activeNode) ?? architecture[0];

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    persistTheme(newTheme);
    applyTheme(newTheme);
  };

  const handleHeroMove = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <main
      onMouseMove={(event) => {
        document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
        document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);
      }}
      className="project-experience relative min-h-screen overflow-hidden bg-[var(--project-bg)] text-[var(--project-text)] transition-colors duration-500"
    >
      <div className="pointer-events-none fixed inset-0 z-0">
        <motion.div
          className="absolute inset-0 opacity-80"
          animate={{ backgroundPosition: ["0% 0%", "100% 70%", "0% 0%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{
            background:
              "radial-gradient(circle at 20% 20%, var(--project-glow), transparent 28%), radial-gradient(circle at 78% 10%, color-mix(in srgb, var(--project-accent) 10%, transparent), transparent 24%), radial-gradient(circle at 72% 78%, color-mix(in srgb, var(--project-text) 7%, transparent), transparent 30%)",
            backgroundSize: "120% 120%",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(color-mix(in_srgb,var(--project-accent)_10%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_srgb,var(--project-accent)_10%,transparent)_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(circle_at_50%_22%,black,transparent_72%)]" />
        {Array.from({ length: 22 }).map((_, index) => (
          <motion.span
            key={index}
            className="absolute h-1 w-1 rounded-full bg-[var(--project-accent)] shadow-[0_0_18px_var(--project-glow)]"
            style={{ left: `${(index * 37) % 100}%`, top: `${(index * 19) % 100}%` }}
            animate={{ opacity: [0.2, 0.9, 0.2], y: [0, -18, 0] }}
            transition={{ duration: 4 + (index % 5), repeat: Infinity, delay: index * 0.13 }}
          />
        ))}
      </div>

      <motion.div
        className="pointer-events-none fixed inset-0 z-10 bg-[#0b0f19]"
        initial={{ opacity: 1, backdropFilter: "blur(18px)" }}
        animate={{ opacity: 0, backdropFilter: "blur(0px)" }}
        transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="relative z-20">
        <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">
          <Link
            href="/search?q=projects"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-[#dbeafe] backdrop-blur transition hover:border-[#8ab4f8]/55"
          >
            <ArrowLeft className="h-4 w-4" />
            Search results
          </Link>
          <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs uppercase tracking-[0.22em] text-[#9ca3af] sm:flex">
            <Activity className="h-3.5 w-3.5 text-[#8ab4f8]" />
            Case study OS
          </div>
          <ThemeSwitcher theme={theme} onChange={changeTheme} compact />
          </div>
        </header>

        <section
          onMouseMove={handleHeroMove}
          onMouseLeave={() => {
            mouseX.set(0);
            mouseY.set(0);
          }}
          className="mx-auto grid min-h-[calc(100vh-84px)] max-w-7xl items-center gap-10 px-5 pb-12 pt-4 md:grid-cols-[0.92fr_1.08fr] md:px-8"
        >
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="relative"
            style={{ x: heroTextX }}
          >
            <motion.div variants={reveal} transition={{ duration: 0.55 }} className="mb-5 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[#8ab4f8]/30 bg-[#8ab4f8]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-[#8ab4f8]">
                {project.category}
              </span>
              {project.duration ? <span className="text-sm text-[#9ca3af]">{project.duration}</span> : null}
            </motion.div>
            <motion.h1
              layoutId={`project-title-${project.id}`}
              variants={reveal}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-normal text-white md:text-7xl"
            >
              {project.title}
            </motion.h1>
            <motion.p variants={reveal} className="mt-6 max-w-2xl text-lg leading-8 text-[#c7d2fe] md:text-xl">
              {project.description}
            </motion.p>
            <motion.div variants={reveal} className="mt-7 flex flex-wrap gap-2">
              {project.tech.slice(0, 6).map((tech) => (
                <span key={tech} className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-sm text-[#dbeafe]">
                  {tech}
                </span>
              ))}
            </motion.div>
            <motion.div variants={reveal} className="mt-8 flex flex-wrap gap-3">
              <DetailButton href={project.github} primary>
                <Github className="h-4 w-4" /> GitHub
              </DetailButton>
              {project.live ? (
                <DetailButton href={project.live}>
                  <ExternalLink className="h-4 w-4" /> Live demo
                </DetailButton>
              ) : null}
            </motion.div>
          </motion.div>

          <motion.div
            layoutId={`project-visual-${project.id}`}
            style={{ rotateX: heroRotateX, rotateY: heroRotateY, transformStyle: "preserve-3d" }}
            initial={{ opacity: 0, scale: 0.82, y: 36 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 90, damping: 18, delay: 0.12 }}
            className="relative min-h-[520px] rounded-[28px] border border-white/10 bg-[#111827]/75 p-4 shadow-[0_34px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl [perspective:1000px]"
          >
            <div className="absolute -inset-1 rounded-[32px] bg-[radial-gradient(circle_at_35%_20%,rgba(138,180,248,0.28),transparent_36%),radial-gradient(circle_at_70%_80%,rgba(85,214,190,0.16),transparent_35%)] blur-xl" />
            <div className="relative h-full min-h-[488px] overflow-hidden rounded-[22px] border border-white/10 bg-[#0b0f19]">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="flex gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                </div>
                <span className="text-xs uppercase tracking-[0.22em] text-[#9ca3af]">Live system preview</span>
              </div>

              <div className="relative grid h-[432px] place-items-center overflow-hidden">
                <motion.div
                  className="absolute h-64 w-64 rounded-full border border-[#8ab4f8]/25"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute h-96 w-96 rounded-full border border-dashed border-white/10"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
                />
                {architecture.map((node, index) => {
                  const Icon = node.icon;
                  return (
                    <motion.button
                      key={node.id}
                      type="button"
                      onMouseEnter={() => setActiveNode(node.id)}
                      whileHover={{ scale: 1.08, y: -3 }}
                      className={[
                        "absolute grid h-20 w-20 place-items-center rounded-2xl border text-white shadow-[0_0_28px_rgba(138,180,248,0.18)] transition",
                        activeNode === node.id ? "border-[#8ab4f8] bg-[#8ab4f8]/18" : "border-white/12 bg-white/[0.06]",
                      ].join(" ")}
                      style={{ left: `${node.x}%`, top: `${node.y}%`, transform: "translate(-50%, -50%)" }}
                      animate={{ y: [0, index % 2 ? -8 : 8, 0] }}
                      transition={{ duration: 5 + index, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Icon className="h-7 w-7" />
                    </motion.button>
                  );
                })}
                <svg className="absolute inset-0 h-full w-full">
                  {architecture.flatMap((node) =>
                    node.links.map((target) => {
                      const next = architecture.find((item) => item.id === target);
                      if (!next) return null;
                      const hot = activeNode === node.id || activeNode === next.id;
                      return (
                        <motion.line
                          key={`${node.id}-${target}`}
                          x1={`${node.x}%`}
                          y1={`${node.y}%`}
                          x2={`${next.x}%`}
                          y2={`${next.y}%`}
                          stroke={hot ? "#8ab4f8" : "rgba(255,255,255,0.14)"}
                          strokeWidth={hot ? 2.4 : 1.2}
                          strokeDasharray="6 8"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1, strokeDashoffset: [0, -28] }}
                          transition={{ pathLength: { duration: 1.1 }, strokeDashoffset: { duration: 2, repeat: Infinity, ease: "linear" } }}
                        />
                      );
                    })
                  )}
                </svg>
                <motion.div
                  className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/10 bg-[#111827]/85 p-4 text-left backdrop-blur"
                  key={activeArchNode.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-sm font-semibold text-white">{activeArchNode.label}</p>
                  <p className="mt-1 text-sm leading-5 text-[#9ca3af]">{activeArchNode.detail}</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <SectionTitle
            eyebrow="Overview"
            title="A fast read, built from visual signals."
            copy="The case study is split into scannable blocks so the problem, audience, features, and impact appear before the reader has to dig."
          />
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid gap-4 md:grid-cols-5"
          >
            {[
              ["Problem", project.caseStudy?.problem ?? project.longDescription.split(".")[0] ?? project.description, Brain],
              ["Why built", project.caseStudy?.whyBuilt ?? `To make ${project.category.toLowerCase()} work feel usable, inspectable, and product-ready.`, Sparkles],
              ["Who it helps", project.caseStudy?.users ?? (project.category === "ML/AI" ? "Support operators, analysts, and teams reviewing voice workflows." : "Users who need dependable workflows without operational drag."), Eye],
              ["Key features", `${project.keyFeatures.length} focused product capabilities`, Zap],
              ["Scale", project.caseStudy?.impact ?? (project.metrics?.[0] ? `${project.metrics[0].value} - ${project.metrics[0].label}` : project.role), Gauge],
            ].map(([label, copy, Icon], index) => {
              const CardIcon = Icon as IconComponent;
              return (
                <motion.article
                  key={String(label)}
                  variants={reveal}
                  whileHover={{ y: -6 }}
                  className={["rounded-2xl border border-white/10 bg-[#111827]/70 p-5 backdrop-blur", index === 0 ? "md:col-span-2" : ""].join(" ")}
                >
                  <CardIcon className="h-5 w-5 text-[#8ab4f8]" />
                  <h3 className="mt-5 text-lg font-semibold text-white">{String(label)}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#9ca3af]">{String(copy)}</p>
                </motion.article>
              );
            })}
          </motion.div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <SectionTitle
            eyebrow="Stack"
            title="Technology as architecture, not a checklist."
            copy="Each card reveals why the tool was chosen, where it sits in the system, and what it improves."
          />
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {stack.map((tech) => (
              <motion.article
                key={tech.name}
                variants={reveal}
                whileHover={{ rotateX: 5, rotateY: -5, y: -8 }}
                className="group relative min-h-64 rounded-2xl border border-white/10 bg-[#111827]/75 p-5 [transform-style:preserve-3d]"
              >
                <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_50%_0%,rgba(138,180,248,0.18),transparent_45%)] opacity-0 transition group-hover:opacity-100" />
                <div className="relative flex h-full flex-col justify-between">
                  <div>
                    <div className="grid h-14 w-14 place-items-center rounded-2xl border border-[#8ab4f8]/25 bg-[#8ab4f8]/10 text-sm font-bold text-[#dbeafe]">
                      {tech.logo}
                    </div>
                    <h3 className="mt-5 text-2xl font-semibold text-white">{tech.name}</h3>
                    <p className="mt-3 text-sm leading-6 text-[#9ca3af]">{tech.why}</p>
                  </div>
                  <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-[#0b0f19]/80 p-4 opacity-80 transition group-hover:opacity-100">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#8ab4f8]">Role</p>
                    <p className="mt-2 text-sm text-[#dbeafe]">{tech.role}</p>
                    <p className="mt-3 text-xs text-[#9ca3af]">{tech.benefit}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <SectionTitle
            eyebrow="Architecture"
            title="The system map is the centerpiece."
            copy="Hover a node to trace responsibility across interface, orchestration, data, auth, and intelligence layers."
          />
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <motion.div
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="relative min-h-[460px] overflow-hidden rounded-3xl border border-white/10 bg-[#111827]/70"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(138,180,248,0.16),transparent_46%)]" />
              <svg className="absolute inset-0 h-full w-full">
                {architecture.flatMap((node) =>
                  node.links.map((target) => {
                    const next = architecture.find((item) => item.id === target);
                    if (!next) return null;
                    const hot = activeNode === node.id || activeNode === next.id;
                    return (
                      <motion.line
                        key={`${node.id}-${target}-large`}
                        x1={`${node.x}%`}
                        y1={`${node.y}%`}
                        x2={`${next.x}%`}
                        y2={`${next.y}%`}
                        stroke={hot ? "#8ab4f8" : "rgba(255,255,255,0.13)"}
                        strokeWidth={hot ? 3 : 1.5}
                        strokeDasharray="5 9"
                        animate={{ strokeDashoffset: [0, -42] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      />
                    );
                  })
                )}
              </svg>
              {architecture.map((node) => {
                const Icon = node.icon;
                return (
                  <motion.button
                    type="button"
                    key={node.id}
                    onMouseEnter={() => setActiveNode(node.id)}
                    onFocus={() => setActiveNode(node.id)}
                    whileHover={{ scale: 1.05 }}
                    className={[
                      "absolute w-36 -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-4 text-left backdrop-blur transition",
                      activeNode === node.id ? "border-[#8ab4f8] bg-[#8ab4f8]/15" : "border-white/10 bg-[#0b0f19]/75",
                    ].join(" ")}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  >
                    <Icon className="h-5 w-5 text-[#8ab4f8]" />
                    <span className="mt-3 block text-sm font-semibold text-white">{node.label}</span>
                  </motion.button>
                );
              })}
            </motion.div>

            <motion.aside
              key={activeArchNode.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-3xl border border-white/10 bg-[#111827]/80 p-6"
            >
              <activeArchNode.icon className="h-8 w-8 text-[#8ab4f8]" />
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.24em] text-[#8ab4f8]">{activeArchNode.group}</p>
              <h3 className="mt-3 text-3xl font-semibold text-white">{activeArchNode.label}</h3>
              <p className="mt-4 text-sm leading-6 text-[#9ca3af]">{activeArchNode.detail}</p>
              <div className="mt-6 space-y-3">
                {activeArchNode.links.length ? activeArchNode.links.map((link) => {
                  const node = architecture.find((item) => item.id === link);
                  return node ? (
                    <button
                      type="button"
                      key={link}
                      onClick={() => setActiveNode(link)}
                      className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm text-[#dbeafe] transition hover:border-[#8ab4f8]/45"
                    >
                      {node.label}
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : null;
                }) : <p className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-[#9ca3af]">Terminal node. This layer returns the decision back into the product loop.</p>}
              </div>
            </motion.aside>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <SectionTitle
            eyebrow="Journey"
            title="Engineering decisions with a narrative spine."
            copy="A compact timeline shows how the project moved from problem discovery to a working product loop."
          />
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid gap-4 md:grid-cols-3"
          >
            {journey.map((step, index) => (
              <motion.article key={step.phase} variants={reveal} className="relative rounded-2xl border border-white/10 bg-[#111827]/70 p-5">
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#8ab4f8]">{String(index + 1).padStart(2, "0")} / {step.phase}</span>
                <h3 className="mt-4 text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#9ca3af]">{step.copy}</p>
              </motion.article>
            ))}
          </motion.div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <SectionTitle
            eyebrow="Feature showcase"
            title="Features that respond when explored."
            copy="Hover or tap each feature to change the live preview and turn static bullets into inspectable product behavior."
          />
          <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
            <div className="flex gap-3 overflow-x-auto pb-3 lg:block lg:space-y-3 lg:overflow-visible lg:pb-0">
              {project.keyFeatures.map((feature, index) => (
                <motion.button
                  type="button"
                  key={feature}
                  onMouseEnter={() => setActiveFeature(feature)}
                  onClick={() => setActiveFeature(feature)}
                  whileHover={{ x: 4 }}
                  className={[
                    "min-w-[270px] rounded-2xl border p-4 text-left transition lg:min-w-0",
                    activeFeature === feature ? "border-[#8ab4f8] bg-[#8ab4f8]/12" : "border-white/10 bg-[#111827]/70",
                  ].join(" ")}
                >
                  <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#8ab4f8]">Feature {index + 1}</span>
                  <p className="mt-3 text-sm leading-6 text-white">{feature}</p>
                </motion.button>
              ))}
            </div>
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative min-h-[390px] overflow-hidden rounded-3xl border border-white/10 bg-[#111827]/80 p-6"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(138,180,248,0.22),transparent_34%)]" />
              <div className="relative flex items-center justify-between">
                <span className="rounded-full border border-[#8ab4f8]/25 bg-[#8ab4f8]/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#8ab4f8]">Demo mode</span>
                <Play className="h-5 w-5 text-[#8ab4f8]" />
              </div>
              <div className="relative mt-10 grid gap-4 md:grid-cols-3">
                {[0, 1, 2].map((item) => (
                  <motion.div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-[#0b0f19]/70 p-4"
                    animate={{ y: [0, item === 1 ? -12 : 10, 0] }}
                    transition={{ duration: 4 + item, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="h-2 rounded-full bg-[#8ab4f8]/70" style={{ width: `${62 + item * 13}%` }} />
                    <div className="mt-4 h-24 rounded-xl bg-[linear-gradient(135deg,rgba(138,180,248,0.24),rgba(255,255,255,0.04))]" />
                    <p className="mt-4 text-xs text-[#9ca3af]">{item === 0 ? "Input" : item === 1 ? "Processing" : "Outcome"}</p>
                  </motion.div>
                ))}
              </div>
              <p className="relative mt-8 max-w-2xl text-lg leading-8 text-[#dbeafe]">{activeFeature}</p>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <SectionTitle
            eyebrow="Metrics"
            title="Impact shown as instrument panels."
            copy="Metrics animate as dashboard objects, giving recruiters quick proof without another paragraph."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {(project.metrics?.length ? project.metrics : [{ label: "Feature depth", value: `${project.keyFeatures.length}+` }, { label: "Stack layers", value: `${project.tech.length}` }]).map((metric, index) => {
              const percent = percentFromMetric(metric.value, index);
              return (
                <motion.article
                  key={metric.label}
                  variants={reveal}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="rounded-3xl border border-white/10 bg-[#111827]/75 p-6"
                >
                  <div className="relative mx-auto grid h-40 w-40 place-items-center rounded-full">
                    <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full -rotate-90">
                      <circle cx="60" cy="60" r="48" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                      <motion.circle
                        cx="60"
                        cy="60"
                        r="48"
                        fill="none"
                        stroke="#8ab4f8"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray="301.59"
                        initial={{ strokeDashoffset: 301.59 }}
                        whileInView={{ strokeDashoffset: 301.59 - (301.59 * percent) / 100 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.1, ease: "easeOut" }}
                      />
                    </svg>
                    <span className="text-3xl font-semibold text-white">{metric.value}</span>
                  </div>
                  <p className="mt-5 text-center text-sm font-semibold text-[#dbeafe]">{metric.label}</p>
                </motion.article>
              );
            })}
            <motion.article
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="rounded-3xl border border-white/10 bg-[#111827]/75 p-6"
            >
              <Gauge className="h-8 w-8 text-[#8ab4f8]" />
              <p className="mt-8 text-4xl font-semibold text-white">60fps</p>
              <p className="mt-3 text-sm leading-6 text-[#9ca3af]">Motion budget target for the project case-study surface.</p>
              <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
                <motion.span className="block h-full rounded-full bg-[#8ab4f8]" initial={{ width: 0 }} whileInView={{ width: "88%" }} viewport={{ once: true }} transition={{ duration: 0.9 }} />
              </div>
            </motion.article>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <SectionTitle
            eyebrow="Code"
            title="Engineering details without leaving the experience."
            copy="Tabbed snippets expose the technical thinking behind the surface in small, recruiter-friendly chunks."
          />
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#111827]/80">
            <div className="flex gap-2 overflow-x-auto border-b border-white/10 p-3">
              {(Object.keys(panels) as Array<keyof typeof panels>).map((panel) => (
                <button
                  type="button"
                  key={panel}
                  onClick={() => setActiveCode(panel)}
                  className={[
                    "rounded-full px-4 py-2 text-sm font-semibold capitalize transition",
                    activeCode === panel ? "bg-white text-[#0b0f19]" : "bg-white/[0.05] text-[#9ca3af] hover:text-white",
                  ].join(" ")}
                >
                  {panel}
                </button>
              ))}
            </div>
            <motion.pre
              key={activeCode}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-x-auto p-6 text-sm leading-7 text-[#dbeafe]"
            >
              <code>{panels[activeCode]}</code>
            </motion.pre>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <SectionTitle
            eyebrow="Gallery"
            title="Visual breaks for product memory."
            copy="Screens, diagrams, and flows open in a cinematic viewer instead of becoming static thumbnails."
          />
          <div className="flex snap-x gap-4 overflow-x-auto pb-4">
            {gallery.map((item) => (
              <motion.button
                type="button"
                key={item.title}
                onClick={() => setGalleryItem(item)}
                whileHover={{ scale: 1.03 }}
                className="group relative h-80 min-w-[82vw] overflow-hidden rounded-3xl border border-white/10 bg-[#111827] text-left sm:min-w-[440px]"
              >
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 82vw, 440px"
                  className="object-cover opacity-70 transition duration-500 group-hover:scale-105 group-hover:opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                  <span className="text-xl font-semibold text-white">{item.title}</span>
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#0b0f19]"><Eye className="h-4 w-4" /></span>
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 py-20 md:px-8">
          <SectionTitle
            eyebrow="Lessons"
            title="What the project taught."
            copy="A concise reflection layer keeps the page mature: technical lessons, mistakes, scaling insights, and tradeoffs."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {(project.caseStudy?.lessons ?? [
              { title: "Technical lesson", copy: "Architecture is easier to evaluate when each layer has a visible responsibility." },
              { title: "Mistake corrected", copy: "The first pass leaned too much on explanation; the better version makes behavior inspectable." },
              { title: "Scaling insight", copy: "A small, typed contract between UI, services, and data makes future features less fragile." },
              { title: "Design tradeoff", copy: "The interface favors guided exploration over dense documentation so it stays memorable." },
            ]).map(({ title, copy }) => (
              <motion.article
                key={title}
                variants={reveal}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="rounded-2xl border border-white/10 bg-[#111827]/65 p-5"
              >
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#9ca3af]">{copy}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-24 pt-10 md:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-semibold text-white">Related projects</h2>
            <ArrowRight className="h-5 w-5 text-[#8ab4f8]" />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {related.map((item) => (
              <Link key={item.id} href={`/projects/${item.id}`} className="group min-w-[310px] rounded-2xl border border-white/10 bg-[#111827]/75 p-5 transition hover:-translate-y-1 hover:border-[#8ab4f8]/45">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8ab4f8]">{item.category}</p>
                <h3 className="mt-4 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#9ca3af]">{item.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <AnimatePresence>
        {galleryItem ? (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-5 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#111827]"
            >
              <button
                type="button"
                onClick={() => setGalleryItem(null)}
                className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/55 text-white backdrop-blur"
                aria-label="Close gallery"
              >
                <X className="h-5 w-5" />
              </button>
              <Image
                src={galleryItem.image}
                alt=""
                width={1280}
                height={820}
                className="max-h-[78vh] w-full object-contain"
              />
              <div className="border-t border-white/10 p-5">
                <h3 className="text-xl font-semibold text-white">{galleryItem.title}</h3>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
