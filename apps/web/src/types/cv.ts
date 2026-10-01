import { type z } from 'zod';
import {
  type CVStateSchema,
  type CustomSectionSchema,
  type DescriptionModeSchema,
  type DocumentSizeSchema,
  type EducationSchema,
  type FeaturedSkillSchema,
  type LanguageLayoutSchema,
  type LanguageSchema,
  type LocalePresetSchema,
  type ProfileSchema,
  type ProjectSchema,
  type ResumeSchema,
  type SectionTitlesSchema,
  type SettingsSchema,
  type SkillsSchema,
  type WorkExperienceSchema,
} from './cv/schemas';

export { CURRENT_CV_SCHEMA_VERSION } from './cv/version';
export { parseCVState } from './cv/parse';
export { defaultCVState, defaultResume, defaultSettings } from './cv/defaults';
export {
  BulletVisibilitySchema,
  CVStateSchema,
  CustomSectionSchema,
  DescriptionModesSchema,
  DescriptionModeSchema,
  DocumentSizeSchema,
  EducationSchema,
  FeaturedSkillSchema,
  LanguageLayoutSchema,
  LanguageSchema,
  LocalePresetSchema,
  ProfileSchema,
  ProjectSchema,
  ResumeSchema,
  SectionTitlesSchema,
  SectionVisibilitySchema,
  SettingsSchema,
  SkillsSchema,
  WorkExperienceSchema,
} from './cv/schemas';

export type Profile = z.infer<typeof ProfileSchema>;
export type WorkExperience = z.infer<typeof WorkExperienceSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Language = z.infer<typeof LanguageSchema>;
export type LanguageLayout = z.infer<typeof LanguageLayoutSchema>;
export type FeaturedSkill = z.infer<typeof FeaturedSkillSchema>;
export type Skills = z.infer<typeof SkillsSchema>;
export type CustomSection = z.infer<typeof CustomSectionSchema>;
export type Resume = z.infer<typeof ResumeSchema>;
export type DocumentSize = z.infer<typeof DocumentSizeSchema>;
export type LocalePreset = z.infer<typeof LocalePresetSchema>;
export type Settings = z.infer<typeof SettingsSchema>;
export type CVState = z.infer<typeof CVStateSchema>;
export type DescriptionMode = z.infer<typeof DescriptionModeSchema>;
export type SectionTitleKey = keyof z.infer<typeof SectionTitlesSchema>;
