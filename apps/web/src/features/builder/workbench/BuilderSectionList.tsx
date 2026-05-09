import { type ReactNode } from 'react'
import { Icon, type IconName } from '@/components/ui/Icon'
import { ProfileEditor } from '@/features/builder/profile/ProfileEditor'
import { SettingsEditor } from '@/features/builder/settings/SettingsEditor'
import { WorkExperienceEditor } from '@/features/builder/work/WorkExperienceEditor'
import { EducationEditor } from '@/features/builder/education/EducationEditor'
import { ProjectsEditor } from '@/features/builder/projects/ProjectsEditor'
import { LanguagesEditor } from '@/features/builder/languages/LanguagesEditor'
import { SkillsEditor } from '@/features/builder/skills/SkillsEditor'
import { CustomSectionsEditor } from '@/features/builder/custom-sections/CustomSectionsEditor'

const BUILDER_SECTIONS = [
  { title: 'Personal Profile', icon: 'users', content: <ProfileEditor /> },
  { title: 'Experience', icon: 'activity', content: <WorkExperienceEditor /> },
  { title: 'Education', icon: 'fold', content: <EducationEditor /> },
  { title: 'Projects', icon: 'spark', content: <ProjectsEditor /> },
  { title: 'Skills', icon: 'shield', content: <SkillsEditor /> },
  { title: 'Custom Sections', icon: 'fold', content: <CustomSectionsEditor /> },
  { title: 'Languages', icon: 'users', content: <LanguagesEditor /> },
  { title: 'Builder Settings', icon: 'sun', content: <SettingsEditor /> },
] satisfies BuilderSection[]

const PLANNED_SECTIONS: string[] = []

interface BuilderSection {
  title: string
  icon: IconName
  content: ReactNode
}

export function BuilderSectionList() {
  return (
    <>
      {BUILDER_SECTIONS.map((section) => (
        <BuilderSectionCard key={section.title} section={section} />
      ))}
      {PLANNED_SECTIONS.length > 0 && <PlannedSectionList />}
    </>
  )
}

function BuilderSectionCard({ section }: { section: BuilderSection }) {
  return (
    <section className="space-y-24">
      <BuilderSectionHeading title={section.title} icon={section.icon} />
      <div className="panel p-24 bg-bg-2 border border-border rounded-xl">
        {section.content}
      </div>
    </section>
  )
}

function BuilderSectionHeading({ title, icon }: { title: string; icon: IconName }) {
  return (
    <div className="flex items-center gap-8 border-b border-border-faint pb-8">
      <Icon name={icon} size={14} className="text-ember" />
      <h3 className="text-xs uppercase tracking-[0.2em] text-ink-4 font-bold">{title}</h3>
    </div>
  )
}

function PlannedSectionList() {
  return (
    <div className="space-y-12 opacity-50">
      <h3 className="text-[10px] uppercase tracking-widest text-ink-4 font-bold">
        More Sections Coming Soon
      </h3>
      <div className="grid grid-cols-2 gap-12">
        {PLANNED_SECTIONS.map((section) => <PlannedSectionCard key={section} section={section} />)}
      </div>
    </div>
  )
}

function PlannedSectionCard({ section }: { section: string }) {
  return (
    <div className="panel p-12 bg-bg-2 border border-border rounded-lg flex items-center justify-between">
      <span className="text-xs font-medium">{section}</span>
      <span className="text-[8px] bg-bg-3 border border-border-strong px-4 py-1 rounded text-ink-4 uppercase">
        Planned
      </span>
    </div>
  )
}
