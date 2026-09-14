// Student Peer Video Lectures & Vault Data

const LECTURES_STORAGE_KEY = "skillsmap_community_lectures";

export const DEFAULT_COMMUNITY_LECTURES = [
  {
    id: "lec-dsa-graph-algorithms",
    title: "Graph Algorithms Explained: Dijkstra's, A* & Shortest Path with Visuals",
    subject: "Data Structures & Algorithms",
    creator: {
      name: "Alex Rivera",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      role: "Student @ CS Dept",
      subscribers: 1420,
      isVerified: true
    },
    duration: "24:15",
    type: "embed",
    videoUrl: "https://www.youtube.com/embed/EFg3u_E6eHU",
    description: "In this lecture I break down Dijkstra's algorithm step-by-step using adjacency lists and min-heaps in Python. Includes time complexity proofs and edge case analysis for negative cycles vs Bellman-Ford.",
    eduScore: 98,
    isAiVerified: true,
    views: 3840,
    likes: 312,
    difficulty: "Intermediate",
    tags: ["Algorithms", "Python", "Graphs", "DSA"],
    resources: {
      githubUrl: "https://github.com/skillsmap/algorithms-repo",
      notesPdfName: "dijkstra_cheat_sheet.pdf"
    },
    chapters: [
      { timeSeconds: 0, timeStr: "00:00", title: "Introduction & Real-World Use Cases (GPS/Routing)" },
      { timeSeconds: 240, timeStr: "04:00", title: "Greedy Approach & Min-Heap Priority Queue" },
      { timeSeconds: 610, timeStr: "10:10", title: "Python Code Walkthrough" },
      { timeSeconds: 1050, timeStr: "17:30", title: "Time Complexity O((V + E) log V) Proof" },
      { timeSeconds: 1320, timeStr: "22:00", title: "Edge Cases & Interview Questions" }
    ],
    aiSummary: "Key Concept Takeaway: Dijkstra's algorithm uses a greedy approach backed by a min-heap to find single-source shortest paths in weighted graphs with non-negative weights in O((V+E)log V) time."
  },
  {
    id: "lec-react-state-architecture",
    title: "React 19 & Server Components: Complete State Architecture Walkthrough",
    subject: "Full-Stack Web",
    creator: {
      name: "Marcus Brody",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      role: "Graduate Fellow",
      subscribers: 2890,
      isVerified: true
    },
    duration: "32:40",
    type: "embed",
    videoUrl: "https://www.youtube.com/embed/8pDqJVdNa44",
    description: "Comprehensive lecture covering the boundary between React Server Components (RSC) and Client Components ('use client'), async data streaming, and avoiding waterfall queries.",
    eduScore: 96,
    isAiVerified: true,
    views: 5210,
    likes: 489,
    difficulty: "Advanced",
    tags: ["React", "JavaScript", "Full-Stack", "Frontend"],
    resources: {
      githubUrl: "https://github.com/skillsmap/react19-architecture",
      notesPdfName: "react_server_components_guide.pdf"
    },
    chapters: [
      { timeSeconds: 0, timeStr: "00:00", title: "Why Server Components? Zero-Bundle Overhead" },
      { timeSeconds: 420, timeStr: "07:00", title: "Passing Server Actions to Client Boundaries" },
      { timeSeconds: 980, timeStr: "16:20", title: "Optimistic UI Updates with useOptimistic" },
      { timeSeconds: 1540, timeStr: "25:40", title: "Suspense Boundaries & Streaming SSR" }
    ],
    aiSummary: "Key Concept Takeaway: React 19 Server Components run on Node backend to fetch data with 0kB client bundle size, while client components hydrate interactive event listeners."
  },
  {
    id: "lec-python-asyncio-concurrency",
    title: "Python AsyncIO Deep Dive: Event Loops, Coroutines & Tasks Under The Hood",
    subject: "Python Programming",
    creator: {
      name: "Elena Rostova",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      role: "Teaching Assistant @ AI Lab",
      subscribers: 1980,
      isVerified: true
    },
    duration: "28:10",
    type: "embed",
    videoUrl: "https://www.youtube.com/embed/t5Bo1Je9EmE",
    description: "Demystifying single-threaded cooperative multitasking in Python. We inspect how selector-based epoll/kqueue event loops handle thousands of concurrent network sockets.",
    eduScore: 95,
    isAiVerified: true,
    views: 4120,
    likes: 380,
    difficulty: "Advanced",
    tags: ["Python", "Concurrency", "AsyncIO", "Backend"],
    resources: {
      githubUrl: "https://github.com/skillsmap/python-concurrency",
      notesPdfName: "python_asyncio_internals.pdf"
    },
    chapters: [
      { timeSeconds: 0, timeStr: "00:00", title: "Threads vs Multiprocessing vs AsyncIO" },
      { timeSeconds: 310, timeStr: "05:10", title: "The Python GIL & I/O Bound Bottlenecks" },
      { timeSeconds: 780, timeStr: "13:00", title: "asyncio.gather vs TaskGroup (Python 3.11+)" },
      { timeSeconds: 1350, timeStr: "22:30", title: "Writing a Non-Blocking HTTP Crawler" }
    ],
    aiSummary: "Key Concept Takeaway: Python AsyncIO achieves high concurrency without thread switching overhead by pausing coroutines at await points while kernel sockets wait for I/O readiness."
  },
  {
    id: "lec-docker-k8s-devops",
    title: "Docker to Kubernetes: Container Multi-Stage Builds & Pod Networking",
    subject: "DevOps & Cloud Systems",
    creator: {
      name: "David K.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      role: "SRE Fellow",
      subscribers: 3100,
      isVerified: true
    },
    duration: "35:12",
    type: "embed",
    videoUrl: "https://www.youtube.com/embed/Wf2eSG3owoA",
    description: "From a local Dockerfile to production Kubernetes deployments, Services, Ingress controllers, and persistent volume claims.",
    eduScore: 97,
    isAiVerified: true,
    views: 6780,
    likes: 540,
    difficulty: "Intermediate",
    tags: ["DevOps", "Docker", "Kubernetes", "Cloud"],
    resources: {
      githubUrl: "https://github.com/skillsmap/k8s-deployments",
      notesPdfName: "docker_k8s_cheatsheet.pdf"
    },
    chapters: [
      { timeSeconds: 0, timeStr: "00:00", title: "Multi-Stage Dockerfile Optimization" },
      { timeSeconds: 500, timeStr: "08:20", title: "Building Minimal Alpine Images" },
      { timeSeconds: 1100, timeStr: "18:20", title: "Kubernetes Pods, Deployments & ReplicaSets" },
      { timeSeconds: 1650, timeStr: "27:30", title: "ConfigMaps, Secrets & Ingress Routing" }
    ],
    aiSummary: "Key Concept Takeaway: Multi-stage Docker builds separate build toolchains from runtime containers, creating tiny production images easily orchestrated by Kubernetes."
  },
  {
    id: "lec-java-jvm-memory",
    title: "Java JVM Deep Dive: Garbage Collection, Heap vs Stack & ClassLoaders",
    subject: "Java & OOP Engineering",
    creator: {
      name: "Priya Sharma",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      role: "Backend Architect",
      subscribers: 2450,
      isVerified: true
    },
    duration: "30:45",
    type: "embed",
    videoUrl: "https://www.youtube.com/embed/G_cQZ_8z2vM",
    description: "Understand JVM memory management, Young Generation (Eden/Survivor) vs Old Generation, G1GC tuning, and troubleshooting OutOfMemory errors.",
    eduScore: 94,
    isAiVerified: true,
    views: 4890,
    likes: 425,
    difficulty: "Advanced",
    tags: ["Java", "JVM", "Backend", "GarbageCollection"],
    resources: {
      githubUrl: "https://github.com/skillsmap/jvm-profiling",
      notesPdfName: "jvm_memory_guide.pdf"
    },
    chapters: [
      { timeSeconds: 0, timeStr: "00:00", title: "JVM Architecture Overview" },
      { timeSeconds: 420, timeStr: "07:00", title: "Heap Memory Generational Hypothesis" },
      { timeSeconds: 980, timeStr: "16:20", title: "G1 and ZGC Garbage Collectors" },
      { timeSeconds: 1420, timeStr: "23:40", title: "Diagnosing Memory Leaks with JConsole" }
    ],
    aiSummary: "Key Concept Takeaway: The JVM manages memory through generational garbage collection where short-lived objects in Eden are quickly scavenged before tenure promotion to Old Gen."
  }
];

