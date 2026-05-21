export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  tech: string[];
  github: string;
  live: string;
  metrics?: { label: string; value: string }[];
  category: "ML/AI" | "Frontend" | "Full-Stack";
  keyFeatures: string[];
  role: string;
  duration?: string;
  screenshot?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  duration: string;
  description: string[];
  tech: string[];
  highlights?: string[];
  type?: "work" | "research" | "volunteer";
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  location: string;
  duration: string;
  gpa?: string;
  details?: string[];
}

export interface SkillCategory {
  category: string;
  items: { name: string; level: number; icon?: string }[];
}

export interface Bio {
  name: string;
  title: string;
  tagline: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  resumeUrl: string;
  summary: string;
  aboutLong: string;
  avatar: string;
  strengths: string[];
  interests: string[];
}

export const bio: Bio = {
  name: "Agamjot Singh",
  title: "B.Tech IT · ML Research Intern · Full-Stack Developer",
  tagline: "Deep learning research, secure backends, and apps that ship.",
  email: "agamjot2712@gmail.com",
  phone: "+91 8750394949",
  location: "Manipal, Karnataka, India",
  github: "https://github.com/Agamjot27",
  linkedin: "linkedin.com/in/agamjot-singh-b50412204/",
  resumeUrl: "/resume.pdf",
  summary:
    "B.Tech IT student at Manipal Institute of Technology with hands-on ML research (ConvNeXt, contrastive learning), full-stack builds (FastAPI, Flutter, React), and national-level hackathon results. Open to internships and new-grad roles in AI, backend, and product engineering.",
  aboutLong:
    "I'm Agamjot Singh, a B.Tech Information Technology student at Manipal Institute of Technology (GPA 7.99). I research computer vision at MIT Manipal—building a 39-class plant disease classifier with ConvNeXt, label-aware attention, and CLIP-style contrastive learning (~95% accuracy). Outside the lab I ship full-stack products: NLP call analytics with LLMs, an encrypted digital-asset resale platform, and a Firebase-powered club operations app. I've ranked top 75 in Amazon HackOn (52k+ participants) and was top-2 waitlisted for Smart India Hackathon 2025 (Ministry of Steel / NMDC). I also lead placement coordination and ACM workshops on campus. I'm strongest in Python, PyTorch, and React, with 300+ DSA problems solved on LeetCode and GFG.",
  avatar: "/agamjot-profile.jpeg",
  strengths: [
    "ML depth: transfer learning, multi-loss training, OpenCV preprocessing, and attention mechanisms on real-world vision data.",
    "Full-stack delivery: Streamlit, FastAPI, MySQL, Flutter, Firebase, and REST APIs with security-first design (AES/RSA).",
    "Competitive engineering: Amazon HackOn top 75 / 52k+ and SIH 2025 national waitlist (Ministry of Steel).",
    "Community leadership: placement drives, career workshops for 300+ students, and ACM tech education."
  ],
  interests: [
    "Computer vision & multimodal learning",
    "NLP & LLM-powered product features",
    "Secure marketplaces & cryptography",
    "Competitive programming & hackathons"
  ]
};

