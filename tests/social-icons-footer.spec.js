const { test, expect } = require('@playwright/test');

test.describe('Social Icons Footer', () => {
  const testPages = [
    '/',
    '/about/',
    '/services/',
    '/blog/',
    '/blog/getting-started-with-11ty/',
    '/projects/project-alpha/',
    '/contact/'
  ];

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 }); // Mobile-first testing
  });

  test('Social icons touch targets on mobile', async ({ page }) => {
    for (const pageUrl of testPages) {
      await page.goto(pageUrl);

      const socialIcons = page.locator('.social-icons a, .footer .social a, footer [class*="social"] a');
      const iconCount = await socialIcons.count();

      if (iconCount > 0) {
        for (let i = 0; i < iconCount; i++) {
          const icon = socialIcons.nth(i);
          const box = await icon.boundingBox();

          if (box) {
            // Touch targets should be 48x48px minimum for accessibility
            expect(box.width, `Social icon ${i + 1} width on ${pageUrl}`).toBeGreaterThanOrEqual(44); // Allow small tolerance
            expect(box.height, `Social icon ${i + 1} height on ${pageUrl}`).toBeGreaterThanOrEqual(44);
          }

          // Check computed styles for exact size
          const iconStyles = await icon.evaluate((el) => {
            const styles = window.getComputedStyle(el);
            return {
              width: parseFloat(styles.width),
              height: parseFloat(styles.height),
              minWidth: parseFloat(styles.minWidth),
              minHeight: parseFloat(styles.minHeight),
              padding: styles.padding
            };
          });

          // Icons should be close to 48px target
          const expectedSize = 48;
          const tolerance = 8; // Allow some flexibility

          expect(iconStyles.width, `Icon ${i + 1} computed width on ${pageUrl}`).toBeGreaterThanOrEqual(expectedSize - tolerance);
          expect(iconStyles.height, `Icon ${i + 1} computed height on ${pageUrl}`).toBeGreaterThanOrEqual(expectedSize - tolerance);
        }
      }
    }
  });

  test('Social icons spacing and alignment', async ({ page }) => {
    for (const pageUrl of testPages) {
      await page.goto(pageUrl);

      const socialContainer = page.locator('.social-icons, .footer .social, footer [class*="social"]');
      const socialIcons = page.locator('.social-icons a, .footer .social a, footer [class*="social"] a');

      const iconCount = await socialIcons.count();

      if (iconCount > 1) {
        // Check 12px gap between icons
        for (let i = 0; i < iconCount - 1; i++) {
          const currentIcon = socialIcons.nth(i);
          const nextIcon = socialIcons.nth(i + 1);

          const currentBox = await currentIcon.boundingBox();
          const nextBox = await nextIcon.boundingBox();

          if (currentBox && nextBox) {
            // Calculate gap (horizontal or vertical depending on layout)
            const horizontalGap = nextBox.x - (currentBox.x + currentBox.width);
            const verticalGap = nextBox.y - (currentBox.y + currentBox.height);

            // Should have 12px gap (with some tolerance)
            const expectedGap = 12;
            const tolerance = 8;

            // Check if icons are horizontally or vertically arranged
            if (Math.abs(currentBox.y - nextBox.y) < 5) {
              // Horizontal arrangement
              expect(horizontalGap, `Gap between icon ${i + 1} and ${i + 2} on ${pageUrl}`).toBeGreaterThanOrEqual(expectedGap - tolerance);
              expect(horizontalGap).toBeLessThanOrEqual(expectedGap + tolerance);
            } else {
              // Vertical arrangement
              expect(verticalGap, `Vertical gap between icon ${i + 1} and ${i + 2} on ${pageUrl}`).toBeGreaterThanOrEqual(expectedGap - tolerance);
              expect(verticalGap).toBeLessThanOrEqual(expectedGap + tolerance);
            }
          }
        }

        // Check container alignment
        const containerBox = await socialContainer.boundingBox();
        if (containerBox) {
          // Container should be properly centered or aligned
          expect(containerBox.width).toBeGreaterThan(0);
        }
      }
    }
  });

  test('Social icons hover states and interactions', async ({ page }) => {
    await page.goto('/');

    const socialIcons = page.locator('.social-icons a, .footer .social a, footer [class*="social"] a');
    const iconCount = await socialIcons.count();

    if (iconCount > 0) {
      for (let i = 0; i < iconCount; i++) {
        const icon = socialIcons.nth(i);

        // Get initial styles
        const initialStyles = await icon.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return {
            transform: styles.transform,
            opacity: styles.opacity,
            backgroundColor: styles.backgroundColor,
            color: styles.color
          };
        });

        // Hover over icon
        await icon.hover();
        await page.waitForTimeout(100); // Allow for transition

        // Get hover styles
        const hoverStyles = await icon.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return {
            transform: styles.transform,
            opacity: styles.opacity,
            backgroundColor: styles.backgroundColor,
            color: styles.color
          };
        });

        // Should have some visual change on hover
        const hasVisualChange =
          initialStyles.transform !== hoverStyles.transform ||
          initialStyles.opacity !== hoverStyles.opacity ||
          initialStyles.backgroundColor !== hoverStyles.backgroundColor ||
          initialStyles.color !== hoverStyles.color;

        expect(hasVisualChange, `Icon ${i + 1} should have hover effect`).toBeTruthy();

        // Test click interaction
        await icon.click();
        // Icons should be links, so they might navigate or open in new tab
        // We don't test actual navigation to avoid leaving the page
      }
    }
  });

  test('Social icons overflow prevention on narrow screens', async ({ page }) => {
    const narrowViewports = [
      { width: 320, height: 568 }, // iPhone 5
      { width: 280, height: 568 }, // Very narrow
      { width: 360, height: 640 }  // Small Android
    ];

    for (const viewport of narrowViewports) {
      await page.setViewportSize(viewport);

      for (const pageUrl of testPages) {
        await page.goto(pageUrl);

        const socialContainer = page.locator('.social-icons, .footer .social, footer [class*="social"]');
        const socialIcons = page.locator('.social-icons a, .footer .social a, footer [class*="social"] a');

        const iconCount = await socialIcons.count();
        if (iconCount > 0) {
          // Check that icons don't overflow viewport
          const containerBox = await socialContainer.boundingBox();
          if (containerBox) {
            expect(containerBox.x + containerBox.width, `Social container on ${pageUrl} at ${viewport.width}px`).toBeLessThanOrEqual(viewport.width + 2);
          }

          // Check individual icons
          for (let i = 0; i < iconCount; i++) {
            const icon = socialIcons.nth(i);
            const iconBox = await icon.boundingBox();

            if (iconBox) {
              expect(iconBox.x + iconBox.width, `Icon ${i + 1} on ${pageUrl} at ${viewport.width}px`).toBeLessThanOrEqual(viewport.width + 2);
              expect(iconBox.x, `Icon ${i + 1} position on ${pageUrl} at ${viewport.width}px`).toBeGreaterThanOrEqual(-2);
            }
          }

          // Check for horizontal scrolling
          const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
          expect(bodyScrollWidth, `No horizontal scroll on ${pageUrl} at ${viewport.width}px`).toBeLessThanOrEqual(viewport.width + 1);
        }
      }
    }
  });

  test('Social icons accessibility', async ({ page }) => {
    await page.goto('/');

    const socialIcons = page.locator('.social-icons a, .footer .social a, footer [class*="social"] a');
    const iconCount = await socialIcons.count();

    if (iconCount > 0) {
      for (let i = 0; i < iconCount; i++) {
        const icon = socialIcons.nth(i);

        // Check for accessibility attributes
        const ariaLabel = await icon.getAttribute('aria-label');
        const title = await icon.getAttribute('title');
        const href = await icon.getAttribute('href');

        // Should have either aria-label or title for screen readers
        expect(ariaLabel || title, `Icon ${i + 1} should have aria-label or title`).toBeTruthy();

        // Should have valid href
        expect(href, `Icon ${i + 1} should have href`).toBeTruthy();
        expect(href.length, `Icon ${i + 1} href should not be empty`).toBeGreaterThan(0);

        // Check for proper target attribute for external links
        const target = await icon.getAttribute('target');
        if (href && (href.startsWith('http') || href.startsWith('mailto:'))) {
          // External links should open in new tab/window
          expect(target, `External link ${i + 1} should have target="_blank"`).toBe('_blank');

          // Should have rel="noopener" for security
          const rel = await icon.getAttribute('rel');
          expect(rel, `External link ${i + 1} should have rel="noopener"`).toMatch(/noopener/);
        }

        // Test keyboard navigation
        await icon.focus();
        const focusedElement = await page.locator(':focus').count();
        expect(focusedElement, `Icon ${i + 1} should be focusable`).toBeGreaterThan(0);

        // Test keyboard activation
        await page.keyboard.press('Enter');
        // Should trigger click event (we don't test actual navigation)
      }
    }
  });

  test('Social icons responsive behavior', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568, name: 'Small mobile' },
      { width: 390, height: 844, name: 'Standard mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1024, height: 768, name: 'Desktop' }
    ];

    await page.goto('/');

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(100);

      const socialContainer = page.locator('.social-icons, .footer .social, footer [class*="social"]');
      const socialIcons = page.locator('.social-icons a, .footer .social a, footer [class*="social"] a');

      const iconCount = await socialIcons.count();
      if (iconCount > 0) {
        // Check that icons are visible and properly sized at all viewports
        for (let i = 0; i < iconCount; i++) {
          const icon = socialIcons.nth(i);
          await expect(icon).toBeVisible();

          const iconBox = await icon.boundingBox();
          if (iconBox) {
            // Icons should maintain minimum touch target size on mobile
            if (viewport.width < 768) {
              expect(iconBox.width, `Icon ${i + 1} touch target at ${viewport.name}`).toBeGreaterThanOrEqual(44);
              expect(iconBox.height, `Icon ${i + 1} touch target at ${viewport.name}`).toBeGreaterThanOrEqual(44);
            }
          }
        }

        // Check container positioning
        const containerBox = await socialContainer.boundingBox();
        if (containerBox) {
          // Container should be within viewport bounds
          expect(containerBox.x, `Container position at ${viewport.name}`).toBeGreaterThanOrEqual(0);
          expect(containerBox.x + containerBox.width, `Container width at ${viewport.name}`).toBeLessThanOrEqual(viewport.width);
        }
      }
    }
  });

  test('Social icons visual consistency', async ({ page }) => {
    await page.goto('/');

    const socialIcons = page.locator('.social-icons a, .footer .social a, footer [class*="social"] a');
    const iconCount = await socialIcons.count();

    if (iconCount > 1) {
      const firstIconStyles = await socialIcons.first().evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          width: styles.width,
          height: styles.height,
          borderRadius: styles.borderRadius,
          fontSize: styles.fontSize
        };
      });

      // All icons should have consistent sizing
      for (let i = 1; i < iconCount; i++) {
        const iconStyles = await socialIcons.nth(i).evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return {
            width: styles.width,
            height: styles.height,
            borderRadius: styles.borderRadius,
            fontSize: styles.fontSize
          };
        });

        expect(iconStyles.width, `Icon ${i + 1} width consistency`).toBe(firstIconStyles.width);
        expect(iconStyles.height, `Icon ${i + 1} height consistency`).toBe(firstIconStyles.height);
        // Border radius and font size should also be consistent for visual harmony
      }
    }
  });
});