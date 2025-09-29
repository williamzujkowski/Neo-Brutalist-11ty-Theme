const { defineConfig, devices } = require('@playwright/test');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: 'tests/test-results/html-report' }],
    ['json', { outputFile: 'tests/test-results/results.json' }],
    ['list']
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL || 'http://localhost:8085',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    /* Record video on failure */
    video: 'retain-on-failure'
  },

  /* Configure projects for major browsers and devices */
  projects: [
    // Desktop Testing - Multiple Resolutions
    {
      name: 'Desktop Chrome 1920x1080',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }
      }
    },
    {
      name: 'Desktop Firefox 1440x900',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1440, height: 900 }
      }
    },
    {
      name: 'Desktop Safari 1366x768',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1366, height: 768 }
      }
    },

    // Mobile Testing - Specific Critical Devices
    {
      name: 'iPhone 14 Pro',
      use: { ...devices['iPhone 14 Pro'] }
    },
    {
      name: 'iPhone 15 Pro Max',
      use: {
        ...devices['iPhone 14 Pro Max'], // Using closest available
        viewport: { width: 430, height: 932 }
      }
    },
    {
      name: 'Google Pixel 7',
      use: {
        ...devices['Pixel 5'],
        viewport: { width: 412, height: 915 }
      }
    },
    {
      name: 'Google Pixel 8 Pro',
      use: {
        ...devices['Pixel 5'],
        viewport: { width: 448, height: 992 }
      }
    },
    {
      name: 'Samsung Galaxy S23',
      use: {
        ...devices['Galaxy S5'],
        viewport: { width: 360, height: 780 }
      }
    },

    // Tablet Testing
    {
      name: 'iPad Pro',
      use: { ...devices['iPad Pro'] }
    }
  ],

  /* Run your local dev server before starting the tests */
  webServer: [
    {
      command: 'npm run serve',
      url: 'http://localhost:8085',
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000
    },
    // Support for GitHub Pages testing
    ...(process.env.GITHUB_PAGES_URL
      ? [
          {
            command: 'echo "Using GitHub Pages URL"',
            url: process.env.GITHUB_PAGES_URL,
            reuseExistingServer: true
          }
        ]
      : [])
  ],

  /* Global test timeout */
  timeout: 30000,

  /* Global setup and teardown */
  // globalSetup: require.resolve('./tests/global-setup.js'),

  /* Test configuration for different environments */
  ...(process.env.GITHUB_PAGES_URL
    ? {
        use: {
          baseURL: process.env.GITHUB_PAGES_URL
        },
        webServer: undefined // Don't start local server for GitHub Pages
      }
    : {})
});
