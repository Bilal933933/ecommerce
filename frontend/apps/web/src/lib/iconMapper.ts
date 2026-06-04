import { GraduationCap, Building2, Mail, Calculator, FileText, Briefcase, Brain, Code, Database, Globe, Shield, Cpu, BookOpen, Users, Trophy } from "lucide-react"
import type { LucideIcon } from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  "graduation-cap": GraduationCap,
  "building-2": Building2,
  mail: Mail,
  calculator: Calculator,
  "file-text": FileText,
  briefcase: Briefcase,
  brain: Brain,
  code: Code,
  database: Database,
  globe: Globe,
  shield: Shield,
  cpu: Cpu,
  "book-open": BookOpen,
  users: Users,
  trophy: Trophy,
}

export function getIcon(iconName?: string | null): LucideIcon {
  if (!iconName) return Briefcase
  return iconMap[iconName] ?? Briefcase
}
