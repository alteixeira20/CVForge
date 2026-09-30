import { expect, test } from '@playwright/test'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { CURRENT_CV_SCHEMA_VERSION, defaultCVState, type CVState } from '../src/types/cv'
import { lineSpacingToLineHeight } from '../src/features/resume-pdf/resumePdfLayoutHelpers'

const exec = promisify(execFile)
const SCRATCH_DIR =
  process.env.SCRATCH_DIR ||
  '/home/alteixeira20/.local/share/agy02-profile/home/.gemini/antigravity-cli/brain/ac63212a-fc61-4b8c-9d39-9b99b2c757b2/scratch/matrix'

function createPopulatedCV(settingsOverride: Partial<CVState['settings']> = {}): CVState {
  const cv: CVState = JSON.parse(JSON.stringify(defaultCVState))
  cv.resume.profile = {
    name: 'Alexandre Teixeira',
    email: 'alexandre@example.com',
    phone: '+351 912 345 678',
    location: 'Lisboa, Portugal',
    website: 'https://alexandreteixeira.dev',
    github: 'github.com/alteixeira20',
    linkedin: 'linkedin.com/in/alexandreteixeira',
    summary:
      'Principal Systems Architect com mais de 15 anos de experiência na conceção de plataformas distribuídas de alta disponibilidade e tolerância a falhas. Especialista em otimização de infraestruturas cloud heterogéneas, redução de custos de computação e governação de equipas multidisciplinares de engenharia em ambientes de missão crítica.',
  }
  cv.resume.workExperience = [
    {
      id: 'work-1',
      company: 'Apex Infrastructure Systems',
      role: 'Principal Distributed Systems Engineer & Technical Lead',
      location: 'San Francisco, CA & Lisboa',
      startDate: '2021-01',
      endDate: '',
      isCurrent: true,
      bullets: [
        'Liderou a transformação arquitetural do motor transacional global, escalando o débito de processamento de 250.000 para mais de 2.500.000 eventos por segundo com redução de 42% na latência p99 em três regiões continentais.',
        'Concebeu e implementou um coordenador de consenso tolerante a falhas bizantinas que eliminou pontos únicos de falha e reduziu o intervalo de recuperação catastrófica de 45 segundos para 800 milissegundos.',
        'Desenvolveu protocolos de compressão streaming binária diminuindo o consumo de largura de banda inter-regiões em 35%, gerando uma poupança orçamental de $1.450.000 anuais.',
        'Estabeleceu padrões corporativos de telemetria distribuída, rastreabilidade ponta-a-ponta e monitorização proativa de alertas críticos.',
      ],
    },
    {
      id: 'work-2',
      company: 'Vanguard Cloud Technologies',
      role: 'Senior Platform Architect',
      location: 'Porto, Portugal',
      startDate: '2017-03',
      endDate: '2020-12',
      isCurrent: false,
      bullets: [
        'Arquiteto responsável pela malha de microsserviços em Kubernetes multi-tenant, suportando mais de 400 serviços de produção com orquestração de canários e rotações sem interrupção de serviço.',
        'Padronizou pipelines de integração contínua e automação de conformidade de segurança, reduzindo o tempo de entrega de releases de semanas para horas.',
      ],
    },
  ]
  cv.resume.education = [
    {
      id: 'edu-1',
      school: 'Universidade do Porto / Carnegie Mellon University',
      degree: 'Mestrado em Engenharia Informática e Sistemas Distribuídos',
      location: 'Porto, Portugal',
      startDate: '2015-09',
      endDate: '2017-06',
      details: [
        'Graduado com distinção máxima; tese publicada sobre consenso assíncrono em máquinas de estado replicadas.',
      ],
    },
  ]
  cv.resume.projects = [
    {
      id: 'proj-1',
      name: 'HelixKV Distributed Key-Value Store',
      link: 'github.com/alteixeira20/helix-kv',
      startDate: '2022-01',
      endDate: '2023-06',
      bullets: [
        'Motor de base de dados chave-valor transacional de alto desempenho desenvolvido em Rust com suporte a consenso Raft e isolamento serializável rigoroso.',
      ],
    },
    {
      id: 'proj-2',
      name: 'CloudCost Optimizer Agent',
      link: 'github.com/alteixeira20/cloudcost-agent',
      startDate: '2023-08',
      endDate: '2024-02',
      bullets: [
        'Agente autónomo para análise em tempo real e rebalanceamento preditivo de instâncias spot em clusters heterogéneos.',
      ],
    },
  ]
  cv.resume.skills = {
    featured: [],
    featuredWithRating: [],
    technical: ['Rust', 'Go', 'TypeScript', 'Distributed Consensus', 'Kubernetes', 'gRPC', 'eBPF', 'Kafka', 'PostgreSQL'],
    soft: ['Liderança Técnica', 'Arquitetura de Sistemas', 'Gestão de Incidentes Críticos', 'Mentoria'],
  }
  cv.resume.languages = [
    { id: 'lang-1', name: 'Português', proficiency: 'Nativo' },
    { id: 'lang-2', name: 'Inglês', proficiency: 'Bilingue / Fluente (C2)' },
  ]
  cv.settings = {
    ...cv.settings,
    descriptionMode: {
      ...cv.settings.descriptionMode,
      workExperience: 'bullets',
      projects: 'paragraph',
    },
    ...settingsOverride,
  }
  cv.schemaVersion = CURRENT_CV_SCHEMA_VERSION
  cv.updatedAt = new Date().toISOString()
  return cv
}

