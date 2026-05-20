import { type ReactNode } from 'react'
import { type IconName } from '@/components/ui/Icon'
import { type RepeatableSectionKey } from '@/context/CVContext'
import { type SectionTitleKey } from '@/types/cv'
import { ProfileEditor } from '@/features/builder/profile/ProfileEditor'
import { SettingsEditor } from '@/features/builder/settings/SettingsEditor'
import { WorkExperienceEditor } from '@/features/builder/work-experience/WorkExperienceEditor'
import { EducationEditor } from '@/features/builder/education/EducationEditor'
import { ProjectsEditor } from '@/features/builder/projects/ProjectsEditor'
import { LanguagesEditor } from '@/features/builder/languages/LanguagesEditor'
import { SkillsEditor } from '@/features/builder/skills/SkillsEditor'
import { CustomSectionsEditor } from '@/features/builder/custom-sections/CustomSectionsEditor'

export const BUILDER_SECTIONS = [
  { id: 'profile',    icon: 'users',     content: <ProfileEditor /> },
  { id: 'experience', icon: 'activity',  content: <WorkExperienceEditor /> },
  { id: 'education',  icon: 'file-text', content: <EducationEditor /> },
  { id: 'projects',   icon: 'spark',     content: <ProjectsEditor /> },
  { id: 'skills',     icon: 'shield',    content: <SkillsEditor /> },
  { id: 'custom',     icon: 'anvil',     content: <CustomSectionsEditor /> },
  { id: 'languages',  icon: 'flame',     content: <LanguagesEditor /> },
  { id: 'settings',   icon: 'settings',  content: <SettingsEditor /> },
] satisfies Array<{ id: string; icon: IconName; content: ReactNode }>

// Maps section card IDs to their settings.sectionTitles key and display fallback
export type SectionConfig = { titleKey: SectionTitleKey; addKey?: RepeatableSectionKey; addLabel?: string }
export const SECTION_CONFIG: Record<string, SectionConfig | undefined> = {
  experience: { titleKey: 'workExperience', addKey: 'workExperience', addLabel: 'Add Experience' },
  education:  { titleKey: 'education',      addKey: 'education',      addLabel: 'Add Education'  },
  projects:   { titleKey: 'projects',       addKey: 'projects',       addLabel: 'Add Project'    },
  skills:     { titleKey: 'skills' },
  languages:  { titleKey: 'languages',      addKey: 'languages',      addLabel: 'Add Language'   },
  custom:     { titleKey: 'customSections', addKey: 'customSections', addLabel: 'Add Section'    },
}

export const SECTION_ID_MAP: Record<string, string> = {
  workExperience: 'experience',
  education: 'education',
  projects: 'projects',
  skills: 'skills',
  languages: 'languages',
  customSections: 'custom',
}

export const STATIC_TITLES: Record<string, string> = {
  profile:  'Personal Profile',
  settings: 'Builder Settings',
}
