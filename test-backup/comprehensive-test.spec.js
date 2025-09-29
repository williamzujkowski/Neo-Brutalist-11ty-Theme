const { test, expect } = require('@playwright/test');

// Test different device viewports
const devices = [
  { name: 'iPhone 14 Pro', viewport: { width: 393, height: 852 } },
  { name: 'iPhone 15 Pro', viewport: { width: 430, height: 932 } },
  { name: 'Google Pixel 7', viewport: { width: 412, height: 915 } },
  { name: 'Google Pixel 8', viewport: { width: 412, height: 915 } },
  { name: 'Desktop', viewport: { width: 1920, height: 1080 } }
];

test.describe('Comprehensive Site Tests', () => {
  const baseURL = 'http://localhost:8085';

  devices.forEach(device => {
    test.describe(`${device.name} Tests`, () => {
      test.use({ viewport: device.viewport });

      test('Homepage loads correctly', async ({ page }) => {
        await page.goto(baseURL);

        // Check hero section
        await expect(page.locator('.hero')).toBeVisible();
        await expect(page.locator('.hero-title')).toBeVisible();

        // Check navigation
        if (device.name.includes('Desktop')) {
          await expect(page.locator('.nav-menu')).toBeVisible();
        } else {
          // Mobile should have hamburger menu
          await expect(page.locator('.hamburger')).toBeVisible();
        }

        // Check footer social icons
        await expect(page.locator('footer .social-links')).toBeVisible();
        const socialLinks = page.locator('footer .social-link');
        await expect(socialLinks).toHaveCount(4); // GitHub, Twitter, LinkedIn, Email

        // Verify social icons have proper SVG content
        for (let i = 0; i < 4; i++) {
          const link = socialLinks.nth(i);
          await expect(link).toBeVisible();
          const svg = link.locator('svg');
          await expect(svg).toBeVisible();
        }
      });

      test('Navigation links work correctly', async ({ page }) => {
        await page.goto(baseURL);

        // Test navigation links
        const links = [
          { text: 'ABOUT', url: '/pages/about/' },
          { text: 'SERVICES', url: '/pages/services/' },
          { text: 'BLOG', url: '/blog/' },
          { text: 'CONTACT', url: '/pages/contact/' }
        ];

        for (const link of links) {
          if (device.name.includes('Desktop')) {
            await page.click(`text="${link.text}"`);
          } else {
            // Open mobile menu first
            await page.click('.hamburger');
            await page.waitForSelector('.nav-menu.active');
            await page.click(`text="${link.text}"`);
          }

          await expect(page).toHaveURL(new RegExp(link.url));
          await page.goto(baseURL); // Go back to homepage
        }
      });

      test('Blog page and posts work correctly', async ({ page }) => {
        await page.goto(`${baseURL}/blog/`);

        // Check blog grid
        await expect(page.locator('.blog-grid')).toBeVisible();
        const blogCards = page.locator('.blog-card');
        await expect(blogCards).toHaveCount(7);

        // Click first blog post
        await blogCards.first().click();

        // Check post navigation
        await expect(page.locator('.post-navigation')).toBeVisible();
        const backBtn = page.locator('.post-back-btn');
        await expect(backBtn).toBeVisible();
        await expect(backBtn).toContainText('BACK TO BLOG');

        // Check post content
        await expect(page.locator('.post-title')).toBeVisible();
        await expect(page.locator('.post-content')).toBeVisible();

        // Test back to blog button
        await backBtn.click();
        await expect(page).toHaveURL(/\/blog\//);
      });

      test('Project images load correctly', async ({ page }) => {
        await page.goto(baseURL);

        // Scroll to projects section
        await page.evaluate(() => {
          document.querySelector('#projects')?.scrollIntoView();
        });

        // Check project images
        const projectImages = ['chaos-grid.svg', 'type-destroyer.svg', 'color-riot.svg'];

        for (const imageName of projectImages) {
          const img = page.locator(`img[src*="${imageName}"]`);
          await expect(img).toBeVisible();

          // Verify image loaded successfully
          const naturalWidth = await img.evaluate(el => el.naturalWidth);
          expect(naturalWidth).toBeGreaterThan(0);
        }
      });

      test('Footer social icons are functional', async ({ page }) => {
        await page.goto(baseURL);

        // Scroll to footer
        await page.evaluate(() => {
          document.querySelector('footer')?.scrollIntoView();
        });

        // Check each social link
        const socialLinks = page.locator('footer .social-link');

        for (let i = 0; i < 4; i++) {
          const link = socialLinks.nth(i);
          await expect(link).toBeVisible();

          // Check link has href attribute
          const href = await link.getAttribute('href');
          expect(href).toBeTruthy();

          // Check aria-label for accessibility
          const ariaLabel = await link.getAttribute('aria-label');
          expect(ariaLabel).toBeTruthy();

          // Check target="_blank" for external links
          const target = await link.getAttribute('target');
          expect(target).toBe('_blank');

          // Check SVG icon is present
          const svg = link.locator('svg');
          await expect(svg).toBeVisible();

          // Check hover effect (size should be adequate for touch)
          const box = await link.boundingBox();
          if (!device.name.includes('Desktop')) {
            // Mobile touch targets should be at least 48x48
            expect(box.width).toBeGreaterThanOrEqual(48);
            expect(box.height).toBeGreaterThanOrEqual(48);
          }
        }
      });

      test('Typography is readable on mobile', async ({ page }) => {
        if (!device.name.includes('Desktop')) {
          await page.goto(baseURL);

          // Check text contrast
          const bodyText = page.locator('body').first();
          const color = await bodyText.evaluate(el => window.getComputedStyle(el).color);

          // Should be dark enough for readability
          expect(color).toMatch(/rgb\((1[0-9]|2[0-9]|[0-9]),/); // Dark color

          // Check font size on mobile
          const fontSize = await bodyText.evaluate(el => window.getComputedStyle(el).fontSize);
          const fontSizePx = parseInt(fontSize);
          expect(fontSizePx).toBeGreaterThanOrEqual(16); // Minimum readable size
        }
      });

      test('Mobile menu toggle works', async ({ page }) => {
        if (!device.name.includes('Desktop')) {
          await page.goto(baseURL);

          // Check hamburger is visible
          const hamburger = page.locator('.hamburger');
          await expect(hamburger).toBeVisible();

          // Check menu is initially hidden
          const navMenu = page.locator('.nav-menu');
          await expect(navMenu).not.toHaveClass(/active/);

          // Click hamburger to open menu
          await hamburger.click();
          await expect(navMenu).toHaveClass(/active/);

          // Click again to close
          await hamburger.click();
          await expect(navMenu).not.toHaveClass(/active/);
        }
      });

      test('Accessibility checks', async ({ page }) => {
        await page.goto(baseURL);

        // Check all images have alt text
        const images = page.locator('img');
        const imageCount = await images.count();
        for (let i = 0; i < imageCount; i++) {
          const alt = await images.nth(i).getAttribute('alt');
          expect(alt).toBeTruthy();
        }

        // Check all links have accessible text or aria-label
        const links = page.locator('a');
        const linkCount = await links.count();
        for (let i = 0; i < linkCount; i++) {
          const link = links.nth(i);
          const text = await link.textContent();
          const ariaLabel = await link.getAttribute('aria-label');
          expect(text || ariaLabel).toBeTruthy();
        }

        // Check focus indicators are visible
        await page.keyboard.press('Tab');
        const focusedElement = page.locator(':focus');
        await expect(focusedElement).toBeVisible();
      });
    });
  });
});
