import { defineConfig, devices } from '@playwright/test'

const BASE = process.env.BASE_URL ?? 'http://localhost:4173'
export default defineConfig({
  testDir: 'tests',
  timeout: 90_000,
  reporter: [['list']],
  use: {
    baseURL: BASE,
    launchOptions: { args: ['--enable-gpu', '--use-angle=d3d11', '--ignore-gpu-blocklist'] },
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } }, grepInvert: /@mobile/ },
    { name: 'mobile', use: { ...devices['Pixel 7'] }, grep: /@mobile/ },
  ],
  webServer: process.env.BASE_URL ? undefined : { command: 'npm run preview', url: BASE, reuseExistingServer: true },
})
