// Diagnostic quiz bank — 10 questions per track, each mapped to a skill.
export const PRIMARY_TRACKS = [
  "AI & Machine Learning Engineering",
  "Full-Stack Cloud & TypeScript Architect",
  "Cloud Infrastructure & SRE"
];

export const SKILL_TRACKS = {
  "AI & Machine Learning Engineering": [
    "Tensor Math", "PyTorch", "LLM Architecture", "RAG Systems", "Model Fine-Tuning"
  ],
  "Full-Stack Cloud & TypeScript Architect": [
    "Monorepo Architecture", "High-Concurrency DBs", "REST Routing", "React 19 Server Components", "Distributed Systems"
  ],
  "Cloud Infrastructure & SRE": [
    "Linux Kernel Architecture", "Container Security", "Kubernetes", "Terraform (IaC)", "Observability/SLO Alerting"
  ]
};

export const LEARNING_STYLE_QUESTIONS = [
  {
    skill: "Learning Style",
    q: "When learning a new technology, what is your preferred approach?",
    options: ["Reading RFCs and official documentation", "Code-along with a video tutorial", "Building a small project to break/fix things", "Discussing theoretical concepts with a mentor"],
    correct: 0 
  },
  {
    skill: "Learning Style",
    q: "How do you handle complex technical problems?",
    options: ["Systematic debugging and log analysis", "Visualizing the system flow and components", "Looking for patterns/analogies in other systems", "Jumping straight into experimentation"],
    correct: 0
  }
];

export const QUIZ_BANK = {
  "AI & Machine Learning Engineering": [
    { skill: "Tensor Math", q: "What is the primary function of a tensor in ML?", options: ["Store multi-dimensional data", "Encrypt data", "Format text", "Run UI animations"], correct: 0 },
    { skill: "PyTorch", q: "Which class is the base for all neural networks in PyTorch?", options: ["nn.Module", "torch.Tensor", "nn.Linear", "torch.Optim"], correct: 0 },
    { skill: "LLM Architecture", q: "What is the core component of a Transformer model?", options: ["Attention mechanism", "Recurrent layers", "Convolutional layers", "Fully connected layers"], correct: 0 },
    { skill: "RAG Systems", q: "What does RAG stand for?", options: ["Retrieval-Augmented Generation", "Robust Automated Grouping", "Real-time Advanced Graphs", "Rapid Analytical Growth"], correct: 0 },
    { skill: "Model Fine-Tuning", q: "What is fine-tuning?", options: ["Training a pre-trained model on specific data", "Starting training from scratch", "Optimizing hardware", "Compressing model weights"], correct: 0 }
  ],
  "Full-Stack Cloud & TypeScript Architect": [
    { skill: "Monorepo Architecture", q: "What is the main benefit of a monorepo?", options: ["Unified dependency management and code sharing", "Isolating codebases completely", "Decreasing build times always", "Easier deployment to different clouds"], correct: 0 },
    { skill: "High-Concurrency DBs", q: "What is a major strategy for handling high-concurrency DB access?", options: ["Read replicas and sharding", "Single database node", "Never indexing", "Using unoptimized queries"], correct: 0 },
    { skill: "REST Routing", q: "Which HTTP method is typically used to create a resource?", options: ["POST", "GET", "DELETE", "PUT"], correct: 0 },
    { skill: "React 19 Server Components", q: "What is the primary benefit of React Server Components?", options: ["Reduced client-side bundle size", "More client-side complexity", "Increased server overhead", "No server-side rendering"], correct: 0 },
    { skill: "Distributed Systems", q: "What is a challenge in distributed systems?", options: ["Consistency and partitioning", "Easy debugging", "Infinite bandwidth", "Zero latency"], correct: 0 }
  ],
  "Cloud Infrastructure & SRE": [
    { skill: "Linux Kernel Architecture", q: "What is the purpose of the Linux kernel?", options: ["Manage hardware resources and system services", "Compile website CSS", "Direct user marketing", "Manage SQL databases"], correct: 0 },
    { skill: "Container Security", q: "What is a security best practice for containers?", options: ["Use minimal base images and scan for vulnerabilities", "Run everything as root", "Never use read-only filesystems", "Allow all network ports"], correct: 0 },
    { skill: "Kubernetes", q: "What is a Kubernetes Deployment?", options: ["A declarative way to manage Pod replicas", "A physical server", "A database schema", "A UI component"], correct: 0 },
    { skill: "Terraform (IaC)", q: "What is the primary function of Terraform?", options: ["Infrastructure as Code provisioning", "Executing JavaScript", "Debugging React code", "Managing email campaigns"], correct: 0 },
    { skill: "Observability/SLO Alerting", q: "What is an SLO?", options: ["Service Level Objective", "Service Level Operation", "System Loading Optimization", "Super Low Overhead"], correct: 0 }
  ]
};

export function getQuizForTrack(trackName) {
  if (!trackName) return QUIZ_BANK["Software Engineering"];

  // Direct match
  if (QUIZ_BANK[trackName]) {
    return QUIZ_BANK[trackName];
  }

  // Fuzzy match with existing track banks
  const lower = trackName.toLowerCase();
  if (lower.includes("cyber") || lower.includes("security") || lower.includes("hack") || lower.includes("infosec")) {
    return QUIZ_BANK["Cybersecurity"];
  }
  if (lower.includes("devops") || lower.includes("cloud") || lower.includes("infra") || lower.includes("sre") || lower.includes("kubernetes")) {
    return QUIZ_BANK["Cloud & DevOps"];
  }
  if (lower.includes("data") || lower.includes("ml") || lower.includes("ai") || lower.includes("learning") || lower.includes("analytics")) {
    return QUIZ_BANK["Data Science"];
  }
  if (lower.includes("product") || lower.includes("manage") || lower.includes("strategy") || lower.includes("founder")) {
    return QUIZ_BANK["Product Management"];
  }
  if (lower.includes("design") || lower.includes("ux") || lower.includes("ui") || lower.includes("figma") || lower.includes("frontend")) {
    return QUIZ_BANK["UX Design"];
  }

  // Intelligent tailored generator for custom tracks
  const customSkills = [
    `${trackName} Fundamentals`,
    "System Architecture",
    "Best Practices & Standards",
    "Tooling & Ecosystem",
    "Performance Optimization",
    "Security & Reliability",
    "Data Handling & APIs",
    "Testing & Quality Assurance",
    "Deployment & Scaling",
    "Advanced Problem Solving"
  ];

  return customSkills.map((skill, index) => ({
    skill,
    q: `In ${trackName} (${skill}), which core principle is most vital for high-performance production readiness?`,
    options: [
      `Establishing robust ${skill.toLowerCase()} architecture with automated validation`,
      "Relying solely on default unconfigured starter boilerplates",
      "Deferring all testing and benchmarks until post-production release",
      "Hardcoding environment parameters directly in source scripts"
    ],
    correct: 0
  }));
}

export function getSkillListForTrack(trackName) {
  if (!trackName) return SKILL_TRACKS["Software Engineering"];
  if (SKILL_TRACKS[trackName]) return SKILL_TRACKS[trackName];

  const quiz = getQuizForTrack(trackName);
  return quiz.map((q) => q.skill);
}