export const projects: Project[] = [
  {
    id: "call-intelligence-nlp",
    title: "Call Intelligence via NLP",
    description:
      "Full-stack Streamlit app for real-time customer support call analysis using NLP and LLMs.",
    longDescription:
      "Architected a Streamlit web application that ingests customer support call transcripts and runs automated analysis pipelines. Integrated Mistral AI and Groq APIs for sentiment analysis, urgency detection, issue classification, and call summarisation—cutting manual transcript review effort by roughly 40%.",
    tech: ["Python", "Streamlit", "NLP", "Mistral AI", "Groq API", "LLMs"],
    github: "https://github.com/Agamjot27",
    live: "",
    role: "Full-Stack Developer",
    duration: "May 2025 – June 2025",
    category: "ML/AI",
    metrics: [
      { label: "Manual effort reduced", value: "~40%" },
      { label: "Analysis modes", value: "4+" }
    ],
    keyFeatures: [
      "Real-time transcript ingestion and analysis dashboard.",
      "Sentiment, urgency, and issue-type classification pipelines.",
      "LLM-powered call summarisation via Mistral and Groq.",
      "Streamlit UI for fast iteration and demo-ready workflows."
    ]
  },
  {
    id: "revault",
    title: "ReVault — Secure Encrypted Digital Asset Resale",
    description:
      "FastAPI + MySQL marketplace for secure resale of tickets and gaming accounts with end-to-end encryption.",
    longDescription:
      "Built a marketplace enabling secure resale of digital assets. Implemented AES-256 encryption for stored assets, RSA key exchange for buyer-only decryption, SHA-256 integrity checks, and digital signatures to prevent tampering. Delivered scalable REST APIs for upload, listing, and transfer with role-based access control.",
    tech: ["FastAPI", "Python", "MySQL", "AES-256", "RSA", "REST APIs"],
    github: "https://github.com/Agamjot27",
    live: "",
    role: "Backend & Security Engineer",
    duration: "October 2025 – December 2025",
    category: "Full-Stack",
    metrics: [
      { label: "Encryption", value: "AES-256 + RSA" },
      { label: "Integrity", value: "SHA-256" }
    ],
    keyFeatures: [
      "Encrypted asset storage and buyer-only decryption flow.",
      "Tamper detection via hashing and digital signatures.",
      "Role-based access control across marketplace APIs.",
      "Listing, upload, and secure transfer endpoints."
    ]
  },
  {
    id: "clubops",
    title: "ClubOps — Event & Member App",
    description:
      "Cross-platform club app for events and member communication, serving 100+ users.",
    longDescription:
      "Led development of a cross-platform application to streamline club events and member communication. Used Firebase Authentication for secure login, Cloud Firestore for real-time data, and Cloud Messaging for push notifications—supporting 100+ active users.",
    tech: ["Flutter", "Firebase Auth", "Cloud Firestore", "FCM", "Dart"],
    github: "https://github.com/Agamjot27",
    live: "",
    role: "Lead Developer",
    duration: "June 2025 – August 2025",
    category: "Full-Stack",
    metrics: [
      { label: "Active users", value: "100+" },
      { label: "Platform", value: "Cross-platform" }
    ],
    keyFeatures: [
      "Firebase Authentication and secure session handling.",
      "Real-time event and member data with Firestore.",
      "Push notifications via Firebase Cloud Messaging.",
      "Event scheduling and member communication workflows."
    ]
  }
];

export const experience: Experience[] = [
  {
    id: "mit-research-intern",
    company: "MIT Manipal",
    role: "Research Intern",
    location: "Manipal, Karnataka, India",
    duration: "May 2025 – Present",
    type: "research",
    description: [
      "Built a ConvNeXt-based multi-class plant disease classifier (39 classes) achieving ~95% accuracy using transfer learning.",
      "Designed a label-aware attention mechanism (inspired by Q2L) to improve class-specific feature learning.",
      "Integrated contrastive learning (CLIP-style) with a custom multi-loss framework, boosting accuracy by 15% and stabilizing training.",
      "Applied OpenCV-based CLAHE and advanced augmentations to improve robustness under real-world conditions."
    ],
    tech: ["PyTorch", "ConvNeXt", "OpenCV", "Contrastive Learning", "Python", "Computer Vision"],
    highlights: [
      "39-class plant disease classification pipeline.",
      "~95% accuracy with transfer learning and custom multi-loss training."
    ]
  },
  {
    id: "placement-coordinator",
    company: "MIT Manipal — Placement Team",
    role: "Placement Team Coordinator",
    location: "Manipal, Karnataka, India",
    duration: "December 2024 – Present",
    type: "volunteer",
    description: [
      "Coordinated campus placement drives with 10+ recruiters, streamlining logistics for smooth execution and high student participation.",
      "Led 5+ career workshops for 300+ students on resume writing, interview skills, and professional communication."
    ],
    tech: ["Event coordination", "Communication", "Career coaching"],
    highlights: ["10+ recruiter partnerships", "300+ students in career workshops"]
  },
  {
    id: "acm-core",
    company: "ACM Manipal",
    role: "Core Committee Member",
    location: "Manipal, Karnataka, India",
    duration: "September 2024 – Present",
    type: "volunteer",
    description: [
      "Conducted workshops on AI, ML, and CNNs, training 100+ students in core concepts and applications.",
      "Helped organise ACM's tech competition during TechTatva, engaging 200+ participants."
    ],
    tech: ["AI/ML education", "Workshop delivery", "Event management"],
    highlights: ["100+ students trained", "200+ TechTatva participants"]
  }
];

