import { type CVState } from '@/types/cv';

export function isEmptyCV(state: CVState) {
  const { profile, workExperience, education, projects, skills, languages, customSections } = state.resume;
  const hasProfile = [
    profile.name,
    profile.email,
    profile.phone,
    profile.location,
    profile.website,
    profile.github,
    profile.linkedin,
    profile.summary,
  ].some((value) => value.trim());

  return (
    !hasProfile &&
    workExperience.length === 0 &&
    education.length === 0 &&
    projects.length === 0 &&
    skills.featured.length === 0 &&
    skills.featuredWithRating.length === 0 &&
    skills.technical.length === 0 &&
    skills.soft.length === 0 &&
    languages.length === 0 &&
    customSections.length === 0
  );
}
