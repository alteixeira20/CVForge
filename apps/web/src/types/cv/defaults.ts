import { type CVState, type Resume, type Settings } from '../cv';
import { CURRENT_CV_SCHEMA_VERSION } from './version';

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
  sectionTitles: {
    workExperience: 'Work Experience',
    education: 'Education',
    projects: 'Projects',
    skills: 'Skills',
    languages: 'Languages',
    customSections: 'Custom Sections',
  },
  descriptionMode: {
    workExperience: 'bullets' as const,
    education: 'bullets' as const,
    projects: 'bullets' as const,
    customSections: 'bullets' as const,
  },
  topBarHeight: 3,
  contactGap: 14,
  summaryGap: 8,
  titleMetaGap: 1,
  descriptionGap: 3,
  workEntryGap: 8,
  educationEntryGap: 8,
  projectEntryGap: 8,
  languageLineHeight: 1.55,
};

export const defaultCVState: CVState = {
  resume: defaultResume,
  settings: defaultSettings,
  schemaVersion: CURRENT_CV_SCHEMA_VERSION,
  updatedAt: new Date().toISOString(),
};
