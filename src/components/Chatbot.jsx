import React, { useState, useRef, useEffect } from "react";
import { 
  X, 
  Send, 
  Loader2, 
  Sparkles, 
  Bot, 
  User, 
  RefreshCw, 
  Copy, 
  Check, 
  Wand2, 
  ChevronRight,
  MessageSquare
} from "lucide-react";
import { chatbotReply, getMyProfile, invokeAi } from "@/lib/skillMap";
import { evaluateAndAwardBadges } from "@/lib/badgeSystem";
import { awardCurrentUserXP } from "@/data/leaderboardData";
import { cn } from "@/lib/utils";

const QUICK_PROMPTS = [
  "What skills should I prioritize next?",
  "How to bridge my largest skill gap?",
  "Recommend high-demand tech stacks",
  "Generate Architecture Prompt for a real-time app",
];

const PROMPT_THEMES = [
  { id: "fullstack", title: "Full Stack Cloud Platform", desc: "React, Node.js, Postgres, Docker, Redis", tag: "Web & Systems" },
  { id: "agentic", title: "Multi-Agent AI Workflow", desc: "Gemini SDK, Vector DB, Tool Calling", tag: "Agentic AI" },
  { id: "realtime", title: "Real-time Collaborative Board", desc: "WebSockets, CRDTs, High-concurrency", tag: "Realtime" },
  { id: "distributed", title: "Microservices & Distributed Pub/Sub", desc: "Kafka, gRPC, Distributed Caching", tag: "Distributed" }
];

