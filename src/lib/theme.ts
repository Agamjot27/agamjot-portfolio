export const THEMES = ["light", "dark"] as const;
export type Theme = (typeof THEMES)[number];

const STORAGE_KEY = "portfolio-theme";

export function isTheme(value: string | null): value is Theme {
  return value !== null && (THEMES as readonly string[]).includes(value);
}

export function getSavedTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return isTheme(saved) ? saved : null;
  } catch {
    return null;
  }
}

export const DEFAULT_THEME: Theme = "dark";

/** Apply the selected portfolio theme on <html>. */
export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("theme-dark");
  if (theme === "dark") {
    root.classList.add("theme-dark");
  }
}

export function persistTheme(theme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
}

export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");if(t!=="light")document.documentElement.classList.add("theme-dark")}catch(e){document.documentElement.classList.add("theme-dark")}})();`;
