import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for OrangeHRM demo automation.
 * Docs: https://playwright.dev/docs/test-configuration
 * Allure: https://allurereport.org/docs/playwright/
 */
export default defineConfig({
  testDir: './tests',
  // Run tests one after another in a single browser/worker (easier to watch in headed mode)
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
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
          locale: 'en-US',
          ci: process.env.CI ? 'true' : 'false',
        },
      },
    ],
  ],
  timeout: 60_000,
  use: {
    baseURL: 'https://opensource-demo.orangehrmlive.com',
    // Browser locale alone is not enough; fixtures/test.ts forces i18n locale=en_US
    locale: 'en-US',
    timezoneId: 'UTC',
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
    },
    launchOptions: {
      args: ['--disable-features=Translate,TranslateUI', '--disable-translate'],
    },
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

