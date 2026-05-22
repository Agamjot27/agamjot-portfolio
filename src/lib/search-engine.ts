import Fuse from "fuse.js";
import { bio, projects, experience, education, skills, achievements, easterEggs, Project, Experience, SkillCategory } from "../data/portfolioData";

export type SearchIntent = 
  | "ABOUT"
  | "PROJECTS"
  | "EXPERIENCE"
  | "SKILLS"
  | "CONTACT"
  | "ACHIEVEMENTS"
  | "TIMELINE"
  | "TERMINAL"
  | "EASTER_EGG"
  | "GENERAL";

export interface SearchResult {
  intent: SearchIntent;
  query: string;
  featuredSnippet?: {
    title: string;
    subtitle?: string;
    description?: string;
    content?: string;
    type: "project" | "experience" | "skills" | "contact" | "easter-egg" | "bio";
    data?: any;
  };
  projects: Project[];
  experience: Experience[];
  skills: SkillCategory[];
  achievements: typeof achievements;
  generalResults: {
    type: "project" | "experience" | "skill" | "achievement" | "bio";
    title: string;
    description: string;
    url?: string;
    tags?: string[];
    score?: number;
    data: any;
  }[];
}

// Flat search items for Fuse.js
interface FlatSearchItem {
  id: string;
  type: "project" | "experience" | "skill" | "achievement" | "bio";
  title: string;
  subtitle?: string;
  description: string;
  tags: string[];
  data: any;
}

const getFlatItems = (): FlatSearchItem[] => {
  const items: FlatSearchItem[] = [];

  // Bio
  items.push({
    id: "bio-general",
    type: "bio",
    title: bio.name,
    subtitle: bio.title,
    description: `${bio.summary} ${bio.aboutLong} ${bio.strengths.join(" ")}`,
    tags: ["about", "me", "profile", "bio", "agamjot", "singh", "who are you", "who is"],
    data: bio
  });

  // Projects
  projects.forEach(p => {
    items.push({
      id: `project-${p.id}`,
      type: "project",
      title: p.title,
      subtitle: p.role,
      description: `${p.description} ${p.longDescription} ${p.tech.join(" ")} ${p.keyFeatures.join(" ")}`,
      tags: [...p.tech, "project", p.category, "code", "github"],
      data: p
    });
  });

  // Education
  education.forEach((ed) => {
    items.push({
      id: `edu-${ed.id}`,
      type: "bio",
      title: `${ed.degree} — ${ed.institution}`,
      subtitle: ed.duration,
      description: `${ed.location} ${ed.gpa || ""} ${(ed.details || []).join(" ")}`,
      tags: ["education", "university", "college", "degree", "mit", "manipal", "gpa", ed.institution],
      data: ed
    });
  });

  // Experience
  experience.forEach(e => {
    items.push({
      id: `exp-${e.id}`,
      type: "experience",
      title: `${e.role} at ${e.company}`,
      subtitle: e.duration,
      description: `${e.description.join(" ")} ${e.tech.join(" ")} ${(e.highlights || []).join(" ")}`,
      tags: [...e.tech, "experience", "job", "work", "internship", e.company, e.role],
      data: e
    });
  });

  // Skills
  skills.forEach(s => {
    items.push({
      id: `skill-${s.category.toLowerCase().replace(/\s+/g, "-")}`,
      type: "skill",
      title: s.category,
      description: s.items.map(i => i.name).join(", "),
      tags: ["skills", "tech", "stack", "languages", ...s.items.map(i => i.name)],
      data: s
    });
  });

  // Achievements
  achievements.forEach((a, i) => {
    items.push({
      id: `ach-${i}`,
      type: "achievement",
      title: a.title,
      subtitle: a.date,
      description: a.description,
      tags: ["achievement", "award", "hackathon", "amazon hackon", "smart india", "sih", "contest"],
      data: a
    });
  });

  return items;
};

