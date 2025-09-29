const { test, expect } = require('@playwright/test');

const baseURL = 'http://localhost:8085';

test.describe('Final Validation Tests', () => {
  test('Social icons render correctly on all pages', async ({ page }) => {
    const pages = ['/', '/blog/', '/pages/about/', '/pages/services/', '/pages/contact/'];

    for (const pagePath of pages) {
      await page.goto(baseURL + pagePath);

      // Check footer social links container
      const socialLinks = page.locator('footer .social-links');
      await expect(socialLinks).toBeVisible();

      // Check all 8 social icons are present
      const socialIcons = page.locator('footer .social-link');
      await expect(socialIcons).toHaveCount(8);

      // Verify each icon has an SVG
      const icons = await socialIcons.all();
      for (const icon of icons) {
        const svg = icon.locator('svg');
        await expect(svg).toBeVisible();

        // Check SVG has path element
        const path = svg.locator('path');
        await expect(path).toBeVisible();
      }
    }
  });

  test('Mobile navigation hamburger menu exists', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 852 }); // iPhone 14 Pro
    await page.goto(baseURL);

    const hamburger = page.locator('.hamburger');
    await expect(hamburger).toBeVisible();

    // Test menu toggle
    await hamburger.click();
    const navMenu = page.locator('.nav-menu');
    await expect(navMenu).toHaveClass(/active/);

    await hamburger.click();
    await expect(navMenu).not.toHaveClass(/active/);
  });

  test('Blog post navigation works correctly', async ({ page }) => {
    await page.goto(baseURL + '/blog/');

    // Click first blog post
    const firstPost = page.locator('.blog-card').first();
    await firstPost.click();

    // Check "Back to Blog" navigation exists
    const backNav = page.locator('.post-navigation');
    await expect(backNav).toBeVisible();

    const backBtn = page.locator('.post-back-btn');
    await expect(backBtn).toBeVisible();
    await expect(backBtn).toContainText('BACK TO BLOG');

    // Test navigation back to blog
    await backBtn.click();
    await expect(page).toHaveURL(/\/blog\//);
  });

  test('Project images load successfully', async ({ page }) => {
    await page.goto(baseURL);

    // Scroll to projects section
    await page.evaluate(() => {
      document.querySelector('#projects')?.scrollIntoView();
    });

    const projectImages = [
      { name: 'chaos-grid.svg', selector: 'img[src*="chaos-grid.svg"]' },
      { name: 'type-destroyer.svg', selector: 'img[src*="type-destroyer.svg"]' },
      { name: 'color-riot.svg', selector: 'img[src*="color-riot.svg"]' }
    ];

    for (const project of projectImages) {
      const img = page.locator(project.selector).first();
      await expect(img).toBeVisible();

      // Verify image loaded
      const naturalWidth = await img.evaluate(el => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });

  test('Responsive design works on multiple viewports', async ({ page }) => {
    const viewports = [
      { name: 'Desktop', width: 1920, height: 1080 },
      { name: 'iPhone 14 Pro', width: 393, height: 852 },
      { name: 'iPhone 15 Pro', width: 430, height: 932 },
      { name: 'Google Pixel 7', width: 412, height: 915 }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto(baseURL);

      // Check hero section
      await expect(page.locator('.hero')).toBeVisible();

      // Check navigation exists
      await expect(page.locator('nav')).toBeVisible();

      // Check footer
      await expect(page.locator('footer')).toBeVisible();

      // Check social icons in footer
      const socialIcons = page.locator('footer .social-link svg');
      const iconCount = await socialIcons.count();
      expect(iconCount).toBe(8);
    }
  });

  test('All navigation links work correctly', async ({ page }) => {
    await page.goto(baseURL);

    const navLinks = [
      { text: 'ABOUT', expectedUrl: '/pages/about/' },
      { text: 'SERVICES', expectedUrl: '/pages/services/' },
      { text: 'BLOG', expectedUrl: '/blog/' },
      { text: 'CONTACT', expectedUrl: '/pages/contact/' }
    ];

    for (const link of navLinks) {
      await page.goto(baseURL); // Reset to home
      await page.click(`nav a:has-text("${link.text}")`);
      await expect(page).toHaveURL(new RegExp(link.expectedUrl));

      // Verify footer social icons exist on each page
      const socialIcons = page.locator('footer .social-link');
      await expect(socialIcons).toHaveCount(8);
    }
  });

  test('Accessibility: all social links have proper attributes', async ({ page }) => {
    await page.goto(baseURL);

    const socialLinks = page.locator('footer .social-link');
    const links = await socialLinks.all();

    for (const link of links) {
      // Check aria-label
      const ariaLabel = await link.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();

      // Check target="_blank" for external links
      const target = await link.getAttribute('target');
      expect(target).toBe('_blank');

      // Check rel="noopener noreferrer" for security
      const rel = await link.getAttribute('rel');
      expect(rel).toContain('noopener');
      expect(rel).toContain('noreferrer');

      // Check href exists
      const href = await link.getAttribute('href');
      expect(href).toBeTruthy();
    }
  });
});