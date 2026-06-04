# @workspace/types — Shared Types

**Description:** تعريفات TypeScript المشتركة بين جميع الحزم والتطبيقات.

## Type Categories

| File | Description |
|------|-------------|
| `auth.types.ts` | AuthUser, AuthStore, Login/Register requests/responses |
| `exam.types.ts` | Exam, ExamGroup, GroupQuestion, CreateExamRequest, AnswerQuestion, Review |
| `question.types.ts` | Question, QuestionOption, Difficulty, CRUD DTOs |
| `section.types.ts` | Section, CreateSectionRequest, UpdateSectionRequest |
| `specialization.types.ts` | Specialization, CRUD DTOs |
| `result.types.ts` | ExamResult, ExamResultListItem, SectionResult, Progress |
| `leaderboard.types.ts` | LeaderboardUser, LeaderboardEntry, LeaderboardResponse |
| `stats.types.ts` | OverallStats, ChartDataPoint, SectionStat, PerformanceQuery |
| `user-profile.types.ts` | ProfileUser, ProfileStats, ProfileSectionProgress, UpdateMeRequest |
| `user.ts` | User (basic) |
| `admin.types.ts` | AdminDashboardStats |
| `file.types.ts` | File types |
| `level.types.ts` | Level types |
| `product.ts` | Product type |
| `api.ts` | ApiResponse<T>, ApiSuccess, ApiError, PaginationMeta |

## Barrel Export
```typescript
// index.ts يصدر كل شيء
export * from "./user"
export * from "./api"
export type { LoginRequest, Exam, Specialization, ... } from "..."
```

## Dependencies & Context
- لا توجد تبعيات خارجية (pure types)
- مستخدم من جميع التطبيقات والحزم
- Skills: `frontend-pattern-skill.md`
