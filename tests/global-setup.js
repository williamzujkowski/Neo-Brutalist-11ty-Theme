const { chromium } = require('@playwright/test');

async function globalSetup(_config) {
  console.log('Starting global setup...');

  // Ensure the site is built and running
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Try to access the site
    console.log('Checking if site is accessible...');
    const response = await page.goto('http://localhost:8085', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    if (response && response.status() < 400) {
      console.log('Site is accessible and ready for testing');
    } else {
      console.warn('Site may not be fully ready, but continuing with tests');
    }

    // Pre-warm critical pages
    const criticalPages = ['/', '/blog/', '/services/', '/contact/'];

    for (const pageUrl of criticalPages) {
      try {
        await page.goto(`http://localhost:8085${pageUrl}`, {
          waitUntil: 'networkidle',
          timeout: 10000
        });
        console.log(`Pre-warmed: ${pageUrl}`);
      } catch (error) {
        console.warn(`Could not pre-warm ${pageUrl}: ${error.message}`);
      }
    }
  } catch (error) {
    console.warn(`Setup warning: ${error.message}`);
    // Don't fail setup if site isn't ready - let individual tests handle it
  } finally {
    await browser.close();
  }

  console.log('Global setup completed');
}

module.exports = globalSetup;
