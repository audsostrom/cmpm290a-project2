import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: 'http://localhost:5190', trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 900, height: 920 } } }],
  webServer: {
    command: 'pnpm exec vite --port 5190 --strictPort',
    url: 'http://localhost:5190',
    reuseExistingServer: !process.env.CI,
  },
});
