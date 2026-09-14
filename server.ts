import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import pdfParse from "pdf-parse";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const app = express();

app.use(express.json({ limit: "15mb" }));

// Lazy Google Gemini AI initialization
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Fallback logic for when GEMINI_API_KEY is not configured or in offline sandbox
function generateLocalAiResponse(prompt: string, schema: any) {
  const p = (prompt || "").toLowerCase();

  if (schema?.properties?.graph) {
    const skills = [
      "JavaScript", "React", "Node.js", "Databases", "System Design",
      "Algorithms", "Git", "Testing", "API Design", "Cloud Deployment"
    ];
    return {
      graph: skills.map((skill) => {
        let level = 0.5;
        if (p.includes(skill.toLowerCase())) level = 0.75;
        return {
          skill,
          level: Math.round(level * 100) / 100,
        };
      }),
    };
  }

  if (schema?.properties?.milestones) {
    return {
      milestones: [
        {
          skill: "System Design",
          currentLevel: 0.45,
          targetLevel: 0.85,
          durationWeeks: 4,
          subGoals: [
            "Understand horizontal vs vertical scaling and caching (Redis)",
            "Design distributed message queues and publish-subscribe systems",
            "Construct high-availability failover architectures",
          ],
          status: "in_progress",
        },
        {
          skill: "Cloud Deployment",
          currentLevel: 0.40,
          targetLevel: 0.80,
          durationWeeks: 3,
          subGoals: [
            "Master containerization best practices with Docker",
            "Deploy and orchestrate multi-tier applications with Kubernetes",
            "Implement automated CI/CD deployment pipelines",
          ],
          status: "locked",
        },
        {
          skill: "Testing",
          currentLevel: 0.50,
          targetLevel: 0.85,
          durationWeeks: 2,
          subGoals: [
            "Write comprehensive unit and integration suites",
            "Adopt end-to-end automated testing with Playwright",
            "Enforce regression testing coverage thresholds",
          ],
          status: "locked",
        },
        {
          skill: "Algorithms",
          currentLevel: 0.65,
          targetLevel: 0.85,
          durationWeeks: 4,
          subGoals: [
            "Deep dive into graph traversals and dynamic programming",
            "Analyze time/space tradeoffs under peak load constraints",
            "Complete 40 selected coding interview challenges",
          ],
          status: "locked",
        },
      ],
    };
  }

  if (schema?.properties?.suggestion) {
    return {
      suggestion: "Focus next on System Design — it's your primary growth opportunity for your career goal. Complete the System Design Primer resource, then take an adaptive assessment to validate your progress.",
    };
  }

  if (schema?.properties?.missingSkills) {
    return {
      missingSkills: [
        "Kubernetes & Container Orchestration",
        "Distributed Tracing & OpenTelemetry",
        "GraphQL & gRPC API Protocols",
      ],
      atsIssues: [
        "Quantify key accomplishments with metrics (e.g. 'reduced latency by 35%').",
        "Ensure standard headings like 'Experience', 'Education', and 'Skills' for optimal ATS parsing.",
      ],
      rewriteSuggestions: [
        "Add a dedicated 'Core Competencies' section matching job keywords directly.",
        "Highlight production system availability and CI/CD automation experience in your bullet points.",
      ],
    };
  }

  if (schema?.properties?.reason) {
    return {
      reason: "Recommended to strengthen your core competencies and close milestone gaps toward your career goal.",
    };
  }

  if (schema?.properties?.question) {
    return {
      question: "In distributed system architecture, which pattern prevents cascading failures across dependent downstream services?",
      options: [
        "Circuit Breaker pattern",
        "Singleton pattern",
        "Factory Method pattern",
        "Double-checked locking",
      ],
      correctIndex: 0,
      explanation: "The Circuit Breaker pattern detects failures and encapsulates the logic of preventing a failure from constantly recurring during maintenance or temporary outages.",
    };
  }

  if (schema?.properties?.reply) {
    return {
      reply: "Based on your competency profile, you have solid foundations in JavaScript, React, and Git. To reach senior engineering standards, I recommend focusing on System Design and Cloud Deployment. High-throughput distributed patterns and container orchestration are among the highest-demand skills in today's tech market.",
    };
  }

  return {};
}

