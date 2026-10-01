import { StyleSheet } from '@react-pdf/renderer'
import { type Settings } from '@/types/cv'
import { PAGE_PADDING_HORIZONTAL, PAGE_PADDING_VERTICAL } from './resumePdfGeometry'
import { resolveDateFont, resolvePdfFont } from './resumePdfFontHelpers'
import {
  compact,
  MAX_PDF_LINE_HEIGHT,
  MIN_PDF_LINE_HEIGHT,
  scaleBulletRowMargin,
  scaleSpacing,
} from './resumePdfLayoutHelpers'

export function createResumePdfStyles(settings: Settings) {
  const fontFamily = resolvePdfFont(settings.fontFamily)
  const bodySize = compact(settings.fontSize, -0.5, 9, 12)
  const nameSize = compact(settings.nameFontSize, 2, 16, 26)
  const contactSize = compact(bodySize, -1, 8, 10.5)
  const dateSize = compact(bodySize, -1.5, 8, 10)
  const headingSize = compact(settings.sectionHeadingSize, -1.5, 8.5, 11)
  const lineHeight = compact(settings.lineHeight, 0, MIN_PDF_LINE_HEIGHT, MAX_PDF_LINE_HEIGHT)
  const sectionSpacing = scaleSpacing(settings.sectionSpacing, 0.6, 0, 30)
  const profileSpacing = scaleSpacing(settings.profileSpacing, 0.8, 0, 32)

  const topBarHeight = settings.topBarHeight ?? 3
  const contactGap = settings.contactGap ?? 14
  const summaryGap = settings.summaryGap ?? 8
  const titleMetaGap = settings.titleMetaGap ?? 1
  const descriptionGap = settings.descriptionGap ?? 3
  const workEntryGap = settings.workEntryGap ?? 8
  const educationEntryGap = settings.educationEntryGap ?? 8
  const projectEntryGap = settings.projectEntryGap ?? 8
  const languageLineHeight = compact(settings.languageLineHeight ?? lineHeight, 0, MIN_PDF_LINE_HEIGHT, MAX_PDF_LINE_HEIGHT)
  const bulletRowMarginBottom = scaleBulletRowMargin(lineHeight)
  const bulletMarkerMarginTop = Math.max(3, Math.min(6, Math.round(bodySize * lineHeight * 0.35)))

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
    pageContent: {
      width: '100%',
      maxWidth: '100%',
      minWidth: 0,
    },
    contentBounds: {
      width: '100%',
      maxWidth: '100%',
      minWidth: 0,
    },
    accentRule: {
      height: topBarHeight,
      backgroundColor: settings.themeColor,
      marginTop: -PAGE_PADDING_VERTICAL,
      marginRight: -PAGE_PADDING_HORIZONTAL,
      marginBottom: PAGE_PADDING_VERTICAL - topBarHeight,
      marginLeft: -PAGE_PADDING_HORIZONTAL,
    },
    header: {
      width: '100%',
      maxWidth: '100%',
      minWidth: 0,
      marginBottom: profileSpacing,
    },
    name: {
      width: '100%',
      maxWidth: '100%',
      minWidth: 0,
      fontSize: nameSize,
      fontWeight: 600,
      color: '#111418',
      lineHeight: 1.1,
      letterSpacing: -0.2,
      marginBottom: 8,
    },
    contactWrap: {
      width: '100%',
      maxWidth: '100%',
      minWidth: 0,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      rowGap: 3,
      columnGap: contactGap,
    },
    contactItem: {
      maxWidth: '100%',
      minWidth: 0,
      flexDirection: 'row',
      alignItems: 'center',
      flexShrink: 1,
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
      maxWidth: '100%',
      minWidth: 0,
      flexShrink: 1,
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
      width: '100%',
      maxWidth: '100%',
      minWidth: 0,
      fontSize: bodySize,
      color: '#3D4250',
      lineHeight,
      marginTop: summaryGap,
    },
    section: {
      width: '100%',
      maxWidth: '100%',
      minWidth: 0,
      marginTop: sectionSpacing,
    },
    sectionHeader: {
      width: '100%',
      maxWidth: '100%',
      minWidth: 0,
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
      minWidth: 0,
      flexShrink: 1,
      fontSize: headingSize,
      color: '#111418',
      fontWeight: 600,
      letterSpacing: 1.3,
      textTransform: 'uppercase',
    },
    sectionRule: {
      height: 0.5,
      minWidth: 0,
      flexBasis: 0,
      flexGrow: 1,
      flexShrink: 1,
      backgroundColor: '#D6D9DE',
      marginLeft: 4,
    },
    workEntryGroup: { width: '100%', maxWidth: '100%', minWidth: 0, marginBottom: workEntryGap },
    educationEntryGroup: { width: '100%', maxWidth: '100%', minWidth: 0, marginBottom: educationEntryGap },
    projectEntryGroup: { width: '100%', maxWidth: '100%', minWidth: 0, marginBottom: projectEntryGap },
    entry: { width: '100%', maxWidth: '100%', minWidth: 0 },
    entryRow: {
      width: '100%',
      maxWidth: '100%',
      minWidth: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: 12,
    },
    entryTitle: {
      fontSize: bodySize,
      fontWeight: 600,
      color: '#111418',
      minWidth: 0,
      flexBasis: 0,
      flexGrow: 1,
      flexShrink: 1,
      lineHeight: compact(lineHeight, -0.2, MIN_PDF_LINE_HEIGHT, 1.6),
    },
    entryOrg: {
      fontWeight: 400,
      color: '#3D4250',
    },
    entryDates: {
      maxWidth: '35%',
      minWidth: 0,
      fontFamily: resolveDateFont(fontFamily),
      fontSize: dateSize,
      color: '#6B7280',
      flexShrink: 1,
      lineHeight: 1.25,
    },
    entrySubtitle: {
      width: '100%',
      maxWidth: '100%',
      minWidth: 0,
      fontSize: contactSize,
      color: '#6B7280',
      lineHeight: compact(lineHeight, -0.15, MIN_PDF_LINE_HEIGHT, 1.6),
      marginTop: titleMetaGap,
      marginBottom: 3,
    },
    bulletList: {
      width: '100%',
      maxWidth: '100%',
      minWidth: 0,
      marginTop: descriptionGap,
    },
    bulletRow: {
      width: '100%',
      maxWidth: '100%',
      minWidth: 0,
      flexDirection: 'row',
      gap: 6,
      marginBottom: bulletRowMarginBottom,
    },
    bulletMarker: {
      width: 4,
      height: 1,
      backgroundColor: '#6B7280',
      marginTop: bulletMarkerMarginTop,
      flexShrink: 0,
    },
    bulletText: {
      maxWidth: '100%',
      minWidth: 0,
      flexBasis: 0,
      fontSize: bodySize,
      flexGrow: 1,
      flexShrink: 1,
      color: '#111418',
      lineHeight,
    },
    paragraph: {
      width: '100%',
      maxWidth: '100%',
      minWidth: 0,
      fontSize: bodySize,
      marginTop: descriptionGap,
      color: '#111418',
      lineHeight,
    },
    skillRow: {
      width: '100%',
      maxWidth: '100%',
      minWidth: 0,
      flexDirection: 'row',
      gap: 10,
      marginBottom: 4,
    },
    skillRowLast: {
      width: '100%',
      maxWidth: '100%',
      minWidth: 0,
      flexDirection: 'row',
      gap: 10,
    },
    skillLabel: {
      width: 110,
      minWidth: 0,
      flexShrink: 0,
      fontSize: contactSize,
      fontWeight: 500,
      color: '#3D4250',
      lineHeight,
      paddingTop: 1.5,
      letterSpacing: 0.2,
    },
    skillValues: {
      maxWidth: '100%',
      minWidth: 0,
      flexBasis: 0,
      fontSize: bodySize,
      flexGrow: 1,
      flexShrink: 1,
      color: '#111418',
      lineHeight,
    },
    languageList: {
      width: '100%',
      maxWidth: '100%',
      minWidth: 0,
      flexDirection: 'column',
      gap: 0,
    },
    languageText: {
      width: '100%',
      maxWidth: '100%',
      minWidth: 0,
      fontSize: bodySize,
      color: '#111418',
      lineHeight: languageLineHeight,
    },
    languageProf: {
      color: '#6B7280',
      fontSize: contactSize,
    },
  })
}
