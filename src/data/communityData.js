// Community Data: Channels, student discussion posts, and peer contact directory

export const COMMUNITY_CHANNELS = [
  { id: "general", name: "general-lounge", description: "Open discussion for all students: study tips, campus life, tech news & general chat", icon: "Hash", activeUsers: 48 },
  { id: "software-field", name: "software-engineering", description: "Code reviews, system design debates, tech stacks, and full-stack challenges", icon: "Code", activeUsers: 64 },
  { id: "service-sector", name: "service-consulting", description: "Business tech, IT services, consulting case interviews, and digital transformation", icon: "Briefcase", activeUsers: 29 },
  { id: "interview-prep", name: "interview-prep", description: "DSA problem of the day, behavioral stories, mock interview partners, and salary negotiation", icon: "Target", activeUsers: 53 },
  { id: "project-collabs", name: "project-collabs", description: "Find teammates for hackathons, open-source repos, capstones, and startup MVPs", icon: "Users", activeUsers: 37 },
];

export const INITIAL_COMMUNITY_POSTS = [
  {
    id: "post_1",
    channelId: "general",
    author: {
      name: "Maya Lin",
      handle: "@mayalin_tech",
      avatar: "ML",
      color: "bg-emerald-100 text-emerald-800",
      role: "Student",
      track: "Software Engineering",
      college: "University of Washington"
    },
    timestamp: "18 mins ago",
    content: "Hey everyone! Just completed the System Design milestone on my roadmap here on SkillMap. Highly recommend checking out how database sharding works before taking the diagnostic quiz — really cemented the concepts for me!",
    likes: 14,
    tags: ["#roadmap", "#systemdesign", "#learning"],
    replies: [
      {
        id: "rep_1_1",
        author: "Tariq Owens",
        avatar: "TO",
        color: "bg-blue-100 text-blue-800",
        timestamp: "12 mins ago",
        content: "Nice work Maya! Did you practice building an actual sharded replica in Docker or just conceptual review?"
      },
      {
        id: "rep_1_2",
        author: "Maya Lin",
        avatar: "ML",
        color: "bg-emerald-100 text-emerald-800",
        timestamp: "8 mins ago",
        content: "@Tariq Owens I spun up two Postgres containers in Docker with pgpool-II. Totally worth the 2 hours of debugging."
      }
    ]
  },
  {
    id: "post_2",
    channelId: "software-field",
    author: {
      name: "Rohan Varma",
      handle: "@rohan_codes",
      avatar: "RV",
      color: "bg-indigo-100 text-indigo-800",
      role: "Student",
      track: "Full Stack & Cloud",
      college: "Georgia Tech"
    },
    timestamp: "45 mins ago",
    content: "Quick question on API Design: when building high-concurrency endpoints that trigger background jobs, do you prefer returning HTTP 202 Accepted with a polling status URL, or setting up a bidirectional WebSocket/SSE right away?",
    likes: 19,
    tags: ["#architecture", "#apis", "#backend"],
    replies: [
      {
        id: "rep_2_1",
        author: "Liam Zhao",
        avatar: "LZ",
        color: "bg-violet-100 text-violet-800",
        timestamp: "32 mins ago",
        content: "202 Accepted + polling location header is the standard unless the client requires immediate sub-second feedback (like live streaming progress). Keeps the server connection pool clean!"
      }
    ]
  },
  {
    id: "post_3",
    channelId: "service-sector",
    author: {
      name: "Ananya Sharma",
      handle: "@ananya_consult",
      avatar: "AS",
      color: "bg-amber-100 text-amber-800",
      role: "Student",
      track: "Service Sector & IT Consulting",
      college: "Cornell University"
    },
    timestamp: "1 hour ago",
    content: "For anyone preparing for IT consulting interviews (Deloitte, Accenture, EY): make sure you can explain the difference between cloud migration lift-and-shift vs. cloud native refactoring with real cost implications. Interviewers loved that real-world angle!",
    likes: 27,
    tags: ["#consulting", "#cloudmigration", "#careers"],
    replies: []
  },
  {
    id: "post_4",
    channelId: "interview-prep",
    author: {
      name: "Kavita Rao",
      handle: "@kavita_prep",
      avatar: "KR",
      color: "bg-rose-100 text-rose-800",
      role: "Peer Mentor",
      track: "Algorithms & Systems",
      college: "UT Austin"
    },
    timestamp: "2 hours ago",
    content: "Who wants to do a mock technical interview this evening around 6 PM EST? Looking to practice Top 'NeetCode 150' dynamic programming problems and two-pointer patterns. Drop a reply or message me directly!",
    likes: 22,
    tags: ["#mockinterview", "#dsa", "#studygroup"],
    replies: []
  },
  {
    id: "post_5",
    channelId: "project-collabs",
    author: {
      name: "Julian Gomez",
      handle: "@julian_builder",
      avatar: "JG",
      color: "bg-teal-100 text-teal-800",
      role: "Student",
      track: "Full-Stack & AI",
      college: "UC Berkeley"
    },
    timestamp: "3 hours ago",
    content: "Building an open-source Carbon Footprint tracking CLI for developer CI/CD pipelines. We have 2 members (backend + frontend) and are looking for 1 more collaborator with Docker or Go experience. Great resume project!",
    likes: 31,
    tags: ["#hackathon", "#opensource", "#collaboration"],
    replies: []
  }
];

