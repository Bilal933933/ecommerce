export interface AdminDashboardStats {
  users: {
    total: number;
    active: number;
    newThisMonth: number;
  };
  exams: {
    total: number;
    completedToday: number;
    simulations: number;
    practices: number;
  };
  questions: {
    total: number;
    active: number;
    byDifficulty: Array<{ difficulty: string; _count: number }>;
  };
  results: {
    avgScore: number;
    passRate: number;
    scoreDistribution: Array<{ range: string; count: number }>;
  };
  topSpecializations: Array<{ name: string; totalExams: number }>;
  weeklyActivity: Array<{ date: string; exams: number }>;
}
