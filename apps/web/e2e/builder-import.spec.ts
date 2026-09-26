import { expect, test, type Page } from '@playwright/test'
import {
  PDFDocument,
  PDFNumber,
  PDFOperator,
  PDFOperatorNames,
  StandardFonts,
  type PDFFont,
  type PDFPage,
} from 'pdf-lib'

type RunPart = string | number

// Writes one line as a TJ array, the way older CVForge (react-pdf) exports did:
// a space glyph followed by a large pull-back is a phantom space inside a word.
function drawRun(pdf: PDFDocument, page: PDFPage, font: PDFFont, parts: RunPart[], x: number, y: number) {
  const fontName = page.node.newFontDictionary(font.name, font.ref)
  const array = pdf.context.obj(parts.map((part) => (typeof part === 'number' ? PDFNumber.of(part) : font.encodeText(part))))
  page.pushOperators(
    PDFOperator.of(PDFOperatorNames.BeginText),
    PDFOperator.of(PDFOperatorNames.SetFontAndSize, [fontName, PDFNumber.of(10)]),
    PDFOperator.of(PDFOperatorNames.MoveText, [PDFNumber.of(x), PDFNumber.of(y)]),
    PDFOperator.of(PDFOperatorNames.ShowTextAdjusted, [array]),
    PDFOperator.of(PDFOperatorNames.EndText),
  )
}

async function olderCVForgePdf() {
  const pdf = await PDFDocument.create()
  pdf.setCreator('react-pdf')
  pdf.setProducer('CVForge')
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const page = pdf.addPage([595, 842])
  const line = (parts: RunPart[], y: number, x = 48) => drawRun(pdf, page, font, parts, x, y)

  line(['Casey Morgan'], 790)
  line(['casey@example.org'], 772)
  line(['Engineer completing an intensive systems progra ', 247.56, 'mming curriculum at 42 P ', 247.56, 'orto,'], 750)
  line(['with hands-on expe ', 247.56, 'rience building parsers and backends in C and Python.'], 738)
  line(['EXPERIENCE'], 710)
  line(['Acme Corp'], 692)
  line(['Platform Engineer'], 678)
  line(['Jan 2020 - Mar 20 ', 247.56, '23'], 678, 440)
  line(['•'], 664, 54)
  line(['Built a deployment pipeline that reduced release time by 40% for ten te ', 247.56, 'ams.'], 664, 64)
  line(['EDUCATION'], 636)
  line(['Example University'], 618)
  line(['BSc Computer Science'], 604)
  line(['2015 - 2019'], 604, 440)
  return Buffer.from(await pdf.save())
}

async function importPdf(page: Page, buffer: Buffer) {
  await page.getByRole('button', { name: 'Import' }).click()
  const chooser = page.waitForEvent('filechooser')
  await page.getByRole('button', { name: 'Choose File' }).click()
  await (await chooser).setFiles({ name: 'older-cvforge.pdf', mimeType: 'application/pdf', buffer })
  await expect(page.getByText('Best-Effort Draft Review')).toBeVisible({ timeout: 20_000 })
  await page.getByRole('button', { name: 'Create Editable Draft' }).click()
}

test('importing an older CVForge PDF removes phantom spaces inside words', async ({ page }) => {
  await page.goto('/builder')
  await importPdf(page, await olderCVForgePdf())

  await expect(page.getByLabel('Full Name')).toHaveValue('Casey Morgan')
  const summary = page.getByLabel('Professional Summary')
  await expect(summary).toHaveValue(/intensive systems programming curriculum at 42 Porto, with hands-on experience building/)
  await expect(page.getByLabel('Role')).toHaveValue('Platform Engineer')
  const work = await page.evaluate(() => JSON.parse(localStorage.getItem('cvforge:state')!).resume.workExperience)
  expect(work).toHaveLength(1)
  expect(work[0]).toMatchObject({ company: 'Acme Corp', startDate: 'Jan 2020', endDate: 'Mar 2023' })
  expect(work[0].bullets).toEqual(['Built a deployment pipeline that reduced release time by 40% for ten teams.'])
})

test('an import opens every section that received content', async ({ page }) => {
  await page.goto('/builder')
  await expect(page.getByLabel('Company')).toHaveCount(0)
  await importPdf(page, await olderCVForgePdf())

  await expect(page.getByLabel('Company')).toHaveValue('Acme Corp')
  await expect(page.getByLabel('School / Institution')).toHaveValue('Example University')
  await expect(page.getByLabel('Degree / Major')).toHaveValue('BSc Computer Science')
})

test('section move arrows sit side by side in one row', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/builder')
  const up = page.getByRole('button', { name: 'Move section up' }).nth(1)
  const down = page.getByRole('button', { name: 'Move section down' }).nth(1)
  const upBox = (await up.boundingBox())!
  const downBox = (await down.boundingBox())!
  expect(Math.abs(upBox.y - downBox.y)).toBeLessThanOrEqual(1)
  expect(downBox.x).toBeGreaterThanOrEqual(upBox.x + upBox.width - 1)
  expect(Math.min(upBox.width, upBox.height)).toBeGreaterThanOrEqual(24)
})
