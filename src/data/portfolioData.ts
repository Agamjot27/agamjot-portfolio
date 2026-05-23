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
  screenshots?: string[];  // up to 5 images for the BounceCards preview
  thumbnail?: string;      // small preview image for the search result card
  caseStudy?: {
    problem: string;
    whyBuilt: string;
    users: string;
    impact: string;
    architecture: {
      interface: string;
      orchestration: string;
      auth: string;
      data: string;
      intelligence: string;
    };
    journey: { phase: string; title: string; copy: string }[];
    lessons: { title: string; copy: string }[];
    code: Partial<Record<"frontend" | "backend" | "data" | "intelligence", string>>;
  };
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
  title: "B.Tech IT - ML Research Intern - MERN Full-Stack Developer",
  tagline: "MERN products, PostgreSQL-backed systems, and AI features that ship.",
  email: "agamjot2712@gmail.com",
  phone: "+91 8750394949",
  location: "Manipal, Karnataka, India",
  github: "https://github.com/Agamjot27",
  linkedin: "https://www.linkedin.com/in/agamjot-singh-b50412204/",
  resumeUrl: "/resume.pdf",
  summary:
    "B.Tech IT student at Manipal Institute of Technology with hands-on ML research, MERN full-stack development, PostgreSQL/MongoDB database design, and national-level hackathon results. Targeting SDE internship roles across full-stack, backend, and AI-product engineering.",
  aboutLong:
  "I'm Agamjot Singh, a B.Tech IT student at Manipal Institute of Technology passionate about building scalable full-stack products and exploring applied AI. I work primarily with React, Node.js, PostgreSQL, MongoDB, and Python, focusing on backend architecture, APIs, authentication, and user-centric development. Alongside development, I research computer vision at MIT Manipal, where I've worked on plant disease classification using modern deep learning techniques. I've also placed in competitions like Amazon HackOn and actively contribute to campus initiatives through ACM workshops and placement coordination. Outside academics, I enjoy problem solving and have solved over 300+ problems in DSA while continuously improving as an SDE.",  avatar: "/agamjot-profile.jpeg",
  strengths: [
    "ML depth: transfer learning, multi-loss training, OpenCV preprocessing, and attention mechanisms on real-world vision data.",
    "Full-stack delivery: MERN stack, PostgreSQL, MongoDB, REST APIs, authentication, and security-first backend design.",
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
    id: "revault",
    title: "ReVault — Secure Encrypted Digital Asset Resale",
    screenshots: [
      "/screenshots/revault-home.png",
      "/screenshots/revault-listing.png",
      "/screenshots/revault-checkout.png",
      "/screenshots/revault-trans.png",
      "/screenshots/revault-dashboard.png",
    ],
    thumbnail: "/screenshots/revault-home.png",
    description:
      "React + FastAPI + MongoDB marketplace for encrypted resale of gaming accounts, event tickets, and digital assets.",
    longDescription:
      "Built a secure digital asset marketplace where sensitive credentials are encrypted before storage and asset transfers are backed by integrity checks, signatures, role-based access, admin approval, and blockchain audit records. The platform combines a React/Tailwind marketplace UI, FastAPI backend, MongoDB persistence with Beanie ODM, AES-256-GCM encryption, RSA-2048 key exchange, SHA-256 hashes, RSA-PSS digital signatures, JWT authentication, and Web3 transaction logging.",
    tech: ["React", "FastAPI", "MongoDB", "AES-256-GCM", "RSA-2048", "SHA-256", "JWT", "Web3.py"],
    github: "https://github.com/Agamjot27",
    live: "",
    role: "Full-Stack Security Engineer",
    duration: "October 2025 – December 2025",
    category: "Full-Stack",
    metrics: [
      { label: "Encryption strength", value: "AES-256" },
      { label: "Key exchange", value: "RSA-2048" },
      { label: "Trust layers", value: "5" }
    ],
    keyFeatures: [
      "Three-step asset listing flow that encrypts sensitive credentials before they are stored.",
      "AES-256-GCM encryption with per-asset random keys, IVs, and authentication tags.",
      "RSA-2048/OAEP key exchange so only authorized parties can decrypt asset credentials.",
      "SHA-256 integrity hashes and RSA-PSS digital signatures to detect tampering and prove authenticity.",
      "JWT authentication with user/admin roles, admin approval workflow, and secure credential viewing.",
      "MongoDB asset schema storing encrypted payloads, encrypted keys, signatures, transaction logs, and audit state.",
      "Blockchain integration for immutable asset verification and transaction records."
    ],
    caseStudy: {
      problem:
        "Digital asset resale is risky because credentials can be leaked, modified, or disputed before a buyer receives them. The marketplace needed trust without exposing sensitive data too early.",
      whyBuilt:
        "ReVault was built to make secure resale feel usable: users can list assets normally while encryption, key exchange, integrity checks, signatures, and audit records work behind the scenes.",
      users:
        "Sellers list gaming accounts, event tickets, and digital content; buyers purchase verified assets; admins review encrypted listings, approve assets, and manage trust workflows.",
      impact:
        "The project demonstrates five trust layers: confidentiality, integrity, authenticity, non-repudiation, and role-based access control.",
      architecture: {
        interface:
          "The React 18 + Tailwind frontend includes a marketplace, category filters, list-asset flow, security indicators, verification badges, and an admin dashboard.",
        orchestration:
          "FastAPI exposes documented REST endpoints for authentication, asset listing, encrypted upload, admin review, purchase, decryption, health checks, and blockchain recording.",
        auth:
          "JWT tokens and role-based access separate normal users from admins; bcrypt password hashing protects accounts while admin routes gate sensitive credential operations.",
        data:
          "MongoDB stores users, encrypted asset payloads, encrypted AES keys, SHA-256 data hashes, RSA-PSS signatures, blockchain hashes, status, and audit history.",
        intelligence:
          "The security layer combines AES-256-GCM, RSA-2048/OAEP, SHA-256, RSA-PSS signatures, and Web3 transaction logging to make asset transfer verifiable."
      },
      journey: [
        { phase: "Problem", title: "The marketplace needed trust before transfer", copy: "Selling credentials and digital assets creates a trust gap: sellers should not expose plaintext early, and buyers need proof the asset is legitimate." },
        { phase: "Research", title: "Modeled security guarantees as product features", copy: "The design mapped confidentiality, integrity, authenticity, non-repudiation, access control, and auditability into visible product flows." },
        { phase: "Failed Attempts", title: "A normal CRUD marketplace was not enough", copy: "Basic listings and purchases would not prove ownership or prevent tampering, so encryption metadata and verification records became first-class data." },
        { phase: "Architecture Decisions", title: "Layered cryptography through the backend", copy: "AES protects asset credentials, RSA protects AES keys, hashes verify integrity, signatures prove origin, and blockchain records preserve audit history." },
        { phase: "Optimization", title: "Made complex security inspectable", copy: "The UI surfaces encryption status, verification badges, admin approval, category filters, and encrypted payload views so judges can see the trust system working." },
        { phase: "Final Outcome", title: "A secure resale platform with an audit trail", copy: "ReVault combines a polished marketplace with a cryptographic backend and blockchain logging to demonstrate secure digital asset transfer." }
      ],
      lessons: [
        { title: "Technical lesson", copy: "Security features are easier to trust when the data model stores proof: ciphertext, IV, tag, encrypted key, hash, signature, and transaction hash." },
        { title: "Mistake corrected", copy: "The platform could not treat encryption as a hidden backend utility; users and admins needed visible verification states." },
        { title: "Scaling insight", copy: "Production readiness would require HSM-backed key storage, key rotation, load balancing, sharding, CDN-backed files, formal audits, and penetration testing." },
        { title: "Design tradeoff", copy: "The demo prioritizes transparent security and judge-friendly flows, while production would add stronger privacy controls such as multi-signature flows and zero-knowledge proofs." }
      ],
      code: {
        frontend: "<SecurityBadge status='AES-256 encrypted' />\n<CategoryFilter value={category} onChange={setCategory} />\n<ListAssetStep sensitiveFields={credentials} />",
        backend: "encrypted = aes_gcm.encrypt(credentials, asset_key)\nencrypted_key = rsa_oaep.encrypt(asset_key, buyer_public_key)\nsignature = rsa_pss.sign(asset_hash, seller_private_key)",
        data: "assets\n  encrypted_data: { ciphertext, iv, tag }\n  encrypted_key: base64_rsa_wrapped_key\n  data_hash: sha256_hash\n  signature: rsa_pss_signature\n  blockchain_hash: transaction_hash",
        intelligence: "verify_hash(ciphertext, data_hash)\nverify_signature(data_hash, signature, seller_public_key)\nrecord_transaction(asset_id, buyer_id, blockchain_hash)"
      }
    }
  },
  {
    id: "call-intelligence-nlp",
    title: "Unified AI Customer Care System",
    screenshots: [
      "/screenshots/nlp-call-dash.png",
      "/screenshots/nlp-call-text.png",
      "/screenshots/nlp-call-smart.png",
      "/screenshots/nlp-call-summ.png",
      "/screenshots/nlp-call-nlp.png",
    ],
    thumbnail: "/screenshots/nlp-call-dash.png",
    description:
      "FastAPI + Streamlit customer support automation platform for L1 chat, grievance routing, and call transcript intelligence.",
    longDescription:
      "Built a modular AI customer care system that automates Level 1 support queries, classifies and routes grievances, and extracts actionable insights from unstructured call transcripts. The system uses a Streamlit frontend, FastAPI REST backend, Pydantic request and response models, and a Groq-powered Llama3-8b NLP service for sentiment analysis, intent detection, response generation, transcript summarization, tag extraction, and context-aware Q&A.",
    tech: ["Python", "FastAPI", "Streamlit", "Pydantic", "Groq API", "Llama3-8b", "NLP"],
    github: "https://github.com/Agamjot27",
    live: "",
    role: "Full-Stack AI Engineer",
    duration: "May 2025 – June 2025",
    category: "ML/AI",
    metrics: [
      { label: "Manual review effort reduced", value: "~40%" },
      { label: "Grievance resolution time reduced", value: "~30%" },
      { label: "Core AI modules", value: "3" }
    ],
    keyFeatures: [
      "L1 automation chatbot with sentiment analysis, intent detection, technical specialization, and escalation prediction.",
      "Smart grievance management that classifies complaints, assigns priority, and suggests relevant departments.",
      "Call intelligence pipeline for transcript summaries, tag/entity extraction, sentiment analysis, and transcript Q&A.",
      "FastAPI service-layer architecture with route handlers for chat, grievance management, and call analysis.",
      "Groq Llama3-8b integration through an OpenAI-compatible client with structured JSON parsing and fallbacks.",
      "Streamlit frontend with three operational tabs and session-state based conversation continuity."
    ],
    caseStudy: {
      problem:
        "Customer support teams deal with long hold times, delayed grievance routing, and large volumes of unstructured call transcripts that are slow to review manually.",
      whyBuilt:
        "The system was built to turn repetitive L1 support and transcript review into an AI-assisted workflow that can answer common issues, route serious complaints, and surface training insights quickly.",
      users:
        "Support managers monitor escalations and quality insights, agents handle routed cases with better context, and customers get faster first responses through text or simulated voice flows.",
      impact:
        "The platform targets roughly 40% less manual transcript review effort and roughly 30% faster grievance resolution through automated classification and routing.",
      architecture: {
        interface: "Streamlit provides a three-tab command surface for L1 automation, grievance management, and call intelligence, while preserving conversation state in st.session_state.",
        orchestration: "FastAPI route handlers validate requests with Pydantic and coordinate service calls for chat, grievance classification, call analysis, and transcript Q&A.",
        auth: "The demo is stateless and unauthenticated; production notes call for JWT/OAuth, rate limiting, CORS hardening, and persistent user/session storage.",
        data: "The current design avoids a database for demo speed, using in-memory frontend session state; production scaling would add PostgreSQL or MongoDB plus Redis caching.",
        intelligence: "A centralized NLP service calls Groq's Llama3-8b model for sentiment, intent, generation, summarization, entity extraction, escalation signals, and context-aware Q&A."
      },
      journey: [
        { phase: "Problem", title: "Support work was slow at the exact points users notice", copy: "The project began with three support bottlenecks: customers waiting on simple issues, grievances being misrouted, and managers manually reading transcripts for quality signals." },
        { phase: "Research", title: "Mapped customer-care work into three AI surfaces", copy: "The system was split into L1 chat automation, grievance routing, and call intelligence so each NLP capability had a clear operational job." },
        { phase: "Failed attempts", title: "Avoided a single generic chatbot", copy: "A plain chatbot would hide the strongest engineering work, so the final design exposes sentiment, intent, specialization, escalation, summaries, and Q&A as separate inspectable outputs." },
        { phase: "Architecture Decisions", title: "Separated HTTP handling from NLP behavior", copy: "FastAPI routers handle validation and orchestration, while the NLP service owns prompts, Groq calls, structured JSON parsing, fallbacks, and business rules." },
        { phase: "Optimization", title: "Designed for scaling beyond the demo", copy: "The stateless backend can be horizontally scaled; the documented next steps include Redis caching, PostgreSQL persistence, queues for LLM calls, and parallel NLP tasks." },
        { phase: "Final Outcome", title: "A modular AI support platform", copy: "The final product demonstrates enterprise support automation with live chat intelligence, grievance triage, transcript summarization, and context-aware transcript questioning." }
      ],
      lessons: [
        { title: "Technical lesson", copy: "LLM products become more reliable when model calls are isolated behind a service layer with schema validation, whitelist checks, and fallback behavior." },
        { title: "Mistake corrected", copy: "The strongest version was not one all-purpose chat box; it was a system that made each NLP decision visible and reviewable." },
        { title: "Scaling insight", copy: "A stateless FastAPI backend is easy to demo and horizontally scale, but production needs persistence, caching, queues, and request prioritization." },
        { title: "Design tradeoff", copy: "Streamlit accelerated delivery and demos, while a production customer-facing version would move the frontend to React or Vue with WebSockets." }
      ],
      code: {
        frontend: "tab_chat, tab_grievance, tab_call = st.tabs([\n  'L1 Automation',\n  'Grievance Management',\n  'Call Intelligence'\n])\nst.session_state.conversation_history.append(user_message)",
        backend: "app.include_router(chatbot.router, prefix='/l1_automation')\napp.include_router(grievance.router, prefix='/grievance_management')\napp.include_router(call_analysis.router, prefix='/call_intelligence')",
        data: "ChatRequest\n  message: str\n  user_id: str\n  conversation_history: list\n\nChatResponse\n  response, sentiment, intent, options, escalate_to_human",
        intelligence: "sentiment = nlp_service.get_sentiment(message)\nintent = nlp_service.get_intent_and_specialization(message)\nreply = nlp_service.get_generative_response(message, history)\nescalate = nlp_service.predict_escalation(sentiment, intent, history)"
      }
    }
  },
  {
    id: "clubops",
    title: "ClubOps — Event & Member App",
    screenshots: [
      "/screenshots/clubops-memdash.png",
      "/screenshots/clubops-profile.png",
      "/screenshots/clubops-event.png",
      "/screenshots/clubops-comm.png",
      "/screenshots/clubops-direc.png",
    ],
    thumbnail: "/screenshots/clubops-memdash.png",
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
    category: "Frameworks & Full-Stack",
    items: [
      { name: "Node.js", level: 86 },
      { name: "Express.js", level: 84 },
      { name: "React / ReactJS", level: 85 },
      { name: "MongoDB", level: 84 },
      { name: "PostgreSQL", level: 82 },
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
    category: "AI / ML",
    items: [
      { name: "PyTorch", level: 90 },
      { name: "TensorFlow", level: 75 },
      { name: "NLP", level: 82 },
      { name: "Computer Vision", level: 86 }
    ]
  },
  {
    category: "Tools & Platforms",
    items: [
      { name: "Docker", level: 78 },
      { name: "Git", level: 88 },
      { name: "PostgreSQL", level: 82 },
      { name: "MongoDB", level: 84 },
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
      "Agamjot combines MERN full-stack development, PostgreSQL/MongoDB database work, secure backend systems, ML research, and 300+ DSA problems. Targeting SDE internships. Top 75 in Amazon HackOn / 52k+. Email agamjot2712@gmail.com or search 'contact' for details."
  },
  "roast my code": {
    title: "Agent roast protocol online",
    subtitle: "Scanning repositories…",
    content:
      "You want a roast? Fine: your LeetCode streak is longer than some of your commit messages, your API naming is probably more dramatic than the actual endpoint, and at least one dashboard button definitely does five jobs. Ship tests next time, legend."
  },
  "why frontend over backend": {
    title: "Why full-stack, not either/or",
    content:
      "Good SDE work sits across product surfaces, APIs, databases, and reliability. Agamjot builds MERN interfaces, Node/Express APIs, PostgreSQL/MongoDB data layers, and AI features so demos become usable products."
  },
  "favorite tech stack": {
    title: "Core arsenal",
    content:
      "MERN stack: MongoDB, Express.js, React, Node.js, with PostgreSQL for relational systems. Python + PyTorch for AI/ML, FastAPI for AI services, Docker/Git/Linux for delivery. 300+ DSA problems on LeetCode & GFG."
  }
};
