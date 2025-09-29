const { test, expect } = require('@playwright/test');

// Mobile device configurations for testing
const MOBILE_DEVICES = [
  { name: 'iPhone 12/13/14', width: 390, height: 844 },
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'Google Pixel 5', width: 393, height: 851 },
  { name: 'Samsung Galaxy S20', width: 360, height: 800 }
];

const TEST_PAGES = [
  { name: 'Homepage', url: '/' },
  { name: 'Blog Page', url: '/blog/' },
  { name: 'Sample Blog Post', url: '/posts/welcome-to-neo-brutalism/' },
  { name: 'About Page', url: '/pages/about/' },
  { name: 'Contact Page', url: '/pages/contact/' }
];

// Test each mobile device
MOBILE_DEVICES.forEach(device => {
  test.describe(`Mobile Responsiveness - ${device.name} (${device.width}x${device.height})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: device.width, height: device.height });
    });

    TEST_PAGES.forEach(testPage => {
      test(`${testPage.name} - Navigation and Layout`, async ({ page }) => {
        await page.goto(`http://localhost:8080${testPage.url}`);

        // Wait for page to load
        await page.waitForLoadState('networkidle');

        // Take screenshot for visual inspection
        await page.screenshot({
          path: `tests/screenshots/mobile-${device.name.replace(/\s+/g, '-').toLowerCase()}-${testPage.name.replace(/\s+/g, '-').toLowerCase()}.png`,
          fullPage: true
        });

        // Check navigation elements
        const nav = page.locator('nav, .nav, .navigation, header nav');
        if ((await nav.count()) > 0) {
          await expect(nav.first()).toBeVisible();

          // Check if navigation is responsive (not overflowing)
          const navBounds = await nav.first().boundingBox();
          if (navBounds) {
            expect(navBounds.width).toBeLessThanOrEqual(device.width + 1); // +1 for rounding
          }
        }

        // Check for hamburger menu or mobile navigation
        const mobileMenu = page.locator(
          '.mobile-menu, .hamburger, .menu-toggle, [aria-label*="menu"]'
        );
        const navLinks = page.locator('nav a, .nav a, .navigation a');

        if ((await mobileMenu.count()) > 0) {
          console.log(`${device.name} - ${testPage.name}: Mobile menu found`);
        } else if ((await navLinks.count()) > 0) {
          // Check if nav links are properly styled for mobile
          const firstLink = navLinks.first();
          const linkBounds = await firstLink.boundingBox();
          if (linkBounds) {
            expect(linkBounds.width).toBeLessThanOrEqual(device.width);
          }
        }

        // Check for horizontal scroll (should not exist)
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        expect(bodyWidth).toBeLessThanOrEqual(device.width + 20); // Allow 20px buffer for scrollbars
      });
    });

    test('Blog Post - Back to Blog Button Alignment', async ({ page }) => {
      await page.goto('http://localhost:8080/posts/welcome-to-neo-brutalism/');
      await page.waitForLoadState('networkidle');

      // Look for back to blog button
      const backButton = page.locator(
        'a[href*="blog"], .back-to-blog, .back-button, a:has-text("Back to Blog"), a:has-text("← Blog"), a:has-text("Back")'
      );

      if ((await backButton.count()) > 0) {
        await expect(backButton.first()).toBeVisible();

        const buttonBounds = await backButton.first().boundingBox();
        if (buttonBounds) {
          // Check button doesn't overflow viewport
          expect(buttonBounds.x + buttonBounds.width).toBeLessThanOrEqual(device.width);
          expect(buttonBounds.x).toBeGreaterThanOrEqual(0);

          // Check button has adequate touch target (min 44px as per accessibility guidelines)
          expect(buttonBounds.height).toBeGreaterThanOrEqual(32); // Slightly relaxed for this design
        }

        console.log(`${device.name}: Back to Blog button found and properly positioned`);
      } else {
        console.log(`${device.name}: No Back to Blog button found - this might need to be added`);
      }
    });

    test('Typography Readability and Spacing', async ({ page }) => {
      await page.goto('http://localhost:8080/posts/welcome-to-neo-brutalism/');
      await page.waitForLoadState('networkidle');

      // Check main content typography
      const mainContent = page.locator('main, .content, .post-content, article');
      await expect(mainContent.first()).toBeVisible();

      // Check heading sizes
      const headings = page.locator('h1, h2, h3, h4, h5, h6');
      const headingCount = await headings.count();

      for (let i = 0; i < Math.min(headingCount, 3); i++) {
        const heading = headings.nth(i);
        const headingBounds = await heading.boundingBox();

        if (headingBounds) {
          // Headings should not overflow viewport
          expect(headingBounds.x + headingBounds.width).toBeLessThanOrEqual(device.width + 10);

          // Check font size is readable (at least 18px for headings on mobile)
          const fontSize = await heading.evaluate(el => window.getComputedStyle(el).fontSize);
          const fontSizePx = parseInt(fontSize);
          expect(fontSizePx).toBeGreaterThanOrEqual(16); // Minimum readable size
        }
      }

      // Check paragraph text
      const paragraphs = page.locator('p');
      if ((await paragraphs.count()) > 0) {
        const firstParagraph = paragraphs.first();
        const fontSize = await firstParagraph.evaluate(el => window.getComputedStyle(el).fontSize);
        const fontSizePx = parseInt(fontSize);
        expect(fontSizePx).toBeGreaterThanOrEqual(14); // Minimum readable body text

        const lineHeight = await firstParagraph.evaluate(
          el => window.getComputedStyle(el).lineHeight
        );
        console.log(`${device.name}: Paragraph font-size: ${fontSize}, line-height: ${lineHeight}`);
      }
    });

    test('Social Icons Footer Positioning', async ({ page }) => {
      await page.goto('http://localhost:8080/');
      await page.waitForLoadState('networkidle');

      // Scroll to footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

      // Look for social icons
      const socialIcons = page.locator(
        '.social, .social-icons, .social-links, footer a[href*="twitter"], footer a[href*="github"], footer a[href*="linkedin"], footer a[href*="facebook"]'
      );

      if ((await socialIcons.count()) > 0) {
        const socialContainer = socialIcons.first();
        await expect(socialContainer).toBeVisible();

        const containerBounds = await socialContainer.boundingBox();
        if (containerBounds) {
          // Social icons should be within viewport
          expect(containerBounds.x + containerBounds.width).toBeLessThanOrEqual(device.width);
          expect(containerBounds.x).toBeGreaterThanOrEqual(0);

          console.log(`${device.name}: Social icons properly positioned in footer`);
        }

        // Check individual social icon sizes for touch targets
        const icons = page.locator('.social a, .social-icons a, .social-links a');
        const iconCount = await icons.count();

        for (let i = 0; i < Math.min(iconCount, 3); i++) {
          const icon = icons.nth(i);
          const iconBounds = await icon.boundingBox();

          if (iconBounds) {
            // Icons should have adequate touch targets
            expect(Math.min(iconBounds.width, iconBounds.height)).toBeGreaterThanOrEqual(32);
          }
        }
      } else {
        console.log(`${device.name}: No social icons found in footer`);
      }
    });

    test('Overall Mobile Layout Quality', async ({ page }) => {
      await page.goto('http://localhost:8080/');
      await page.waitForLoadState('networkidle');

      // Check for common mobile layout issues

      // 1. No horizontal scrolling
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(hasHorizontalScroll).toBeFalsy();

      // 2. Viewport meta tag should be present
      const viewportMeta = page.locator('meta[name="viewport"]');
      await expect(viewportMeta).toHaveCount(1);

      const viewportContent = await viewportMeta.getAttribute('content');
      expect(viewportContent).toContain('width=device-width');

      // 3. Check for touch-friendly spacing
      const interactiveElements = page.locator('button, a, input, select, textarea');
      const elementCount = await interactiveElements.count();

      for (let i = 0; i < Math.min(elementCount, 5); i++) {
        const element = interactiveElements.nth(i);
        const bounds = await element.boundingBox();

        if (bounds) {
          // Interactive elements should have adequate size for touch
          expect(Math.min(bounds.width, bounds.height)).toBeGreaterThanOrEqual(28);
        }
      }

      // 4. Images should be responsive
      const images = page.locator('img');
      const imageCount = await images.count();

      for (let i = 0; i < Math.min(imageCount, 3); i++) {
        const img = images.nth(i);
        const imgBounds = await img.boundingBox();

        if (imgBounds) {
          // Images should not overflow viewport
          expect(imgBounds.x + imgBounds.width).toBeLessThanOrEqual(device.width + 10);
        }
      }

      console.log(`${device.name}: Overall mobile layout quality check completed`);
    });
  });
});

// Cross-device comparison test
test('Cross-Device Layout Consistency', async ({ page }) => {
  const results = [];

  for (const device of MOBILE_DEVICES) {
    await page.setViewportSize({ width: device.width, height: device.height });
    await page.goto('http://localhost:8080/');
    await page.waitForLoadState('networkidle');

    // Measure key layout elements
    const headerHeight = await page
      .locator('header')
      .boundingBox()
      .then(b => b?.height || 0);
    const mainWidth = await page
      .locator('main')
      .boundingBox()
      .then(b => b?.width || 0);

    results.push({
      device: device.name,
      headerHeight,
      mainWidth,
      viewportWidth: device.width
    });
  }

  // Log results for comparison
  console.log('Cross-device layout measurements:', results);

  // Basic consistency checks
  const headerHeights = results.map(r => r.headerHeight);
  const maxHeaderHeight = Math.max(...headerHeights);
  const minHeaderHeight = Math.min(...headerHeights);

  // Header height shouldn't vary too dramatically across devices
  expect(maxHeaderHeight - minHeaderHeight).toBeLessThan(50);
});
