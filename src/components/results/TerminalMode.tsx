"use client";

import React, { useState, useEffect, useRef } from "react";
import { bio, projects, skills, education, experience } from "@/data/portfolioData";

interface TerminalModeProps {
  onExit: () => void;
}

interface CommandHistory {
  command: string;
  output: string | React.ReactNode;
}

export default function TerminalMode({ onExit }: TerminalModeProps) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<CommandHistory[]>([
    {
      command: "system_init",
      output: (
        <div className="text-zinc-400">
          <p className="text-emerald-400 font-bold">AgamjotOS v1.0.0 (Terminal Mode Activated)</p>
          <p className="mt-1">Type <span className="text-blue-400">help</span> to view available commands, or <span className="text-red-400">exit</span> to return to search engine UI.</p>
        </div>
      )
    }
  ]);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  useEffect(() => {
    // Focus terminal input on load
    inputRef.current?.focus();
    
    // Global click to focus input
    const handleGlobalClick = () => {
      inputRef.current?.focus();
    };
    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, []);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    const parts = cmd.toLowerCase().split(" ");
    const primaryCmd = parts[0];
    const args = parts.slice(1);
    
    let output: React.ReactNode = "";

    switch (primaryCmd) {
      case "help":
        output = (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-zinc-300">
            <div><span className="text-emerald-400 font-bold">whoami</span> - Display biography summary</div>
            <div><span className="text-emerald-400 font-bold">ls projects</span> - List all key engineering projects</div>
            <div><span className="text-emerald-400 font-bold">cat resume</span> - View professional experience & education</div>
            <div><span className="text-emerald-400 font-bold">skills</span> - Display categorized technical competencies</div>
            <div><span className="text-emerald-400 font-bold">open [github|linkedin]</span> - Open corresponding social links</div>
            <div><span className="text-emerald-400 font-bold">clear</span> - Clear terminal interface</div>
            <div><span className="text-emerald-400 font-bold">exit</span> - Deactivate terminal mode</div>
          </div>
        );
        break;
      
      case "clear":
        setHistory([]);
        setInput("");
        return;

      case "exit":
        onExit();
        return;

      case "whoami":
        output = (
          <div className="text-zinc-300 space-y-2 max-w-2xl">
            <p className="text-emerald-400 font-semibold">{bio.name} — {bio.title}</p>
            <p>{bio.aboutLong}</p>
            <p className="text-zinc-400 italic">Location: {bio.location} | Focus: Deep Learning & Modern UX</p>
          </div>
        );
        break;

      case "ls":
        if (args[0] === "projects" || args.length === 0) {
          output = (
            <div className="space-y-4">
              <p className="text-zinc-400">Displaying {projects.length} matching entities:</p>
              {projects.map(p => (
                <div key={p.id} className="border-l-2 border-emerald-500 pl-3 py-1">
                  <p className="text-emerald-400 font-bold">{p.title} <span className="text-zinc-500 text-xs font-normal">({p.category})</span></p>
                  <p className="text-zinc-300 text-sm mt-1">{p.description}</p>
                  <p className="text-zinc-400 text-xs mt-1">Tech: {p.tech.join(", ")}</p>
                </div>
              ))}
            </div>
          );
        } else {
          output = <span className="text-red-400">Directory not found. Try: ls projects</span>;
        }
        break;

      case "cat":
        if (args[0] === "resume" || args.length === 0) {
          output = (
            <div className="space-y-4 max-w-3xl">
              <p className="text-emerald-400 font-bold border-b border-zinc-800 pb-1">
                {bio.name} — Curriculum Vitae
              </p>
              <p className="text-zinc-400 text-sm">
                {bio.email} · {bio.phone} · {bio.location}
              </p>
              <div className="space-y-3">
                <p className="text-blue-400 font-semibold">EDUCATION</p>
                {education.map((ed) => (
                  <div key={ed.id}>
                    <p className="text-zinc-200 font-medium">
                      {ed.institution} — {ed.degree}
                    </p>
                    <p className="text-zinc-400 text-xs">
                      {ed.duration}
                      {ed.gpa ? ` · ${ed.gpa}` : ""}
                    </p>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <p className="text-blue-400 font-semibold">WORK & VOLUNTEER</p>
                {experience.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <p className="text-zinc-200 font-medium">
                      {exp.role} — {exp.company} ({exp.duration})
                    </p>
                    <ul className="list-disc list-inside text-zinc-400 text-sm pl-2">
                      {exp.description.slice(0, 2).map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="text-zinc-500 text-xs">
                Full PDF: {bio.resumeUrl} (place file in public/resume.pdf)
              </p>
            </div>
          );
        } else {
          output = <span className="text-red-400">File not found. Try: cat resume</span>;
        }
        break;

      case "skills":
        output = (
          <div className="space-y-3">
            {skills.map(cat => (
              <div key={cat.category}>
                <span className="text-blue-400 font-semibold">{cat.category}:</span>
                <span className="text-zinc-300 ml-2">
                  {cat.items.map(i => `${i.name} (${i.level}%)`).join(", ")}
                </span>
              </div>
            ))}
          </div>
        );
        break;

      case "open":
        if (args[0] === "github") {
          window.open(bio.github, "_blank");
          output = <span className="text-emerald-400">Opening Github profile...</span>;
        } else if (args[0] === "linkedin") {
          window.open(bio.linkedin, "_blank");
          output = <span className="text-emerald-400">Opening LinkedIn profile...</span>;
        } else {
          output = <span className="text-red-400">Target not recognized. Try: open github OR open linkedin</span>;
        }
        break;

      default:
        output = (
          <span className="text-red-400">
            Command &apos;{primaryCmd}&apos; not recognized. Type <span className="text-blue-400 underline cursor-pointer" onClick={() => setInput("help")}>help</span> to list available commands.
          </span>
        );
        break;
    }

    setHistory(prev => [...prev, { command: cmd, output }]);
    setInput("");
  };

  return (
    <div className="w-full min-h-screen bg-[#07080a] text-zinc-300 font-mono p-6 md:p-10 flex flex-col select-text">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-2 font-semibold tracking-wider">agamjot@shell: ~</span>
        </div>
        <button 
          onClick={onExit}
          className="text-zinc-500 hover:text-red-400 transition-colors border border-zinc-800 rounded px-2 py-0.5 hover:bg-zinc-900"
        >
          Exit Shell [Esc]
        </button>
      </div>

      {/* Terminal Content Box */}
      <div className="flex-1 overflow-y-auto space-y-4 max-h-[80vh] scrollbar-thin scrollbar-thumb-zinc-800 pr-2">
        {history.map((h, i) => (
          <div key={i} className="space-y-1">
            {h.command !== "system_init" && (
              <div className="flex items-center gap-2 text-zinc-500">
                <span className="text-emerald-500">➜</span>
                <span className="text-blue-400">~</span>
                <span className="text-zinc-200">{h.command}</span>
              </div>
            )}
            <div className="pl-4 leading-relaxed whitespace-pre-wrap">{h.output}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Terminal Input Form */}
      <form onSubmit={handleCommand} className="flex items-center gap-2 border-t border-zinc-900 pt-4 mt-auto">
        <span className="text-emerald-500 font-bold">➜</span>
        <span className="text-blue-400 font-bold">~</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-emerald-400 focus:ring-0 p-0 font-mono caret-emerald-500"
          placeholder="type a command..."
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </form>
    </div>
  );
}