test('Builder Typography control is renamed to Line Spacing and supports 0 density', async ({ page }) => {
  const pageErrors: string[] = []
  page.on('pageerror', (err) => pageErrors.push(err.message))

  await page.goto('/builder')

  // Open the Builder Settings card
  const settingsCard = page.locator('.group').filter({ hasText: 'Builder Settings' })
  await settingsCard.getByRole('button', { name: 'Expand section' }).click()

  // Verify Typography panel exists and Line Spacing is visible while Line Height is not
  await expect(page.getByText('Line Spacing', { exact: true })).toBeVisible()
  await expect(page.getByText('Line Height', { exact: true })).toHaveCount(0)

  // Verify default value is 0.5, step is 0.05, min is 0, max is 1
  const lineSpacingInput = page.getByLabel(/Line Spacing/)
  await expect(lineSpacingInput).toBeVisible()
  await expect(lineSpacingInput).toHaveValue('0.5')
  await expect(lineSpacingInput).toHaveAttribute('min', '0')
  await expect(lineSpacingInput).toHaveAttribute('max', '1')
  await expect(lineSpacingInput).toHaveAttribute('step', '0.05')

  // Change Line Spacing to 0
  await lineSpacingInput.fill('0')
  await expect(lineSpacingInput).toHaveValue('0')

  // Set Section spacing and Profile spacing to 0
  const sectionInput = page.getByLabel('Section Spacing')
  const profileInput = page.getByLabel('Profile Spacing')
  await sectionInput.fill('0')
  await profileInput.fill('0')

  // Verify reload preserves state
  await page.reload()
  const settingsCardReloaded = page.locator('.group').filter({ hasText: 'Builder Settings' })
  await settingsCardReloaded.getByRole('button', { name: 'Expand section' }).click()

  const lineSpacingAfterReload = page.getByLabel(/Line Spacing/)
  await expect(lineSpacingAfterReload).toHaveValue('0')
  await expect(page.getByLabel('Section Spacing')).toHaveValue('0')
  await expect(page.getByLabel('Profile Spacing')).toHaveValue('0')

  // Verify JSON export reflects internal lineHeight 0.7 and zero spacings
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export' }).click()
  const download = await downloadPromise
  const backupBuffer = await readFile((await download.path())!)
  const exported = JSON.parse(backupBuffer.toString('utf-8'))
  expect(exported.settings.lineHeight).toBe(0.7)
  expect(exported.settings.sectionSpacing).toBe(0)
  expect(exported.settings.profileSpacing).toBe(0)

  // Test Reset PDF settings restores default 0.5
  await page.getByRole('button', { name: 'Reset PDF settings' }).click()
  await page.getByRole('button', { name: 'Reset settings' }).click()
  await expect(page.getByLabel(/Line Spacing/)).toHaveValue('0.5')
  await expect(page.getByLabel('Section Spacing')).toHaveValue('20')
  await expect(page.getByLabel('Profile Spacing')).toHaveValue('10')

  // Test JSON import restores custom Line Spacing 0
  await page.getByRole('button', { name: 'Import' }).click()
  await page.locator('input[type="file"]').setInputFiles({
    name: download.suggestedFilename() || 'cvforge-backup.json',
    mimeType: 'application/json',
    buffer: backupBuffer,
  })
  const confirmButton = page.getByRole('button', { name: 'Replace current CV & Restore' })
  await expect(confirmButton).toBeVisible()
  await confirmButton.click()

  // Open settings if collapsed and verify Line Spacing restored to 0
  const reopenedSettings = page.locator('.group').filter({ hasText: 'Builder Settings' })
  const lineSpacingAfterImport = page.getByLabel(/Line Spacing/)
  if (!(await lineSpacingAfterImport.isVisible().catch(() => false))) {
    await reopenedSettings.getByRole('button', { name: 'Expand section' }).click()
  }
  await expect(page.getByLabel(/Line Spacing/)).toHaveValue('0')
  await expect(page.getByLabel('Section Spacing')).toHaveValue('0')
  await expect(page.getByLabel('Profile Spacing')).toHaveValue('0')

  // Test legacy CV with lineHeight: 1.5 loads as Line Spacing 0.5
  exported.settings.lineHeight = 1.5
  await page.getByRole('button', { name: 'Import' }).click()
  await page.locator('input[type="file"]').setInputFiles({
    name: 'legacy-backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(exported, null, 2)),
  })
  const legacyConfirmButton = page.getByRole('button', { name: 'Replace current CV & Restore' })
  await expect(legacyConfirmButton).toBeVisible()
  await legacyConfirmButton.click()

  if (!(await lineSpacingAfterImport.isVisible().catch(() => false))) {
    await reopenedSettings.getByRole('button', { name: 'Expand section' }).click()
  }
  await expect(page.getByLabel(/Line Spacing/)).toHaveValue('0.5')

  expect(pageErrors).toEqual([])
})

