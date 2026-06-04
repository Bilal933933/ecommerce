export interface Stat {
  id: string
  labelKey: string
  value: number
  suffix: string
  icon: React.ReactNode
}

export interface Feature {
  id: string
  titleKey: string
  descriptionKey: string
  icon: React.ReactNode
}

export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  avatarUrl: string
  socialLinks?: {
    twitter?: string
    linkedin?: string
    github?: string
  }
}
