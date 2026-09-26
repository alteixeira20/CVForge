import { defineConfig, devices } from '@playwright/test'

const port = Number(process.env.PLAYWRIGHT_PORT ?? 4317)
const baseURL = `http://127.0.0.1:${port}`
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH
const reuseExistingServer = process.env.PLAYWRIGHT_REUSE_SERVER === '1'
const standaloneAppDir = '.next/standalone/apps/web'
const standaloneCommand = [
  `rm -rf ${standaloneAppDir}/public ${standaloneAppDir}/.next/static`,
  `mkdir -p ${standaloneAppDir}/.next`,
  `cp -R public ${standaloneAppDir}/public`,
  `cp -R .next/static ${standaloneAppDir}/.next/static`,
  `exec env HOSTNAME=127.0.0.1 PORT=${port} node ${standaloneAppDir}/server.js`,
].join(' && ')

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL,
    viewport: { width: 1280, height: 800 },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
        launchOptions: executablePath ? {
          executablePath,
          args: ['--no-sandbox'],
        } : undefined,
      },
    },
    {
      name: 'firefox-smoke',
      testMatch: /(cross-browser-smoke|privacy)\.spec\.ts/,
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 800 },
      },
    },
    {
      name: 'webkit-smoke',
      testMatch: /(cross-browser-smoke|privacy)\.spec\.ts/,
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 800 },
      },
    },
  ],
  webServer: {
    command: standaloneCommand,
    url: `${baseURL}/health`,
    reuseExistingServer,
    timeout: 120_000,
  },
})
