const { test, expect } = require('@playwright/test');

test.describe('Mobile Blog Navigation', () => {
  const blogPosts = [
    '/blog/getting-started-with-11ty/',
    '/blog/neo-brutalist-design-principles/',
    '/blog/building-fast-static-sites/',
    '/blog/markdown-and-nunjucks/',
    '/blog/responsive-typography/',
    '/blog/performance-optimization/',
    '/blog/seo-best-practices/'
  ];

  test.beforeEach(async ({ page }) => {
    // Set mobile viewport for consistent testing
    await page.setViewportSize({ width: 390, height: 844 });
  });

  for (const blogPost of blogPosts) {
    test(`Blog navigation on ${blogPost}`, async ({ page }) => {
      await page.goto(blogPost);

      // Check if "Back to Blog" navigation exists
      const backToBlogNav = page.locator('.back-to-blog');
      await expect(backToBlogNav).toBeVisible();

      // Verify navigation bar styling
      const navStyles = await backToBlogNav.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          position: styles.position,
          top: styles.top,
          backgroundColor: styles.backgroundColor,
          zIndex: styles.zIndex,
          width: styles.width
        };
      });

      expect(navStyles.position).toBe('fixed');
      expect(navStyles.top).toBe('0px');
      expect(navStyles.width).toBe('100%');

      // Check proper spacing for title (80px margin-top)
      const articleTitle = page.locator('article h1, .article-title h1');
      if (await articleTitle.count() > 0) {
        const titleStyles = await articleTitle.first().evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return {
            marginTop: styles.marginTop
          };
        });

        // Allow for some flexibility in margin calculation (px vs rem)
        const marginTopValue = parseInt(titleStyles.marginTop);
        expect(marginTopValue).toBeGreaterThanOrEqual(70); // Allow for slight variations
      }

      // Test navigation bar doesn't overlap content
      const contentElement = page.locator('main, article, .content');
      if (await contentElement.count() > 0) {
        const contentBox = await contentElement.first().boundingBox();
        const navBox = await backToBlogNav.boundingBox();

        if (contentBox && navBox) {
          // Content should start below navigation
          expect(contentBox.y).toBeGreaterThan(navBox.y + navBox.height - 10); // 10px tolerance
        }
      }

      // Test button functionality
      const backButton = page.locator('.back-to-blog a, .back-to-blog button');
      await expect(backButton).toBeVisible();
      await expect(backButton).toHaveAttribute('href', '/blog/');

      // Test hover state (if applicable)
      await backButton.hover();

      // Verify no horizontal scrolling
      const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const windowInnerWidth = await page.evaluate(() => window.innerWidth);
      expect(bodyScrollWidth).toBeLessThanOrEqual(windowInnerWidth + 1); // 1px tolerance
    });
  }

  test('Back to Blog navigation functionality', async ({ page }) => {
    await page.goto('/blog/getting-started-with-11ty/');

    // Click back to blog button
    const backButton = page.locator('.back-to-blog a');
    await backButton.click();

    // Should navigate to blog listing
    await expect(page).toHaveURL('/blog/');

    // Verify blog listing page loads correctly
    await expect(page.locator('h1')).toContainText(['Blog', 'Posts', 'Articles']);
  });

  test('Mobile navigation bar responsive behavior', async ({ page }) => {
    // Test on various mobile widths
    const viewports = [
      { width: 320, height: 568 }, // iPhone 5
      { width: 360, height: 640 }, // Common small mobile
      { width: 390, height: 844 }, // iPhone 12/13
      { width: 430, height: 932 }  // iPhone 14 Pro Max
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/blog/neo-brutalist-design-principles/');

      const backToBlogNav = page.locator('.back-to-blog');
      await expect(backToBlogNav).toBeVisible();

      // Navigation should take full width
      const navBox = await backToBlogNav.boundingBox();
      expect(navBox.width).toBeGreaterThanOrEqual(viewport.width - 2); // Account for borders

      // No horizontal scroll at any width
      const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyScrollWidth).toBeLessThanOrEqual(viewport.width + 1);
    }
  });

  test('Navigation accessibility', async ({ page }) => {
    await page.goto('/blog/getting-started-with-11ty/');

    const backButton = page.locator('.back-to-blog a');

    // Check for proper ARIA attributes
    const ariaLabel = await backButton.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();

    // Check keyboard navigation
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');

    // Should be able to activate with Enter or Space
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL('/blog/');
  });
});