import { StyleSheet } from '@react-pdf/renderer'
import { type Settings } from '@/types/cv'
import { resolveDateFont, resolvePdfFont } from './resumePdfFontHelpers'
import { compact, scaleSpacing } from './resumePdfLayoutHelpers'

export const PAGE_PADDING_VERTICAL = 34
export const PAGE_PADDING_HORIZONTAL = 50

export function createResumePdfStyles(settings: Settings) {
  const fontFamily = resolvePdfFont(settings.fontFamily)
  const bodySize = compact(settings.fontSize, -0.5, 9, 12)
  const nameSize = compact(settings.nameFontSize, 2, 16, 26)
  const contactSize = compact(bodySize, -1, 8, 10.5)
  const dateSize = compact(bodySize, -1.5, 8, 10)
  const headingSize = compact(settings.sectionHeadingSize, -1.5, 8.5, 11)
  const lineHeight = compact(settings.lineHeight, -0.08, 1.28, 1.48)
  const sectionSpacing = scaleSpacing(settings.sectionSpacing, 0.6, 8, 16)
  const profileSpacing = scaleSpacing(settings.profileSpacing, 0.8, 5, 10)

  const topBarHeight = settings.topBarHeight ?? 3
  const contactGap = settings.contactGap ?? 14
  const summaryGap = settings.summaryGap ?? 8
  const titleMetaGap = settings.titleMetaGap ?? 1
  const descriptionGap = settings.descriptionGap ?? 3
  const workEntryGap = settings.workEntryGap ?? 8
  const educationEntryGap = settings.educationEntryGap ?? 8
  const projectEntryGap = settings.projectEntryGap ?? 8
  const languageLineHeight = settings.languageLineHeight ?? Math.min(lineHeight + 0.13, 1.6)

  return StyleSheet.create({
    page: {
      paddingTop: PAGE_PADDING_VERTICAL,
      paddingRight: PAGE_PADDING_HORIZONTAL,
      paddingBottom: PAGE_PADDING_VERTICAL,
      paddingLeft: PAGE_PADDING_HORIZONTAL,
      fontFamily,
      fontSize: bodySize,
      lineHeight,
      color: '#111418',
    },
    accentRule: {
      height: topBarHeight,
      backgroundColor: settings.themeColor,
      marginTop: -PAGE_PADDING_VERTICAL,
      marginRight: -PAGE_PADDING_HORIZONTAL,
      marginBottom: PAGE_PADDING_VERTICAL - topBarHeight,
      marginLeft: -PAGE_PADDING_HORIZONTAL,
    },
    header: { marginBottom: profileSpacing },
    name: {
      fontSize: nameSize,
      fontWeight: 600,
      color: '#111418',
      lineHeight: 1.1,
      letterSpacing: -0.2,
      marginBottom: 8,
    },
    contactWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      rowGap: 3,
      columnGap: contactGap,
    },
    contactItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      fontSize: contactSize,
      color: '#3D4250',
      lineHeight: 1.2,
    },
    contactIcon: {
      width: 8,
      height: 8,
      flexShrink: 0,
    },
    contactValue: {
      fontSize: contactSize,
      color: '#3D4250',
      textDecoration: 'none',
      lineHeight: 1.2,
    },
    link: {
      color: settings.themeColor,
      textDecoration: 'none',
    },
    summary: {
      fontSize: bodySize,
      color: '#3D4250',
      lineHeight: Math.min(lineHeight + 0.03, 1.5),
      marginTop: summaryGap,
    },
    section: { marginTop: sectionSpacing },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 6,
    },
    sectionTick: {
      width: 4,
      height: 4,
      backgroundColor: settings.themeColor,
      flexShrink: 0,
    },
    sectionTitleText: {
      fontSize: headingSize,
      color: '#111418',
      fontWeight: 600,
      letterSpacing: 1.3,
      textTransform: 'uppercase',
    },
    sectionRule: {
      height: 0.5,
      flexGrow: 1,
      backgroundColor: '#D6D9DE',
      marginLeft: 4,
    },
    workEntryGroup: { marginBottom: workEntryGap },
    educationEntryGroup: { marginBottom: educationEntryGap },
    projectEntryGroup: { marginBottom: projectEntryGap },
    entry: {},
    entryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: 12,
    },
    entryTitle: {
      fontWeight: 600,
      color: '#111418',
      flexGrow: 1,
      flexShrink: 1,
      lineHeight: 1.3,
    },
    entryOrg: {
      fontWeight: 400,
      color: '#3D4250',
    },
    entryDates: {
      fontFamily: resolveDateFont(fontFamily),
      fontSize: dateSize,
      color: '#6B7280',
      flexShrink: 0,
      lineHeight: 1.25,
    },
    entrySubtitle: {
      fontSize: contactSize,
      color: '#6B7280',
      lineHeight: 1.35,
      marginTop: titleMetaGap,
      marginBottom: 3,
    },
    bulletList: {
      marginTop: descriptionGap,
    },
    bulletRow: {
      flexDirection: 'row',
      gap: 6,
      marginBottom: 1,
    },
    bulletMarker: {
      width: 4,
      height: 1,
      backgroundColor: '#6B7280',
      marginTop: 6,
      flexShrink: 0,
    },
    bulletText: {
      flexGrow: 1,
      flexShrink: 1,
      color: '#111418',
      lineHeight: Math.max(lineHeight - 0.02, 1.35),
    },
    paragraph: {
      marginTop: descriptionGap,
      color: '#111418',
      lineHeight: Math.max(lineHeight - 0.02, 1.35),
    },
    skillRow: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 4,
    },
    skillRowLast: {
      flexDirection: 'row',
      gap: 10,
    },
    skillLabel: {
      width: 110,
      flexShrink: 0,
      fontSize: contactSize,
      fontWeight: 500,
      color: '#3D4250',
      lineHeight,
      paddingTop: 1.5,
      letterSpacing: 0.2,
    },
    skillValues: {
      flexGrow: 1,
      flexShrink: 1,
      color: '#111418',
      lineHeight,
    },
    languageText: {
      color: '#111418',
      lineHeight: languageLineHeight,
    },
    languageProf: {
      color: '#6B7280',
      fontSize: contactSize,
    },
  })
}
