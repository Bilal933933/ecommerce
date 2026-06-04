# Layer 3 & 4: Subagents & Hooks Guidelines

## Partitioning Strategy

To maintain clean context and minimize token usage, split work across **separate conversations** (sessions) based on these boundaries:

---

## 1. By Architecture Layer

| Session | Scope | Files | When |
|---------|-------|-------|------|
| **Backend API** | NestJS modules, Prisma schema, DTOs, controllers, services, repositories | `backend/src/**` | New API endpoint or DB schema change |
| **Frontend Feature** | React components, hooks, pages, types, schemas | `frontend/apps/*/src/features/*` | New UI feature or page |
| **Shared Package** | API client, types, store, locales, UI components | `frontend/packages/*` | Cross-app change or new shared component |

## 2. By Feature Domain

| Skill File | When to Load | Typical Tasks |
|-----------|-------------|---------------|
| `auth-skill.md` | Auth-related changes | Login/register flow, JWT guards, sessions, password reset |
| `exam-skill.md` | Exam system changes | Create/take/submit exam, groups, simulation/practice, results |
| `profile-skill.md` | Profile/settings changes | View/edit profile, stats, avatar, settings |
| `admin-skill.md` | Admin panel changes | Dashboard stats, user CRUD, file management |
| `backend-core-skill.md` | Core infra changes | Exception filter, response interceptor, validation pipe, i18n |
| `frontend-pattern-skill.md` | Any frontend work | Reinforce coding patterns, component structure, store usage |

## 3. By Task Type

| Task Type | Suggested Session Split | Context Needed |
|-----------|------------------------|----------------|
| **Code Review** | Single session per file/module | Relevant skill file + changed files |
| **Bug Fix** | Single session (read → diagnose → fix → verify) | Skill file for affected area |
| **New Feature** | Multiple sessions: (1) plan/types → (2) backend → (3) frontend | CLAUDE.md + relevant skills |
| **Refactoring** | One session per module | CLAUDE.md + current module code |
| **Testing** | One session per test suite | Skill file + source code |
| **Database Change** | Single session (schema → migration → seed) | Prisma schema + module DTOs |

---

## 4. Session Initialization Protocol

### Starting a New Session
```
1. Load CLAUDE.md (always) — Architecture Rules + Naming Conventions + Code Expectations
2. Load relevant skill file(s) — e.g., exam-skill.md for exam work
3. Read the specific files you'll be modifying
4. Begin task
```

### Context Retention Tips
- **DO NOT** re-read files you haven't changed (trust your context)
- **DO** re-read a file if you're unsure of its current state
- **DO** reference the skill files at the start of each session
- **DO NOT** carry context across sessions (each session is independent)

### When Switching Between Areas
```
CRITICAL: If you switch from backend to frontend (or vice versa),
start a NEW conversation session. The context is too different
to share efficiently.
```

---

## 5. Agent Specialization Hooks

### A. Code Review Agent
**Trigger:** After writing >100 lines of code
**Task:** Check for:
- TypeScript strict mode compliance (no `any`)
- Naming conventions match CLAUDE.md
- No console.log in production code
- i18n keys used instead of hardcoded strings
- Repository layer isolation (no Prisma in service)
- Proper error handling (HTTP exceptions with i18n keys)
- React Query hooks follow the mutation pattern (toast + navigate)
- Barrel exports in index.ts
- All imports use correct aliases (`@/`, `@workspace/*`)

### B. Test Writing Agent
**Trigger:** When asked to write tests
**Task:** 
- Backend: Create `*.spec.ts` following `users.service.spec.ts` pattern
- Mock repositories, test service methods in isolation
- Test all error paths (not just happy path)
- Frontend: Test React Query hooks with mock API client

### C. Refactoring Agent
**Trigger:** When asked to restructure code
**Task:**
- Follow feature module structure from CLAUDE.md
- Split files by responsibility (components/hooks/pages/service)
- Move inline types to `types/index.ts`
- Add barrel exports
- Keep components small, compose from sub-components

### D. Documentation Agent
**Trigger:** When asked to document code
**Task:**
- Update CLAUDE.md if architecture changes
- Update relevant skill files if module structure changes
- Add locale keys for new i18n strings
- Keep skill files concise (reference, not tutorial)

---

## 6. Token Budget Guidelines

| Activity | Recommended Token Budget |
|----------|------------------------|
| Read/review existing code | 4K-8K tokens |
| Small bug fix | 8K-16K tokens |
| New feature (one area) | 16K-32K tokens |
| Full feature (backend + frontend) | 32K-64K tokens (split across 2 sessions) |
| Code review | 8K-16K tokens |

---

## 7. Common Pitfalls to Avoid

- ❌ Working on backend and frontend in the same session
- ❌ Loading every skill file at once (load only what you need)
- ❌ Re-reading unchanged files
- ❌ Leaving commented-out code
- ❌ Using `any` instead of `unknown`
- ❌ Hardcoding Arabic/English strings instead of using i18n
- ❌ Importing Prisma directly in service layer
- ❌ Mutating React Query cache directly instead of using `queryClient.invalidateQueries`
- ❌ Adding state to Zustand that should be fetched via React Query
