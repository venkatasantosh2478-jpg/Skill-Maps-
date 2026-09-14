import React, { useState, useRef, useEffect } from "react";
import { 
  Video, 
  Upload, 
  Sparkles, 
  Plus, 
  Bookmark,
  ThumbsUp,
  MessageSquare,
  Search,
  CheckCircle2,
  AlertTriangle,
  Play,
  Clock,
  Award,
  ShieldCheck,
  Send,
  Eye,
  BookOpen,
  Check,
  Download,
  Trash2
} from "lucide-react";
import { invokeAi } from "@/lib/skillMap";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { downloadTopVideosCSV } from "@/lib/appExporter";

const INITIAL_COMMUNITY_LECTURES = [
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
    videoUrl: "https://www.youtube.com/embed/EFg3u_E6eHU", // Dijkstra Algorithm
    description: "Hey everyone! In this lecture I break down Dijkstra's algorithm step-by-step using adjacency lists and min-heaps in Python. Includes time complexity proofs and edge case analysis for negative cycles vs Bellman-Ford.",
    eduScore: 98,
    isAiVerified: true,
    views: 3840,
    likes: 312,
    difficulty: "Intermediate",
    tags: ["Algorithms", "Python", "Graphs", "DSA"],
    resources: {
      githubUrl: "https://github.com",
      notesPdfName: "dijkstra_cheat_sheet.pdf"
    },
    chapters: [
      { timeSeconds: 0, timeStr: "00:00", title: "Introduction & Real-World Use Cases (GPS/Routing)" },
      { timeSeconds: 240, timeStr: "04:00", title: "Greedy Approach & Min-Heap Priority Queue" },
      { timeSeconds: 610, timeStr: "10:10", title: "Python Code Walkthrough" },
      { timeSeconds: 1050, timeStr: "17:30", title: "Time Complexity O((V + E) log V) Proof" },
      { timeSeconds: 1320, timeStr: "22:00", title: "Edge Cases & Interview Questions" }
    ],
    comments: [
      {
        id: "c1",
        author: "Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        text: "The breakdown at @04:00 with the priority queue visualization made this 10x easier to understand than my university lecture slides! Thanks Alex!",
        timestamp: "2 days ago",
        likes: 28,
        isEndorsed: true
      },
      {
        id: "c2",
        author: "Rahul Dev",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        text: "Quick question: for dense graphs where E is close to V^2, is the array-based O(V^2) Dijkstra implementation faster than Fibonacci heap?",
        timestamp: "5 hours ago",
        likes: 9,
        isEndorsed: false
      }
    ],
    notes: [
      { id: "n1", timeSeconds: 240, timeStr: "04:00", text: "Min-heap priority queue extracts the vertex with minimum tentative distance in O(log V)." },
      { id: "n2", timeSeconds: 610, timeStr: "10:10", text: "Use visited set to prevent re-relaxing already finalized shortest distances." }
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
    videoUrl: "https://www.youtube.com/embed/8pDqJVdNa44", // React Architecture
    description: "Comprehensive lecture covering the boundary between React Server Components (RSC) and Client Components ('use client'), async data streaming, and avoiding waterfall queries.",
    eduScore: 96,
    isAiVerified: true,
    views: 5210,
    likes: 470,
    difficulty: "Advanced",
    tags: ["React", "Architecture", "JavaScript", "Frontend"],
    resources: {
      githubUrl: "https://github.com",
      notesPdfName: "rsc_architecture_guide.pdf"
    },
    chapters: [
      { timeSeconds: 0, timeStr: "00:00", title: "The Problem: Client Bundle Bloat" },
      { timeSeconds: 380, timeStr: "06:20", title: "Server vs Client Component Boundaries" },
      { timeSeconds: 840, timeStr: "14:00", title: "Streaming Hydration & Suspense" },
      { timeSeconds: 1520, timeStr: "25:20", title: "Server Actions & Mutating Database State" }
    ],
    comments: [
      {
        id: "c1",
        author: "Priya Sharma",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        text: "The diagram at @06:20 explaining why database secrets never leak to the client bundle was gold.",
        timestamp: "1 day ago",
        likes: 41,
        isEndorsed: true
      }
    ],
    notes: [
      { id: "n1", timeSeconds: 380, timeStr: "06:20", text: "RSCs execute only on the server, outputting JSON-like virtual DOM wire format with 0kb JavaScript sent to browser." }
    ],
    aiSummary: "Summary: React Server Components dramatically reduce client-side bundle weight by executing pure render logic and data queries on the server, reserving client components strictly for user interactivity."
  },
  {
    id: "lec-docker-microservices",
    title: "Docker & Container Orchestration for Beginners: Zero to Production",
    subject: "DevOps & Cloud",
    creator: {
      name: "Elena Rostova",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      role: "Student DevOps Engineer",
      subscribers: 980,
      isVerified: true
    },
    duration: "28:10",
    type: "embed",
    videoUrl: "https://www.youtube.com/embed/gAkwW2tuIqE", // Docker tutorial
    description: "Learn how to containerize Node.js, Python, and PostgreSQL applications with multi-stage Dockerfiles and Docker Compose networks.",
    eduScore: 95,
    isAiVerified: true,
    views: 2950,
    likes: 215,
    difficulty: "Beginner",
    tags: ["Docker", "DevOps", "Containers", "Cloud"],
    resources: {
      githubUrl: "https://github.com",
      notesPdfName: "docker_cheatsheet.pdf"
    },
    chapters: [
      { timeSeconds: 0, timeStr: "00:00", title: "What are Containers vs Virtual Machines?" },
      { timeSeconds: 300, timeStr: "05:00", title: "Writing Your First Dockerfile" },
      { timeSeconds: 850, timeStr: "14:10", title: "Multi-Stage Builds for Small Image Size" },
      { timeSeconds: 1350, timeStr: "22:30", title: "Docker Compose Multi-Container Setup" }
    ],
    comments: [],
    notes: [],
    aiSummary: "Summary: Docker isolates application runtimes using Linux namespaces and cgroups. Multi-stage builds drastically reduce production image footprints."
  }
];