export const runSearch = (query: string): SearchResult => {
  const normalized = query.trim().toLowerCase();
  
  // Default structure
  const result: SearchResult = {
    intent: "GENERAL",
    query,
    projects: [],
    experience: [],
    skills: [],
    achievements: [],
    generalResults: []
  };

  if (!normalized) {
    return result;
  }

  // Resume / CV download
  if (
    normalized.includes("resume") ||
    normalized.includes("download cv") ||
    normalized === "cv"
  ) {
    result.intent = "CONTACT";
    result.featuredSnippet = {
      title: "Download Resume (PDF)",
      subtitle: bio.name,
      description: `Email: ${bio.email} · Phone: ${bio.phone}\n\nDownload: ${bio.resumeUrl}`,
      type: "contact",
      data: { ...bio, triggerResumeDownload: true }
    };
    return result;
  }

  // 1. Detect Terminal Mode Request
  if (normalized.includes("enable terminal mode") || normalized === "terminal" || normalized === "terminal mode") {
    result.intent = "TERMINAL";
    return result;
  }

  // 2. Detect Easter Eggs
  for (const eggKey of Object.keys(easterEggs)) {
    if (normalized.includes(eggKey)) {
      result.intent = "EASTER_EGG";
      const egg = easterEggs[eggKey];
      result.featuredSnippet = {
        title: egg.title,
        subtitle: egg.subtitle,
        description: egg.content,
        type: "easter-egg",
        data: egg
      };
      return result;
    }
  }

  // 3. Detect Primary Intent by Keywords
  let detectedIntent: SearchIntent = "GENERAL";

  const intents = {
    ABOUT: ["who is", "who are", "about", "bio", "tell me about", "myself", "background", "photo", "avatar"],
    PROJECTS: ["project", "projects", "portfolio", "code", "github", "ml projects", "ai projects", "react projects", "apps"],
    EXPERIENCE: ["experience", "jobs", "work", "internship", "employment", "company", "career", "startup", "history"],
    SKILLS: ["skills", "skills in", "tech stack", "languages", "programming", "frameworks", "technologies", "what do you know"],
    CONTACT: ["contact", "email", "linkedin", "phone", "social", "github link", "hire", "address", "reach out", "mobile"],
    ACHIEVEMENTS: ["achievement", "achievements", "award", "awards", "hackon", "hackathon", "amazon", "sih", "smart india"],
    TIMELINE: ["timeline", "career timeline", "education", "university", "college", "degree", "mit", "manipal", "gpa", "b.tech"]
  };

  for (const [intent, keywords] of Object.entries(intents)) {
    if (keywords.some(keyword => normalized.includes(keyword))) {
      detectedIntent = intent as SearchIntent;
      break;
    }
  }

  result.intent = detectedIntent;

  // 4. Perform Search using Fuse.js for general search results
  const flatItems = getFlatItems();
  const fuse = new Fuse(flatItems, {
    keys: [
      { name: "tags", weight: 2 },
      { name: "title", weight: 1.5 },
      { name: "description", weight: 1 }
    ],
    threshold: 0.4,
    includeScore: true
  });

  const fuseResults = fuse.search(query);

  // Map Fuse.js results
  result.generalResults = fuseResults.map(r => ({
    type: r.item.type,
    title: r.item.title,
    description: r.item.description,
    tags: r.item.tags,
    score: r.score,
    data: r.item.data
  }));

  // Helper arrays for fast category checks
  const matchedProjects = result.generalResults.filter(r => r.type === "project").map(r => r.data as Project);
  const matchedExperiences = result.generalResults.filter(r => r.type === "experience").map(r => r.data as Experience);
  const matchedSkills = result.generalResults.filter(r => r.type === "skill").map(r => r.data as SkillCategory);

  // 5. Build Intent-Specific Featured Snippets & Filter Lists
  if (detectedIntent === "ABOUT") {
    result.featuredSnippet = {
      title: `About ${bio.name}`,
      subtitle: bio.title,
      description: bio.aboutLong,
      type: "bio",
      data: bio
    };
  } else if (detectedIntent === "PROJECTS") {
    // If searching for a specific project like "pneumonia"
    const specificProject = projects.find(
      (p) =>
        normalized.includes(p.id) ||
        normalized.includes("revault") ||
        normalized.includes("clubops") ||
        normalized.includes("call intelligence") ||
        normalized.includes("convnext") ||
        normalized.includes("plant disease")
    );
    if (specificProject) {
      result.featuredSnippet = {
        title: specificProject.title,
        subtitle: specificProject.role,
        description: specificProject.longDescription,
        type: "project",
        data: specificProject
      };
      result.projects = [specificProject];
    } else {
      // Return projects that match stack keywords, or all
      const filtered = projects.filter(p => 
        p.tech.some(t => normalized.includes(t.toLowerCase())) ||
        p.title.toLowerCase().includes(normalized) ||
        p.description.toLowerCase().includes(normalized)
      );
      result.projects = filtered.length > 0 ? filtered : projects;
    }
  } else if (detectedIntent === "EXPERIENCE") {
    result.experience = matchedExperiences.length > 0 ? matchedExperiences : experience;
    if (result.experience.length > 0) {
      const topExp = result.experience[0];
      result.featuredSnippet = {
        title: `${topExp.role} at ${topExp.company}`,
        subtitle: topExp.duration,
        description: topExp.description.join(" "),
        type: "experience",
        data: topExp
      };
    }
  } else if (detectedIntent === "SKILLS") {
    result.skills = matchedSkills.length > 0 ? matchedSkills : skills;
    // Find specific skill proficiency if mentioned
    let specificSkillItem: any = null;
    let categoryName = "";
    for (const cat of skills) {
      const found = cat.items.find(i => normalized.includes(i.name.toLowerCase()));
      if (found) {
        specificSkillItem = found;
        categoryName = cat.category;
        break;
      }
    }

    if (specificSkillItem) {
      result.featuredSnippet = {
        title: `Skill: ${specificSkillItem.name}`,
        subtitle: `Proficiency: ${specificSkillItem.level}% (${categoryName})`,
        description: `Agamjot has solid practical experience using ${specificSkillItem.name} across multiple projects. He has rated his expertise at ${specificSkillItem.level}%.`,
        type: "skills",
        data: specificSkillItem
      };
    } else {
      result.featuredSnippet = {
        title: "Agamjot's Core Technologies",
        subtitle: "Full Spectrum Tech Stack",
        description: "MERN stack (MongoDB, Express.js, React, Node.js), PostgreSQL, FastAPI, Python/PyTorch, Docker, Git, and 300+ DSA problems on LeetCode & GFG.",
        type: "skills",
        data: skills
      };
    }
  } else if (detectedIntent === "CONTACT") {
    result.featuredSnippet = {
      title: "Want to hire Agamjot?",
      subtitle: bio.location,
      description: `Email: ${bio.email}\nPhone: ${bio.phone}\nLinkedIn: ${bio.linkedin}\nGitHub: ${bio.github}`,
      type: "contact",
      data: bio
    };
  } else if (detectedIntent === "ACHIEVEMENTS") {
    result.achievements = achievements;
    result.featuredSnippet = {
      title: "Achievements & Awards",
      subtitle: `${achievements.length} highlights`,
      description: achievements.map((a) => `${a.title} (${a.date}): ${a.description}`).join("\n\n"),
      type: "bio",
      data: achievements
    };
  } else if (detectedIntent === "TIMELINE") {
    const primaryEd = education[0];
    result.featuredSnippet = {
      title: "Education & Career Timeline",
      subtitle: primaryEd.institution,
      description: `${primaryEd.degree} (${primaryEd.duration}). GPA: ${primaryEd.gpa}. Research intern at MIT Manipal; B.Tech IT graduating May 2027.`,
      type: "bio",
      data: { bio, education, experience }
    };
  } else {
    // GENERAL intent: if there's a highly matched result (score < 0.25), promote it to featured snippet
    if (result.generalResults.length > 0 && (result.generalResults[0].score || 1) < 0.25) {
      const top = result.generalResults[0];
      let snippetType: "project" | "experience" | "skills" | "contact" | "easter-egg" | "bio" = "bio";
      
      if (top.type === "project") snippetType = "project";
      else if (top.type === "experience") snippetType = "experience";
      else if (top.type === "skill") snippetType = "skills";
      
      result.featuredSnippet = {
        title: top.title,
        subtitle: top.type.toUpperCase(),
        description: top.description,
        type: snippetType,
        data: top.data
      };
    }
  }

  // Populate lists if empty and they are not intent-exclusive, to enrich search experience
  if (result.projects.length === 0 && matchedProjects.length > 0) {
    result.projects = matchedProjects.slice(0, 3);
  }
  if (result.experience.length === 0 && matchedExperiences.length > 0) {
    result.experience = matchedExperiences.slice(0, 3);
  }
  if (result.skills.length === 0 && matchedSkills.length > 0) {
    result.skills = matchedSkills.slice(0, 3);
  }

  return result;
};

export const SUGGESTIONS = [
  "Who is Agamjot Singh?",
  "About Agamjot",
  "Show ML projects",
  "ReVault encrypted marketplace",
  "Call Intelligence NLP",
  "MERN full-stack projects",
  "PostgreSQL backend projects",
  "Plant disease ConvNeXt research",
  "Open resume",
  "Work experience",
  "Skills in PyTorch",
  "Skills in MERN stack",
  "Skills in PostgreSQL",
  "Skills in Node.js",
  "Contact details",
  "Career timeline",
  "Achievements",
  "Amazon HackOn",
  "Smart India Hackathon",
  "enable terminal mode",
  "roast my code",
  "favorite tech stack",
  "hire agamjot"
];

export const getSuggestions = (input: string): string[] => {
  const normalized = input.trim().toLowerCase();
  if (!normalized) return [];

  // Match suggestions that start with or contain the query
  return SUGGESTIONS.filter(s => {
    const sLower = s.toLowerCase();
    return sLower.startsWith(normalized) || (sLower.includes(normalized) && sLower.length - normalized.length < 15);
  }).slice(0, 5); // Return top 5 matches
};
