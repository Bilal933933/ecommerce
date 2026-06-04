# Skill: Exam System

## Description
Complete exam lifecycle: create (simulation/practice), take (grouped questions, navigation), answer (single attempt in simulation, instant feedback in practice), close groups, submit, review results. Supports two modes: SIMULATION (full-length, timed, groups) and PRACTICE (single-topic, untimed, instant feedback).

## Context
- Backend: `src/modules/exams/`, `src/modules/questions/`, `src/modules/sections/`, `src/modules/specializations/`, `src/modules/results/`
- Frontend: `apps/web/src/features/exam-creation/`, `exam-take/`, `exam-results/`, `exams-history/`, `results/`
- DB: `exams`, `exam_answers`, `questions`, `question_options`, `results`, `section_results`, `specializations`, `sections`

## Backend Reference

### Exam Module Structure
```
modules/exams/
├── dto/
│   ├── create-exam.dto.ts     # CreateExamDto: mode, title?, sectionId?, specializationId?, difficulty?
│   ├── answer-question.dto.ts # AnswerQuestionDto: questionId, selectedOptionId
│   └── submit-exam.dto.ts     # SubmitExamDto (optional)
├── types/
│   └── exam.types.ts          # ExamGroup interface
├── exams.controller.ts        # Routes: /exams/*
├── exams.service.ts           # Business logic: create, answer, closeGroup, submit, review
├── exams.repository.ts        # Prisma queries
└── exams.module.ts            # Module definition
```

### Exam Modes
```
SIMULATION → full exam with specialization + all sections as groups
  → ~50 specialization questions + ~N section groups
  → each group has timeLimitSeconds, isLocked until previous group closed
  → no instant feedback on answers (only saved)
  → one attempt per question (cannot change answer)

PRACTICE → single-topic exam (section OR specialization)
  → single group
  → instant feedback (isCorrect returned on answer)
  → can change answers (not locked)
  → no time limit enforced
```

### Key Flow
```
POST /exams                    → create(userId, specId, dto) → exam with pre-loaded questions
GET  /exams/:examId            → findExam → groups metadata + currentGroupOrder
GET  /exams/:examId/group/:g   → findGroupQuestions → shuffled questions + options
POST /exams/:examId/group/:g/close → closeGroup → lock group → unlock next (or submit if last)
PATCH /exams/:examId/answer    → answerQuestion → save selected option + isCorrect
POST /exams/:examId/submit     → submit → calculate results + sectionResults
GET  /exams/:examId/review     → getReview → full review with correct answers
GET  /exams/my                 → getMyExams → paginated exam history
```

### ExamGroup Type
```typescript
interface ExamGroup {
  order: number;
  label: string;
  questionCount: number;
  timeLimitSeconds: number;
  isLocked: boolean;
}
```

### Important Logic
- **createSimulation**: fetches specialization questions (group 1) + all active section questions (group 2+), creates `Exam` with `groups` JSON + `ExamAnswer` rows
- **createPractice**: fetches questions from single section/specialization, single group
- **closeGroup**: validates previous groups locked, locks current group, if last → auto-submit
- **answerQuestion**: SIMULATION → cannot re-answer; PRACTICE → overwrite + return `isCorrect`
- **submit**: calculates total/answered/correct, score%, passed, sectionResults, creates `Result` + `SectionResult` rows
- **PASSING_SCORE**: 50 (from `core/constants/exam.constants.ts`)
- **Time expiry**: auto-submit when fetching group questions if `isExamExpired()`

### Results Module
```
modules/results/
├── results.controller.ts      # GET /results/:examId
├── progress.controller.ts     # GET /results/progress (aggregate stats)
├── results.service.ts
├── results.repository.ts
└── results.module.ts
```

## Frontend Reference

### Exam Creation (`features/exam-creation/`)
```
exam-creation/
├── pages/
│   └── ExamCreationPage.tsx       # Main page, tabs for SIMULATION/PRACTICE
├── components/
│   ├── SimulationCard.tsx         # Start full simulation
│   ├── PracticeCard.tsx           # Start practice by section
│   ├── SpecializationPracticeCard.tsx  # Start practice by specialization
│   ├── SectionSelector.tsx        # Section picker
│   └── ExamSettings.tsx           # title, difficulty config
├── types/index.ts                 # ExamMode, ExamConfig
├── hooks/                         # useCreateExam
└── index.ts                       # barrel exports
```

### Exam Take (`features/exam-take/`)
```
exam-take/
├── pages/
│   └── ExamTakePage.tsx           # Active exam session UI
├── components/                    # Question display, timer, group navigation
├── hooks/                         # useExam, useAnswerQuestion, useCloseGroup
├── types/                         # local types
└── index.ts
```

### Exam Results (`features/exam-results/`)
```
exam-results/
├── pages/
│   └── ExamResultsPage.tsx        # Post-exam results view
├── components/                    # Score display, section breakdown, review
├── hooks/                         # useExamResult
└── index.ts
```

### Exams History (`features/exams-history/`)
```
exams-history/
├── pages/
│   └── ExamsHistoryPage.tsx       # Paginated list of past exams
├── components/                    # ExamListItem, filters
├── hooks/                         # useMyExams
├── types/
└── index.ts
```

### Shared Types (`packages/types/src/exam.types.ts`)
Key types: `Exam`, `ExamGroup`, `GroupQuestion`, `GroupQuestionOption`, `GroupQuestionsResponse`, `CreateExamRequest`, `AnswerQuestionRequest`, `AnswerQuestionResponse`, `CloseGroupResponse`, `ExamReviewResponse`, `MyExamsListItem`, `MyExamsListResponse`

### API Client (`packages/api-client/src/exams/exams.client.ts`)
Exports: `createExam`, `getMyExams`, `getExam`, `getGroupQuestions`, `answerQuestion`, `closeGroup`, `submitExam`, `getReview`

### Routes
```
/exams/new             → AuthGuard → DashboardLayout → ExamCreationPage
/exam-session          → AuthGuard → ExamTakePage (pass examId via state/params)
/exam-results          → AuthGuard → DashboardLayout → ExamResultsPage
/exams                 → AuthGuard → DashboardLayout → ExamsHistoryPage
```

### i18n Keys
- `exams.simulation.*`, `exams.practice.*`
- `examCreation.*`
- `examTake.*` (timer, group navigation, answer status)
- `examResults.*` (score, passed/failed, section breakdown)
- `examsHistory.*` (filter, sort, paginate)