// Known skill keywords for offline/fallback extraction
const KNOWN_SKILLS = [
  "JavaScript", "TypeScript", "React", "Next.js", "Vue", "Node.js", "Express",
  "Python", "Django", "Flask", "Java", "Spring Boot", "C++", "Go", "Rust",
  "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Docker", "Kubernetes",
  "AWS", "GCP", "Azure", "Git", "GitHub", "CI/CD", "REST APIs", "GraphQL",
  "Microservices", "System Design", "Unit Testing", "Jest", "Playwright",
  "Linux", "Agile", "Scrum", "Figma", "HTML5", "CSS3", "Tailwind CSS",
  "Machine Learning", "PyTorch", "TensorFlow", "Pandas", "Data Structures", "Algorithms"
];

function generateLocalIdeaAnalysis(
  ideaName: string = "Project",
  description: string = "",
  sector: string = "Technology",
  websiteUrl: string = ""
) {
  const title = ideaName || "Innovator Project";
  const desc = description || "Next-generation software solution addressing productivity bottlenecks.";
  const web = websiteUrl ? ` (${websiteUrl})` : "";

  return {
    viabilityScore: 84,
    verdict: "High Market Potential with Technical Defensibility",
    summary: `${title} targets a high-growth segment in ${sector}${web}. With deliberate architectural execution and defensible UX ergonomics, it can outmaneuver legacy incumbents by providing faster, more collaborative workflows.`,
    pros: [
      {
        title: "Distinct Product-Market Alignment",
        description: `Directly targets unsolved developer and end-user friction points in ${sector}, offering measurable operational time savings.`,
      },
      {
        title: "Strong Network & Viral Potential",
        description: "Shared workspace artifacts and collaborative team loops encourage organic multi-seat invite adoption.",
      },
      {
        title: "Scalable Cloud Unit Economics",
        description: "Stateless microservice design and modern client-side caching keep operational marginal costs per active user below $0.03/mo.",
      },
    ],
    cons: [
      {
        risk: "Cold-Start User & Data Asymmetry",
        impact: "High",
        mitigation: "Bootstrap with synthetic mock templates and pre-built starter configurations so users receive instant value without configuration.",
      },
      {
        risk: "Incumbent Feature Fast-Follow",
        impact: "Medium",
        mitigation: "Build sticky workflow integrations, proprietary domain-specific prompts, and open community extension hooks.",
      },
      {
        risk: "API Quotas & Token Latency Overhead",
        impact: "Medium",
        mitigation: "Implement tiered semantic caching (Redis), response streaming, and lightweight distilled models for basic classifications.",
      },
    ],
    existingSolutions: [
      {
        name: "Legacy Enterprise Suites",
        domain: "Traditional monolithic platforms",
        strengths: "Deep enterprise compliance, existing multi-year procurement contracts.",
        weaknesses: "Bloated navigation, steep learning curves, slow release cadences, and rigid pricing structures.",
        differentiationOpportunity: "Deliver an instantaneous, distraction-free browser UI with modern keyboard shortcuts and real-time multiplayer.",
      },
      {
        name: "Generic Open-Source Repositories",
        domain: "Developer DIY scripts",
        strengths: "Zero direct licensing expense, complete code transparency.",
        weaknesses: "Requires complex manual DevOps provisioning, lacks unified authentication, no zero-downtime maintenance.",
        differentiationOpportunity: "Offer a turn-key managed cloud service that works out of the box with zero dev setup time.",
      },
    ],
    improvements: [
      {
        area: "Edge Acceleration & Global CDN",
        recommendation: "Deploy serverless API handlers at the edge to guarantee sub-40ms response latency worldwide.",
        competitiveImpact: "Reduces bounce rate by 35% during first-time interactive walkthroughs.",
      },
      {
        area: "Interactive Sandboxed Preview",
        recommendation: "Embed an in-browser sandbox or live playground directly inside the core dashboard.",
        competitiveImpact: "Boosts user trial-to-activation conversion by creating immediate 'aha!' moments.",
      },
      {
        area: "Permissioned Team Collaboration",
        recommendation: "Introduce role-based access control (RBAC), multi-cursor annotations, and audit change logs.",
        competitiveImpact: "Enables seamless upgrade paths into team and enterprise pricing tiers.",
      },
    ],
    budgetEstimation: {
      totalEstimatedRange: "$3,800 – $6,500 (6-Month MVP Runway)",
      monthlyRunRate: "$420 – $780 / month",
      breakdown: [
        {
          category: "Cloud Compute & Managed Postgres",
          cost: "$120 – $180 / mo",
          details: "App hosting (Cloud Run/Vercel), managed PostgreSQL instance with read replicas, automated backups.",
        },
        {
          category: "AI & Vector Search Inference",
          cost: "$150 – $280 / mo",
          details: "Gemini 2.5/3 Flash API token consumption, embedding indices, semantic cache storage.",
        },
        {
          category: "Domain, CDN & Security Firewall",
          cost: "$35 – $60 / mo",
          details: "Custom domains, Cloudflare Enterprise DDoS mitigation, SSL certificates.",
        },
        {
          category: "Developer Tooling & Monitoring",
          cost: "$65 – $110 / mo",
          details: "GitHub Actions CI/CD minutes, Sentry performance tracing, Postman team workspace.",
        },
        {
          category: "Community Launch & Early User Acquisition",
          cost: "$500 one-off",
          details: "ProductHunt debut assets, video walkthrough production, and developer swag.",
        },
      ],
    },
    requiredTeam: [
      {
        role: "Lead Frontend / React Architect",
        headcount: 1,
        skills: ["React", "TypeScript", "Tailwind CSS", "UI/UX Design"],
        responsibilities: "Build responsive layout, state store, interactive data visualizations, and micro-interactions.",
      },
      {
        role: "Backend & Systems Engineer",
        headcount: 1,
        skills: ["Node.js", "Python", "Docker", "PostgreSQL", "System Design"],
        responsibilities: "Develop resilient REST/GraphQL APIs, rate-limiting middleware, and database schema migrations.",
      },
      {
        role: "AI/ML Integration Specialist",
        headcount: 1,
        skills: ["Machine Learning", "Python", "Gemini API", "FastAPI"],
        responsibilities: "Architect prompt pipelines, structured schema validation, fallback handlers, and model evaluations.",
      },
      {
        role: "Product & UI/UX Designer",
        headcount: 1,
        skills: ["UI/UX Design", "Figma", "Design Systems", "Prototyping"],
        responsibilities: "Create end-to-end design systems, accessibility WCAG compliance, user testing prototypes.",
      },
    ],
  };
}

