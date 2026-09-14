import { skillsMap } from "@/api/skillsMapClient";
import { SKILL_TRACKS } from "@/lib/quizBank";

export const LEVEL_BANDS = ["beginner", "intermediate", "advanced"];

export function levelToBand(level) {
  if (level < 0.4) return "beginner";
  if (level < 0.7) return "intermediate";
  return "advanced";
}

export function bandToLevel(band) {
  return band === "advanced" ? 0.85 : band === "intermediate" ? 0.55 : 0.25;
}

export function avgCompetency(graph) {
  if (!graph || !graph.length) return 0;
  return graph.reduce((a, s) => a + (s.level || 0), 0) / graph.length;
}

export async function getMyProfile() {
  const me = await skillsMap.auth.me();
  const userId = me.id || me.uid;
  const userEmail = (me.email || "").toLowerCase();
  
  // Try matching by created_by_id or email
  const allProfiles = await skillsMap.entities.StudentProfile.list();
  const matched = allProfiles.find((p) => p.created_by_id === userId || (p.email && p.email.toLowerCase() === userEmail));
  if (matched) {
    return matched;
  }

  // Create default personalized profile for this specific user
  const track = me.track || "Software Engineering";
  const displayName = me.full_name || me.name || me.email?.split("@")[0] || "Student Candidate";
  const userInstitution = me.institution || "University Institute of Technology";
  const userGoal = me.careerGoal || "Full Stack Cloud & AI Systems Architect";

  const newProfile = {
    created_by_id: userId,
    name: displayName,
    full_name: displayName,
    email: me.email || "",
    track,
    institution: userInstitution,
    careerGoal: userGoal,
    bio: me.bio || `Passionate ${userGoal} focused on high-scale distributed backends, AI agents, and intuitive reactive user interfaces.`,
    resumeText: `${displayName}
${me.email || "student@skillsmap.io"} | LinkedIn / GitHub Portfolio
Target Role: ${userGoal}
Education: ${userInstitution} - B.S. in Computer Science & Engineering

PROFESSIONAL SUMMARY
Dynamic and results-driven software engineer specializing in full-stack cloud applications, reactive web platforms, and automated developer tooling. Experienced in designing resilient RESTful microservices, event-driven architectures, and AI agent integration pipelines.

CORE TECHNICAL SKILLS
- Languages: JavaScript (ES6+), TypeScript, Python, SQL, HTML5/CSS3
- Frontend: React 18, Vite, Tailwind CSS, Responsive Design, State Management
- Backend & Cloud: Node.js, Express, PostgreSQL, REST APIs, Docker, CI/CD
- Systems & AI: System Design, Distributed Caching (Redis), Google Gemini API, Git

FEATURED ENGINEERING PROJECTS
1. Intelligent Competency & Skill Gap Visualizer: Real-time radar charts and automated learning roadmap generation with automated progress checkpoints.
2. High-Throughput RESTful Microservices Engine: Implemented JWT authorization, rate-limiting middlewares, and optimized query execution with zero downtime.`,
    competencyGraph: emptyGraph(track),
    roadmap: {
      milestones: [
        {
          skill: "System Design",
          currentLevel: 0.55,
          targetLevel: 0.85,
          durationWeeks: 4,
          status: "in_progress",
          subGoals: [
            "Study distributed caching (Redis) & CDN edge strategies",
            "Design horizontal scaling & database sharding architecture",
            "Build an event-driven pub/sub architecture mockup",
          ],
        },
        {
          skill: "Cloud Deployment",
          currentLevel: 0.48,
          targetLevel: 0.80,
          durationWeeks: 3,
          status: "locked",
          subGoals: [
            "Containerize microservices with Docker and multi-stage builds",
            "Configure CI/CD pipelines with automated tests",
            "Deploy to Kubernetes cluster with ingress routing",
          ],
        },
        {
          skill: "API Design",
          currentLevel: 0.75,
          targetLevel: 0.90,
          durationWeeks: 2,
          status: "locked",
          subGoals: [
            "Implement RESTful endpoints adhering to OpenAPI 3.0",
            "Add rate limiting, JWT validation & error boundaries",
            "Design GraphQL schema with DataLoader to eliminate N+1 queries",
          ],
        },
      ],
    },
    activityLog: [
      {
        date: new Date().toISOString(),
        action: "Initialized personalized competency profile & portfolio",
        skillAffected: "",
        delta: 0,
      },
    ],
  };

  try {
    return await skillsMap.entities.StudentProfile.create(newProfile);
  } catch (err) {
    return newProfile;
  }
}

export async function createProfile(data) {
  return await skillsMap.entities.StudentProfile.create(data);
}

export async function updateProfile(id, data) {
  return await skillsMap.entities.StudentProfile.update(id, data);
}

export function emptyGraph(track) {
  return (SKILL_TRACKS[track] || []).map((skill) => ({
    skill,
    level: 0,
    lastUpdated: new Date().toISOString(),
  }));
}

