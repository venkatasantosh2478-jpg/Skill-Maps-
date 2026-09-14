import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Users,
  Hash,
  Send,
  Heart,
  Rocket,
  Flame,
  Search,
  MessageCircle,
  Clock,
  UserCheck
} from "lucide-react";
import {
  COMMUNITY_CHANNELS,
  INITIAL_COMMUNITY_POSTS,
  PEER_CONTACTS
} from "@/data/communityData";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { awardCurrentUserXP } from "@/data/leaderboardData";
import { evaluateAndAwardBadges } from "@/lib/badgeSystem";
import { Star } from "lucide-react";

const STORAGE_POSTS_KEY = "skillsmap_community_posts";
const STORAGE_DMS_KEY = "skillsmap_direct_chats";

export default function Community() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("general_chat"); // "general_chat" | "peer_contacts"
  const [activeChannelId, setActiveChannelId] = useState("general");
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState("");
  const [newPostTag, setNewPostTag] = useState("#general");
  const [searchPeerQuery, setSearchPeerQuery] = useState("");
  const [selectedPeerFilter, setSelectedPeerFilter] = useState("all");

  // 1:1 Direct Chat State
  const [selectedPeer, setSelectedPeer] = useState(null);
  const [directChats, setDirectChats] = useState({});
  const [dmInputText, setDmInputText] = useState("");

  // Load posts and DMs from localStorage or defaults
  useEffect(() => {
    try {
      const storedPosts = localStorage.getItem(STORAGE_POSTS_KEY);
      if (storedPosts) {
        setPosts(JSON.parse(storedPosts));
      } else {
        setPosts(INITIAL_COMMUNITY_POSTS);
        localStorage.setItem(STORAGE_POSTS_KEY, JSON.stringify(INITIAL_COMMUNITY_POSTS));
      }

      const storedDms = localStorage.getItem(STORAGE_DMS_KEY);
      if (storedDms) {
        setDirectChats(JSON.parse(storedDms));
      } else {
        const initialDms = {};
        PEER_CONTACTS.forEach((peer) => {
          initialDms[peer.id] = peer.initialMessages || [];
        });
        setDirectChats(initialDms);
        localStorage.setItem(STORAGE_DMS_KEY, JSON.stringify(initialDms));
      }
    } catch (e) {
      setPosts(INITIAL_COMMUNITY_POSTS);
    }
  }, []);

  // Save posts when updated
  const updatePosts = (newPosts) => {
    setPosts(newPosts);
    try {
      localStorage.setItem(STORAGE_POSTS_KEY, JSON.stringify(newPosts));
    } catch (e) {}
  };

  const handleSendPost = (e) => {
    e?.preventDefault();
    if (!newPostText.trim()) return;

    const currentUserName = user?.full_name || "Alex Chen";
    const initials = currentUserName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const newPost = {
      id: `post_${Date.now()}`,
      channelId: activeChannelId,
      author: {
        name: currentUserName,
        handle: `@${currentUserName.toLowerCase().replace(/\s+/g, "_")}`,
        avatar: initials || "ST",
        color: "bg-indigo-100 text-indigo-800",
        role: "Student",
        track: "Full Stack & Cloud Systems",
        college: "Tech University",
      },
      timestamp: "Just now",
      content: newPostText.trim(),
      likes: 1,
      tags: [newPostTag],
      replies: [],
    };

    const updated = [newPost, ...posts];
    updatePosts(updated);
    setNewPostText("");

    toast({
      title: "Message Posted!",
      description: `Your thoughts were shared to #${activeChannel?.name}.`,
    });
  };

  const handleReactPost = (postId, emoji) => {
    const updated = posts.map((p) => {
      if (p.id === postId) {
        return {
          ...p,
          likes: (p.likes || 0) + 1,
          lastReaction: emoji,
        };
      }
      return p;
    });
    updatePosts(updated);
  };

  const handleMarkHelpful = async (postId, replyId = null) => {
    const updated = posts.map((p) => {
      if (p.id === postId) {
        if (replyId && p.replies) {
          const updatedReplies = p.replies.map((r) =>
            r.id === replyId ? { ...r, isHelpful: true, helpfulCount: (r.helpfulCount || 0) + 1 } : r
          );
          return { ...p, replies: updatedReplies };
        }
        return { ...p, isHelpful: true, helpfulCount: (p.helpfulCount || 0) + 1 };
      }
      return p;
    });
    updatePosts(updated);

    // Increment user help count in localStorage for badge tracking
    const currentHelps = parseInt(localStorage.getItem("skillsmap_community_helps") || "0", 10) + 1;
    localStorage.setItem("skillsmap_community_helps", currentHelps.toString());

    // Award XP
    awardCurrentUserXP(50, "Community Peer Solution Recognized");

    // Evaluate badges
    const newBadges = await evaluateAndAwardBadges({
      communityHelpCount: currentHelps,
      userId: user?.uid
    });

    toast({
      title: "Helpful Answer Verified! ⭐",
      description: `+50 XP awarded! ${newBadges.length > 0 ? "You earned the Community Guardian Medal!" : `Total helpful solutions: ${currentHelps}`}`,
    });
  };

  const handleSendDm = () => {
    if (!selectedPeer || !dmInputText.trim()) return;

    const peerId = selectedPeer.id;
    const currentList = directChats[peerId] || [];
    const newMsg = {
      sender: "me",
      text: dmInputText.trim(),
      time: "Just now",
    };

    const updatedList = [...currentList, newMsg];
    const updatedAllDms = { ...directChats, [peerId]: updatedList };
    setDirectChats(updatedAllDms);
    setDmInputText("");

    try {
      localStorage.setItem(STORAGE_DMS_KEY, JSON.stringify(updatedAllDms));
    } catch (e) {}

    // Simulate friendly automatic response after 1.5s
    setTimeout(() => {
      const responseMsg = {
        sender: "them",
        text: `Hey! Thanks for reaching out! Glad to connect on SkillMap. Let's definitely collaborate on this!`,
        time: "Just now",
      };
      setDirectChats((prev) => {
        const withReply = {
          ...prev,
          [peerId]: [...(prev[peerId] || []), responseMsg],
        };
        try {
          localStorage.setItem(STORAGE_DMS_KEY, JSON.stringify(withReply));
        } catch (e) {}
        return withReply;
      });
    }, 1400);
  };

  const activeChannel = COMMUNITY_CHANNELS.find((c) => c.id === activeChannelId) || COMMUNITY_CHANNELS[0];
  const channelPosts = posts.filter((p) => p.channelId === activeChannelId);

  const filteredPeers = PEER_CONTACTS.filter((peer) => {
    const matchesFilter =
      selectedPeerFilter === "all" ||
      (selectedPeerFilter === "online" && peer.status.toLowerCase().includes("online")) ||
      (selectedPeerFilter === "pair" && peer.status.toLowerCase().includes("pair"));
    const matchesSearch =
      searchPeerQuery === "" ||
      peer.name.toLowerCase().includes(searchPeerQuery.toLowerCase()) ||
      peer.college.toLowerCase().includes(searchPeerQuery.toLowerCase()) ||
      peer.topSkills.some((s) => s.toLowerCase().includes(searchPeerQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Community Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-10 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Users className="h-3.5 w-3.5" /> Community & Peer Network
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            Connect, Chat & Collaborate with <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-sky-300 bg-clip-text text-transparent">Fellow Students</span>
          </h1>
          <p className="mt-3 text-slate-300 text-base sm:text-lg leading-relaxed">
            Join the general student discussion lounge to debate system design, share roadmap progress, or directly contact peers for pair programming and mock interviews.
          </p>

          <div className="mt-6 flex items-center gap-6 pt-5 border-t border-slate-800/80 flex-wrap text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              230+ Students Online Across Tracks
            </span>
            <span>·</span>
            <span>5 Active Real-Time Channels</span>
            <span>·</span>
            <span>Direct 1:1 Peer Messenger</span>
          </div>
        </div>
      </div>

      {/* Main Mode Toggle: General Chat vs. People to Contact */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("general_chat")}
            className={`px-4 py-2 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "general_chat"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            General Student Chat (All Channels)
          </button>
          <button
            onClick={() => setActiveTab("peer_contacts")}
            className={`px-4 py-2 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "peer_contacts"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <UserCheck className="h-4 w-4" />
            People to Contact & 1:1 Direct Chat ({PEER_CONTACTS.length})
          </button>
        </div>
      </div>

      {/* MODE 1: GENERAL STUDENT CHAT */}
      {activeTab === "general_chat" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Channel Sidebar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
            <div className="px-2 py-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Student Channels
              </span>
            </div>

            <div className="space-y-1">
              {COMMUNITY_CHANNELS.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannelId(ch.id)}
                  className={`w-full px-3 py-2.5 rounded-xl text-left transition-all flex items-center justify-between text-xs font-semibold ${
                    activeChannelId === ch.id
                      ? "bg-indigo-50 text-indigo-700 font-bold border border-indigo-200/70"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Hash className={`h-4 w-4 ${activeChannelId === ch.id ? "text-indigo-600" : "text-slate-400"}`} />
                    <span className="truncate">{ch.name}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-normal">
                    {ch.activeUsers} online
                  </span>
                </button>
              ))}
            </div>

            {/* Quick Channel Guidelines */}
            <div className="mt-4 pt-4 border-t border-slate-100 px-2">
              <p className="text-[11px] text-slate-400 font-medium">Lounge Etiquette</p>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Be kind, respectful, and constructive. Share actionable learning notes, code snippets, and celebrate each other's progress!
              </p>
            </div>
          </div>

          {/* Discussion Feed & Composer (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Channel Banner */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Hash className="h-5 w-5 text-indigo-600" />
                  <h2 className="text-base font-bold text-slate-900">
                    {activeChannel.name}
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {activeChannel.description}
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100 flex items-center gap-1.5 flex-shrink-0">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {activeChannel.activeUsers} Students Active
              </span>
            </div>

            {/* Composer Box */}
            <form
              onSubmit={handleSendPost}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3"
            >
              <textarea
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder={`Message #${activeChannel.name}... Ask a question, share a milestone, or start a discussion`}
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none bg-slate-50 focus:bg-white"
              />

              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-slate-400">Tag:</span>
                  <select
                    value={newPostTag}
                    onChange={(e) => setNewPostTag(e.target.value)}
                    className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none"
                  >
                    <option value="#general">#general</option>
                    <option value="#roadmap">#roadmap</option>
                    <option value="#systemdesign">#systemdesign</option>
                    <option value="#interviewprep">#interviewprep</option>
                    <option value="#projectcollab">#projectcollab</option>
                    <option value="#question">#question</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={!newPostText.trim()}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-200 transition-colors flex items-center gap-1.5 disabled:opacity-40"
                >
                  <Send className="h-3.5 w-3.5" /> Post to Channel
                </button>
              </div>
            </form>

            {/* Posts List */}
            <div className="space-y-4">
              {channelPosts.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
                  No messages in #{activeChannel.name} yet. Be the first student to start the conversation!
                </div>
              ) : (
                channelPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-3.5 hover:border-slate-300 transition-colors"
                  >
                    {/* Post Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs ${post.author.color}`}
                        >
                          {post.author.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">
                              {post.author.name}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {post.author.handle}
                            </span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-slate-600 font-medium">
                              {post.author.role}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            {post.author.college} · {post.author.track}
                          </p>
                        </div>
                      </div>

                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {post.timestamp}
                      </span>
                    </div>

                    {/* Post Content */}
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line pl-12">
                      {post.content}
                    </p>

                    {/* Post Tags & Reactions */}
                    <div className="flex items-center justify-between gap-3 pt-2 pl-12 border-t border-slate-50">
                      <div className="flex items-center gap-1.5">
                        {post.tags?.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-semibold"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Reaction Bar */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleReactPost(post.id, "heart")}
                          className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-medium border border-slate-200/60 flex items-center gap-1 transition-colors"
                        >
                          <Heart className="h-3 w-3 text-rose-500" /> {post.likes}
                        </button>
                        <button
                          onClick={() => handleReactPost(post.id, "rocket")}
                          className="p-1 rounded-lg bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 border border-slate-200/60 text-xs transition-colors"
                          title="Boost"
                        >
                          <Rocket className="h-3 w-3 text-indigo-500" />
                        </button>
                        <button
                          onClick={() => handleReactPost(post.id, "fire")}
                          className="p-1 rounded-lg bg-slate-50 hover:bg-amber-50 text-slate-600 hover:text-amber-600 border border-slate-200/60 text-xs transition-colors"
                          title="Inspiring"
                        >
                          <Flame className="h-3 w-3 text-amber-500" />
                        </button>
                      </div>
                    </div>

                    {/* Replies Thread */}
                    {post.replies && post.replies.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100 pl-12 space-y-2">
                        {post.replies.map((rep) => (
                          <div key={rep.id} className="bg-slate-50 p-3 rounded-xl flex items-start gap-2.5">
                            <div
                              className={`h-6 w-6 rounded-md flex items-center justify-center font-bold text-[10px] ${rep.color}`}
                            >
                              {rep.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-bold text-slate-900">
                                  {rep.author}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  {rep.timestamp}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                                {rep.content}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <button
                                  onClick={() => handleMarkHelpful(post.id, rep.id)}
                                  className={`text-3xs px-2 py-0.5 rounded-md font-bold flex items-center gap-1 transition-all ${
                                    rep.isHelpful 
                                      ? "bg-amber-100 text-amber-800 border border-amber-300"
                                      : "bg-slate-200/70 hover:bg-amber-50 text-slate-600 hover:text-amber-700"
                                  }`}
                                >
                                  <Star className={`h-2.5 w-2.5 ${rep.isHelpful ? "fill-amber-500 text-amber-500" : ""}`} />
                                  {rep.isHelpful ? `Helpful Solution (${rep.helpfulCount || 1})` : "Mark as Helpful (+50 XP)"}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: PEOPLE TO CONTACT & 1:1 DIRECT CHAT */}
      {activeTab === "peer_contacts" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Peer Directory (1 or 2 cols) */}
          <div className="lg:col-span-2 space-y-5">
            {/* Filter and Search Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {["all", "online", "pair"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedPeerFilter(f)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                      selectedPeerFilter === f
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60"
                    }`}
                  >
                    {f === "all" ? "All Peers" : f === "online" ? "Online Now" : "Pair Coding"}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchPeerQuery}
                  onChange={(e) => setSearchPeerQuery(e.target.value)}
                  placeholder="Search by name, skill, college..."
                  className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Peer Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredPeers.map((peer) => (
                <div
                  key={peer.id}
                  className={`bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                    selectedPeer?.id === peer.id
                      ? "border-indigo-600 ring-2 ring-indigo-500/20"
                      : "border-slate-200"
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-11 w-11 rounded-xl flex items-center justify-center font-bold text-sm ${peer.color}`}
                        >
                          {peer.avatar}
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-slate-900">
                            {peer.name}
                          </h3>
                          <p className="text-[11px] text-slate-500">
                            {peer.college}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`h-2.5 w-2.5 rounded-full ${peer.statusColor} ring-4 ring-white flex-shrink-0`}
                        title={peer.status}
                      />
                    </div>

                    <p className="text-[11px] font-semibold text-indigo-600 mt-2">
                      {peer.sector}
                    </p>

                    <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-2">
                      {peer.bio}
                    </p>

                    {/* Top Skills */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {peer.topSkills.map((sk) => (
                        <span
                          key={sk}
                          className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contact Action */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      {peer.openTo}
                    </span>

                    <button
                      onClick={() => setSelectedPeer(peer)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      Chat / Contact
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 1:1 Direct Chat Drawer / Window */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[580px]">
            {selectedPeer ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs ${selectedPeer.color}`}
                    >
                      {selectedPeer.avatar}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">
                        {selectedPeer.name}
                      </h3>
                      <p className="text-[10px] text-slate-500">
                        {selectedPeer.status} · {selectedPeer.sector}
                      </p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded bg-white text-indigo-700 text-[10px] font-semibold border border-slate-200">
                    1:1 Peer DM
                  </span>
                </div>

                {/* Messages Body */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-white">
                  <div className="text-center py-2">
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-medium">
                      Direct Peer Chat with {selectedPeer.name}
                    </span>
                  </div>

                  {(directChats[selectedPeer.id] || []).map((msg, i) => (
                    <div
                      key={i}
                      className={`flex flex-col ${
                        msg.sender === "me" ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                          msg.sender === "me"
                            ? "bg-indigo-600 text-white rounded-br-xs"
                            : "bg-slate-100 text-slate-800 rounded-bl-xs"
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 px-1">
                        {msg.time}
                      </span>
                    </div>
                  ))}
                </div>

                {/* DM Input Footer */}
                <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center gap-2">
                  <input
                    type="text"
                    value={dmInputText}
                    onChange={(e) => setDmInputText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendDm()}
                    placeholder={`Message ${selectedPeer.name}...`}
                    className="flex-1 text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                  <button
                    onClick={handleSendDm}
                    disabled={!dmInputText.trim()}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors disabled:opacity-40"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-700">No Peer Selected</h4>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                    Select a student from the directory to start a direct 1:1 conversation for pair coding, resume reviews, or study collabs.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