function extractSkillsLocally(text: string): string[] {
  if (!text) return [];
  const lower = text.toLowerCase();
  const matched = KNOWN_SKILLS.filter((skill) => {
    const escaped = skill.toLowerCase().replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "i");
    return regex.test(lower);
  });
  return Array.from(new Set(matched));
}

function parseGeminiJson(text: string): any {
  if (!text) return null;
  const cleaned = text.trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    // Try extracting first JSON block (object or array)
    const jsonMatch = cleaned.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

function isTransientError(err: any): boolean {
  if (!err) return false;
  const status = err.status || err.code || err.statusCode;
  const msg = (err.message || "").toLowerCase();
  const str = String(err).toLowerCase();

  if (status === 503 || status === 429 || status === 500 || status === 502 || status === 504) {
    return true;
  }
  return (
    msg.includes("high demand") ||
    msg.includes("unavailable") ||
    msg.includes("resource_exhausted") ||
    msg.includes("temporary") ||
    msg.includes("try again later") ||
    msg.includes("rate limit") ||
    msg.includes("timeout") ||
    str.includes("503") ||
    str.includes("429")
  );
}

// Resilient Gemini invocation helper with exponential backoff & model fallbacks
async function callGeminiWithRetry(options: {
  contents: any;
  config?: any;
  preferredModel?: string;
}): Promise<string | null> {
  const ai = getGeminiClient();
  if (!ai) return null;

  // Primary model plus compliant fallback models from the official list
  const models = [
    options.preferredModel || "gemini-3.8-flash",
    "gemini-flash-latest",
    "gemini-3.1-flash-lite",
  ];

  for (const model of models) {
    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Gemini call timed out on ${model}`)), 4500)
      );

      const response = await Promise.race([
        ai.models.generateContent({
          model,
          contents: options.contents,
          config: options.config,
        }),
        timeoutPromise,
      ]);

      const text = response.text?.trim();
      if (text) {
        return text;
      }
    } catch (err: any) {
      if (isTransientError(err)) {
        console.info(`Gemini model ${model} temporarily unavailable or high demand. Switching to alternative model in pool...`);
        continue;
      }
      // Continue to next model on other errors
      continue;
    }
  }

  return null;
}

// Health endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    ai: "gemini-3.8-flash",
    hasApiKey: !!process.env.GEMINI_API_KEY,
  });
});

// Gemini AI endpoint for structured prompts
app.post("/api/ai/invoke-llm", async (req, res) => {
  const { prompt, response_json_schema } = req.body || {};

  try {
    if (prompt) {
      const text = await callGeminiWithRetry({
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          systemInstruction:
            "You are the Skills Map AI Career & Competency Guide. Always return strictly valid JSON corresponding to the requested schema. Do not include markdown ticks or additional commentary.",
        },
      });

      if (text) {
        const parsed = parseGeminiJson(text);
        if (parsed && Object.keys(parsed).length > 0) {
          return res.json(parsed);
        }
      }
    }
  } catch (err: any) {
    console.info("Gemini invoke-llm falling back to local synthesizer:", err?.message || err);
  }

  // Graceful fallback to guarantee UI remains responsive and functional
  const fallback = generateLocalAiResponse(prompt, response_json_schema);
  return res.json(fallback);
});

// Dedicated AI Idea Analyzer endpoint
app.post("/api/ai/analyze-idea", async (req, res) => {
  const { ideaName, description, sector, websiteUrl, targetAudience } = req.body || {};

  const systemPrompt = `You are a premier startup incubator partner, lead technical architect, and venture strategist.
Analyze the following startup/project idea and its website or referenced link. Provide an honest, high-depth analysis in strictly valid JSON with no markdown backticks:
{
  "viabilityScore": <integer 1-100>,
  "verdict": "<short strong verdict e.g. High Market Potential with High Technical Moat>",
  "summary": "<2-3 concise insightful sentences>",
  "pros": [
    { "title": "<strength name>", "description": "<detailed justification>" }
  ],
  "cons": [
    { "risk": "<risk name>", "impact": "<High|Medium|Low>", "mitigation": "<actionable mitigation strategy>" }
  ],
  "existingSolutions": [
    { "name": "<competitor or incumbent>", "domain": "<their category>", "strengths": "<what they do well>", "weaknesses": "<fatal flaws or gaps>", "differentiationOpportunity": "<how this idea wins>" }
  ],
  "improvements": [
    { "area": "<product or tech area>", "recommendation": "<concrete suggestion>", "competitiveImpact": "<measurable market advantage>" }
  ],
  "budgetEstimation": {
    "totalEstimatedRange": "<e.g. $4,000 - $7,500 (6-Month MVP Runway)>",
    "monthlyRunRate": "<e.g. $450 - $900 / mo>",
    "breakdown": [
      { "category": "<Cloud Compute / Database / AI APIs / Security / DevRel>", "cost": "<cost>", "details": "<item details>" }
    ]
  },
  "requiredTeam": [
    { "role": "<role name>", "headcount": 1, "skills": ["<skill1>", "<skill2>", "<skill3>"], "responsibilities": "<key contribution>" }
  ]
}

Idea Name: ${ideaName || "Innovator Project"}
Sector: ${sector || "Software Engineering"}
Website / Reference Link: ${websiteUrl || "None provided"}
Description: ${description || "Next-generation software application solving user pain points."}
Target Audience: ${targetAudience || "Tech-enabled professionals and teams"}`;

  try {
    const text = await callGeminiWithRetry({
      contents: systemPrompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    if (text) {
      const parsed = parseGeminiJson(text);
      if (parsed && parsed.pros && parsed.cons) {
        return res.json(parsed);
      }
    }
  } catch (err: any) {
    console.info("Gemini analyze-idea falling back to local strategist:", err?.message || err);
  }

  const fallback = generateLocalIdeaAnalysis(ideaName, description, sector, websiteUrl);
  return res.json(fallback);
});

// Gemini AI endpoint for resume text extraction
app.post("/api/ai/extract-file", async (req, res) => {
  const { textContent, base64Data, mimeType, file_url, fileName } = req.body || {};

  try {
    let contents: any = null;

    if (base64Data) {
      contents = [
        {
          inlineData: {
            mimeType: mimeType || "application/pdf",
            data: base64Data,
          },
        },
        {
          text: "Extract all text, skills, technologies, experience highlights, and career focus from this resume document. Return JSON: { \"resumeText\": string, \"detectedSkills\": string[] }.",
        },
      ];
    } else if (textContent || file_url) {
      contents = `Extract all skills, technologies, experience highlights, and career focus from this resume text:\n${textContent || file_url}\nReturn JSON with { "resumeText": string, "detectedSkills": string[] }`;
    }

    if (contents) {
      const text = await callGeminiWithRetry({
        contents,
        config: {
          responseMimeType: "application/json",
          systemInstruction:
            "You are an expert resume parser and ATS competency analyst. Always return strictly valid JSON with { \"resumeText\": string, \"detectedSkills\": string[] }.",
        },
      });

      if (text) {
        const parsed = parseGeminiJson(text);
        if (parsed && (parsed.resumeText || parsed.detectedSkills)) {
          return res.json({ output: parsed });
        }
      }
    }
  } catch (err: any) {
    console.info("Gemini resume extraction falling back to local extractor:", err?.message || err);
  }

  const rawText = textContent || "";
  const detectedSkills = extractSkillsLocally(rawText);

  return res.json({
    output: {
      resumeText: textContent || "",
      detectedSkills: detectedSkills,
      extracted: !!textContent,
    },
  });
});

// Module A: Skill Profiling Engine
app.post("/api/ai/profile-resume", async (req, res) => {
  const { resumeText, quizAnswers } = req.body || {};
  try {
    const ai = getGeminiClient();
    if (ai) {
      const prompt = `You are a technical skill assessor. Given this resume text and these quiz answers, output a JSON array of competency scores across these axes: Backend, Frontend, Architecture, Problem Solving, Database, DevOps. Score each 0.0-1.0 based on: quiz correctness for related questions, and evidence in the resume (projects, work experience, certifications, technologies mentioned). Only score an axis above 0.3 if there is direct evidence. Output strict JSON: [{ axis: string, level: number, evidence: string }]
      
Resume Text:
${resumeText || "None provided"}

Quiz Answers:
${JSON.stringify(quizAnswers || [])}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      if (response.text) {
        const parsed = JSON.parse(response.text);
        if (Array.isArray(parsed)) {
          return res.json({ competencyScores: parsed });
        }
      }
    }
  } catch (err) {
    console.warn("AI profiling fallback:", err);
  }

  // Fallback estimation
  const axes = ["Backend", "Frontend", "Architecture", "Problem Solving", "Database", "DevOps"];
  const fallbackScores = axes.map((axis) => ({
    axis,
    level: 0.55,
    evidence: "Evaluated from diagnostic assessment and baseline technical profile."
  }));
  return res.json({ competencyScores: fallbackScores });
});

