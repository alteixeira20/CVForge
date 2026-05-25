import { z } from 'zod';
import { CURRENT_CV_SCHEMA_VERSION } from './version';

/**
 * ─── Resume Models ──────────────────────────────────────────────────────────
 */

export const ProfileSchema = z.object({
  name: z.string().default(''),
  email: z.string().default(''),
  phone: z.string().default(''),
  location: z.string().default(''),
  website: z.string().default(''),
  github: z.string().default(''),
  linkedin: z.string().default(''),
  summary: z.string().default(''),
});

export const WorkExperienceSchema = z.object({
  id: z.string(),
  company: z.string().default(''),
  role: z.string().default(''),
  location: z.string().default(''),
  startDate: z.string().default(''),
  endDate: z.string().default(''),
  isCurrent: z.boolean().default(false),
  bullets: z.array(z.string()).default([]),
});

export const EducationSchema = z.object({
  id: z.string(),
  school: z.string().default(''),
  degree: z.string().default(''),
  location: z.string().default(''),
  startDate: z.string().default(''),
  endDate: z.string().default(''),
  details: z.array(z.string()).default([]),
});

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string().default(''),
  link: z.string().default(''),
  startDate: z.string().default(''),
  endDate: z.string().default(''),
  bullets: z.array(z.string()).default([]),
});

export const LanguageSchema = z.object({
  id: z.string(),
  name: z.string().default(''),
  proficiency: z.string().default(''),
});

export const FeaturedSkillSchema = z.object({
  skill: z.string().default(''),
  rating: z.number().min(0).max(5).optional(),
});

export const SkillsSchema = z.object({
  featured: z.array(z.string()).default([]), // For simple list
  featuredWithRating: z.array(FeaturedSkillSchema).default([]),
  technical: z.array(z.string()).default([]),
  soft: z.array(z.string()).default([]),
});

export const CustomSectionSchema = z.object({
  id: z.string(),
  title: z.string().default(''),
  bullets: z.array(z.string()).default([]),
});

export const ResumeSchema = z.object({
  profile: ProfileSchema,
  workExperience: z.array(WorkExperienceSchema).default([]),
  education: z.array(EducationSchema).default([]),
  projects: z.array(ProjectSchema).default([]),
  skills: SkillsSchema,
  languages: z.array(LanguageSchema).default([]),
  customSections: z.array(CustomSectionSchema).default([]),
});

/**
 * ─── Settings Models ────────────────────────────────────────────────────────
 */

export const DocumentSizeSchema = z.enum(['A4', 'Letter']);
export const LocalePresetSchema = z.enum(['EU', 'US']);

export const SectionVisibilitySchema = z.object({
  workExperience: z.boolean().default(true),
  education: z.boolean().default(true),
  projects: z.boolean().default(true),
  skills: z.boolean().default(true),
  languages: z.boolean().default(true),
  customSections: z.boolean().default(false),
});

export const BulletVisibilitySchema = z.object({
  workExperience: z.boolean().default(true),
  education: z.boolean().default(true),
  projects: z.boolean().default(true),
  customSections: z.boolean().default(true),
});

export const DescriptionModeSchema = z.enum(['bullets', 'paragraph']);

export const SectionTitlesSchema = z.object({
  workExperience: z.string().default('Work Experience'),
  education: z.string().default('Education'),
  projects: z.string().default('Projects'),
  skills: z.string().default('Skills'),
  languages: z.string().default('Languages'),
  customSections: z.string().default('Custom Sections'),
});

export const DescriptionModesSchema = z.object({
  workExperience: DescriptionModeSchema.default('bullets'),
  education: DescriptionModeSchema.default('bullets'),
  projects: DescriptionModeSchema.default('bullets'),
  customSections: DescriptionModeSchema.default('bullets'),
});

export const SettingsSchema = z.object({
  documentSize: DocumentSizeSchema.default('A4'),
  localePreset: LocalePresetSchema.default('EU'),
  themeColor: z.string().default('#2c1f19'),
  fontFamily: z.string().default('Lexend'),
  fontSize: z.number().default(11),
  nameFontSize: z.number().default(18),
  sectionHeadingSize: z.number().default(11),
  lineHeight: z.number().default(1.5),
  sectionSpacing: z.number().default(20),
  profileSpacing: z.number().default(10),
  entrySpacing: z.number().default(10),
  sectionOrder: z.array(z.string()).default([
    'workExperience',
    'education',
    'projects',
    'skills',
    'languages',
    'customSections',
  ]),
  visibleSections: SectionVisibilitySchema,
  bulletVisibility: BulletVisibilitySchema,
  sectionTitles: SectionTitlesSchema.default({
    workExperience: 'Work Experience',
    education: 'Education',
    projects: 'Projects',
    skills: 'Skills',
    languages: 'Languages',
    customSections: 'Custom Sections',
  }),
  descriptionMode: DescriptionModesSchema.default({
    workExperience: 'bullets',
    education: 'bullets',
    projects: 'bullets',
    customSections: 'bullets',
  }),
  topBarHeight: z.number().default(3),
  contactGap: z.number().default(14),
  summaryGap: z.number().default(8),
  titleMetaGap: z.number().default(1),
  descriptionGap: z.number().default(3),
  workEntryGap: z.number().default(8),
  educationEntryGap: z.number().default(8),
  projectEntryGap: z.number().default(8),
  languageLineHeight: z.number().default(1.55),
});

/**
 * ─── Root CVState ───────────────────────────────────────────────────────────
 */

export const CVStateSchema = z.object({
  resume: ResumeSchema,
  settings: SettingsSchema,
  schemaVersion: z.literal(CURRENT_CV_SCHEMA_VERSION).default(CURRENT_CV_SCHEMA_VERSION),
  updatedAt: z.string().default(() => new Date().toISOString()),
});
