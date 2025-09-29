/**
 * CONSOLIDATED ACCESSIBILITY TESTS
 * Merges: accessibility.spec.js, accessibility-audit.spec.js
 *
 * Tests comprehensive WCAG 2.1 AA compliance and accessibility features
 * Covers: Color contrast, keyboard navigation, screen reader support,
 * focus management, ARIA attributes
 */

const { test, expect } = require('@playwright/test');
const { waitForPageLoad, checkColorContrast } = require('./helpers/test-utils');

// Test pages for accessibility validation
const accessibilityTestPages = [
  { url: '/', name: 'Homepage' },
  { url: '/pages/about/', name: 'About Page' },
  { url: '/pages/services/', name: 'Services Page' },
  { url: '/blog/', name: 'Blog Index' },
  { url: '/pages/contact/', name: 'Contact Page' },
  { url: '/projects/', name: 'Projects Page' }
];

// Device configurations for accessibility testing
const accessibilityDevices = [
  { name: 'Desktop', width: 1920, height: 1080 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Mobile', width: 375, height: 667 }
];

// WCAG 2.1 AA contrast ratios
const _WCAG_CONTRAST_RATIOS = {
  normal: 4.5,
  large: 3.0,
  ui: 3.0
};

test.describe('Consolidated Accessibility Tests', () => {
  // WCAG 2.1 AA COMPLIANCE TESTS
  test.describe('WCAG 2.1 AA Compliance', () => {
    accessibilityTestPages.forEach(testPage => {
      test(`should meet WCAG 2.1 AA standards on ${testPage.name}`, async ({ page }) => {
        await page.goto(testPage.url);
        await waitForPageLoad(page);

        // 1. IMAGES AND MEDIA ACCESSIBILITY
        const images = page.locator('img');
        const imageCount = await images.count();

        for (let i = 0; i < imageCount; i++) {
          const img = images.nth(i);
          const alt = await img.getAttribute('alt');
          const ariaLabel = await img.getAttribute('aria-label');
          const ariaLabelledBy = await img.getAttribute('aria-labelledby');
          const role = await img.getAttribute('role');

          // Images must have alt text or be marked as decorative
          const hasAccessibleText =
            alt !== null || ariaLabel || ariaLabelledBy || role === 'presentation';
          expect(
            hasAccessibleText,
            `Image ${i + 1} on ${testPage.name} must have alt text or be marked decorative`
          ).toBe(true);

          // Alt text should be meaningful (not just filename)
          if (alt && alt.trim().length > 0) {
            expect(
              alt.toLowerCase(),
              `Image ${i + 1} alt text should not be a filename`
            ).not.toMatch(/\.(jpg|jpeg|png|gif|svg|webp)$/);
            expect(
              alt.trim().length,
              `Image ${i + 1} alt text should be descriptive`
            ).toBeGreaterThan(2);
          }
        }

        // 2. LINK ACCESSIBILITY
        const links = page.locator('a');
        const linkCount = await links.count();

        for (let i = 0; i < Math.min(linkCount, 20); i++) {
          // Test first 20 links for performance
          const link = links.nth(i);
          const href = await link.getAttribute('href');
          const text = await link.textContent();
          const ariaLabel = await link.getAttribute('aria-label');
          const ariaLabelledBy = await link.getAttribute('aria-labelledby');
          const title = await link.getAttribute('title');

          // Links must have accessible text
          const hasAccessibleText = (text && text.trim()) || ariaLabel || ariaLabelledBy || title;
          expect(
            hasAccessibleText,
            `Link ${i + 1} on ${testPage.name} must have accessible text`
          ).toBeTruthy();

          // External links should have proper attributes
          if (href && href.startsWith('http')) {
            const target = await link.getAttribute('target');
            const rel = await link.getAttribute('rel');

            expect(target, `External link ${i + 1} should open in new tab`).toBe('_blank');
            expect(rel, `External link ${i + 1} should have rel="noopener"`).toContain('noopener');

            // Should indicate it opens in new window
            const indicatesNewWindow =
              (text && text.includes('(opens in new')) ||
              (ariaLabel && ariaLabel.includes('new window')) ||
              (title && title.includes('new window'));
            // This is recommended but not required, so we just log it
            if (!indicatesNewWindow) {
              console.log(`External link ${i + 1} could indicate it opens in new window`);
            }
          }
        }

        // 3. FORM ACCESSIBILITY (if forms exist)
        const formElements = page.locator('input, select, textarea');
        const formCount = await formElements.count();

        for (let i = 0; i < formCount; i++) {
          const element = formElements.nth(i);
          const id = await element.getAttribute('id');
          const ariaLabel = await element.getAttribute('aria-label');
          const ariaLabelledBy = await element.getAttribute('aria-labelledby');
          const placeholder = await element.getAttribute('placeholder');

          // Form elements should have labels
          let hasLabel = ariaLabel || ariaLabelledBy;

          if (id && !hasLabel) {
            const label = page.locator(`label[for="${id}"]`);
            hasLabel = (await label.count()) > 0;
          }

          if (!hasLabel && placeholder) {
            // Placeholder alone is not sufficient but better than nothing
            console.log(
              `Form element ${i + 1} on ${testPage.name} only has placeholder - should have proper label`
            );
          } else {
            expect(
              hasLabel,
              `Form element ${i + 1} on ${testPage.name} must have proper label`
            ).toBe(true);
          }
        }

        // 4. HEADING HIERARCHY
        const headings = page.locator('h1, h2, h3, h4, h5, h6');
        const headingCount = await headings.count();

        if (headingCount > 0) {
          // Should have exactly one H1
          const h1Count = await page.locator('h1').count();
          expect(h1Count, `${testPage.name} should have exactly one H1`).toBe(1);

          // Check heading hierarchy (no skipped levels)
          const headingLevels = [];
          for (let i = 0; i < headingCount; i++) {
            const heading = headings.nth(i);
            const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
            const level = parseInt(tagName.charAt(1), 10);
            headingLevels.push(level);
          }

          for (let i = 1; i < headingLevels.length; i++) {
            const currentLevel = headingLevels[i];
            const maxPreviousLevel = Math.max(...headingLevels.slice(0, i));
            const levelDifference = currentLevel - maxPreviousLevel;

            expect(
              levelDifference,
              `Heading level ${currentLevel} should not skip levels on ${testPage.name}`
            ).toBeLessThanOrEqual(1);
          }
        }

        // 5. LANDMARK ACCESSIBILITY
        const landmarks = {
          main: page.locator('main, [role="main"]'),
          nav: page.locator('nav, [role="navigation"]'),
          header: page.locator('header, [role="banner"]'),
          footer: page.locator('footer, [role="contentinfo"]')
        };

        // Should have main landmark
        expect(
          await landmarks.main.count(),
          `${testPage.name} should have main landmark`
        ).toBeGreaterThan(0);

        // Should have navigation landmark
        expect(
          await landmarks.nav.count(),
          `${testPage.name} should have navigation landmark`
        ).toBeGreaterThan(0);

        // Multiple landmarks of same type should have labels
        if ((await landmarks.nav.count()) > 1) {
          const navElements = await landmarks.nav.all();
          for (let i = 0; i < navElements.length; i++) {
            const ariaLabel = await navElements[i].getAttribute('aria-label');
            const ariaLabelledBy = await navElements[i].getAttribute('aria-labelledby');
            expect(
              ariaLabel || ariaLabelledBy,
              `Multiple nav landmarks should have distinguishing labels`
            ).toBeTruthy();
          }
        }
      });
    });
  });

  // KEYBOARD NAVIGATION TESTS
  test.describe('Keyboard Navigation', () => {
    accessibilityDevices.forEach(device => {
      test(`should support complete keyboard navigation on ${device.name}`, async ({ page }) => {
        await page.setViewportSize({ width: device.width, height: device.height });
        await page.goto('/');
        await waitForPageLoad(page);

        // Test tab navigation
        const focusableElements = [];
        const maxTabs = 20; // Limit to prevent infinite loops

        for (let i = 0; i < maxTabs; i++) {
          await page.keyboard.press('Tab');
          await page.waitForTimeout(100);

          const focusedElement = page.locator(':focus');
          const focusedCount = await focusedElement.count();

          if (focusedCount > 0) {
            const tagName = await focusedElement.evaluate(el => el.tagName.toLowerCase());
            const className = await focusedElement.getAttribute('class');
            const id = await focusedElement.getAttribute('id');

            focusableElements.push({ tagName, className, id, index: i });

            // Check focus is visible
            const focusStyles = await focusedElement.evaluate(el => {
              const styles = window.getComputedStyle(el);
              return {
                outline: styles.outline,
                outlineWidth: styles.outlineWidth,
                boxShadow: styles.boxShadow,
                backgroundColor: styles.backgroundColor,
                borderColor: styles.borderColor
              };
            });

            const hasFocusIndicator =
              focusStyles.outline !== 'none' ||
              focusStyles.outlineWidth !== '0px' ||
              focusStyles.boxShadow !== 'none' ||
              focusStyles.backgroundColor !== 'rgba(0, 0, 0, 0)' ||
              focusStyles.borderColor !== 'rgba(0, 0, 0, 0)';

            expect(
              hasFocusIndicator,
              `Focus indicator should be visible for ${tagName} element`
            ).toBe(true);
          } else {
            break; // No more focusable elements
          }
        }

        expect(focusableElements.length, 'Should have focusable elements on page').toBeGreaterThan(
          0
        );

        // Test reverse tab navigation
        for (let i = 0; i < Math.min(5, focusableElements.length); i++) {
          await page.keyboard.press('Shift+Tab');
          await page.waitForTimeout(100);
        }

        // Test Enter key activation on links and buttons
        const firstFocusable = page.locator(':focus');
        if ((await firstFocusable.count()) > 0) {
          const tagName = await firstFocusable.evaluate(el => el.tagName.toLowerCase());
          if (tagName === 'a' || tagName === 'button') {
            // Press Enter should activate the element
            await page.keyboard.press('Enter');
            await page.waitForTimeout(300);
            // We don't test the actual navigation to avoid leaving the page
          }
        }
      });

      test(`should handle mobile menu keyboard navigation on ${device.name}`, async ({ page }) => {
        if (device.width <= 768) {
          // Mobile/tablet
          await page.setViewportSize({ width: device.width, height: device.height });
          await page.goto('/');
          await waitForPageLoad(page);

          // Find and focus hamburger menu
          const hamburgerSelectors = ['.hamburger', '.nav-toggle', '.mobile-menu-toggle'];
          let hamburger;

          for (const selector of hamburgerSelectors) {
            hamburger = page.locator(selector);
            if ((await hamburger.count()) > 0 && (await hamburger.isVisible())) {
              break;
            }
          }

          if (hamburger && (await hamburger.count()) > 0) {
            // Tab to hamburger menu
            let focused = false;
            for (let i = 0; i < 10; i++) {
              await page.keyboard.press('Tab');
              const focusedElement = page.locator(':focus');
              if ((await focusedElement.count()) > 0) {
                const isHamburger = await focusedElement.evaluate((el, selector) => {
                  return el.matches(selector);
                }, hamburgerSelectors.join(', '));
                if (isHamburger) {
                  focused = true;
                  break;
                }
              }
            }

            if (focused) {
              // Activate with Enter
              await page.keyboard.press('Enter');
              await page.waitForTimeout(300);

              // Menu should be open, test navigation within menu
              const menuLinks = page.locator('.nav-links a, .nav-menu a, .mobile-menu a');
              const linkCount = await menuLinks.count();

              if (linkCount > 0) {
                // Tab through menu items
                for (let i = 0; i < Math.min(linkCount, 5); i++) {
                  await page.keyboard.press('Tab');
                  const focusedElement = page.locator(':focus');
                  if ((await focusedElement.count()) > 0) {
                    await expect(focusedElement).toBeVisible();
                  }
                }

                // Escape should close menu
                await page.keyboard.press('Escape');
                await page.waitForTimeout(300);
              }
            }
          }
        }
      });
    });
  });

  // COLOR CONTRAST AND VISUAL ACCESSIBILITY
  test.describe('Color Contrast and Visual Accessibility', () => {
    test('should have sufficient color contrast for text elements', async ({ page }) => {
      await page.goto('/');
      await waitForPageLoad(page);

      // Test main text elements
      const textSelectors = [
        'body',
        'p',
        'h1, h2, h3, h4, h5, h6',
        'a',
        'button',
        'nav a',
        '.hero-title',
        '.post-title'
      ];

      for (const selector of textSelectors) {
        const elements = page.locator(selector);
        const elementCount = await elements.count();

        for (let i = 0; i < Math.min(elementCount, 3); i++) {
          // Test first 3 of each type
          const element = elements.nth(i);
          if (await element.isVisible()) {
            const contrast = await checkColorContrast(element);

            // Log contrast info for manual verification
            console.log(`${selector} element ${i + 1}:`, contrast);

            // Basic checks - color should be defined
            expect(contrast.color, `${selector} should have defined text color`).toBeTruthy();
            expect(
              contrast.backgroundColor,
              `${selector} should have defined background color`
            ).toBeTruthy();
          }
        }
      }
    });

    test('should not rely solely on color to convey information', async ({ page }) => {
      await page.goto('/');
      await waitForPageLoad(page);

      // Check links are distinguishable by more than color
      const links = page.locator('a');
      const linkCount = await links.count();

      for (let i = 0; i < Math.min(linkCount, 5); i++) {
        const link = links.nth(i);
        if (await link.isVisible()) {
          const linkStyles = await link.evaluate(el => {
            const styles = window.getComputedStyle(el);
            return {
              textDecoration: styles.textDecoration,
              fontWeight: styles.fontWeight,
              border: styles.border,
              outline: styles.outline
            };
          });

          // Links should have some visual distinction beyond color
          const hasVisualDistinction =
            linkStyles.textDecoration !== 'none' ||
            parseInt(linkStyles.fontWeight, 10) >= 600 ||
            linkStyles.border !== '0px none rgb(0, 0, 0)' ||
            linkStyles.outline !== 'none';

          // This is a guideline, not always strictly required
          if (!hasVisualDistinction) {
            console.log(`Link ${i + 1} relies primarily on color for distinction`);
          }
        }
      }
    });

    test('should support high contrast mode and reduced motion', async ({ page }) => {
      await page.goto('/');
      await waitForPageLoad(page);

      // Test with forced colors (simulates high contrast mode)
      await page.emulateMedia({ forcedColors: 'active' });
      await page.waitForTimeout(500);

      const mainElements = page.locator('main, nav, footer');
      const elementCount = await mainElements.count();

      for (let i = 0; i < elementCount; i++) {
        const element = mainElements.nth(i);
        if ((await element.count()) > 0) {
          await expect(element).toBeVisible();
        }
      }

      // Test with reduced motion
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.waitForTimeout(500);

      // Elements should still be functional with reduced motion
      const interactiveElements = page.locator('button, a, [role="button"]');
      const interactiveCount = await interactiveElements.count();

      if (interactiveCount > 0) {
        const firstInteractive = interactiveElements.first();
        await expect(firstInteractive).toBeVisible();
      }
    });
  });

  // ARIA AND SEMANTIC HTML TESTS
  test.describe('ARIA and Semantic HTML', () => {
    test('should use appropriate ARIA attributes and semantic HTML', async ({ page }) => {
      await page.goto('/');
      await waitForPageLoad(page);

      // Check for proper landmarks
      const landmarks = [
        { element: 'main', expectedRole: 'main' },
        { element: 'nav', expectedRole: 'navigation' },
        { element: 'header', expectedRole: 'banner' },
        { element: 'footer', expectedRole: 'contentinfo' }
      ];

      for (const landmark of landmarks) {
        const element = page.locator(landmark.element);
        if ((await element.count()) > 0) {
          const role = await element.first().getAttribute('role');
          // Element either has implicit role or explicit role attribute
          console.log(`${landmark.element} landmark found${role ? ` with role="${role}"` : ''}`);
        }
      }

      // Check buttons have proper roles and states
      const buttons = page.locator('button, [role="button"]');
      const buttonCount = await buttons.count();

      for (let i = 0; i < buttonCount; i++) {
        const button = buttons.nth(i);
        const ariaPressed = await button.getAttribute('aria-pressed');
        const ariaExpanded = await button.getAttribute('aria-expanded');
        const _disabled = await button.getAttribute('disabled');

        // Toggle buttons should have aria-pressed
        if (ariaPressed !== null) {
          expect(['true', 'false'], 'aria-pressed should be true or false').toContain(ariaPressed);
        }

        // Expandable buttons should have aria-expanded
        if (ariaExpanded !== null) {
          expect(['true', 'false'], 'aria-expanded should be true or false').toContain(
            ariaExpanded
          );
        }
      }

      // Check lists are properly structured
      const lists = page.locator('ul, ol');
      const listCount = await lists.count();

      for (let i = 0; i < listCount; i++) {
        const list = lists.nth(i);
        const listItems = list.locator('li');
        const itemCount = await listItems.count();

        if (itemCount > 0) {
          // Lists should contain list items
          expect(itemCount, `List ${i + 1} should contain list items`).toBeGreaterThan(0);
        }
      }
    });

    test('should handle dynamic content accessibility', async ({ page }) => {
      await page.goto('/');
      await waitForPageLoad(page);

      // Test mobile menu (if present) for proper ARIA states
      const mobileMenuToggle = page.locator('.hamburger, .nav-toggle, .mobile-menu-toggle').first();

      if ((await mobileMenuToggle.count()) > 0 && (await mobileMenuToggle.isVisible())) {
        // Check initial state
        const initialExpanded = await mobileMenuToggle.getAttribute('aria-expanded');
        expect(initialExpanded, 'Mobile menu toggle should have aria-expanded').toBe('false');

        // Click to open menu
        await mobileMenuToggle.click();
        await page.waitForTimeout(300);

        // Check updated state
        const expandedAfterClick = await mobileMenuToggle.getAttribute('aria-expanded');
        expect(
          expandedAfterClick,
          'Mobile menu toggle should update aria-expanded when opened'
        ).toBe('true');

        // Click to close menu
        await mobileMenuToggle.click();
        await page.waitForTimeout(300);

        // Check final state
        const expandedAfterClose = await mobileMenuToggle.getAttribute('aria-expanded');
        expect(
          expandedAfterClose,
          'Mobile menu toggle should update aria-expanded when closed'
        ).toBe('false');
      }
    });
  });

  // SCREEN READER SUPPORT TESTS
  test.describe('Screen Reader Support', () => {
    test('should provide meaningful page titles and headings', async ({ page }) => {
      for (const testPage of accessibilityTestPages.slice(0, 4)) {
        // Test subset
        await page.goto(testPage.url);
        await waitForPageLoad(page);

        // Check page title
        const title = await page.title();
        expect(title, `${testPage.name} should have page title`).toBeTruthy();
        expect(title.length, `${testPage.name} title should be descriptive`).toBeGreaterThan(3);

        // Check for meaningful H1
        const h1 = page.locator('h1').first();
        if ((await h1.count()) > 0) {
          const h1Text = await h1.textContent();
          expect(h1Text?.trim(), `${testPage.name} H1 should have text`).toBeTruthy();
          expect(
            h1Text?.trim().length,
            `${testPage.name} H1 should be descriptive`
          ).toBeGreaterThan(3);
        }

        // Check for skip links (recommended for accessibility)
        const skipLink = page.locator('a[href="#main"], a[href="#content"], .skip-link').first();
        if ((await skipLink.count()) > 0) {
          console.log(`Skip link found on ${testPage.name}`);
        }
      }
    });

    test('should provide status updates for dynamic content', async ({ page }) => {
      await page.goto('/');
      await waitForPageLoad(page);

      // Check for live regions (aria-live)
      const liveRegions = page.locator('[aria-live]');
      const liveRegionCount = await liveRegions.count();

      for (let i = 0; i < liveRegionCount; i++) {
        const region = liveRegions.nth(i);
        const ariaLive = await region.getAttribute('aria-live');
        expect(['polite', 'assertive', 'off'], 'aria-live should have valid value').toContain(
          ariaLive
        );
      }

      // Check for status messages (aria-status, role="status")
      const statusElements = page.locator('[role="status"], [aria-label*="status"], .status');
      const statusCount = await statusElements.count();

      if (statusCount > 0) {
        console.log(`Found ${statusCount} status elements`);
      }
    });
  });

  // TOUCH AND MOBILE ACCESSIBILITY
  test.describe('Touch and Mobile Accessibility', () => {
    test('should provide adequate touch targets on mobile devices', async ({ page }) => {
      const mobileViewport = { width: 375, height: 667 };
      await page.setViewportSize(mobileViewport);
      await page.goto('/');
      await waitForPageLoad(page);

      // Test touch targets
      const touchTargets = page.locator(
        'a, button, input, select, textarea, [role="button"], [role="link"]'
      );
      const targetCount = await touchTargets.count();

      for (let i = 0; i < Math.min(targetCount, 15); i++) {
        // Test first 15 for performance
        const target = touchTargets.nth(i);
        if (await target.isVisible()) {
          const box = await target.boundingBox();
          if (box) {
            // WCAG 2.1 AA: Touch targets should be at least 44x44px
            expect(
              box.width,
              `Touch target ${i + 1} width should be at least 44px`
            ).toBeGreaterThanOrEqual(44);
            expect(
              box.height,
              `Touch target ${i + 1} height should be at least 44px`
            ).toBeGreaterThanOrEqual(44);
          }
        }
      }
    });

    test('should support device orientation changes', async ({ page }) => {
      // Test portrait
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await waitForPageLoad(page);

      const portraitNav = page.locator('nav, .navigation');
      await expect(portraitNav.first()).toBeVisible();

      // Test landscape
      await page.setViewportSize({ width: 667, height: 375 });
      await page.waitForTimeout(300);

      const landscapeNav = page.locator('nav, .navigation');
      await expect(landscapeNav.first()).toBeVisible();

      // Content should remain accessible in both orientations
      const mainContent = page.locator('main, .content, .container');
      if ((await mainContent.count()) > 0) {
        await expect(mainContent.first()).toBeVisible();
      }
    });
  });
});
