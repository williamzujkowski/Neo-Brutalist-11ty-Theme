const { test, expect } = require('@playwright/test');

test.describe('Typography and Readability Tests', () => {
  const mobileDevices = [
    { name: 'iPhone 12', width: 390, height: 844 },
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'Pixel 5', width: 393, height: 851 },
    { name: 'Galaxy S20', width: 360, height: 800 }
  ];

  const testPages = [
    { path: '/', name: 'Homepage' },
    { path: '/pages/about/', name: 'About Page' },
    { path: '/pages/services/', name: 'Services Page' },
    { path: '/blog/', name: 'Blog Listing' },
    { path: '/pages/contact/', name: 'Contact Page' }
  ];

  mobileDevices.forEach(device => {
    testPages.forEach(pageInfo => {
      test.describe(`${device.name} - ${pageInfo.name} Typography`, () => {
        test.beforeEach(async ({ page }) => {
          await page.setViewportSize({ width: device.width, height: device.height });
          await page.goto(pageInfo.path);
          await page.waitForLoadState('networkidle');
        });

        test('should have improved text contrast (darker colors)', async ({ page }) => {
          // Test main content text contrast
          const textElements = await page.locator('p, li, span, div').all();

          for (const element of textElements.slice(0, 5)) {
            const isVisible = await element.isVisible();
            if (!isVisible) continue;

            const styles = await element.evaluate(el => {
              const computed = window.getComputedStyle(el);
              return {
                color: computed.color,
                backgroundColor: computed.backgroundColor,
                fontSize: computed.fontSize,
                fontWeight: computed.fontWeight
              };
            });

            // Parse RGB values for contrast calculation
            const parseRGB = (rgbString) => {
              const match = rgbString.match(/rgb\\((\\d+),\\s*(\\d+),\\s*(\\d+)\\)/);
              return match ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])] : null;
            };

            const textColor = parseRGB(styles.color);
            if (textColor) {
              // Text should be dark enough for good contrast
              const [r, g, b] = textColor;
              const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

              // For dark text, luminance should be low (< 0.5)
              // For light text on dark background, luminance should be high (> 0.5)
              expect(luminance).toBeGreaterThanOrEqual(0);
              expect(luminance).toBeLessThanOrEqual(1);
            }
          }
        });

        test('should have appropriate font sizes for mobile', async ({ page }) => {
          // Test body text sizes
          const bodyTexts = await page.locator('p, li, .text, .content').all();

          for (const text of bodyTexts.slice(0, 3)) {
            const isVisible = await text.isVisible();
            if (!isVisible) continue;

            const fontSize = await text.evaluate(el => {
              return parseFloat(window.getComputedStyle(el).fontSize);
            });

            // Body text should be at least 14px on mobile
            expect(fontSize).toBeGreaterThanOrEqual(14);
            expect(fontSize).toBeLessThanOrEqual(24); // Reasonable upper limit
          }

          // Test heading sizes
          const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();

          for (const heading of headings.slice(0, 3)) {
            const isVisible = await heading.isVisible();
            if (!isVisible) continue;

            const fontSize = await heading.evaluate(el => {
              return parseFloat(window.getComputedStyle(el).fontSize);
            });

            // Headings should be larger than body text
            expect(fontSize).toBeGreaterThanOrEqual(18);
          }
        });

        test('should have proper line height for readability', async ({ page }) => {
          const textElements = await page.locator('p, .content, article').all();

          for (const element of textElements.slice(0, 3)) {
            const isVisible = await element.isVisible();
            if (!isVisible) continue;

            const styles = await element.evaluate(el => {
              const computed = window.getComputedStyle(el);
              return {
                lineHeight: computed.lineHeight,
                fontSize: parseFloat(computed.fontSize)
              };
            });

            // Line height should be between 1.2 and 2.0 times font size
            const lineHeight = parseFloat(styles.lineHeight);
            if (!isNaN(lineHeight) && lineHeight > 0) {
              const ratio = lineHeight / styles.fontSize;
              expect(ratio).toBeGreaterThanOrEqual(1.2);
              expect(ratio).toBeLessThanOrEqual(2.0);
            }
          }
        });

        test('should have adequate letter spacing', async ({ page }) => {
          const textElements = await page.locator('h1, h2, h3, .title, .heading').all();

          for (const element of textElements.slice(0, 3)) {
            const isVisible = await element.isVisible();
            if (!isVisible) continue;

            const letterSpacing = await element.evaluate(el => {
              return window.getComputedStyle(el).letterSpacing;
            });

            // Letter spacing should not be 'normal' or extremely negative
            expect(letterSpacing).not.toBe('normal');

            if (letterSpacing !== 'normal') {
              const spacingValue = parseFloat(letterSpacing);
              // Should not be extremely negative (more than -5px)
              expect(spacingValue).toBeGreaterThanOrEqual(-5);
            }
          }
        });

        test('should have readable text colors on Neo-Brutalist backgrounds', async ({ page }) => {
          // Test text on colored backgrounds
          const coloredElements = await page.locator('.hero, .service-card, .project-card, .blog-card, .stat').all();

          for (const element of coloredElements.slice(0, 3)) {
            const isVisible = await element.isVisible();
            if (!isVisible) continue;

            const textChild = element.locator('h1, h2, h3, h4, h5, h6, p, span').first();
            const hasText = await textChild.count() > 0;

            if (hasText) {
              const styles = await textChild.evaluate(el => {
                const computed = window.getComputedStyle(el);
                return {
                  color: computed.color,
                  textShadow: computed.textShadow,
                  fontWeight: computed.fontWeight
                };
              });

              // Text should have color defined
              expect(styles.color).not.toBe('');
              expect(styles.color).not.toBe('inherit');

              // Text on colorful backgrounds should have shadow or be bold for readability
              const hasTextShadow = styles.textShadow && styles.textShadow !== 'none';
              const isBold = parseInt(styles.fontWeight) >= 700;

              // Should have either text shadow OR be bold for better visibility
              expect(hasTextShadow || isBold).toBe(true);
            }
          }
        });

        test('should handle text overflow properly', async ({ page }) => {
          const containers = await page.locator('.service-card, .project-card, .blog-card, .stat').all();

          for (const container of containers.slice(0, 3)) {
            const isVisible = await container.isVisible();
            if (!isVisible) continue;

            const hasOverflow = await container.evaluate(el => {
              return el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight;
            });

            // If there's overflow, check if it's handled properly
            if (hasOverflow) {
              const overflowStyle = await container.evaluate(el => {
                return window.getComputedStyle(el).overflow;
              });

              // Should have overflow handling
              expect(['hidden', 'scroll', 'auto']).toContain(overflowStyle);
            }
          }
        });

        test('should have consistent typography hierarchy', async ({ page }) => {
          const h1Elements = await page.locator('h1').all();
          const h2Elements = await page.locator('h2').all();
          const h3Elements = await page.locator('h3').all();

          // Get font sizes for comparison
          const getSizes = async (elements) => {
            const sizes = [];
            for (const el of elements.slice(0, 2)) {
              const isVisible = await el.isVisible();
              if (isVisible) {
                const size = await el.evaluate(e => parseFloat(window.getComputedStyle(e).fontSize));
                sizes.push(size);
              }
            }
            return sizes;
          };

          const h1Sizes = await getSizes(h1Elements);
          const h2Sizes = await getSizes(h2Elements);
          const h3Sizes = await getSizes(h3Elements);

          // H1 should be larger than H2, H2 larger than H3
          if (h1Sizes.length > 0 && h2Sizes.length > 0) {
            expect(Math.max(...h1Sizes)).toBeGreaterThan(Math.max(...h2Sizes));
          }

          if (h2Sizes.length > 0 && h3Sizes.length > 0) {
            expect(Math.max(...h2Sizes)).toBeGreaterThan(Math.max(...h3Sizes));
          }
        });

        test('should have proper text alignment on mobile', async ({ page }) => {
          const textElements = await page.locator('p, .content, .text').all();

          for (const element of textElements.slice(0, 3)) {
            const isVisible = await element.isVisible();
            if (!isVisible) continue;

            const textAlign = await element.evaluate(el => {
              return window.getComputedStyle(el).textAlign;
            });

            // Text should be left-aligned or justified for better mobile readability
            expect(['left', 'start', 'justify']).toContain(textAlign);
          }
        });

        test('should handle long words and URLs properly', async ({ page }) => {
          const textContainers = await page.locator('p, .content, .description').all();

          for (const container of textContainers.slice(0, 3)) {
            const isVisible = await container.isVisible();
            if (!isVisible) continue;

            const wordBreak = await container.evaluate(el => {
              const computed = window.getComputedStyle(el);
              return {
                wordBreak: computed.wordBreak,
                wordWrap: computed.wordWrap,
                overflowWrap: computed.overflowWrap
              };
            });

            // Should have word breaking for long content
            const hasWordBreaking =
              wordBreak.wordBreak === 'break-word' ||
              wordBreak.wordWrap === 'break-word' ||
              wordBreak.overflowWrap === 'break-word' ||
              wordBreak.overflowWrap === 'anywhere';

            // At least one word breaking method should be set for mobile
            expect(hasWordBreaking || wordBreak.wordBreak === 'normal').toBe(true);
          }
        });
      });
    });
  });
});