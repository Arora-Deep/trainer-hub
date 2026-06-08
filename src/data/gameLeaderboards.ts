// Mock per-lesson game leaderboards. Keyed by lessonId.
// Used by the student CoursePlayer (game-based-learning lessons) and the
// trainer BatchDetails → Games tab.

export interface GameLeaderboardEntry {
  rank: number;
  studentId: string;
  name: string;
  avatar?: string;
  score: number;
  timeSec: number; // completion time in seconds (lower is better, tiebreak)
  attempts: number;
  completedAt: string;
  isMe?: boolean;
}

export interface GameLeaderboard {
  lessonId: string;
  courseId: string;
  batchId: string;
  gameTitle: string;
  gameType: "escape-room" | "hangman";
  totalPlayers: number;
  averageScore: number;
  entries: GameLeaderboardEntry[];
}

const fmtTime = (s: number) => {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}m ${r.toString().padStart(2, "0")}s`;
};

export const formatLeaderboardTime = fmtTime;

export const gameLeaderboards: GameLeaderboard[] = [
  // Java Fundamentals — Escape Room (lesson l-10-23, batch 10)
  {
    lessonId: "l-10-23",
    courseId: "10",
    batchId: "10",
    gameTitle: "The Java Mastery Vault",
    gameType: "escape-room",
    totalPlayers: 14,
    averageScore: 782,
    entries: [
      { rank: 1, studentId: "s-101", name: "Ananya Iyer", score: 980, timeSec: 1142, attempts: 1, completedAt: "2h ago" },
      { rank: 2, studentId: "s-102", name: "Karan Mehta", score: 955, timeSec: 1268, attempts: 1, completedAt: "5h ago" },
      { rank: 3, studentId: "s-103", name: "Priya Shah", score: 940, timeSec: 1305, attempts: 2, completedAt: "1d ago" },
      { rank: 4, studentId: "s-me", name: "You", score: 910, timeSec: 1392, attempts: 2, completedAt: "1d ago", isMe: true },
      { rank: 5, studentId: "s-104", name: "Rohit Sinha", score: 890, timeSec: 1480, attempts: 1, completedAt: "1d ago" },
      { rank: 6, studentId: "s-105", name: "Vikram Joshi", score: 845, timeSec: 1560, attempts: 3, completedAt: "2d ago" },
      { rank: 7, studentId: "s-106", name: "Sneha Pillai", score: 820, timeSec: 1605, attempts: 2, completedAt: "2d ago" },
      { rank: 8, studentId: "s-107", name: "Aditya Rao", score: 790, timeSec: 1710, attempts: 2, completedAt: "3d ago" },
      { rank: 9, studentId: "s-108", name: "Meera Krishnan", score: 765, timeSec: 1782, attempts: 3, completedAt: "3d ago" },
      { rank: 10, studentId: "s-109", name: "Harsh Patel", score: 720, timeSec: 1865, attempts: 4, completedAt: "4d ago" },
      { rank: 11, studentId: "s-110", name: "Divya Reddy", score: 690, timeSec: 1922, attempts: 2, completedAt: "4d ago" },
      { rank: 12, studentId: "s-111", name: "Sahil Khanna", score: 640, timeSec: 2015, attempts: 5, completedAt: "5d ago" },
    ],
  },

  // Python Fundamentals — Hangman (lesson l-11-12, batch 11)
  {
    lessonId: "l-11-12",
    courseId: "11",
    batchId: "11",
    gameTitle: "Python Syntax Slayer",
    gameType: "hangman",
    totalPlayers: 22,
    averageScore: 654,
    entries: [
      { rank: 1, studentId: "s-201", name: "Tara Nair", score: 880, timeSec: 412, attempts: 1, completedAt: "1h ago" },
      { rank: 2, studentId: "s-202", name: "Imran Sheikh", score: 855, timeSec: 458, attempts: 1, completedAt: "3h ago" },
      { rank: 3, studentId: "s-me", name: "You", score: 820, timeSec: 502, attempts: 2, completedAt: "6h ago", isMe: true },
      { rank: 4, studentId: "s-203", name: "Riya Kapoor", score: 800, timeSec: 525, attempts: 2, completedAt: "1d ago" },
      { rank: 5, studentId: "s-204", name: "Nikhil Bose", score: 770, timeSec: 580, attempts: 1, completedAt: "1d ago" },
      { rank: 6, studentId: "s-205", name: "Aisha Khan", score: 740, timeSec: 615, attempts: 3, completedAt: "2d ago" },
      { rank: 7, studentId: "s-206", name: "Arjun Verma", score: 715, timeSec: 642, attempts: 2, completedAt: "2d ago" },
      { rank: 8, studentId: "s-207", name: "Pooja Desai", score: 680, timeSec: 705, attempts: 3, completedAt: "2d ago" },
      { rank: 9, studentId: "s-208", name: "Manish Chowdhury", score: 650, timeSec: 738, attempts: 2, completedAt: "3d ago" },
      { rank: 10, studentId: "s-209", name: "Ishita Banerjee", score: 620, timeSec: 790, attempts: 4, completedAt: "3d ago" },
      { rank: 11, studentId: "s-210", name: "Yash Agarwal", score: 590, timeSec: 822, attempts: 3, completedAt: "4d ago" },
      { rank: 12, studentId: "s-211", name: "Kavya Menon", score: 560, timeSec: 870, attempts: 5, completedAt: "5d ago" },
    ],
  },
];

export const getLeaderboardForLesson = (lessonId: string) =>
  gameLeaderboards.find((g) => g.lessonId === lessonId);

export const getLeaderboardsForBatch = (batchId: string) =>
  gameLeaderboards.filter((g) => g.batchId === batchId);