export default function Chatbot() {
  const [profile, setProfile] = useState(null);
  const [open, setOpen] = useState(false);
  const [activeMode, setActiveMode] = useState("chat"); // "chat" | "prompt_generator"
  const [ideaInput, setIdeaInput] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("fullstack");
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    getMyProfile().then(setProfile).catch(() => {});
  }, []);

  const [messages, setMessages] = useState([
    { 
      role: "assistant", 
      content: "Hello! I'm your SkillsMap Career & Architecture AI. You can ask me career questions or switch to **Prompt Studio** to generate comprehensive system architecture and project prompts directly inside this chat!" 
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open, activeMode]);

  const send = async (textToSend) => {
    const text = typeof textToSend === "string" ? textToSend : input;
    if (!text.trim() || loading) return;
    const userMsg = { role: "user", content: text.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const reply = await chatbotReply(profile, messages, userMsg.content);
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "I encountered an issue processing that. Please ask again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePromptInChat = async (themeOverride, customIdeaText) => {
    const theme = themeOverride || selectedTheme;
    const idea = customIdeaText || ideaInput || PROMPT_THEMES.find(t => t.id === theme)?.title || "Scalable Engineering Application";
    
    const userRequestMsg = {
      role: "user",
      content: `Generate a complete Master Architecture & System Design Prompt for: "${idea}" (Theme: ${theme})`
    };

    setMessages((m) => [...m, userRequestMsg]);
    setActiveMode("chat");
    setLoading(true);

    try {
      const systemPrompt = `You are a Principal Software Architect. The user wants a production-ready Master Architecture & Implementation Prompt for their idea: "${idea}". 
Produce a structured, comprehensive, copyable Master Specification Prompt containing:
1. System Overview & Core Objectives
2. High-Scale Architectural Topology (Frontend, Backend, Database, Async Workers)
3. Tech Stack Breakdown & Framework Justifications
4. Master Database Schemas & Data Invariants
5. Core REST/gRPC Endpoints & API Contract
6. Security, Zero-Trust Access & Edge Cases
7. Step-by-Step Phased Implementation Plan

Format with clear markdown headings and bold labels.`;

      const response = await invokeAi({
        systemInstruction: systemPrompt,
        prompt: `Generate the complete Master System Architecture Prompt for: ${idea}`
      });

      const replyContent = response || `### Master System Architecture Prompt: ${idea}\n\n**1. Architecture Topology**\n- Client: React 19 + TypeScript + Vite + Tailwind CSS\n- Backend: Express.js REST API with rate-limiting & zero-trust auth\n- Database: Firestore / PostgreSQL with ACID consistency\n\n**2. Data Schemas & Invariants**\n- Users: { uid, email, role, xp, metrics, createdAt }\n- Resources: { id, ownerId, status, payload, updatedAt }\n\n**3. Key Endpoints**\n- POST /api/v1/auth/session\n- GET /api/v1/resources/stream\n- POST /api/v1/engine/execute`;

      setMessages((m) => [
        ...m,
        { 
          role: "assistant", 
          content: replyContent,
          isPromptArtifact: true,
          promptTitle: idea
        }
      ]);

      // Award XP and Prompt Architect badge!
      awardCurrentUserXP(100, "AI Architecture Prompt Generated");
      evaluateAndAwardBadges({ promptsGenerated: 1 });

    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `Failed to generate prompt: ${err.message}. Please try again.` }
      ]);
    } finally {
      setLoading(false);
      setIdeaInput("");
    }
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-600/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 group border border-indigo-400/40"
        aria-label="Open career chatbot and prompt studio"
      >
        {open ? (
          <X className="h-6 w-6 transition-transform group-hover:rotate-90 duration-200" />
        ) : (
          <div className="relative">
            <Sparkles className="h-6 w-6 text-white" />
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-emerald-400 rounded-full ring-2 ring-indigo-600 animate-pulse" />
          </div>
        )}
      </button>

      {open && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[min(94vw,440px)] h-[580px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="px-5 py-3.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-indigo-900/40">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-xs">
                {activeMode === "chat" ? <Bot className="h-5 w-5 text-white" /> : <Wand2 className="h-5 w-5 text-white" />}
              </div>
              <div>
                <p className="font-heading font-bold text-sm text-white leading-tight">
                  {activeMode === "chat" ? "SkillsMap AI Advisor" : "AI Prompt Studio"}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-[11px] text-slate-300">Powered by Gemini AI</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setMessages([{ role: "assistant", content: "Conversation reset. What can I help you architect or prepare today?" }])}
                title="Reset conversation"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
            <button
              onClick={() => setActiveMode("chat")}
              className={cn(
                "flex-1 py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all",
                activeMode === "chat"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs"
                  : "text-slate-600 dark:text-slate-400 hover:bg-white/50"
              )}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Career Chat
            </button>
            <button
              onClick={() => setActiveMode("prompt_generator")}
              className={cn(
                "flex-1 py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all",
                activeMode === "prompt_generator"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs"
                  : "text-slate-600 dark:text-slate-400 hover:bg-white/50"
              )}
            >
              <Wand2 className="h-3.5 w-3.5" />
              Prompt Generator
            </button>
          </div>

          {/* CHAT MODE */}
          {activeMode === "chat" && (
            <>
              {/* Messages Area */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50/60 dark:bg-slate-950/40">
                {messages.map((m, i) => {
                  const isUser = m.role === "user";
                  const isArtifact = m.isPromptArtifact;

                  return (
                    <div key={i} className={isUser ? "flex justify-end gap-2" : "flex justify-start gap-2"}>
                      {!isUser && (
                        <div className="h-7 w-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0 mt-0.5">
                          <Sparkles className="h-3.5 w-3.5" />
                        </div>
                      )}

                      <div 
                        className={cn(
                          "rounded-2xl text-xs sm:text-sm shadow-2xs leading-relaxed",
                          isUser
                            ? "max-w-[80%] rounded-tr-xs bg-indigo-600 text-white px-3.5 py-2.5"
                            : isArtifact
                            ? "max-w-[95%] rounded-tl-xs bg-slate-900 text-slate-100 border border-indigo-500/40 p-4 space-y-3 font-mono text-xs"
                            : "max-w-[88%] rounded-tl-xs bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-3.5 py-2.5 whitespace-pre-wrap"
                        )}
                      >
                        {isArtifact && (
                          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-300 font-sans">
                            <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                              <Sparkles className="h-3.5 w-3.5" /> Master Architecture Prompt
                            </span>
                            <button
                              onClick={() => copyToClipboard(m.content, i)}
                              className="flex items-center gap-1 text-2xs px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all"
                            >
                              {copiedIndex === i ? (
                                <>
                                  <Check className="h-3 w-3 text-emerald-300" /> Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" /> Copy Prompt
                                </>
                              )}
                            </button>
                          </div>
                        )}

                        <div className={isArtifact ? "max-h-64 overflow-y-auto whitespace-pre-wrap text-[11px] text-slate-200" : ""}>
                          {m.content}
                        </div>
                      </div>

                      {isUser && (
                        <div className="h-7 w-7 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                          <User className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {loading && (
                  <div className="flex justify-start gap-2">
                    <div className="h-7 w-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                    <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl rounded-tl-xs px-3.5 py-2.5 shadow-2xs flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-indigo-600 dark:text-indigo-400" />
                      <span className="text-xs text-slate-500 dark:text-slate-400">Gemini is synthesizing...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Prompt Chips */}
              <div className="px-3 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {QUICK_PROMPTS.map((qp, idx) => (
                  <button
                    key={idx}
                    onClick={() => send(qp)}
                    className="whitespace-nowrap text-[11px] font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 px-2.5 py-1 rounded-full transition-colors shrink-0"
                  >
                    {qp}
                  </button>
                ))}
              </div>

              {/* Input Box */}
              <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="Ask about skills, interview prep, or type an idea..."
                  className="flex-1 text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50 dark:bg-slate-800 dark:text-white"
                />
                <button 
                  onClick={() => send()} 
                  disabled={loading || !input.trim()} 
                  className="h-9 w-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center disabled:opacity-40 transition-colors shadow-xs"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </>
          )}

          {/* PROMPT GENERATOR STUDIO MODE (Directly inside chat) */}
          {activeMode === "prompt_generator" && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/40">
              <div className="p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200">
                <p className="font-bold flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 mb-1">
                  <Wand2 className="h-4 w-4" /> In-Chat Architecture Prompt Engine
                </p>
                Select a theme or describe your custom product idea. Gemini will generate a production-ready system specification prompt directly into this chat!
              </div>

              {/* Themes Grid */}
              <div className="space-y-2">
                <label className="text-2xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Select Architectural Archetype
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {PROMPT_THEMES.map((theme) => {
                    const isSel = selectedTheme === theme.id;
                    return (
                      <button
                        key={theme.id}
                        onClick={() => setSelectedTheme(theme.id)}
                        className={cn(
                          "p-3 rounded-2xl text-left border transition-all flex items-center justify-between gap-3",
                          isSel
                            ? "bg-white dark:bg-slate-800 border-indigo-500 dark:border-indigo-400 shadow-sm ring-2 ring-indigo-500/20"
                            : "bg-white/80 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300"
                        )}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900 dark:text-white">
                              {theme.title}
                            </span>
                            <span className="text-3xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold">
                              {theme.tag}
                            </span>
                          </div>
                          <p className="text-2xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {theme.desc}
                          </p>
                        </div>
                        <ChevronRight className={cn("h-4 w-4", isSel ? "text-indigo-600" : "text-slate-300")} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Idea Input */}
              <div className="space-y-1.5">
                <label className="text-2xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Custom Project or Idea Details
                </label>
                <textarea
                  rows={3}
                  value={ideaInput}
                  onChange={(e) => setIdeaInput(e.target.value)}
                  placeholder="e.g. A peer-to-peer real-time mentorship canvas with video breakout rooms and live collaborative compiler..."
                  className="w-full text-xs p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleGeneratePromptInChat()}
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Synthesizing Master Prompt...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Master Architecture Prompt (+100 XP)
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
