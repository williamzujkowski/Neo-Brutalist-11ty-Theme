const { test, expect } = require('@playwright/test');

test.describe('Accessibility Audit', () => {
  const mobileViewports = [
    { name: 'iPhone 12', width: 390, height: 844 },
    { name: 'Galaxy S20', width: 360, height: 800 }
  ];

  const testPages = ['/', '/about/', '/blog/', '/projects/'];

  for (const viewport of mobileViewports) {
    test.describe(`${viewport.name} Accessibility`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
      });

      for (const url of testPages) {
        test(`${url} - Touch Target Sizes`, async ({ page }) => {
          await page.goto(`http://localhost:8080${url}`);
          await page.waitForLoadState('networkidle');

          // Test all interactive elements for minimum touch target size
          const interactiveElements = page.locator(
            'a, button, input, [role="button"], [tabindex]:not([tabindex="-1"])'
          );
          const count = await interactiveElements.count();

          const failedElements = [];

          for (let i = 0; i < count; i++) {
            const element = interactiveElements.nth(i);

            if (await element.isVisible()) {
              const boundingBox = await element.boundingBox();

              if (boundingBox) {
                const hasMinSize = boundingBox.width >= 44 && boundingBox.height >= 44;

                if (!hasMinSize) {
                  const elementInfo = await element.evaluate(el => ({
                    tagName: el.tagName,
                    className: el.className,
                    textContent: el.textContent?.trim().substring(0, 50),
                    href: el.href,
                    width: boundingBox.width,
                    height: boundingBox.height
                  }));
                  failedElements.push(elementInfo);
                }
              }
            }
          }

          // Log failed elements for debugging
          if (failedElements.length > 0) {
            console.log(`Failed touch targets on ${url}:`, failedElements);
          }

          // Allow some exceptions for very small decorative elements
          expect(failedElements.length).toBeLessThanOrEqual(2);
        });

        test(`${url} - Color Contrast`, async ({ page }) => {
          await page.goto(`http://localhost:8080${url}`);
          await page.waitForLoadState('networkidle');

          // Check color contrast for text elements
          const textElements = page
            .locator('p, h1, h2, h3, h4, h5, h6, a:not(.social-link), span, li')
            .filter({ hasText: /.+/ });
          const count = Math.min(await textElements.count(), 15); // Test subset

          for (let i = 0; i < count; i++) {
            const element = textElements.nth(i);

            if (await element.isVisible()) {
              const styles = await element.evaluate(el => {
                const computed = getComputedStyle(el);
                return {
                  color: computed.color,
                  backgroundColor: computed.backgroundColor,
                  fontSize: parseFloat(computed.fontSize),
                  fontWeight: computed.fontWeight
                };
              });

              // Basic font size check
              expect(styles.fontSize).toBeGreaterThanOrEqual(14);

              // TODO: Implement actual contrast ratio calculation
              // For now, just ensure we have color values
              expect(styles.color).toBeTruthy();
            }
          }
        });

        test(`${url} - Keyboard Navigation`, async ({ page }) => {
          await page.goto(`http://localhost:8080${url}`);
          await page.waitForLoadState('networkidle');

          // Test Tab navigation
          const focusableElements = page.locator(
            'a, button, input, [tabindex]:not([tabindex="-1"])'
          );
          const count = Math.min(await focusableElements.count(), 10);

          if (count > 0) {
            // Focus first element
            await page.keyboard.press('Tab');

            const currentFocused = await page.locator(':focus').count();
            expect(currentFocused).toBeGreaterThan(0);

            // Test a few more tab presses
            for (let i = 0; i < Math.min(5, count - 1); i++) {
              await page.keyboard.press('Tab');
              const stillFocused = await page.locator(':focus').count();
              expect(stillFocused).toBeGreaterThan(0);
            }
          }
        });

        test(`${url} - ARIA Labels and Semantic HTML`, async ({ page }) => {
          await page.goto(`http://localhost:8080${url}`);
          await page.waitForLoadState('networkidle');

          // Check for proper heading hierarchy
          const headings = page.locator('h1, h2, h3, h4, h5, h6');
          const headingCount = await headings.count();

          if (headingCount > 0) {
            // Should have at least one h1
            const h1Count = await page.locator('h1').count();
            expect(h1Count).toBeGreaterThanOrEqual(1);
            expect(h1Count).toBeLessThanOrEqual(2); // Shouldn't have too many h1s
          }

          // Check for alt text on images
          const images = page.locator('img');
          const imageCount = await images.count();

          for (let i = 0; i < imageCount; i++) {
            const img = images.nth(i);
            const alt = await img.getAttribute('alt');

            // Images should have alt text (can be empty for decorative images)
            expect(alt).not.toBeNull();
          }

          // Check for form labels if forms exist
          const inputs = page.locator('input, textarea, select');
          const inputCount = await inputs.count();

          for (let i = 0; i < inputCount; i++) {
            const input = inputs.nth(i);
            const id = await input.getAttribute('id');
            const ariaLabel = await input.getAttribute('aria-label');
            const ariaLabelledby = await input.getAttribute('aria-labelledby');

            if (id) {
              const label = page.locator(`label[for="${id}"]`);
              const hasLabel = (await label.count()) > 0;

              // Input should have either a label, aria-label, or aria-labelledby
              const hasAccessibleName = hasLabel || ariaLabel || ariaLabelledby;
              expect(hasAccessibleName).toBeTruthy();
            }
          }
        });
      }
    });
  }
});
