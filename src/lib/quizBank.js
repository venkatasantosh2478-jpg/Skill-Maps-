// Diagnostic quiz bank — 10 questions per track, each mapped to a skill.
export const PRIMARY_TRACKS = [
  "Software Engineering",
  "Data Science",
  "Product Management",
  "UX Design"
];

export const SKILL_TRACKS = {
  "Software Engineering": [
    "JavaScript", "React", "Node.js", "Databases", "System Design",
    "Algorithms", "Git", "Testing", "API Design", "Cloud Deployment"
  ],
  "Data Science": [
    "Python", "Statistics", "SQL", "Machine Learning", "Data Visualization",
    "Pandas", "Deep Learning", "NLP", "Experimentation", "Cloud ML"
  ],
  "Product Management": [
    "User Research", "Roadmapping", "Analytics", "A/B Testing", "Stakeholder Mgmt",
    "Prioritization", "Go-to-Market", "Wireframing", "Pricing", "Strategy"
  ],
  "UX Design": [
    "User Research", "Wireframing", "Prototyping", "Visual Design", "Figma",
    "Usability Testing", "Design Systems", "Interaction Design", "Accessibility", "Information Architecture"
  ],
  "Cybersecurity": [
    "Network Security", "Cryptography", "Penetration Testing", "Vulnerability Assessment", "Incident Response",
    "OWASP Top 10", "Identity & Access Mgmt", "SIEM & SOC", "Cloud Security", "Threat Modeling"
  ],
  "Cloud & DevOps": [
    "Linux Systems", "Docker", "Kubernetes", "CI/CD Pipelines", "Terraform & IaC",
    "Cloud Architecture", "Monitoring & Observability", "Networking", "GitOps", "Security Hardening"
  ],
  "Game Development": [
    "Game Engines (Unity/Unreal)", "3D Math & Physics", "C# / C++", "Shaders & Graphics", "Gameplay Systems",
    "AI & Pathfinding", "Game Design", "Optimization", "Audio & Sound FX", "Multiplayer Architecture"
  ],
  "Blockchain & Web3": [
    "Smart Contracts (Solidity)", "Ethereum & EVM", "DeFi Protocols", "Cryptography & ZK", "Web3.js / Ethers.js",
    "Security Auditing", "Decentralized Storage (IPFS)", "Tokenomics", "Consensus Mechanisms", "Layer 2 Scaling"
  ],
  "Mobile Development": [
    "React Native / Flutter", "Swift & iOS", "Kotlin & Android", "State Management", "Mobile UI Patterns",
    "Offline Storage", "Push Notifications", "App Store Deployment", "Performance & Memory", "Mobile Security"
  ]
};

