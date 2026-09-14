// Mentorship Data: Verified industry mentors, availability, and session topics

export const MENTORSHIP_TOPICS = [
  { id: "mock_interview", name: "Technical Mock Interview", desc: "Live coding or system architecture interview with instant rubric feedback", duration: "45 mins" },
  { id: "resume_audit", name: "Resume & Portfolio Critique", desc: "Line-by-line review targeted for FAANG, tier-1 tech, or consulting ATS systems", duration: "30 mins" },
  { id: "career_roadmap", name: "Career Transition & Roadmap Audit", desc: "Strategic mapping from student/junior into high-impact staff or leadership roles", duration: "45 mins" },
  { id: "system_design", name: "High-Scale System Architecture", desc: "Deep dive into distributed systems, bottlenecks, trade-offs, and scaling patterns", duration: "60 mins" },
  { id: "consulting_case", name: "Consulting Case & Strategy Prep", desc: "Business problem structuring, client stakeholder roleplay, and case frameworks", duration: "45 mins" }
];

export const INITIAL_MENTORS = [
  {
    id: "mentor_1",
    name: "David Kim",
    role: "Principal Software Architect",
    company: "Stripe (ex-Google)",
    sector: "Software & Cloud Systems",
    sectorId: "software-engineering",
    experience: "12 years",
    rating: 4.98,
    totalSessions: 142,
    location: "San Francisco, CA (Remote)",
    avatarBg: "from-blue-600 to-indigo-700",
    initials: "DK",
    bio: "Ex-Google Staff Engineer, now leading global payment infrastructure at Stripe. Mentored 100+ engineers from college graduates to Staff engineers. Passionate about distributed systems, resilient concurrency, and technical interview mastery.",
    specialties: ["Distributed Systems", "Cloud Architecture (AWS/GCP)", "Go & Java High Scale", "Staff Engineering Career Path", "System Design"],
    nextAvailableSlot: "Tomorrow at 10:00 AM",
    availableSlots: [
      { date: "Tomorrow", time: "10:00 AM" },
      { date: "Tomorrow", time: "2:30 PM" },
      { date: "Wednesday", time: "11:00 AM" },
      { date: "Thursday", time: "4:00 PM" }
    ],
    verifiedBadge: "Verified Staff Mentor"
  },
  {
    id: "mentor_2",
    name: "Amina Diallo",
    role: "Senior Director, Digital Strategy & IT Advisory",
    company: "Accenture Technology Strategy",
    sector: "Service Sector & Consulting",
    sectorId: "service-consulting",
    experience: "10 years",
    rating: 4.96,
    totalSessions: 98,
    location: "New York, NY (Remote)",
    avatarBg: "from-emerald-600 to-teal-700",
    initials: "AD",
    bio: "Advising Fortune 100 CIOs on cloud migration, enterprise software rollout (ServiceNow/Salesforce), and operational process transformation. Specialist in case interviews and helping engineers break into strategic technology consulting.",
    specialties: ["IT Transformation", "Enterprise Consulting", "Client Stakeholder Management", "Case Interview Prep", "Digital Operations"],
    nextAvailableSlot: "Wednesday at 1:30 PM",
    availableSlots: [
      { date: "Wednesday", time: "1:30 PM" },
      { date: "Thursday", time: "10:00 AM" },
      { date: "Friday", time: "3:00 PM" }
    ],
    verifiedBadge: "Advisory Leader"
  },
  {
    id: "mentor_3",
    name: "Dr. Marcus Johnson",
    role: "Staff AI Research Scientist",
    company: "Anthropic",
    sector: "Artificial Intelligence & Data Systems",
    sectorId: "ai-data-science",
    experience: "9 years",
    rating: 4.99,
    totalSessions: 165,
    location: "Seattle, WA (Remote)",
    avatarBg: "from-violet-600 to-purple-800",
    initials: "MJ",
    bio: "PhD in Computer Science (Stanford). Leads research on LLM alignment, context-aware reasoning, and production evaluation. Helps students bridge academic research with real-world generative AI production deployments.",
    specialties: ["LLMs & RAG Architectures", "PyTorch / CUDA", "AI Safety & Evaluation", "Research to Production", "PhD/Career Transition"],
    nextAvailableSlot: "Thursday at 3:00 PM",
    availableSlots: [
      { date: "Thursday", time: "3:00 PM" },
      { date: "Friday", time: "11:30 AM" },
      { date: "Monday", time: "1:00 PM" }
    ],
    verifiedBadge: "AI Scientist"
  },
  {
    id: "mentor_4",
    name: "Priya Patel",
    role: "VP of Product Engineering & FinTech Ops",
    company: "Brex (ex-Goldman Sachs)",
    sector: "FinTech & Financial Services",
    sectorId: "fintech-finance",
    experience: "11 years",
    rating: 4.97,
    totalSessions: 114,
    location: "London, UK (Remote)",
    avatarBg: "from-amber-600 to-orange-700",
    initials: "PP",
    bio: "Led engineering teams at Goldman Sachs and Brex. Deep knowledge of payment schemes (ACH, Faster Payments, FedNow), transaction ledger consistency, and helping junior engineers develop strong product sense.",
    specialties: ["Financial Ledgers", "Payment Gateways", "Product Engineering", "FinTech Regulation", "Tech Leadership"],
    nextAvailableSlot: "Friday at 2:00 PM",
    availableSlots: [
      { date: "Friday", time: "2:00 PM" },
      { date: "Monday", time: "9:30 AM" },
      { date: "Tuesday", time: "4:00 PM" }
    ],
    verifiedBadge: "FinTech Executive"
  },
  {
    id: "mentor_5",
    name: "Sarah Lindqvist",
    role: "Staff Design Systems Architect",
    company: "Spotify (ex-Figma)",
    sector: "Creative Media & Design",
    sectorId: "creative-design",
    experience: "8 years",
    rating: 4.94,
    totalSessions: 87,
    location: "Stockholm / Remote",
    avatarBg: "from-rose-600 to-pink-700",
    initials: "SL",
    bio: "Architecting global multi-platform design tokens, accessible component libraries (WCAG AAA), and front-end engineering design bridges. Portfolios reviewed have a 92% interview conversion rate.",
    specialties: ["Design Systems", "Figma Variables & Tokens", "UI/UX Portfolio Polish", "Micro-interactions", "Design-to-Code"],
    nextAvailableSlot: "Tomorrow at 4:30 PM",
    availableSlots: [
      { date: "Tomorrow", time: "4:30 PM" },
      { date: "Wednesday", time: "2:00 PM" },
      { date: "Friday", time: "10:00 AM" }
    ],
    verifiedBadge: "Design Leader"
  },
  {
    id: "mentor_6",
    name: "Dr. Rajesh Nair",
    role: "Director of Health Informatics & Genomics",
    company: "Illumina / Mayo Clinic Collaboration",
    sector: "Healthcare & BioTech",
    sectorId: "healthcare-biotech",
    experience: "14 years",
    rating: 4.97,
    totalSessions: 73,
    location: "Boston, MA (Remote)",
    avatarBg: "from-cyan-600 to-blue-800",
    initials: "RN",
    bio: "Expert in computational biology pipelines, clinical decision support algorithms, and HIPAA-compliant data lakes. Passionate about helping CS and biology students find rewarding high-impact roles in genomics.",
    specialties: ["Bioinformatics Pipelines", "FHIR / Health Standards", "Clinical AI", "Nextflow & Python", "HealthTech Careers"],
    nextAvailableSlot: "Thursday at 11:00 AM",
    availableSlots: [
      { date: "Thursday", time: "11:00 AM" },
      { date: "Friday", time: "1:30 PM" }
    ],
    verifiedBadge: "Clinical Director"
  },
  {
    id: "mentor_7",
    name: "Carlos Mendez",
    role: "Robotics & Embedded Firmware Lead",
    company: "Boston Dynamics",
    sector: "Hardware & Robotics",
    sectorId: "hardware-robotics",
    experience: "10 years",
    rating: 4.95,
    totalSessions: 81,
    location: "Austin, TX (Remote)",
    avatarBg: "from-slate-700 to-zinc-900",
    initials: "CM",
    bio: "Developing safety-critical real-time embedded firmware on ARM Cortex microcontrollers and ROS2 navigation stacks. Mentors students on practical hardware debugging, RTOS, and portfolio-worthy robotics projects.",
    specialties: ["FreeRTOS & Embedded C++", "ROS2 Navigation", "Hardware/PCB Bring-up", "Low-Latency Telemetry", "Robotics Interviews"],
    nextAvailableSlot: "Wednesday at 3:30 PM",
    availableSlots: [
      { date: "Wednesday", time: "3:30 PM" },
      { date: "Thursday", time: "2:00 PM" }
    ],
    verifiedBadge: "Robotics Lead"
  }
];