export function getStoredLectures() {
  if (typeof window === "undefined") return DEFAULT_COMMUNITY_LECTURES;
  try {
    const raw = localStorage.getItem(LECTURES_STORAGE_KEY);
    if (!raw) return DEFAULT_COMMUNITY_LECTURES;
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_COMMUNITY_LECTURES;
  }
}

export function deleteCommunityLecture(id) {
  const current = getStoredLectures();
  const updated = current.filter((l) => l.id !== id);
  saveCommunityLectures(updated);
  return updated;
}

export function updateCommunityLecture(id, fields) {
  const current = getStoredLectures();
  const updated = current.map((l) => {
    if (l.id === id) {
      return { ...l, ...fields, updated_at: new Date().toISOString() };
    }
    return l;
  });
  saveCommunityLectures(updated);
  return updated;
}

export function addCommunityLecture(newLecture) {
  const current = getStoredLectures();
  const lectureObj = {
    id: newLecture.id || `lec-${Date.now()}`,
    views: 0,
    likes: 0,
    eduScore: newLecture.eduScore || 95,
    isAiVerified: true,
    chapters: newLecture.chapters || [
      { timeSeconds: 0, timeStr: "00:00", title: "Introduction" },
      { timeSeconds: 300, timeStr: "05:00", title: "Core Concepts & Architecture" },
      { timeSeconds: 700, timeStr: "11:40", title: "Hands-on Implementation" }
    ],
    ...newLecture,
    created_at: new Date().toISOString()
  };
  const updated = [lectureObj, ...current];
  saveCommunityLectures(updated);
  return updated;
}

export function resetLecturesToDefault() {
  saveCommunityLectures(DEFAULT_COMMUNITY_LECTURES);
  return DEFAULT_COMMUNITY_LECTURES;
}