export const education: Education[] = [
  {
    id: "mit-btech",
    institution: "Manipal Institute of Technology",
    degree: "Bachelor of Technology — Information Technology",
    location: "Karnataka, India",
    duration: "June 2023 – May 2027",
    gpa: "7.99 / 10",
    details: ["B.Tech in IT with focus on software engineering, ML, and systems."]
  },
  {
    id: "mota-singh-xii",
    institution: "S.S. Mota Singh Sr. Sec. Model School",
    degree: "Class XII",
    location: "Delhi, India",
    duration: "June 2011 – March 2023",
    gpa: "90%",
    details: ["Senior secondary education."]
  }
];

export const skills: SkillCategory[] = [
  {
    category: "Languages",
    items: [
      { name: "Python", level: 92 },
      { name: "C++", level: 85 },
      { name: "JavaScript", level: 88 },
      { name: "Java", level: 78 },
      { name: "SQL", level: 82 }
    ]
  },
  {
    category: "Frameworks & ML",
    items: [
      { name: "PyTorch", level: 90 },
      { name: "TensorFlow", level: 75 },
      { name: "React / ReactJS", level: 85 },
      { name: "Flutter", level: 80 },
      { name: "FastAPI", level: 82 }
    ]
  },
  {
    category: "DSA & Problem Solving",
    items: [
      { name: "LeetCode", level: 85 },
      { name: "GeeksforGeeks", level: 85 },
      { name: "Arrays & Strings", level: 88 },
      { name: "Graphs & DP", level: 82 }
    ]
  },
  {
    category: "Tools & Platforms",
    items: [
      { name: "Docker", level: 78 },
      { name: "Git", level: 88 },
      { name: "MySQL", level: 82 },
      { name: "Firebase", level: 80 },
      { name: "Android Studio", level: 72 },
      { name: "Azure Fundamentals", level: 70 },
      { name: "Linux & Shell", level: 80 },
      { name: "Jupyter & VS Code", level: 90 }
    ]
  }
];

export const achievements = [
  {
    title: "Amazon HackOn — Season 5",
    date: "May – June 2025",
    description:
      "Ranked among the top 75 out of 52,000+ participants for excellence in algorithmic problem-solving and coding efficiency. Recognised by Amazon for outstanding performance in one of India's largest coding contests."
  },
  {
    title: "Smart India Hackathon 2025 — Software (Ministry of Steel, NMDC)",
    date: "2025",
    description:
      "Ranked among the top 2 waitlisted teams nationwide for SIH 2025 under the Ministry of Steel (NMDC) problem statement on AI-driven energy optimisation in iron ore mining."
  }
];

export const easterEggs: Record<string, { title: string; subtitle?: string; content: string; extraHtml?: string }> = {
  "hire agamjot": {
    title: "Hiring signal",
    subtitle: "Available for internships & new grad (2027)",
    content:
      "Agamjot combines ML research (ConvNeXt, contrastive learning), secure full-stack systems (FastAPI, encryption), and shipped apps (Flutter, Streamlit). Top 75 in Amazon HackOn / 52k+. Email agamjot2712@gmail.com or search 'contact' for details."
  },
  "roast my code": {
    title: "Agent roast protocol online",
    subtitle: "Scanning repositories…",
    content:
      "You want a roast? Fine: your LeetCode streak is longer than some of your commit messages, you have more loss functions than integration tests, and that one Streamlit app definitely has a button labeled 'Run' that does everything. Ship tests next time, legend."
  },
  "why frontend over backend": {
    title: "Why full-stack, not either/or",
    content:
      "ML models only matter when people can use them. Agamjot builds the model (PyTorch, OpenCV) and the surface (Streamlit, Flutter, React) so demos become products—not notebooks stuck on localhost."
  },
  "favorite tech stack": {
    title: "Core arsenal",
    content:
      "Python + PyTorch for vision/NLP, FastAPI + MySQL for APIs, Flutter + Firebase for mobile, React for web. Tools: Docker, Git, Linux. 300+ DSA problems on LeetCode & GFG."
  }
};
