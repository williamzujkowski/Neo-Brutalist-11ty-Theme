/**
 * Global setup for Playwright tests
 * Runs once before all tests begin
 */

async function globalSetup(config) {
  console.log('🚀 Starting global test setup...');

  // Set environment-specific configuration
  if (process.env.GITHUB_PAGES_URL) {
    console.log(`📱 Testing against GitHub Pages: ${process.env.GITHUB_PAGES_URL}`);
  } else {
    console.log('🏠 Testing against local development server');
  }

  // You can add any global setup logic here
  // For example, seeding test data, authentication, etc.

  console.log('✅ Global setup complete');
}

module.exports = globalSetup;