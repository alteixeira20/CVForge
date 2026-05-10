import { z } from 'zod';

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
});

/**
 * ─── Root CVState ───────────────────────────────────────────────────────────
 */

export const CVStateSchema = z.object({
  resume: ResumeSchema,
  settings: SettingsSchema,
  schemaVersion: z.string().default('1.0.0'),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export type Profile = z.infer<typeof ProfileSchema>;
export type WorkExperience = z.infer<typeof WorkExperienceSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Language = z.infer<typeof LanguageSchema>;
export type FeaturedSkill = z.infer<typeof FeaturedSkillSchema>;
export type Skills = z.infer<typeof SkillsSchema>;
export type CustomSection = z.infer<typeof CustomSectionSchema>;
export type Resume = z.infer<typeof ResumeSchema>;
export type DocumentSize = z.infer<typeof DocumentSizeSchema>;
export type LocalePreset = z.infer<typeof LocalePresetSchema>;
export type Settings = z.infer<typeof SettingsSchema>;
export type CVState = z.infer<typeof CVStateSchema>;

/**
 * ─── Defaults ───────────────────────────────────────────────────────────────
 */

export const defaultResume: Resume = {
  profile: {
    name: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    github: '',
    linkedin: '',
    summary: '',
  },
  workExperience: [],
  education: [],
  projects: [],
  skills: {
    featured: [],
    featuredWithRating: [],
    technical: [],
    soft: [],
  },
  languages: [],
  customSections: [],
};

export const defaultSettings: Settings = {
  documentSize: 'A4',
  localePreset: 'EU',
  themeColor: '#2c1f19',
  fontFamily: 'Lexend',
  fontSize: 11,
  nameFontSize: 18,
  sectionHeadingSize: 11,
  lineHeight: 1.5,
  sectionSpacing: 20,
  profileSpacing: 10,
  entrySpacing: 10,
  sectionOrder: [
    'workExperience',
    'education',
    'projects',
    'skills',
    'languages',
    'customSections',
  ],
  visibleSections: {
    workExperience: true,
    education: true,
    projects: true,
    skills: true,
    languages: true,
    customSections: false,
  },
  bulletVisibility: {
    workExperience: true,
    education: true,
    projects: true,
    customSections: true,
  },
};

export const defaultCVState: CVState = {
  resume: defaultResume,
  settings: defaultSettings,
  schemaVersion: '1.0.0',
  updatedAt: new Date().toISOString(),
};

/**
 * --- Helpers ----------------------------------------------------------------
 */

export function parseCVState(value: unknown): CVState | null {
  const result = CVStateSchema.safeParse(value);
  if (result.success) {
    return result.data;
  }
  return null;
}