test('Generate visual check PDFs and PNGs across A4 and Letter for all fonts and densities', async ({ page }) => {
  test.setTimeout(240_000)
  await mkdir(SCRATCH_DIR, { recursive: true })

  const pageSizes: Array<'A4' | 'Letter'> = ['A4', 'Letter']
  const fontOptions = [
    { name: 'helvetica', family: 'Helvetica' },
    { name: 'times', family: 'Times New Roman' },
    { name: 'courier', family: 'Courier New' },
  ]

  const densityScenarios: Array<{
    id: string
    lineSpacing: number
    zeroSpacings?: boolean
  }> = [
    { id: 'spacing_000', lineSpacing: 0.0 },
    { id: 'spacing_010', lineSpacing: 0.1 },
    { id: 'spacing_025', lineSpacing: 0.25 },
    { id: 'spacing_050', lineSpacing: 0.5 },
    { id: 'spacing_100', lineSpacing: 1.0 },
    { id: 'ultra_dense', lineSpacing: 0.0, zeroSpacings: true },
  ]

  for (const pageSize of pageSizes) {
    for (const font of fontOptions) {
      for (const scenario of densityScenarios) {
        const scenarioName = `${pageSize.toLowerCase()}_${font.name}_${scenario.id}`

        const customSettings: Partial<CVState['settings']> = {
          documentSize: pageSize,
          fontFamily: font.family,
          lineHeight: lineSpacingToLineHeight(scenario.lineSpacing),
        }

        if (scenario.zeroSpacings) {
          customSettings.sectionSpacing = 0
          customSettings.profileSpacing = 0
          customSettings.topBarHeight = 0
          customSettings.contactGap = 0
          customSettings.summaryGap = 0
          customSettings.titleMetaGap = 0
          customSettings.descriptionGap = 0
          customSettings.workEntryGap = 0
          customSettings.educationEntryGap = 0
          customSettings.projectEntryGap = 0
        }

        const state = createPopulatedCV(customSettings)

        // Preload localStorage with state
        await page.addInitScript((val) => {
          window.localStorage.setItem('cvforge:state', JSON.stringify(val))
        }, state)

        await page.goto('/builder')

        const downloadButton = page.getByRole('button', { name: 'Download' })
        await expect(downloadButton).toBeVisible({ timeout: 20_000 })

        const downloadPromise = page.waitForEvent('download')
        await downloadButton.click()
        const download = await downloadPromise
        const pdfPath = await download.path()
        expect(pdfPath).not.toBeNull()

        const pdfBuffer = await readFile(pdfPath!)
        const targetPdf = path.join(SCRATCH_DIR, `${scenarioName}.pdf`)
        await writeFile(targetPdf, pdfBuffer)

        // Convert first page to PNG
        const prefix = path.join(SCRATCH_DIR, scenarioName)
        await exec('pdftoppm', ['-png', '-r', '150', '-f', '1', '-l', '1', targetPdf, prefix])

        console.log(`Generated ${scenarioName}: ${pdfBuffer.length} bytes`)
      }
    }
  }
})
