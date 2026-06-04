# Skill: Profile & User Management

## Description
User profile display and editing: view profile (stats, section progress, recent exams, active sessions), update personal info, change specialization, manage account (change password, delete account), avatar upload.

## Context
- Backend: `src/modules/users/` (profile endpoints), `src/modules/files/` (avatar upload)
- Frontend: `apps/web/src/features/profile/`, `apps/web/src/features/settings/`
- DB: `users`, `results`, `user_progress`, `user_section_progress`, `sessions`

## Backend Reference

### Users Module
```
modules/users/
├── dto/
│   └── update-me.dto.ts       # UpdateMeDto (name, email, phone, bio, gender, birthDate, specializationId)
├── controllers/                # (optional sub-controllers)
├── repository/                 # UsersRepository interface + Prisma implementation
├── users.controller.ts         # Routes: /users/*
├── users.service.ts            # Business logic
├── users.service.spec.ts       # Tests
├── users.controller.spec.ts    # Tests
└── users.constants.ts          # Constants
```

### Profile Endpoints
```
GET  /users/me/profile    → getMyProfile(userId)
  → returns ProfileResponse: { user, stats, sectionProgress, recentExams, activeSessions }
PATCH /users/me           → updateMe(userId, UpdateMeDto)
  → returns { user, emailChanged }
```

### ProfileResponse Type
```typescript
interface ProfileResponse {
  user: ProfileUser;                    // full user data
  stats: ProfileStats;                  // totalExams, avgScore, bestScore, passingRate, rank...
  sectionProgress: ProfileSectionProgress[];  // per-section stats
  recentExams: ProfileRecentExam[];     // last N exams
  activeSessions: ProfileActiveSession[]; // active refresh token sessions
}
```

### UpdateMeDto
```typescript
class UpdateMeDto {
  name?: string;
  email?: string;           // changing email triggers re-verification
  phone?: string;
  bio?: string;
  gender?: 'MALE' | 'FEMALE';
  birthDate?: string;       // ISO date
  specializationId?: string;
}
```

### File Upload (Avatar)
`POST /files/upload` → Cloudinary upload → returns `{ url, publicId }`
Then `PATCH /users/me` with `avatarUrl`

## Frontend Reference

### Profile Module (`features/profile/`)
```
profile/
├── pages/
│   └── ProfilePage.tsx          # Main page, fetches useMyProfile, renders sections
├── components/ (16 files)
│   ├── ProfileLayout.tsx        # sidebar + main layout
│   ├── ProfileSidebar.tsx       # user avatar, name, specialization
│   ├── StatsOverview.tsx        # total exams, avg score, best score, rank
│   ├── SectionProgressList.tsx  # per-section progress bars
│   ├── SectionProgressItem.tsx  # single section progress row
│   ├── RecentExamsList.tsx     # recent exams list
│   ├── RecentExamItem.tsx      # single exam item
│   ├── SessionsList.tsx        # active sessions with revoke
│   ├── SessionItem.tsx         # single session
│   ├── AccountActions.tsx      # change password, delete account
│   ├── AvatarCard.tsx          # avatar display + upload
│   ├── UserInfoCard.tsx        # editable user info
│   ├── SpecializationCard.tsx  # specialization picker
│   ├── LoadingSkeleton.tsx     # loading state
│   ├── modals/                 # edit modals
│   └── index.ts                # barrel exports
├── hooks/
│   ├── useMyProfile.ts         # useQuery → profileClient.getMyProfile
│   ├── useProfileActions.ts    # useMutation → update profile
│   └── useProfileAvatar.ts     # useMutation → upload avatar
├── types/
│   └── index.ts                # local types
```

### Settings Module (`features/settings/`)
```
settings/
├── pages/
│   └── SettingsPage.tsx
├── components/                  # theme toggle, language toggle, notifications
├── service/                     # settings service
├── types/                       # settings types
└── ...
```

### React Query Hook Pattern (useMyProfile)
```typescript
export function useMyProfile() {
  return useQuery({
    queryKey: ['my-profile'],
    queryFn: () => profileClient.getMyProfile(),
  })
}
```

### Shared Types (`packages/types/src/user-profile.types.ts`)
Key types: `ProfileUser`, `ProfileStats`, `ProfileSectionProgress`, `ProfileRecentExam`, `ProfileActiveSession`, `ProfileResponse`, `UpdateMeRequest`, `UpdateMeResponse`

### API Client (`packages/api-client/src/users/users.client.ts`)
Exports: `getMyProfile`, `updateMe`, `changePassword`, `deleteAccount`

### i18n Keys
- `profile.pageTitle`, `profile.stats.*`, `profile.sections.*`, `profile.recentExams.*`, `profile.sessions.*`, `profile.actions.*`