export const PEER_CONTACTS = [
  {
    id: "peer_1",
    name: "Maya Lin",
    title: "Computer Science Senior",
    college: "University of Washington",
    sector: "Software & Cloud Systems",
    status: "Online Now",
    statusColor: "bg-emerald-500",
    avatar: "ML",
    color: "bg-emerald-100 text-emerald-800",
    topSkills: ["Distributed Systems", "React", "PostgreSQL"],
    bio: "Building distributed microservices and open source developer tools. Open for pair programming and resume reviews.",
    openTo: "Pair Coding & Project Collabs",
    initialMessages: [
      { sender: "them", text: "Hey! Saw you're also working through the Cloud Architecture roadmap.", time: "Yesterday, 3:15 PM" },
      { sender: "them", text: "Feel free to ping me anytime if you want to pair on system design questions!", time: "Yesterday, 3:16 PM" }
    ]
  },
  {
    id: "peer_2",
    name: "Ananya Sharma",
    title: "Information Systems & Business Analyst",
    college: "Cornell University",
    sector: "Service Sector & IT Consulting",
    status: "Studying",
    statusColor: "bg-amber-500",
    avatar: "AS",
    color: "bg-amber-100 text-amber-800",
    topSkills: ["ITIL", "Process Mining", "Cloud ROI", "Business Analysis"],
    bio: "Focused on technology consulting, digital transformation case studies, and enterprise cloud migrations.",
    openTo: "Case Interview Practice",
    initialMessages: [
      { sender: "them", text: "Hi! Let me know if you'd like to run a mock consulting case interview this week.", time: "2 days ago" }
    ]
  },
  {
    id: "peer_3",
    name: "Rohan Varma",
    title: "Backend & Systems Specialist",
    college: "Georgia Tech",
    sector: "Software & Cloud Systems",
    status: "Online Now",
    statusColor: "bg-emerald-500",
    avatar: "RV",
    color: "bg-indigo-100 text-indigo-800",
    topSkills: ["Node.js", "Docker", "Go", "Redis"],
    bio: "Obsessed with latency reduction, Redis caching patterns, and high-throughput backend APIs.",
    openTo: "Backend Architecture Discussions",
    initialMessages: [
      { sender: "them", text: "Hey there! Love comparing notes on Kafka vs RabbitMQ message patterns.", time: "3 days ago" }
    ]
  },
  {
    id: "peer_4",
    name: "Kavita Rao",
    title: "Algorithms & AI Researcher",
    college: "UT Austin",
    sector: "AI & Data Systems",
    status: "Open to Pair Coding",
    statusColor: "bg-blue-500",
    avatar: "KR",
    color: "bg-rose-100 text-rose-800",
    topSkills: ["PyTorch", "Algorithms", "Vector DBs", "Python"],
    bio: "Preparing for tier-1 AI engineering roles. Active competitive programmer and open source contributor.",
    openTo: "Daily DSA Mock Sessions",
    initialMessages: [
      { sender: "them", text: "Hey! Are you practicing graph algorithms or dynamic programming currently?", time: "5 days ago" }
    ]
  },
  {
    id: "peer_5",
    name: "Liam Zhao",
    title: "FinTech & Distributed Ledger Enthusiast",
    college: "Carnegie Mellon",
    sector: "FinTech & Financial Services",
    status: "Away",
    statusColor: "bg-slate-400",
    avatar: "LZ",
    color: "bg-violet-100 text-violet-800",
    topSkills: ["PostgreSQL (ACID)", "Stripe APIs", "API Design", "Security"],
    bio: "Building double-entry ledger systems and real-time payment reconciliation prototypes.",
    openTo: "FinTech Project Collabs",
    initialMessages: [
      { sender: "them", text: "Hey! Check out TigerBeetle if you haven't yet, super interesting financial db architecture.", time: "1 week ago" }
    ]
  }
];
