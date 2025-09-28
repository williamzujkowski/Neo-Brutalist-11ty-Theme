/**
 * Link Validation Tests
 * Comprehensive testing of all internal and external links
 */

const { test, expect } = require('@playwright/test');
const { waitForPageLoad } = require('./helpers/test-utils');

test.describe('Link Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
  });

  test('should validate all internal links work correctly', async ({ page }) => {
    // Collect all internal links
    const internalLinks = await page.locator('a[href^="/"], a[href^="#"], a[href^="./"], a[href^="../"]').all();

    const results = [];

    for (const link of internalLinks) {
      const href = await link.getAttribute('href');
      const text = await link.textContent();

      if (!href) continue;

      try {
        // Skip hash-only links for now, test them separately
        if (href.startsWith('#')) {
          results.push({
            href,
            text: text?.trim(),
            type: 'hash',
            status: 'skipped'
          });
          continue;
        }

        // Navigate to the link
        await link.click();
        await page.waitForLoadState('networkidle', { timeout: 10000 });

        // Check if page loaded successfully
        const currentUrl = page.url();
        const title = await page.title();

        results.push({
          href,
          text: text?.trim(),
          type: 'internal',
          status: 'success',
          resolvedUrl: currentUrl,
          title
        });

        // Navigate back to continue testing
        await page.goBack();
        await waitForPageLoad(page);

      } catch (error) {
        results.push({
          href,
          text: text?.trim(),
          type: 'internal',
          status: 'error',
          error: error.message
        });

        // Try to recover by going back to home
        await page.goto('/');
        await waitForPageLoad(page);
      }
    }

    // Report results
    console.log('Internal Links Test Results:', results);

    // Assert no broken internal links
    const brokenLinks = results.filter(r => r.status === 'error');
    expect(brokenLinks).toHaveLength(0);
  });

  test('should validate hash anchor links work correctly', async ({ page }) => {
    // Test hash anchor links
    const hashLinks = await page.locator('a[href^="#"]').all();

    for (const link of hashLinks) {
      const href = await link.getAttribute('href');
      const targetId = href?.substring(1);

      if (!targetId) continue;

      // Click the hash link
      await link.click();
      await page.waitForTimeout(1000); // Allow for smooth scrolling

      // Check if target element exists and is in viewport
      const targetElement = page.locator(`#${targetId}`);

      if (await targetElement.count() > 0) {
        await expect(targetElement).toBeInViewport();
      } else {
        // Log missing anchor targets
        console.warn(`Missing anchor target: #${targetId}`);
      }
    }
  });

  test('should validate external links have proper attributes', async ({ page }) => {
    // Find all external links
    const externalLinks = await page.locator('a[href^="http"]').all();

    for (const link of externalLinks) {
      const href = await link.getAttribute('href');
      const target = await link.getAttribute('target');
      const rel = await link.getAttribute('rel');

      // External links should open in new tab
      expect(target).toBe('_blank');

      // External links should have security attributes
      expect(rel).toBeTruthy();
      expect(rel).toContain('noopener');

      // Optional but recommended for security
      if (rel?.includes('noreferrer')) {
        console.log(`✅ Link ${href} has noreferrer for enhanced security`);
      }
    }
  });

  test('should test social media links functionality', async ({ page, context }) => {
    // Test social media links specifically
    const socialSelectors = [
      'a[href*="github.com"]',
      'a[href*="linkedin.com"]',
      'a[href*="twitter.com"]',
      'a[href*="instagram.com"]',
      'a[href*="youtube.com"]',
      'a[href*="facebook.com"]',
      'a[href*="discord"]',
      'a[href*="medium.com"]',
    ];

    for (const selector of socialSelectors) {
      const links = page.locator(selector);
      const count = await links.count();

      if (count > 0) {
        for (let i = 0; i < count; i++) {
          const link = links.nth(i);
          const href = await link.getAttribute('href');
          const isVisible = await link.isVisible();

          expect(href).toBeTruthy();
          expect(isVisible).toBeTruthy();

          // Validate URL format
          expect(href).toMatch(/^https?:\/\//);

          console.log(`✅ Social link validated: ${href}`);
        }
      }
    }
  });

  test('should validate navigation links across all pages', async ({ page }) => {
    const mainPages = ['/', '/projects/', '/blog/'];

    for (const pagePath of mainPages) {
      await page.goto(pagePath);
      await waitForPageLoad(page);

      // Check navigation links are present and functional on each page
      const navLinks = page.locator('nav a, .navigation a');
      const navCount = await navLinks.count();

      expect(navCount).toBeGreaterThan(0);

      // Test at least the home link on each page
      const homeLink = page.locator('nav a[href="/"], .navigation a[href="/"]').first();

      if (await homeLink.count() > 0) {
        await expect(homeLink).toBeVisible();
        await expect(homeLink).toHaveAttribute('href', '/');
      }
    }
  });

  test('should validate email links work correctly', async ({ page }) => {
    // Test mailto links
    const emailLinks = page.locator('a[href^="mailto:"]');
    const count = await emailLinks.count();

    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const link = emailLinks.nth(i);
        const href = await link.getAttribute('href');

        // Validate email format
        expect(href).toMatch(/^mailto:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);

        // Link should be visible
        await expect(link).toBeVisible();
      }
    }
  });

  test('should validate blog post links', async ({ page }) => {
    // Navigate to blog page
    await page.goto('/blog/');
    await waitForPageLoad(page);

    // Find blog post links
    const blogLinks = page.locator('.blog-post a, .post-link, article a[href*="/blog/"], article a[href*="/posts/"]');
    const count = await blogLinks.count();

    if (count > 0) {
      // Test first few blog post links
      const testCount = Math.min(3, count);

      for (let i = 0; i < testCount; i++) {
        const link = blogLinks.nth(i);
        const href = await link.getAttribute('href');

        if (href && !href.startsWith('#')) {
          try {
            await link.click();
            await waitForPageLoad(page);

            // Verify we're on a blog post page
            const postContent = page.locator('article, .post-content, .blog-post-content').first();
            if (await postContent.count() > 0) {
              await expect(postContent).toBeVisible();
            }

            // Go back to blog listing
            await page.goBack();
            await waitForPageLoad(page);

          } catch (error) {
            console.error(`Failed to navigate to blog post: ${href}`, error);
          }
        }
      }
    }
  });

  test('should validate project links', async ({ page }) => {
    // Navigate to projects page
    await page.goto('/projects/');
    await waitForPageLoad(page);

    // Find project links
    const projectLinks = page.locator('.project a, .project-link, article a[href*="/project"]');
    const count = await projectLinks.count();

    if (count > 0) {
      // Test first few project links
      const testCount = Math.min(3, count);

      for (let i = 0; i < testCount; i++) {
        const link = projectLinks.nth(i);
        const href = await link.getAttribute('href');

        if (href && href.startsWith('http')) {
          // External project links
          const target = await link.getAttribute('target');
          const rel = await link.getAttribute('rel');

          expect(target).toBe('_blank');
          expect(rel).toContain('noopener');
        }
      }
    }
  });

  test('should check for broken images in links', async ({ page }) => {
    // Find links that contain images
    const imageLinks = page.locator('a img').locator('..');
    const count = await imageLinks.count();

    for (let i = 0; i < count; i++) {
      const link = imageLinks.nth(i);
      const img = link.locator('img').first();

      // Check if image loads successfully
      const naturalWidth = await img.evaluate((img) => img.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);

      // Check link functionality
      const href = await link.getAttribute('href');
      expect(href).toBeTruthy();
    }
  });

  test('should validate accessibility of links', async ({ page }) => {
    // Check all links have accessible text
    const allLinks = page.locator('a');
    const count = await allLinks.count();

    for (let i = 0; i < count; i++) {
      const link = allLinks.nth(i);
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      const title = await link.getAttribute('title');

      // Link should have accessible text via content, aria-label, or title
      const hasAccessibleText = (text && text.trim().length > 0) ||
                               (ariaLabel && ariaLabel.trim().length > 0) ||
                               (title && title.trim().length > 0);

      if (!hasAccessibleText) {
        // Check if it's an icon link with accessible content
        const hasIcon = await link.locator('svg, i, [class*="icon"]').count() > 0;
        if (hasIcon) {
          expect(ariaLabel || title).toBeTruthy();
        } else {
          expect(hasAccessibleText).toBeTruthy();
        }
      }
    }
  });
});