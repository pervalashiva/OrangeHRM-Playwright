import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for OrangeHRM demo automation.
 * Docs: https://playwright.dev/docs/test-configuration
 * Allure: https://allurereport.org/docs/playwright/
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    [
      'allure-playwright',
      {
        resultsDir: 'allure-results',
        detail: true,
        suiteTitle: true,
        environmentInfo: {
          node_version: process.version,
          base_url: 'https://opensource-demo.orangehrmlive.com',
          ci: process.env.CI ? 'true' : 'false',
        },
      },
    ],
  ],
  timeout: 60_000,
  use: {
    baseURL: 'https://opensource-demo.orangehrmlive.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
