# SkillsMap AI — Master Application Prompt & Technical Architecture Specification

This document provides the complete prompt, functional specifications, system architecture, data schemas, and prompt templates powering the **SkillsMap AI** competency platform.

---

## 1. System Vision & Product Description

**SkillsMap AI** is an intelligent, full-stack educational and career-readiness platform designed for students, engineering candidates, and academic institutions. It bridges the gap between academic theory and real-world industry requirements through:
- **Dynamic Skill Trees & Competency Radars**: Real-time evaluation of student competencies across Software Engineering, AI/ML, Cloud DevOps, Cybersecurity, and Product tracks.
- **Personalized AI Career Roadmaps**: Intelligent milestone generation with detailed rationale explaining *why* each skill must be learned, accompanied by curated free resources and YouTube tutorials.
- **Adaptive Spaced Timetable Generator**: Context-aware scheduling that takes a student's name, target date range, preferred daily hours, and exact personal background/constraints (work schedule, energy levels, exams) to generate hour-by-hour actionable plans.
- **Student Video Lectures Vault**: A dedicated portal where students can upload lecture videos or embed YouTube/Vimeo streams, take timestamped notes, and generate AI key takeaways.
- **Comprehensive Course Documentation & ELI5 Guides**: Deep multi-chapter engineering handbooks paired with "Explain Like I'm 10" analogies and downloadable PDF study guides with embedded links.
- **Institutional Admin & Faculty Console**: Protected role-based console for academic directors to monitor cohort progression, skill gaps, and industry benchmarks.

---

## 2. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 18+ with Vite, ES Modules, TypeScript/JavaScript |
| **Styling & Design System** | Tailwind CSS v4, Lucide React Icons, Custom Theme Provider (Dark/Light mode) |
| **Animations & UI** | Motion (`motion/react`), Canvas Confetti, Radix UI primitives |
| **Backend Server** | Node.js + Express (port 3000), Vite middleware integration |
| **Artificial Intelligence** | Google Gemini API via `@google/genai` SDK (`gemini-2.5-flash`) |
| **Database & Auth** | Firebase Firestore & Firebase Authentication (Google OAuth + Email/Password) |
| **Document Generation** | jsPDF with custom styling, vector cards, and clickable hyperlinks |
| **Data Visualizations** | Recharts (Radar charts, Bar charts, Area graphs, Donut meters) |

---

## 3. Core Functional Modules & User Flows

### A. Authentication & Role-Based Access Control (RBAC)
- **Google OAuth Popup & Email Auth**: Seamless authentication via Firebase Auth.
- **Automatic Profile Sync**: On sign-in, user records are isolated under `/users/{uid}` in Firestore.
- **Admin Verification**: Privileged administrative accounts (e.g., `venkatasantosh2478@gmail.com`) automatically receive the `admin` role with access to `/admin/*` routes.
- **Security Rules**: Non-admin students are strictly forbidden from viewing or modifying admin endpoints.

### B. Adaptive Spaced Timetable Generator
- **Inputs**:
  - `studentName`: Learner's full name.
  - `startDate` & `durationDays`: Schedule timeframe (7, 14, 21, or 30 days).
  - `preferredTimeSlot`: Preferred daily window (e.g. 6:00 PM – 9:00 PM, Morning, Weekend).
  - `dailyHours`: Committed hours per day.
  - `targetSkill`: Subject or track focus (e.g. Python Programming, DSA, Full-Stack).
  - `conditionDescription`: Detailed background constraints (work schedule, energy dips, exam deadlines).
- **Outputs**:
  - Daily timeline with exact time intervals (e.g., 6:00 PM – 6:45 PM: Video Concept, 6:45 PM – 7:30 PM: Hands-on Lab, 7:30 PM – 8:00 PM: Self-Recap).
  - Contextual AI study coach advice customized to the user's constraints.
  - Focus Pomodoro timer with audio-visual alerts.
  - PDF & Calendar (.ics) export.

### C. Student Lectures & Video Vault
- **Video Upload & Embed**: Supports uploading MP4/WebM files and embedding YouTube/Vimeo URLs.
- **Playback & Chapter Markers**: HTML5 video player with variable playback speed (0.75x–2.0x) and chapter jumps.
- **Timestamped Note Taking**: Interactive notes synced with video timestamps.
- **AI Key Concept Extractor**: Gemini AI analyzes lecture topics and generates summary sheets, formulas, and interview questions.

### D. AI Career Roadmap Engine
- **Milestone Generation**: Synthesizes structured 4–7 phase roadmaps based on competency gaps.
- **Detailed Rationale ("Why Learn This?")**: Clear explanation of industry relevance, salary tiers, and real-world architectures.
- **Curated Free Resources**: Direct links to official documentation (Python.org, MDN, PostgreSQL) and high-quality YouTube tutorials.

### E. Course Documentation & ELI5 Handbooks
- **Dual-Perspective Learning**:
  - *Technical Architecture*: Industry code patterns, diagrams, and best practices.
  - *ELI5 Analogy*: Intuitive real-world metaphors (e.g., "Web as a Pizza Restaurant", "Memory as a School Backpack").
- **Free Resources & YouTube Hub**: Embedded links for deep dive self-study.
- **Export Engine**: Vector PDF generation with active hyperlinks.

---

## 4. Master AI Prompt Templates

### Roadmap Generation System Prompt
\`\`\`text
You are an expert technical curriculum designer and career mentor. Given a student's competency matrix, target career goal, and background, generate an ordered learning roadmap in valid JSON format.
Each milestone MUST include:
- skill (string): Title of the topic or technology.
- currentLevel (number 0.0 - 1.0): Current estimated baseline proficiency.
- targetLevel (number 0.0 - 1.0): Required mastery for hireability.
- durationWeeks (number): Estimated time investment.
- whyLearn (string): In-depth 2-3 sentence explanation of WHY this skill is required, its industry demand, practical application, and salary tier impact.
- subGoals (array of strings): 3-4 actionable practical milestones.
- curatedResources (array of objects): Free official links and top YouTube video tutorials with title, url, type, and duration.
- projectDeliverable (string): Concrete portfolio project built during this phase.
\`\`\`

### Timetable Personalization System Prompt
\`\`\`text
You are an AI study coach and spaced repetition scheduler. Given the user's name, target subject, available daily hours, preferred time window, and personal condition/constraints (such as a full-time job, exam deadlines, or fatigue), create a daily hour-by-hour schedule.
Structure the schedule so that:
1. Difficult concepts are scheduled during high-energy windows.
2. Every session balances concept review, active video watching, practical code execution, and recap.
3. Realistic break buffers are included to prevent burnout.
\`\`\`

---

## 5. Security & Firestore Rules Summary
- All user data resides in `/users/{userId}`.
- Authenticated users have read and write permissions ONLY to their own documents (`request.auth.uid == userId`).
- Administrative metrics under `/adminData/*` and `/users` collections require `request.auth.token.role == 'admin'` or verified admin email matching.