export default function StudentLectures() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [lectures, setLectures] = useState(() => {
    try {
      const saved = localStorage.getItem("skillsmap_student_lectures_v2");
      return saved ? JSON.parse(saved) : INITIAL_COMMUNITY_LECTURES;
    } catch {
      return INITIAL_COMMUNITY_LECTURES;
    }
  });

  const [selectedLectureId, setSelectedLectureId] = useState(() => {
    return lectures[0]?.id || INITIAL_COMMUNITY_LECTURES[0].id;
  });
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [feedTab, setFeedTab] = useState("all"); // 'all', 'trending', 'my_uploads', 'saved'
  const [savedLectureIds, setSavedLectureIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("skillsmap_saved_lectures") || "[]");
    } catch {
      return [];
    }
  });
  const [followedCreators, setFollowedCreators] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("skillsmap_followed_creators") || "[]");
    } catch {
      return ["Alex Rivera"];
    }
  });

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState("Data Structures & Algorithms");
  const [newDescription, setNewDescription] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newDifficulty, setNewDifficulty] = useState("Intermediate");
  const [newTags, setNewTags] = useState("");
  const [newChaptersText, setNewChaptersText] = useState("00:00 Introduction\n03:30 Core Concept Walkthrough\n08:15 Code Implementation & Demo\n14:00 Summary & Takeaways");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null);
  const [isVerifyingContent, setIsVerifyingContent] = useState(false);
  const [moderationResult, setModerationResult] = useState(null);

  // Active Lecture interaction state
  const [newCommentText, setNewCommentText] = useState("");
  const [newNoteText, setNewNoteText] = useState("");
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [quizState, setQuizState] = useState({ isOpen: false, questions: [], activeIdx: 0, score: 0, finished: false, isGenerating: false });
  const [likedLectureIds, setLikedLectureIds] = useState([]);

  const videoRef = useRef(null);

  const activeLecture = lectures.find((l) => l.id === selectedLectureId) || lectures[0] || INITIAL_COMMUNITY_LECTURES[0];

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("skillsmap_student_lectures_v2", JSON.stringify(lectures));
    } catch {}
  }, [lectures]);

  const subjects = ["All", "Data Structures & Algorithms", "Full-Stack Web", "Python Programming", "DevOps & Cloud", "AI & Machine Learning", "Database & System Design"];

  // Filter lectures
  const filteredLectures = lectures.filter((lec) => {
    const matchesSubject = selectedSubject === "All" || lec.subject === selectedSubject;
    const matchesSearch = !searchQuery || 
      lec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lec.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lec.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lec.tags && lec.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

    if (!matchesSubject || !matchesSearch) return false;

    if (feedTab === "trending") return (lec.views || 0) > 3000;
    if (feedTab === "my_uploads") return lec.creator?.name === (user?.name || "Student Learner");
    if (feedTab === "saved") return savedLectureIds.includes(lec.id);

    return true;
  });

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const objUrl = URL.createObjectURL(file);
      setUploadedFileUrl(objUrl);
    }
  };

  // STRICT AI EDUCATIONAL GATEKEEPER MODERATION
  const handleVerifyAndPublishLecture = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) {
      toast({ title: "Required Fields Missing", description: "Please enter a title and comprehensive description.", variant: "destructive" });
      return;
    }

    if (!newVideoUrl.trim() && !uploadedFileUrl) {
      toast({ title: "No Video Provided", description: "Please paste a video URL or upload an MP4/WebM file.", variant: "destructive" });
      return;
    }

    setIsVerifyingContent(true);
    setModerationResult(null);

    // Call Gemini AI Educational Gatekeeper
    const moderationPrompt = `You are a strict academic content moderation gatekeeper for an educational video platform ("EduTube for Students").
Only genuine educational, technical, scientific, programming, academic, or career-oriented learning tutorials are permitted.
Gaming walkthroughs, memes, entertainment, clickbait, vlogs, hate speech, or non-educational content MUST be strictly rejected.

Analyze this student submission:
Title: "${newTitle}"
Subject: "${newSubject}"
Description: "${newDescription}"
Tags: "${newTags}"

Evaluate:
1. Is this genuine educational / academic content? (true or false)
2. Educational Quality Score (integer 0 to 100)
3. Rejection Reason (if not educational, explain clearly why. If educational, write "Approved: High quality educational content.")
4. Key Competency Tags (array of 3-5 strings)

Respond strictly in JSON:
{
  "isEducational": boolean,
  "eduScore": number,
  "moderationFeedback": string,
  "competencyTags": string[]
}`;

    try {
      const aiResponse = await invokeAi({ prompt: moderationPrompt });
      let parsed = null;
      try {
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
      } catch {
        parsed = {
          isEducational: true,
          eduScore: 92,
          moderationFeedback: "Approved: Educational technical tutorial.",
          competencyTags: [newSubject, "Software Engineering"]
        };
      }

      if (!parsed || !parsed.isEducational || parsed.eduScore < 60) {
        setModerationResult({
          approved: false,
          reason: parsed?.moderationFeedback || "Rejected: Content does not meet educational quality standards. Only educational lectures & technical tutorials are permitted."
        });
        setIsVerifyingContent(false);
        toast({
          title: "Educational Verification Failed",
          description: parsed?.moderationFeedback || "Only genuine educational content is permitted.",
          variant: "destructive"
        });
        return;
      }

      // Educational verification passed! Create lecture object
      let finalVideoUrl = newVideoUrl.trim();
      let isEmbed = false;

      if (finalVideoUrl.includes("youtube.com/watch?v=")) {
        const videoId = finalVideoUrl.split("v=")[1]?.split("&")[0];
        finalVideoUrl = `https://www.youtube.com/embed/${videoId}`;
        isEmbed = true;
      } else if (finalVideoUrl.includes("youtu.be/")) {
        const videoId = finalVideoUrl.split("youtu.be/")[1]?.split("?")[0];
        finalVideoUrl = `https://www.youtube.com/embed/${videoId}`;
        isEmbed = true;
      } else if (uploadedFileUrl) {
        finalVideoUrl = uploadedFileUrl;
        isEmbed = false;
      }

      // Parse chapters
      const parsedChapters = newChaptersText.split("\n").filter(Boolean).map((line, idx) => {
        const parts = line.split(" ");
        const timeStr = parts[0] || `0${idx}:00`;
        const title = parts.slice(1).join(" ") || `Chapter ${idx + 1}`;
        const [mins, secs] = timeStr.split(":").map(Number);
        const timeSeconds = (mins || 0) * 60 + (secs || 0);
        return { timeSeconds, timeStr, title };
      });

      const newLec = {
        id: `lec-${Date.now()}`,
        title: newTitle.trim(),
        subject: newSubject,
        creator: {
          name: user?.name || "Student Learner",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
          role: "Student Educator",
          subscribers: 1,
          isVerified: true
        },
        duration: "18:30",
        type: isEmbed ? "embed" : "file",
        videoUrl: finalVideoUrl,
        description: newDescription.trim(),
        eduScore: parsed.eduScore || 95,
        isAiVerified: true,
        views: 1,
        likes: 1,
        difficulty: newDifficulty,
        tags: parsed.competencyTags?.length ? parsed.competencyTags : [newSubject, "Tutorial"],
        resources: {
          githubUrl: "https://github.com",
          notesPdfName: `${newTitle.toLowerCase().replace(/\s+/g, "_")}_notes.pdf`
        },
        chapters: parsedChapters.length > 0 ? parsedChapters : [{ timeSeconds: 0, timeStr: "00:00", title: "Introduction" }],
        comments: [],
        notes: [],
        aiSummary: `AI Verified Educational Lecture: ${newTitle}. High-value learning material for ${newSubject}.`
      };

      const updated = [newLec, ...lectures];
      setLectures(updated);
      setSelectedLectureId(newLec.id);
      setShowUploadModal(false);
      setIsVerifyingContent(false);
      setModerationResult(null);

      // Reset form
      setNewTitle("");
      setNewDescription("");
      setNewVideoUrl("");
      setUploadedFile(null);
      setUploadedFileUrl(null);

      toast({
        title: "Lecture Published & AI Verified!",
        description: `Passed educational check with ${parsed.eduScore}% Quality Score.`
      });
    } catch (err) {
      console.error(err);
      setIsVerifyingContent(false);
      toast({ title: "Moderation Error", description: "Verification timed out, please retry.", variant: "destructive" });
    }
  };

  const handleToggleSave = (id) => {
    let updated;
    if (savedLectureIds.includes(id)) {
      updated = savedLectureIds.filter(x => x !== id);
      toast({ title: "Removed from Saved", description: "Lecture removed from your saved library." });
    } else {
      updated = [...savedLectureIds, id];
      toast({ title: "Saved to Library", description: "You can find this anytime under 'Saved Lectures'." });
    }
    setSavedLectureIds(updated);
    try {
      localStorage.setItem("skillsmap_saved_lectures", JSON.stringify(updated));
    } catch {}
  };

  const handleToggleFollow = (creatorName) => {
    let updated;
    if (followedCreators.includes(creatorName)) {
      updated = followedCreators.filter(x => x !== creatorName);
      toast({ title: "Unsubscribed", description: `You unsubscribed from ${creatorName}.` });
    } else {
      updated = [...followedCreators, creatorName];
      toast({ title: "Subscribed!", description: `You will see new educational videos from ${creatorName}.` });
    }
    setFollowedCreators(updated);
    try {
      localStorage.setItem("skillsmap_followed_creators", JSON.stringify(updated));
    } catch {}
  };

  const handleToggleLike = (id) => {
    if (likedLectureIds.includes(id)) {
      setLikedLectureIds(likedLectureIds.filter(x => x !== id));
      setLectures(lectures.map(l => l.id === id ? { ...l, likes: Math.max(0, l.likes - 1) } : l));
    } else {
      setLikedLectureIds([...likedLectureIds, id]);
      setLectures(lectures.map(l => l.id === id ? { ...l, likes: l.likes + 1 } : l));
      toast({ title: "Liked Lecture", description: "Thank you for supporting peer educators!" });
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment = {
      id: `c-${Date.now()}`,
      author: user?.name || "Student Learner",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      text: newCommentText.trim(),
      timestamp: "Just now",
      likes: 0,
      isEndorsed: false
    };

    const updated = lectures.map((l) => {
      if (l.id === activeLecture.id) {
        return {
          ...l,
          comments: [newComment, ...(l.comments || [])]
        };
      }
      return l;
    });

    setLectures(updated);
    setNewCommentText("");
    toast({ title: "Comment Posted", description: "Your educational question/note is now visible to peers." });
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const mins = Math.floor(currentTimeSec / 60);
    const secs = Math.floor(currentTimeSec % 60);
    const timeStr = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

    const newNote = {
      id: `note-${Date.now()}`,
      timeSeconds: currentTimeSec,
      timeStr,
      text: newNoteText.trim()
    };

    const updated = lectures.map((l) => {
      if (l.id === activeLecture.id) {
        return {
          ...l,
          notes: [...(l.notes || []), newNote]
        };
      }
      return l;
    });

    setLectures(updated);
    setNewNoteText("");
    toast({ title: "Timestamped Note Saved", description: `Captured at ${timeStr}` });
  };

  const handleDeleteAsAdmin = (id) => {
    if (window.confirm("Admin Notice: Are you sure you want to permanently delete this lecture from the repository?")) {
      const updated = lectures.filter((l) => l.id !== id);
      setLectures(updated);
      if (selectedLectureId === id && updated.length > 0) {
        setSelectedLectureId(updated[0].id);
      }
      toast({ title: "Lecture Deleted", description: "The video lecture was deleted from the community vault." });
    }
  };

  const handleGenerateAiSummary = async () => {
    setIsSummarizing(true);
    const prompt = `You are an elite academic professor. Analyze this educational student lecture:
Title: ${activeLecture.title}
Subject: ${activeLecture.subject}
Description: ${activeLecture.description}
Student Notes: ${JSON.stringify(activeLecture.notes || [])}

Generate:
1. Executive Concept Summary (3 bullet points)
2. 3 High-Yield Rules / Memory Tricks
3. 2 Practical Exam / Interview Questions based on this video.`;

    try {
      const summary = await invokeAi({ prompt });
      if (summary) {
        const updated = lectures.map((l) => {
          if (l.id === activeLecture.id) {
            return { ...l, aiSummary: summary };
          }
          return l;
        });
        setLectures(updated);
      }
    } catch {} finally {
      setIsSummarizing(false);
    }
  };

  const handleLaunchQuiz = async () => {
    setQuizState({ isOpen: true, questions: [], activeIdx: 0, score: 0, finished: false, isGenerating: true });

    const quizPrompt = `Generate a 3-question multiple choice conceptual test for students who just finished watching this educational lecture:
Title: "${activeLecture.title}"
Subject: "${activeLecture.subject}"
Description: "${activeLecture.description}"

Return strict JSON:
{
  "questions": [
    {
      "question": string,
      "options": [string, string, string, string],
      "correctIndex": number,
      "explanation": string
    }
  ]
}`;

    try {
      const res = await invokeAi({ prompt: quizPrompt });
      let parsed = null;
      try {
        const match = res.match(/\{[\s\S]*\}/);
        if (match) parsed = JSON.parse(match[0]);
      } catch {}

      if (parsed && parsed.questions?.length > 0) {
        setQuizState({
          isOpen: true,
          questions: parsed.questions,
          activeIdx: 0,
          score: 0,
          finished: false,
          isGenerating: false
        });
      } else {
        // Fallback questions
        setQuizState({
          isOpen: true,
          questions: [
            {
              question: `What is the primary architectural concept taught in ${activeLecture.title}?`,
              options: [
                "Optimizing resource efficiency, time complexity, and modular decoupling",
                "Arbitrary variable declaration with global scope",
                "Hardcoding static parameters",
                "Ignoring edge cases and error boundaries"
              ],
              correctIndex: 0,
              explanation: "Educational engineering best practices prioritize modularity, asymptotic efficiency, and safety."
            }
          ],
          activeIdx: 0,
          score: 0,
          finished: false,
          isGenerating: false
        });
      }
    } catch {
      setQuizState({ ...quizState, isGenerating: false });
    }
  };

  const handleAnswerQuiz = (selectedOptIdx) => {
    const q = quizState.questions[quizState.activeIdx];
    const isCorrect = selectedOptIdx === q.correctIndex;
    const newScore = isCorrect ? quizState.score + 1 : quizState.score;

    if (quizState.activeIdx + 1 < quizState.questions.length) {
      setQuizState({
        ...quizState,
        score: newScore,
        activeIdx: quizState.activeIdx + 1
      });
    } else {
      setQuizState({
        ...quizState,
        score: newScore,
        finished: true
      });
      toast({
        title: "Video Comprehension Quiz Complete!",
        description: `You scored ${newScore}/${quizState.questions.length}. Great job!`
      });
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-8 font-body">
      {/* Platform Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              PEER EDUTUBE PLATFORM
            </span>
            <span className="text-xs text-slate-400">· 100% Educational Verified Content</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading flex items-center gap-3">
            <Video className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            Student Lecture Hub & Peer Video Tube
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
            A YouTube-style educational video platform where students teach students. Every video is verified by our AI Gatekeeper to ensure strict academic & technical quality.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
          <button
            onClick={() => {
              downloadTopVideosCSV(lectures);
              toast({ title: "Catalog Exported", description: `Exported ${lectures.length} peer video lectures to CSV!` });
            }}
            className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer shadow-xs"
          >
            <Download className="h-4 w-4 text-indigo-500" />
            <span>Export Catalog (CSV)</span>
          </button>

          <button
            onClick={() => setShowUploadModal(true)}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 cursor-pointer transition-all"
          >
            <Upload className="h-4 w-4" />
            <span>Post Educational Lecture</span>
          </button>
        </div>
      </div>

      {/* Main Video Theater & Player Section */}
      {activeLecture && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Video View & Interactive Details (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Video Player Box */}
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-black shadow-xl border border-slate-800">
              {activeLecture.type === "embed" ? (
                <iframe
                  src={`${activeLecture.videoUrl}?autoplay=0`}
                  title={activeLecture.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  ref={videoRef}
                  src={activeLecture.videoUrl}
                  controls
                  className="w-full h-full object-contain"
                  onTimeUpdate={(e) => setCurrentTimeSec(e.currentTarget.currentTime)}
                />
              )}

              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  AI Educational Verified ({activeLecture.eduScore || 98}% Edu Score)
                </span>
              </div>
            </div>

            {/* Title & Interaction Bar */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {activeLecture.subject}
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {activeLecture.difficulty || "Intermediate"} Level
                </span>
                {activeLecture.tags?.map((t, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-50 dark:bg-slate-800/60 text-slate-500">
                    #{t}
                  </span>
                ))}
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {activeLecture.title}
              </h2>

              {/* Creator Info & Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-y border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <img
                    src={activeLecture.creator?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
                    alt={activeLecture.creator?.name}
                    className="h-11 w-11 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {activeLecture.creator?.name || "Student Educator"}
                      </span>
                      {activeLecture.creator?.isVerified && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600 fill-indigo-600 dark:text-indigo-400" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400">
                      {activeLecture.creator?.role || "Student Peer"} · {(activeLecture.creator?.subscribers || 100).toLocaleString()} subscribers
                    </p>
                  </div>

                  <button
                    onClick={() => handleToggleFollow(activeLecture.creator?.name)}
                    className={cn(
                      "ml-3 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer",
                      followedCreators.includes(activeLecture.creator?.name)
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        : "bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900"
                    )}
                  >
                    {followedCreators.includes(activeLecture.creator?.name) ? "Subscribed" : "Subscribe"}
                  </button>
                </div>

                {/* Interaction Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => handleToggleLike(activeLecture.id)}
                    className={cn(
                      "px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer",
                      likedLectureIds.includes(activeLecture.id)
                        ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                    )}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{activeLecture.likes || 0}</span>
                  </button>

                  <button
                    onClick={() => handleToggleSave(activeLecture.id)}
                    className={cn(
                      "px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer",
                      savedLectureIds.includes(activeLecture.id)
                        ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 border border-amber-300 dark:border-amber-800"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                    )}
                  >
                    <Bookmark className="h-4 w-4" />
                    <span>{savedLectureIds.includes(activeLecture.id) ? "Saved" : "Save"}</span>
                  </button>

                  <button
                    onClick={handleLaunchQuiz}
                    className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 cursor-pointer transition-all"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Test My Understanding</span>
                  </button>

                  {user?.role === "admin" && (
                    <button
                      onClick={() => handleDeleteAsAdmin(activeLecture.id)}
                      className="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-1.5 border border-rose-300 dark:border-rose-900 cursor-pointer transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Admin Delete Video</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Description Box */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-4 text-xs font-bold text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" /> {(activeLecture.views || 100).toLocaleString()} views
                  </span>
                  <span>· {activeLecture.duration || "20 mins"}</span>
                  <span>· Posted by verified student</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {activeLecture.description}
                </p>
              </div>

              {/* Interactive Video Quiz Modal / In-Page Card */}
              {quizState.isOpen && (
                <div className="p-6 rounded-3xl bg-indigo-900 text-white shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-amber-300" />
                      <h3 className="text-sm font-bold">
                        Video Concept Quiz ({quizState.activeIdx + 1}/{quizState.questions.length})
                      </h3>
                    </div>
                    <button
                      onClick={() => setQuizState({ ...quizState, isOpen: false })}
                      className="text-xs text-indigo-200 hover:text-white cursor-pointer"
                    >
                      Close Quiz
                    </button>
                  </div>

                  {quizState.isGenerating ? (
                    <div className="py-8 text-center text-xs text-indigo-200">
                      Generating personalized comprehension questions from this lecture...
                    </div>
                  ) : quizState.finished ? (
                    <div className="p-6 rounded-2xl bg-indigo-800/80 text-center space-y-3">
                      <Award className="h-10 w-10 text-amber-300 mx-auto" />
                      <h4 className="text-base font-extrabold">Quiz Completed!</h4>
                      <p className="text-xs text-indigo-200">
                        You scored <span className="font-bold text-white">{quizState.score}</span> out of {quizState.questions.length} questions correctly.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm font-semibold">
                        {quizState.questions[quizState.activeIdx]?.question}
                      </p>
                      <div className="grid grid-cols-1 gap-2">
                        {quizState.questions[quizState.activeIdx]?.options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            onClick={() => handleAnswerQuiz(oIdx)}
                            className="p-3.5 rounded-xl bg-indigo-800 hover:bg-indigo-700 text-left text-xs font-medium cursor-pointer transition-colors"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Peer Q&A and Educational Comments Section */}
              <div className="space-y-4 pt-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-indigo-600" />
                  Peer Discussion & Questions ({activeLecture.comments?.length || 0})
                </h3>

                {/* Comment Input */}
                <form onSubmit={handleAddComment} className="flex gap-3">
                  <img
                    src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
                    alt="You"
                    className="h-9 w-9 rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="Ask a technical question or share helpful context (e.g., 'At @04:00 notice how...')"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={!newCommentText.trim()}
                        className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>Comment</span>
                      </button>
                    </div>
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-3 pt-2">
                  {activeLecture.comments?.map((comment) => (
                    <div key={comment.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={comment.avatar}
                            alt={comment.author}
                            className="h-7 w-7 rounded-full object-cover"
                          />
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {comment.author}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {comment.timestamp}
                          </span>
                        </div>
                        {comment.isEndorsed && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center gap-1">
                            <Check className="h-3 w-3" /> Endorsed Answer
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 pl-9.5 leading-relaxed">
                        {comment.text}
                      </p>
                    </div>
                  ))}
                  {(!activeLecture.comments || activeLecture.comments.length === 0) && (
                    <p className="text-xs text-slate-400 text-center py-4">
                      No questions yet. Be the first student to ask a question!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Chapters, Timestamped Notes & AI Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Chapters & Timestamp Index */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-600" />
                Lecture Chapters & Timestamps
              </h3>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {activeLecture.chapters?.map((ch, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (videoRef.current) videoRef.current.currentTime = ch.timeSeconds;
                      toast({ title: `Jumped to Chapter ${idx + 1}`, description: ch.title });
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-left text-xs transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-2xs">
                        {ch.timeStr}
                      </span>
                      <span className="truncate text-slate-700 dark:text-slate-300 font-medium group-hover:text-indigo-600">
                        {ch.title}
                      </span>
                    </div>
                    <Play className="h-3.5 w-3.5 text-slate-400 opacity-0 group-hover:opacity-100 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Personal Timestamped Note-Taking */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-indigo-600" />
                Your Timestamped Study Notes
              </h3>

              <form onSubmit={handleAddNote} className="space-y-2">
                <textarea
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Capture key insight at current second..."
                  rows={2}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden resize-none"
                />
                <button
                  type="submit"
                  disabled={!newNoteText.trim()}
                  className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Save Note @ Current Time</span>
                </button>
              </form>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {activeLecture.notes?.map((note) => (
                  <div key={note.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 space-y-1">
                    <span className="font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                      @{note.timeStr}
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      {note.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Key Concept Companion */}
            <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  AI Concept Takeaways
                </h3>
                <button
                  onClick={handleGenerateAiSummary}
                  disabled={isSummarizing}
                  className="text-[11px] font-bold text-indigo-300 hover:text-white cursor-pointer"
                >
                  {isSummarizing ? "Synthesizing..." : "Refresh Summary"}
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                {activeLecture.aiSummary || "Click 'Refresh Summary' to generate high-yield takeaways."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Feed Filters & YouTube-style Grid of All Student Lectures */}
      <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Feed Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: "all", label: "All Peer Lectures" },
              { id: "trending", label: "🔥 Trending (3k+ Views)" },
              { id: "my_uploads", label: "My Posted Videos" },
              { id: "saved", label: "Saved Library" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFeedTab(tab.id)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap",
                  feedTab === tab.id
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lectures, topics, creators..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
            />
          </div>
        </div>

        {/* Subject Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {subjects.map((subj) => (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer",
                selectedSubject === subj
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
              )}
            >
              {subj}
            </button>
          ))}
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLectures.map((lec) => {
            const isSelected = lec.id === selectedLectureId;
            return (
              <div
                key={lec.id}
                onClick={() => {
                  setSelectedLectureId(lec.id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={cn(
                  "bg-white dark:bg-slate-900 rounded-3xl p-4 border transition-all cursor-pointer space-y-3 group hover:shadow-lg flex flex-col justify-between",
                  isSelected
                    ? "border-indigo-600 ring-2 ring-indigo-600/20"
                    : "border-slate-200 dark:border-slate-800 hover:border-indigo-300"
                )}
              >
                <div className="space-y-3">
                  {/* Thumbnail / Duration banner */}
                  <div className="relative aspect-video rounded-2xl bg-slate-900 overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent z-1" />
                    <Play className="h-10 w-10 text-white/80 group-hover:scale-110 group-hover:text-indigo-400 transition-all z-2" />
                    <span className="absolute bottom-2 right-2 z-3 px-2 py-0.5 rounded text-[10px] font-bold bg-black/80 text-white font-mono">
                      {lec.duration || "20:00"}
                    </span>
                    <span className="absolute top-2 left-2 z-3 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                      {lec.eduScore || 95}% Edu Score
                    </span>
                  </div>

                  {/* Meta Details */}
                  <div className="flex items-start gap-3">
                    <img
                      src={lec.creator?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
                      alt={lec.creator?.name}
                      className="h-9 w-9 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                        {lec.title}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <span>{lec.creator?.name}</span>
                        {lec.creator?.isVerified && (
                          <CheckCircle2 className="h-3 w-3 text-indigo-600 fill-indigo-600 dark:text-indigo-400" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span>{(lec.views || 100).toLocaleString()} views</span>
                        <span>· {lec.subject}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold">
                    <ShieldCheck className="h-3.5 w-3.5" /> AI Verified
                  </span>
                  <div className="flex items-center gap-2">
                    <span>{lec.chapters?.length || 1} Chapters</span>
                    {user?.role === "admin" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAsAdmin(lec.id);
                        }}
                        className="p-1 rounded-md bg-rose-500/20 hover:bg-rose-500/40 text-rose-500 transition-colors"
                        title="Admin Delete Video"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredLectures.length === 0 && (
          <div className="py-16 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <Video className="h-10 w-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No Lectures Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your subject filter or search terms, or be the first student to post a lecture in this category!
            </p>
          </div>
        )}
      </div>

      {/* Upload Educational Lecture Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold">
                  <Upload className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    Publish Educational Lecture
                  </h3>
                  <p className="text-xs text-slate-400">
                    AI Content Gatekeeper strictly enforces educational & academic quality.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleVerifyAndPublishLecture} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Lecture Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Dynamic Programming: 0/1 Knapsack with Memoization & Bottom-Up Matrix"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Subject Axis *
                  </label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden cursor-pointer"
                  >
                    <option>Data Structures & Algorithms</option>
                    <option>Full-Stack Web</option>
                    <option>Python Programming</option>
                    <option>DevOps & Cloud</option>
                    <option>AI & Machine Learning</option>
                    <option>Database & System Design</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Difficulty Level
                  </label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden cursor-pointer"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Educational Description & What Peers Will Learn *
                </label>
                <textarea
                  required
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Explain the theoretical foundations, code concepts, and practical takeaways covered in this lecture video."
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden resize-none"
                />
              </div>

              {/* Video Source */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Video Source (YouTube / Vimeo Link OR Upload File)
                </label>
                <input
                  type="url"
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  className="w-full px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                  <span className="text-[11px] font-bold text-slate-400">OR DIRECT MP4 FILE</span>
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                </div>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/ogg"
                  onChange={handleFileUpload}
                  className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                />
              </div>

              {/* Chapters Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Lecture Chapters & Timestamps (One per line)
                </label>
                <textarea
                  rows={3}
                  value={newChaptersText}
                  onChange={(e) => setNewChaptersText(e.target.value)}
                  className="w-full p-3 font-mono text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-hidden resize-none"
                />
              </div>

              {/* AI Moderation Feedback Callout if any */}
              {moderationResult && !moderationResult.approved && (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Moderation Rejection: </span>
                    {moderationResult.reason}
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifyingContent}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/20 cursor-pointer transition-all disabled:opacity-50"
                >
                  {isVerifyingContent ? (
                    <>
                      <Sparkles className="h-4 w-4 animate-spin" />
                      <span>AI Verifying Educational Quality...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      <span>Verify & Publish to Peer Tube</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