export function bumpSkill(graph, skill, delta) {
  const next = (graph || []).map((s) => ({ ...s }));
  const idx = next.findIndex((s) => s.skill === skill);
  if (idx >= 0) {
    next[idx] = {
      ...next[idx],
      level: Math.min(1, Math.max(0, (next[idx].level || 0) + delta)),
      lastUpdated: new Date().toISOString(),
    };
  }
  return next;
}

export function addActivity(log, action, skillAffected, delta) {
  const entry = { date: new Date().toISOString(), action, skillAffected: skillAffected || "", delta: delta || 0 };
  return [entry, ...(log || [])].slice(0, 50);
}

export async function invokeAi({ prompt, systemInstruction }) {
  try {
    const fullPrompt = systemInstruction ? `${systemInstruction}\n\nUser Prompt: ${prompt}` : prompt;
    const res = await skillsMap.integrations.Core.InvokeLLM({
      prompt: fullPrompt,
      add_context_from_internet: false,
    });
    return typeof res === "string" ? res : JSON.stringify(res, null, 2);
  } catch (e) {
    return null;
  }
}

// ---- Gemini AI wrappers (with graceful fallbacks so the app stays usable) ----

async function llmJson(prompt, schema) {
  try {
    const res = await skillsMap.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: schema,
      add_context_from_internet: false,
    });
    return res;
  } catch (e) {
    return null;
  }
}

const graphSchema = {
  type: "object",
  properties: {
    graph: {
      type: "array",
      items: {
        type: "object",
        properties: { skill: { type: "string" }, level: { type: "number" } },
      },
    },
  },
};

const roadmapSchema = {
  type: "object",
  properties: {
    milestones: {
      type: "array",
      items: {
        type: "object",
        properties: {
          skill: { type: "string" },
          currentLevel: { type: "number" },
          targetLevel: { type: "number" },
          durationWeeks: { type: "number" },
          subGoals: { type: "array", items: { type: "string" } },
          status: { type: "string" },
        },
      },
    },
  },
};

const stringSchema = (key) => ({
  type: "object",
  properties: { [key]: { type: "string" } },
});

const resumeSchema = {
  type: "object",
  properties: {
    missingSkills: { type: "array", items: { type: "string" } },
    atsIssues: { type: "array", items: { type: "string" } },
    rewriteSuggestions: { type: "array", items: { type: "string" } },
  },
};

const questionSchema = {
  type: "object",
  properties: {
    question: { type: "string" },
    options: { type: "array", items: { type: "string" } },
    correctIndex: { type: "number" },
    explanation: { type: "string" },
  },
};

export async function generateCompetencyGraph(resumeText, track, quizAnswers) {
  const skills = SKILL_TRACKS[track] || [];
  const quizScore = quizAnswers
    ? skills.map((skill, i) => (quizAnswers[i] ? 0.55 + 0.4 * (quizAnswers[i].correct ? 1 : 0) : 0.3))
    : skills.map(() => 0.3);

  const resume = (resumeText || "").toLowerCase();
  const resumeBoost = skills.map((skill) => (resume.includes(skill.toLowerCase()) ? 0.1 : 0));

  const fallback = skills.map((skill, i) => ({
    skill,
    level: Math.min(1, Math.round((quizScore[i] + resumeBoost[i]) * 100) / 100),
    lastUpdated: new Date().toISOString(),
  }));

  const res = await llmJson(
    `You are a skill assessor. Given a resume and quiz results, produce a competency graph.\nTrack: ${track}\nSkills: ${JSON.stringify(skills)}\nResume: ${(resumeText || "").slice(0, 2000)}\nQuiz correct flags (1=correct,0=wrong): ${JSON.stringify(quizAnswers || skills.map(() => 0))}\nReturn JSON { "graph": [{ "skill": string, "level": number 0-1 }] } covering ALL listed skills.`,
    graphSchema
  );

  if (res && res.graph && res.graph.length) {
    const map = {};
    res.graph.forEach((g) => (map[g.skill] = g.level));
    return skills.map((skill) => ({
      skill,
      level: Math.min(1, Math.max(0, map[skill] != null ? map[skill] : fallback.find((f) => f.skill === skill).level)),
      lastUpdated: new Date().toISOString(),
    }));
  }
  return fallback;
}

