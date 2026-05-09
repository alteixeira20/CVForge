import { type CVState } from '@/types/cv'
import { CustomSectionsPreview, hasPreviewCustomSections } from './CustomSectionsPreview'
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
  const { profile } = resume

  return (
    <div className="w-full max-w-[600px] aspect-[1/1.414] bg-white shadow-2xl rounded-sm overflow-hidden flex flex-col text-[#1a1a1a]">
      <div className="h-6 w-full" style={{ backgroundColor: settings.themeColor }} />
      <div className="p-40 flex-1 flex flex-col overflow-hidden text-left" style={{ fontFamily: settings.fontFamily }}>
        <PreviewHeader profile={profile} settings={settings} />
        {profile.summary && <SummaryPreview summary={profile.summary} settings={settings} />}
        
        <div className="flex flex-col">
          {settings.sectionOrder.map((sectionId) => {
            const isVisible = settings.visibleSections[sectionId as keyof typeof settings.visibleSections]
            if (!isVisible) return null

            switch (sectionId) {
              case 'workExperience':
                return resume.workExperience.length > 0 ? <WorkPreview key={sectionId} items={resume.workExperience} settings={settings} /> : null
              case 'projects':
                return resume.projects.length > 0 ? <ProjectsPreview key={sectionId} items={resume.projects} settings={settings} /> : null
              case 'skills':
                return hasPreviewSkills(resume.skills) ? <SkillsPreview key={sectionId} skills={resume.skills} settings={settings} /> : null
              case 'education':
                return resume.education.length > 0 ? <EducationPreview key={sectionId} items={resume.education} settings={settings} /> : null
              case 'languages':
                return resume.languages.length > 0 ? <LanguagesPreview key={sectionId} items={resume.languages} settings={settings} /> : null
              case 'customSections':
                return hasPreviewCustomSections(resume.customSections) ? <CustomSectionsPreview key={sectionId} items={resume.customSections} settings={settings} /> : null
              default:
                return null
            }
          })}
        </div>
        
        <PreviewFooter settings={settings} />
      </div>
    </div>
  )
}