export const QUIZ_BANK = {
  "Software Engineering": [
    { skill: "JavaScript", q: "What does `Array.prototype.map` return?", options: ["A new array", "The same array mutated", "A boolean", "undefined"], correct: 0 },
    { skill: "React", q: "Which hook runs side effects after render?", options: ["useState", "useMemo", "useEffect", "useRef"], correct: 2 },
    { skill: "Node.js", q: "Node.js is built on which JS engine?", options: ["SpiderMonkey", "V8", "Chakra", "JavaScriptCore"], correct: 1 },
    { skill: "Databases", q: "Which is a NoSQL database?", options: ["PostgreSQL", "MySQL", "MongoDB", "SQLite"], correct: 2 },
    { skill: "System Design", q: "What does a load balancer do?", options: ["Stores cache", "Distributes traffic across servers", "Compiles code", "Encrypts data"], correct: 1 },
    { skill: "Algorithms", q: "Worst-case time complexity of quicksort?", options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], correct: 2 },
    { skill: "Git", q: "Which command creates a new branch and switches to it?", options: ["git branch new", "git checkout -b new", "git merge new", "git commit new"], correct: 1 },
    { skill: "Testing", q: "What does a unit test verify?", options: ["Whole app flow", "A single function/component", "Network speed", "UI styling"], correct: 1 },
    { skill: "API Design", q: "What does REST stand for?", options: ["Remote State Transfer", "Representational State Transfer", "Reliable Service Transport", "Request Event Stream"], correct: 1 },
    { skill: "Cloud Deployment", q: "Which is a containerization tool?", options: ["Docker", "Webpack", "Babel", "ESLint"], correct: 0 }
  ],
  "Data Science": [
    { skill: "Python", q: "Which keyword defines a function in Python?", options: ["function", "def", "fn", "lambda"], correct: 1 },
    { skill: "Statistics", q: "The median is less affected by what than the mean?", options: ["Sample size", "Outliers", "Variance", "Mode"], correct: 1 },
    { skill: "SQL", q: "Which clause filters grouped rows?", options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"], correct: 1 },
    { skill: "Machine Learning", q: "Which algorithm is used for classification?", options: ["K-Means", "Linear Regression", "Random Forest", "PCA"], correct: 2 },
    { skill: "Data Visualization", q: "Best chart for showing part-of-whole?", options: ["Line chart", "Pie chart", "Scatter plot", "Box plot"], correct: 1 },
    { skill: "Pandas", q: "Which object is a 2D labeled table?", options: ["Series", "DataFrame", "Array", "Tensor"], correct: 1 },
    { skill: "Deep Learning", q: "Which framework is popular for neural networks?", options: ["Pandas", "Matplotlib", "PyTorch", "Scikit-learn"], correct: 2 },
    { skill: "NLP", q: "What does TF-IDF measure?", options: ["Image pixels", "Word importance in a document", "Network latency", "File size"], correct: 1 },
    { skill: "Experimentation", q: "What is a control group?", options: ["The variant tested", "The baseline not changed", "A random sample", "The hypothesis"], correct: 1 },
    { skill: "Cloud ML", q: "Which is a managed ML platform?", options: ["AWS SageMaker", "GitHub", "Figma", "Notion"], correct: 0 }
  ],
  "Product Management": [
    { skill: "User Research", q: "What is a persona?", options: ["A real customer", "A fictional user archetype", "A competitor", "A feature list"], correct: 1 },
    { skill: "Roadmapping", q: "A roadmap primarily communicates?", options: ["Code architecture", "Strategy and priorities over time", "Bug reports", "Marketing copy"], correct: 1 },
    { skill: "Analytics", q: "What is a funnel?", options: ["A bug tracker", "Steps users take toward a goal", "A pricing model", "A team structure"], correct: 1 },
    { skill: "A/B Testing", q: "In A/B testing, what is the 'B'?", options: ["The control", "The variant", "The baseline", "The hypothesis"], correct: 1 },
    { skill: "Stakeholder Mgmt", q: "Best way to align stakeholders?", options: ["Avoid them", "Regular clear communication", "Only email", "Delegating all decisions"], correct: 1 },
    { skill: "Prioritization", q: "RICE stands for Reach, Impact, Confidence, and?", options: ["Effort", "Engagement", "Expense", "Equity"], correct: 0 },
    { skill: "Go-to-Market", q: "GTM strategy defines how to?", options: ["Write code", "Deliver a product to users", "Hire engineers", "Design logos"], correct: 1 },
    { skill: "Wireframing", q: "A wireframe is a?", options: ["Final polished design", "Low-fidelity layout sketch", "Database schema", "Marketing plan"], correct: 1 },
    { skill: "Pricing", q: "Freemium means?", options: ["Free trial only", "Free base + paid premium features", "Always paid", "Donation based"], correct: 1 },
    { skill: "Strategy", q: "A moat in business refers to?", options: ["A marketing campaign", "A durable competitive advantage", "A bug", "A roadmap item"], correct: 1 }
  ],
  "UX Design": [
    { skill: "User Research", q: "What is contextual inquiry?", options: ["A survey", "Observing users in their environment", "A/B testing", "Heatmapping"], correct: 1 },
    { skill: "Wireframing", q: "Wireframes should focus on?", options: ["Color palette", "Structure and layout", "Logo design", "Animations"], correct: 1 },
    { skill: "Prototyping", q: "A high-fidelity prototype?", options: ["Is hand-drawn", "Interacts like the real product", "Has no visuals", "Is only text"], correct: 1 },
    { skill: "Visual Design", q: "Which is a principle of visual hierarchy?", options: ["Random spacing", "Contrast and scale", "Uniform size", "No color"], correct: 1 },
    { skill: "Figma", q: "In Figma, a reusable component is called a?", options: ["Layer", "Component", "Frame only", "Slice"], correct: 1 },
    { skill: "Usability Testing", q: "How many users uncover most usability issues?", options: ["1", "5-8", "100", "50+"], correct: 1 },
    { skill: "Design Systems", q: "A design system provides?", options: ["Random styles", "Shared reusable components and tokens", "Only colors", "Marketing text"], correct: 1 },
    { skill: "Interaction Design", q: "Microinteractions are?", options: ["Large page transitions", "Small, focused product moments", "Backend logic", "Database queries"], correct: 1 },
    { skill: "Accessibility", q: "WCAG helps ensure?", options: ["Faster load times", "Usability for people with disabilities", "Better SEO", "Cheaper hosting"], correct: 1 },
    { skill: "Information Architecture", q: "Information architecture is about?", options: ["Organizing content so users find it", "Choosing fonts", "Writing code", "Pricing"], correct: 0 }
  ],
  "Cybersecurity": [
    { skill: "Network Security", q: "What is the primary function of a stateful firewall?", options: ["Filter traffic by inspecting active connection state", "Encrypt hard drives", "Generate passwords", "Compile code"], correct: 0 },
    { skill: "Cryptography", q: "Which of the following is an asymmetric encryption algorithm?", options: ["AES-256", "RSA", "DES", "RC4"], correct: 1 },
    { skill: "OWASP Top 10", q: "What does SQL Injection (SQLi) allow an attacker to do?", options: ["Crash the client browser", "Execute arbitrary queries on the database", "Modify DNS records", "Overclock the CPU"], correct: 1 },
    { skill: "Vulnerability Assessment", q: "What is the Common Vulnerability Scoring System (CVSS) range?", options: ["0 to 10", "1 to 100", "A to F", "Low to Urgent"], correct: 0 },
    { skill: "Identity & Access Mgmt", q: "What does MFA (Multi-Factor Authentication) require?", options: ["Two or more distinct authentication factors", "A 16-character password", "Biometric face scan only", "Captcha verification"], correct: 0 },
    { skill: "Penetration Testing", q: "What phase follows reconnaissance in a penetration test?", options: ["Reporting", "Scanning and enumeration", "Cleanup", "Invoicing"], correct: 1 },
    { skill: "SIEM & SOC", q: "What is the primary role of a SIEM system?", options: ["Aggregate and correlate security logs across systems", "Deploy containers", "Render 3D graphics", "Speed up internet queries"], correct: 0 },
    { skill: "Cloud Security", q: "Under the Shared Responsibility Model, who secures customer data in AWS/GCP?", options: ["The cloud provider", "The customer / organization", "Third-party ISP", "No one"], correct: 1 },
    { skill: "Incident Response", q: "What is the first step when containing an active malware compromise?", options: ["Isolate affected systems from the network", "Post on social media", "Reboot the server immediately", "Delete all database tables"], correct: 0 },
    { skill: "Threat Modeling", q: "What does the STRIDE threat modeling framework stand for?", options: ["Spoofing, Tampering, Repudiation, Info Disclosure, DoS, Elevation of Privilege", "Security, Testing, Resilience, Integrity, Defense, Encryption", "Speed, Throughput, Reliability, Identity, Data, Execution", "None of the above"], correct: 0 }
  ],
  "Cloud & DevOps": [
    { skill: "Linux Systems", q: "Which Linux command displays active processes and memory usage?", options: ["top / htop", "cat", "chmod", "grep"], correct: 0 },
    { skill: "Docker", q: "What is the purpose of a Docker multi-stage build?", options: ["Optimize image size by copying only necessary artifacts", "Run containers in parallel", "Encrypt docker images", "Increase RAM size"], correct: 0 },
    { skill: "Kubernetes", q: "In Kubernetes, what is the smallest deployable computing unit?", options: ["Pod", "Node", "Cluster", "Namespace"], correct: 0 },
    { skill: "CI/CD Pipelines", q: "What is the main goal of Continuous Integration (CI)?", options: ["Automatically build and test code changes frequently", "Manually deploy code on weekends", "Store backup archives", "Generate user invoices"], correct: 0 },
    { skill: "Terraform & IaC", q: "What does Terraform state file track?", options: ["Current mapping of real-world resources to configuration", "User passwords", "Operating system kernels", "Git commits"], correct: 0 },
    { skill: "Cloud Architecture", q: "Which architecture pattern decouples services via message queues?", options: ["Event-driven architecture", "Monolithic architecture", "Single-threaded model", "Static HTML hosting"], correct: 0 },
    { skill: "Monitoring & Observability", q: "What are the three pillars of modern observability?", options: ["Metrics, Logs, and Traces", "CPU, RAM, and Disk", "HTML, CSS, and JS", "Git, Docker, and K8s"], correct: 0 },
    { skill: "Networking", q: "What is the CIDR notation /24 equivalent to in subnet mask?", options: ["255.255.255.0", "255.255.0.0", "255.0.0.0", "255.255.255.255"], correct: 0 },
    { skill: "GitOps", q: "In GitOps, what serves as the single source of truth for infrastructure state?", options: ["Git repository", "Local developer laptop", "Cloud dashboard UI", "Slack channel"], correct: 0 },
    { skill: "Security Hardening", q: "What is the principle of least privilege (PoLP)?", options: ["Granting only the minimal necessary access permissions", "Granting full root access to all devs", "Disabling SSH entirely", "Using open Wi-Fi"], correct: 0 }
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
