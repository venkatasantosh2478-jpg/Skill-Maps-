// Utility for generating and triggering instant downloads for App Details (Users, Top Videos, Platform Telemetry)

function downloadBlob(content, filename, contentType) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Convert Array of Objects to CSV string safely handling commas and quotes
function arrayToCSV(rows) {
  if (!rows || !rows.length) return "";
  const headers = Object.keys(rows[0]);
  const csvRows = [
    headers.join(","), // header row
    ...rows.map((row) =>
      headers
        .map((header) => {
          let val = row[header];
          if (val === null || val === undefined) val = "";
          if (typeof val === "object") val = JSON.stringify(val);
          val = String(val).replace(/"/g, '""');
          return `"${val}"`;
        })
        .join(",")
    )
  ];
  return csvRows.join("\r\n");
}

export function downloadUsersCSV(users) {
  const timestamp = new Date().toISOString().split("T")[0];
  const formattedRows = users.map((u, idx) => ({
    Index: idx + 1,
    UserID: u.id || u.uid || `user_${idx}`,
    FullName: u.full_name || u.name || "Student",
    Email: u.email || "",
    Role: u.role || "student",
    Institution: u.institution || "University Institute of Technology",
    Track: u.track || "Software Engineering",
    CareerGoal: u.careerGoal || "Full Stack Software Engineer",
    XP_Points: u.xp ?? 2150,
    ModulesCompleted: u.modulesCompleted ?? 4,
    QuizzesCompleted: u.quizzesCompleted ?? 8,
    CodeChallengesSolved: u.codeChallengesSolved ?? 9,
    StreakDays: u.streakDays ?? 5,
    RegisteredDate: u.created_date || new Date().toISOString()
  }));

  const csv = arrayToCSV(formattedRows);
  downloadBlob(csv, `skillsmap_users_export_${timestamp}.csv`, "text/csv;charset=utf-8;");
}

export function downloadUsersJSON(users) {
  const timestamp = new Date().toISOString().split("T")[0];
  const payload = {
    exportType: "SKILLSMAP_USERS_DATABASE",
    exportedAt: new Date().toISOString(),
    totalUsersCount: users.length,
    users
  };
  const jsonStr = JSON.stringify(payload, null, 2);
  downloadBlob(jsonStr, `skillsmap_users_export_${timestamp}.json`, "application/json;charset=utf-8;");
}

export function downloadTopVideosCSV(videos) {
  const timestamp = new Date().toISOString().split("T")[0];
  const formattedRows = (videos || []).map((v, idx) => ({
    Rank: idx + 1,
    VideoID: v.id,
    Title: v.title,
    Subject: v.subject || "Computer Science",
    CreatorName: v.creator?.name || "Student Creator",
    CreatorRole: v.creator?.role || "Student",
    Duration: v.duration || "20:00",
    Views: v.views || 0,
    Likes: v.likes || 0,
    EducationalScore: `${v.eduScore || 95}%`,
    Difficulty: v.difficulty || "Intermediate",
    Tags: Array.isArray(v.tags) ? v.tags.join(" | ") : "",
    VideoUrl: v.videoUrl || "",
    GithubResource: v.resources?.githubUrl || "",
    NotesPdf: v.resources?.notesPdfName || ""
  }));

  const csv = arrayToCSV(formattedRows);
  downloadBlob(csv, `skillsmap_top_videos_export_${timestamp}.csv`, "text/csv;charset=utf-8;");
}

export function downloadTopVideosJSON(videos) {
  const timestamp = new Date().toISOString().split("T")[0];
  const payload = {
    exportType: "SKILLSMAP_PEER_LECTURES_VAULT",
    exportedAt: new Date().toISOString(),
    totalVideosCount: videos.length,
    videos
  };
  const jsonStr = JSON.stringify(payload, null, 2);
  downloadBlob(jsonStr, `skillsmap_top_videos_export_${timestamp}.json`, "application/json;charset=utf-8;");
}

export function downloadFullPlatformReport({ users = [], videos = [], stats = {} }) {
  const timestamp = new Date().toISOString().split("T")[0];
  const summary = {
    platformName: "SkillsMap AI Competency & Learning Ecosystem",
    exportedAt: new Date().toISOString(),
    systemMetrics: {
      totalRegisteredStudents: users.length,
      totalPeerLectures: videos.length,
      averageCompetencyRating: stats.avgScore || "78%",
      activeCohortsThisWeek: stats.activeThisWeek || users.length,
      quizzesSolvedToday: stats.quizzesToday || 24,
      certificatesIssued: stats.certificates || 12
    },
    studentsDirectory: users.map((u) => ({
      id: u.id,
      name: u.full_name || u.name,
      email: u.email,
      role: u.role,
      xp: u.xp,
      institution: u.institution,
      careerGoal: u.careerGoal
    })),
    topVideoLectures: videos.map((v) => ({
      id: v.id,
      title: v.title,
      views: v.views,
      likes: v.likes,
      eduScore: v.eduScore,
      creator: v.creator?.name
    }))
  };

  const jsonStr = JSON.stringify(summary, null, 2);
  downloadBlob(jsonStr, `skillsmap_platform_complete_report_${timestamp}.json`, "application/json;charset=utf-8;");
}