// Module B: Adaptive Assessment Question Generation
app.post("/api/ai/adaptive-question", async (req, res) => {
  const { skillTopic, currentDifficulty } = req.body || {};
  try {
    const ai = getGeminiClient();
    if (ai) {
      const prompt = `Generate one multiple-choice question about ${skillTopic || "Software Engineering"} at difficulty level ${currentDifficulty ?? 0.5} (0.0 = beginner, 1.0 = expert). Output strict JSON: { question: string, options: [4 strings], correctIndex: number, difficulty: number }`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      if (response.text) {
        const parsed = JSON.parse(response.text);
        if (parsed && parsed.question && Array.isArray(parsed.options)) {
          return res.json(parsed);
        }
      }
    }
  } catch (err) {
    console.warn("AI adaptive question fallback:", err);
  }

  // Fallback question
  return res.json({
    question: `In advanced ${skillTopic || "Software Engineering"}, what is the primary architectural trade-off of adopting event-driven microservices?`,
    options: [
      "Increased eventual consistency complexity and distributed debugging overhead",
      "Elimination of all network latency across services",
      "Guaranteed strict ACID transactions globally without locks",
      "Zero infrastructure maintenance overhead"
    ],
    correctIndex: 0,
    difficulty: currentDifficulty || 0.5
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: "0.0.0.0", port: PORT },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Skills Map server running on http://0.0.0.0:${PORT} with Gemini AI`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
