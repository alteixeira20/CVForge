import { type CVState } from '@/types/cv'
import { EducationPreview } from './EducationPreview'
import { LanguagesPreview } from './LanguagesPreview'
import { PreviewFooter } from './PreviewFooter'
import { PreviewHeader } from './PreviewHeader'
import { ProjectsPreview } from './ProjectsPreview'
import { hasPreviewSkills, SkillsPreview } from './SkillsPreview'
import { SummaryPreview } from './SummaryPreview'
import { WorkPreview } from './WorkPreview'

export function PreviewDocument({ state }: { state: CVState }) {
  const { resume, settings } = state
  const { profile, workExperience, education, projects, skills, languages } = resume

  return (
    <div className="w-full max-w-[600px] aspect-[1/1.414] bg-white shadow-2xl rounded-sm overflow-hidden flex flex-col text-[#1a1a1a]">
      <div className="h-6 w-full" style={{ backgroundColor: settings.themeColor }} />
      <div className="p-40 flex-1 flex flex-col gap-24 overflow-hidden text-left" style={{ fontFamily: settings.fontFamily }}>
        <PreviewHeader profile={profile} settings={settings} />
        {profile.summary && <SummaryPreview summary={profile.summary} settings={settings} />}
        {workExperience.length > 0 && <WorkPreview items={workExperience} settings={settings} />}
        {projects.length > 0 && <ProjectsPreview items={projects} settings={settings} />}
        {hasPreviewSkills(skills) && <SkillsPreview skills={skills} settings={settings} />}
        {education.length > 0 && <EducationPreview items={education} settings={settings} />}
        {languages.length > 0 && <LanguagesPreview items={languages} settings={settings} />}
        <PreviewFooter settings={settings} />
      </div>
    </div>
  )
}
