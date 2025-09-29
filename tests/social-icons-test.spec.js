const { test, expect, chromium } = require('@playwright/test');

test.describe('Social Icons and Mobile Tests', () => {
  const baseURL = 'http://localhost:8085';

  test('Footer social icons are properly rendered', async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto(baseURL);

    // Check footer exists
    const footer = await page.locator('footer');
    await expect(footer).toBeVisible();

    // Check social links container
    const socialLinks = await page.locator('footer .social-links');
    await expect(socialLinks).toBeVisible();

    // Check all social links
    const links = await page.locator('footer .social-link').all();
    console.log(`Found ${links.length} social links`);

    // Verify each link
    for (let i = 0; i < links.length; i++) {
      const link = links[i];

      // Check link is visible
      await expect(link).toBeVisible();

      // Check SVG icon exists
      const svg = await link.locator('svg');
      await expect(svg).toBeVisible();

      // Check link attributes
      const href = await link.getAttribute('href');
      const ariaLabel = await link.getAttribute('aria-label');

      console.log(`Link ${i + 1}: ${ariaLabel} -> ${href}`);

      expect(href).toBeTruthy();
      expect(ariaLabel).toBeTruthy();
    }

    await browser.close();
  });

  test('Mobile navigation and blog post navigation', async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext({
      viewport: { width: 393, height: 852 } // iPhone 14 Pro
    });
    const page = await context.newPage();

    await page.goto(baseURL);

    // Check hamburger menu is visible
    const hamburger = await page.locator('.hamburger');
    await expect(hamburger).toBeVisible();

    // Navigate to blog
    await page.goto(`${baseURL}/blog/`);

    // Click first blog post
    const firstPost = await page.locator('.blog-card').first();
    await firstPost.click();

    // Check post navigation bar
    const postNav = await page.locator('.post-navigation');
    await expect(postNav).toBeVisible();

    // Check back button
    const backBtn = await page.locator('.post-back-btn');
    await expect(backBtn).toBeVisible();
    await expect(backBtn).toContainText('BACK TO BLOG');

    // Check post title has proper spacing
    const postTitle = await page.locator('.post-title');
    const marginTop = await postTitle.evaluate(el =>
      window.getComputedStyle(el).marginTop
    );
    console.log(`Post title margin-top: ${marginTop}`);

    await browser.close();
  });

  test('Project images are loading', async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto(baseURL);

    // Scroll to projects section
    await page.evaluate(() => {
      document.querySelector('#projects')?.scrollIntoView();
    });

    // Wait for images to be visible
    await page.waitForTimeout(500);

    // Check each project image
    const projectImages = [
      'chaos-grid.svg',
      'type-destroyer.svg',
      'color-riot.svg'
    ];

    for (const imageName of projectImages) {
      const img = await page.locator(`img[src*="${imageName}"]`).first();

      if (await img.isVisible()) {
        const naturalWidth = await img.evaluate(el => el.naturalWidth);
        console.log(`${imageName}: width=${naturalWidth}px`);
        expect(naturalWidth).toBeGreaterThan(0);
      } else {
        console.log(`${imageName}: not found or not visible`);
      }
    }

    await browser.close();
  });
});