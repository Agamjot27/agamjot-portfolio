"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Search, Mic, X } from "lucide-react";
import { getSuggestions } from "@/lib/search-engine";
import { motion, AnimatePresence } from "framer-motion";

interface SearchBoxProps {
  initialValue?: string;
  onSearch: (query: string) => void;
  onQueryChange?: (query: string) => void;
  variant?: "home" | "top";
  placeholderText?: string;
}

const ROTATING_SUGGESTIONS = [
  "Who is Agamjot Singh?",
  "Show ML projects",
  "Open resume",
  "Skills in PyTorch",
  "Amazon HackOn achievement",
  "Contact details",
  "Career timeline",
  "roast my code",
  "enable terminal mode",
  "hire agamjot",
];

export default function SearchBox({
  initialValue = "",
  onSearch,
  onQueryChange,
  variant = "home",
  placeholderText,
}: SearchBoxProps) {
  const [query, setQuery] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<{ start: () => void; stop: () => void } | null>(null);
  const onSearchRef = useRef(onSearch);
  const suggestions = useMemo(() => (query ? getSuggestions(query) : []), [query]);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const w = window as Window & {
        SpeechRecognition?: new () => {
          start: () => void;
          stop: () => void;
          continuous: boolean;
          interimResults: boolean;
          lang: string;
          onstart: (() => void) | null;
          onend: (() => void) | null;
          onresult: ((event: { results: { 0: { 0: { transcript: string } } } }) => void) | null;
          onerror: (() => void) | null;
        };
        webkitSpeechRecognition?: new () => {
          start: () => void;
          stop: () => void;
          continuous: boolean;
          interimResults: boolean;
          lang: string;
          onstart: (() => void) | null;
          onend: (() => void) | null;
          onresult: ((event: { results: { 0: { 0: { transcript: string } } } }) => void) | null;
          onerror: (() => void) | null;
        };
      };
      const SpeechRecognition = w.SpeechRecognition || w.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = "en-US";
        rec.onstart = () => setIsRecording(true);
        rec.onend = () => setIsRecording(false);
        rec.onresult = (event: { results: { 0: { 0: { transcript: string } } } }) => {
          const text = event.results[0][0].transcript;
          setQuery(text);
          onSearchRef.current(text);
        };
        rec.onerror = () => setIsRecording(false);
        recognitionRef.current = rec;
      }
    }
  }, []);

  useEffect(() => {
    if (query) return;

    let currentText = "";
    let isDeleting = false;
    let charIndex = 0;
    const typingSpeed = 80;
    let timer: ReturnType<typeof setTimeout>;

    const targetPhrase = placeholderText || ROTATING_SUGGESTIONS[placeholderIndex];

    const handleType = () => {
      if (!isDeleting) {
        currentText = targetPhrase.substring(0, charIndex + 1);
        charIndex++;
        setDisplayedPlaceholder(currentText);
        if (charIndex === targetPhrase.length) {
          timer = setTimeout(() => {
            isDeleting = true;
            handleType();
          }, 2500);
          return;
        }
      } else {
        currentText = targetPhrase.substring(0, charIndex - 1);
        charIndex--;
        setDisplayedPlaceholder(currentText);
        if (charIndex === 0) {
          isDeleting = false;
          setPlaceholderIndex((prev) => (prev + 1) % ROTATING_SUGGESTIONS.length);
          timer = setTimeout(handleType, 500);
          return;
        }
      }
      timer = setTimeout(handleType, isDeleting ? 40 : typingSpeed);
    };

    timer = setTimeout(handleType, 200);
    return () => clearTimeout(timer);
  }, [placeholderIndex, query, placeholderText]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setIsFocused(false);
    }
  };

  const handleVoiceSearch = () => {
    if (!recognitionRef.current) return;
    if (isRecording) recognitionRef.current?.stop();
    else recognitionRef.current?.start();
  };

  const handleClear = () => {
    setQuery("");
    onQueryChange?.("");
  };

  const selectSuggestion = (val: string) => {
    setQuery(val);
    onQueryChange?.(val);
    onSearch(val);
    setIsFocused(false);
  };

  const updateQuery = (value: string) => {
    setQuery(value);
    onQueryChange?.(value);
  };

  const isHome = variant === "home";

  return (
    <div
      ref={containerRef}
      className={`w-full relative z-40 mx-auto ${isHome ? "max-w-[584px]" : "max-w-xl"}`}
    >
      <form onSubmit={handleSubmit} className="w-full">
        <div
          className={`google-search-bar flex items-center ${isFocused ? "is-focused" : ""} ${
            isHome ? "h-[44px] px-[14px]" : "h-[46px] px-3 shadow-sm border border-theme-custom rounded-full"
          }`}
        >
          <Search
            className={`text-theme-secondary shrink-0 ${isHome ? "w-5 h-5 mr-[13px]" : "w-5 h-5 mr-3"}`}
            strokeWidth={2}
          />

          <div className="relative flex-1 min-w-0">
            <input
              type="text"
              value={query}
              onChange={(e) => updateQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              className="w-full bg-transparent border-none outline-none text-theme-primary placeholder-transparent focus:ring-0 p-0 text-base caret-theme-accent"
              autoComplete="off"
              aria-label="Search"
            />
            {!query && (
              <span className="absolute inset-0 pointer-events-none text-theme-secondary select-none truncate text-base flex items-center">
                {displayedPlaceholder}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 ml-1">
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="text-theme-secondary hover:text-theme-primary p-2 rounded-full hover:bg-theme-elevated transition-colors"
                aria-label="Clear search query"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <button
              type="button"
              onClick={handleVoiceSearch}
              className={`p-2 rounded-full transition-colors ${
                isRecording
                  ? "text-[#ea4335]"
                  : "text-theme-secondary hover:text-theme-primary hover:bg-theme-elevated"
              }`}
              aria-label="Voice search"
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
        </div>
      </form>

      <AnimatePresence>
        {isFocused && suggestions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 right-0 mt-1 bg-theme-card border border-theme-custom rounded-lg shadow-lg overflow-hidden z-50 py-2 list-none m-0 p-0"
            role="listbox"
          >
            {suggestions.map((s, idx) => (
              <motion.li
                key={s}
                role="option"
                aria-selected={false}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.16, delay: idx * 0.025 }}
              >
                <button
                  type="button"
                  onClick={() => selectSuggestion(s)}
                  className="w-full text-left px-4 py-2 text-sm text-theme-primary hover:bg-theme-elevated transition-colors flex items-center gap-3"
                >
                  <Search className="w-4 h-4 text-theme-secondary shrink-0" />
                  <span>{s}</span>
                </button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
