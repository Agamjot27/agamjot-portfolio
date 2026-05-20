const BASE = "/assets/public/models";

export type SkillAsset = {
  id: string;
  name: string;
  level: number;
  modelPath: string;
  rotation?: [number, number, number];
  /** Per-model fit padding (higher = smaller in tile) */
  fitMargin?: number;
};

/** One tile per unique GLB — 3D only, no static fallbacks */
export const skill3DShowcase: SkillAsset[] = [
  {
    id: "python",
    name: "Python",
    level: 92,
    modelPath: `${BASE}/python-transformed.glb`,
    fitMargin: 1.65,
    rotation: [0, 0, 0],
  },
  {
    id: "javascript",
    name: "JavaScript & React",
    level: 88,
    modelPath: `${BASE}/react_logo-transformed.glb`,
    fitMargin: 1.7,
    rotation: [0, 0, 0],
  },
  {
    id: "nodejs",
    name: "Node.js & Backend",
    level: 82,
    modelPath: `${BASE}/node-transformed.glb`,
    fitMargin: 1.6,
    rotation: [0, -Math.PI / 2, 0],
  },
  {
    id: "git",
    name: "Git",
    level: 88,
    modelPath: `${BASE}/git-svg-transformed.glb`,
    fitMargin: 1.75,
    rotation: [0, -Math.PI / 4, 0],
  },
  {
    id: "threejs",
    name: "Three.js & WebGL",
    level: 80,
    modelPath: `${BASE}/three.js-transformed.glb`,
    fitMargin: 1.8,
    rotation: [0, 0.3, 0],
  },
];

export const glbPaths = skill3DShowcase.map((s) => s.modelPath);

export function preloadSkillModels(preload: (path: string) => void) {
  glbPaths.forEach(preload);
}

/** Filter showcase when search narrows to specific skill names */
export function filter3DSkills(names: string[]): SkillAsset[] {
  if (!names.length) return skill3DShowcase;

  const normalized = names.map((n) => n.toLowerCase());
  const matched = skill3DShowcase.filter((s) => {
    const label = s.name.toLowerCase();
    const id = s.id.toLowerCase();
    return normalized.some(
      (n) =>
        label.includes(n) ||
        n.includes(id) ||
        (n.includes("react") && id === "javascript") ||
        (n.includes("pytorch") && id === "python") ||
        (n.includes("fastapi") && id === "nodejs") ||
        (n.includes("sql") && id === "nodejs")
    );
  });

  return matched.length > 0 ? matched : skill3DShowcase;
}