export async function generateRoadmap(graph, goal) {
  const fallback = {
    milestones: (graph || [])
      .filter((s) => (s.level || 0) < 0.8)
      .sort((a, b) => (a.level || 0) - (b.level || 0))
      .slice(0, 6)
      .map((s) => ({
        skill: s.skill,
        currentLevel: s.level || 0,
        targetLevel: 0.85,
        durationWeeks: 3,
        subGoals: [
          `Complete a beginner project in ${s.skill}`,
          `Build an intermediate portfolio piece`,
          `Get peer-reviewed on advanced ${s.skill} work`,
        ],
        status: "locked",
      })),
  };

  const res = await llmJson(
    `You are a career roadmap planner. Given a student's competency graph and career goal, build an ordered learning roadmap.\nGoal: ${goal}\nCompetency graph: ${JSON.stringify(graph)}\nReturn JSON { "milestones": [{ "skill": string, "currentLevel": number, "targetLevel": number, "durationWeeks": number, "subGoals": [string], "status": "locked" }] }. Order milestones so foundational skills come first. 4-7 milestones.`,
    roadmapSchema
  );

  if (res && res.milestones && res.milestones.length) {
    return { milestones: res.milestones.map((m) => ({ ...m, status: m.status || "locked" })) };
  }
  return fallback;
}

export async function generateNextAction(graph, goal) {
  const lowest = [...(graph || [])].sort((a, b) => (a.level || 0) - (b.level || 0))[0];
  const fallback = `Focus next on ${lowest ? lowest.skill : "your weakest skill"} — it's your lowest-scoring area relevant to becoming a ${goal}. Pick one beginner resource, complete it, then take a 5-question adaptive assessment to lock in the gain.`;

  const res = await llmJson(
    `You are a learning coach. Suggest the single next action for this student.\nGoal: ${goal}\nCompetency graph: ${JSON.stringify(graph)}\nReturn JSON { "suggestion": string }. Concise, specific to this student.`,
    stringSchema("suggestion")
  );
  return (res && res.suggestion) || fallback;
}

export async function generateResumeAnalysis(resumeText, jobDescription) {
  const fallback = {
    missingSkills: [],
    atsIssues: ["Resume text could not be analyzed by AI right now — review formatting manually."],
    rewriteSuggestions: ["Add a skills section matching the job description keywords.", "Quantify achievements with metrics."],
  };

  const res = await llmJson(
    `You are an ATS + resume analyst. Compare the resume to the job description.\nResume: ${(resumeText || "").slice(0, 2500)}\nJob description: ${(jobDescription || "").slice(0, 2500)}\nReturn JSON { "missingSkills": [string], "atsIssues": [string], "rewriteSuggestions": [string] }. missingSkills = skills in the job description absent from the resume.`,
    resumeSchema
  );
  return res || fallback;
}

export async function generateResourceReason(resource, profile) {
  const lvl = (profile.competencyGraph || []).find((s) => s.skill === resource.skill)?.level || 0;
  const fallback = `Recommended to strengthen your ${resource.skill} — currently at ${Math.round(lvl * 100)}%.`;
  const res = await llmJson(
    `In one short sentence, explain why this resource fits this student.\nResource: ${JSON.stringify(resource)}\nStudent competency: ${JSON.stringify(profile.competencyGraph)}\nReturn JSON { "reason": string }.`,
    stringSchema("reason")
  );
  return (res && res.reason) || fallback;
}

export async function generateAdaptiveQuestion(skill, difficulty, previousCorrect) {
  const diffLabel = difficulty < 0.4 ? "easy" : difficulty < 0.7 ? "medium" : "hard";
  const fallback = {
    question: `${diffLabel.charAt(0).toUpperCase() + diffLabel.slice(1)} question on ${skill}: Which best describes ${skill}?`,
    options: ["A core concept in this field", "A database engine", "A design pattern only", "A network protocol"],
    correctIndex: 0,
    explanation: `This is a fallback question for ${skill}.`,
  };
  const res = await llmJson(
    `Generate one multiple-choice question to assess the skill "${skill}" at ${diffLabel} difficulty. ${previousCorrect === true ? "Student got the last one right, make it harder." : previousCorrect === false ? "Student got the last one wrong, make it easier." : ""}\nReturn JSON { "question": string, "options": [string,string,string,string], "correctIndex": number 0-3, "explanation": string }.`,
    questionSchema
  );
  if (res && res.question && res.options && res.options.length === 4) return res;
  return fallback;
}

export async function chatbotReply(profile, history, userMessage) {
  const fallback = `I'd focus on strengthening your lowest skills relative to your goal of becoming a ${profile?.careerGoal || "a professional"}. Based on your competency graph, prioritize the skills scoring below 50% and look for beginner resources, then validate with an adaptive assessment.`;
  const convo = history.slice(-4).map((h) => h.role + ": " + h.content).join("\n");
  const res = await llmJson(
    `You are a career guidance assistant. Answer using the student's current skills and goal. When relevant, mention which of their skills are in high demand, which are at risk of being automated or oversaturated, and what emerging skills they should consider. Keep answers concise and specific to this student, not generic advice.\nStudent competency graph: ${JSON.stringify(profile?.competencyGraph || [])}\nCareer goal: ${profile?.careerGoal || "not set"}\nConversation so far: ${convo}\nStudent question: ${userMessage}\nReturn JSON { "reply": string }.`,
    stringSchema("reply")
  );
  return (res && res.reply) || fallback;
}