const { test, expect } = require('@playwright/test');

test.describe('Typography & Readability', () => {
  const testPages = [
    '/',
    '/about/',
    '/services/',
    '/blog/',
    '/blog/getting-started-with-11ty/',
    '/blog/neo-brutalist-design-principles/',
    '/projects/project-alpha/',
    '/contact/'
  ];

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Text contrast compliance', async ({ page }) => {
    for (const pageUrl of testPages) {
      await page.goto(pageUrl);

      // Check body text contrast (#1a1a1a)
      const bodyElements = page.locator('p, li, span:not(.nav *, .header *, .footer *)');
      const bodyCount = await bodyElements.count();

      if (bodyCount > 0) {
        const bodyColor = await bodyElements.first().evaluate((el) => {
          return window.getComputedStyle(el).color;
        });

        // Convert RGB to hex for comparison (approximate)
        const isContrastCompliant = await page.evaluate((color) => {
          // Simple check for dark text color
          const rgbMatch = color.match(/rgb\((\d+), (\d+), (\d+)\)/);
          if (rgbMatch) {
            const [, r, g, b] = rgbMatch.map(Number);
            return r < 50 && g < 50 && b < 50; // Should be very dark
          }
          return color.includes('#1a1a1a') || color.includes('#0a0a0a');
        }, bodyColor);

        expect(isContrastCompliant).toBeTruthy();
      }

      // Check header text contrast (#0a0a0a)
      const headerElements = page.locator('h1, h2, h3, h4, h5, h6');
      const headerCount = await headerElements.count();

      if (headerCount > 0) {
        const headerColor = await headerElements.first().evaluate((el) => {
          return window.getComputedStyle(el).color;
        });

        const isHeaderContrastCompliant = await page.evaluate((color) => {
          const rgbMatch = color.match(/rgb\((\d+), (\d+), (\d+)\)/);
          if (rgbMatch) {
            const [, r, g, b] = rgbMatch.map(Number);
            return r < 30 && g < 30 && b < 30; // Should be very dark
          }
          return color.includes('#0a0a0a') || color.includes('#1a1a1a');
        }, headerColor);

        expect(isHeaderContrastCompliant).toBeTruthy();
      }
    }
  });

  test('Font smoothing and antialiasing', async ({ page }) => {
    await page.goto('/blog/neo-brutalist-design-principles/');

    const textElements = page.locator('p, h1, h2, h3, li');
    const elementCount = await textElements.count();

    if (elementCount > 0) {
      const fontSmoothing = await textElements.first().evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          webkitFontSmoothing: styles.webkitFontSmoothing,
          mozOsxFontSmoothing: styles.mozOsxFontSmoothing,
          fontSmooth: styles.fontSmooth
        };
      });

      // Check for proper font smoothing
      expect(
        fontSmoothing.webkitFontSmoothing === 'antialiased' ||
        fontSmoothing.mozOsxFontSmoothing === 'grayscale' ||
        fontSmoothing.fontSmooth !== 'never'
      ).toBeTruthy();
    }
  });

  test('Line height and readability on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    for (const pageUrl of testPages) {
      await page.goto(pageUrl);

      // Check paragraph line height (should be 1.75)
      const paragraphs = page.locator('p');
      const paragraphCount = await paragraphs.count();

      if (paragraphCount > 0) {
        const lineHeight = await paragraphs.first().evaluate((el) => {
          return window.getComputedStyle(el).lineHeight;
        });

        // Line height should be between 1.6 and 1.8 (allowing for variations)
        const lineHeightNum = parseFloat(lineHeight);
        if (!isNaN(lineHeightNum)) {
          expect(lineHeightNum).toBeGreaterThanOrEqual(1.6);
          expect(lineHeightNum).toBeLessThanOrEqual(1.9);
        } else {
          // If line-height is in pixels, calculate ratio
          const fontSize = await paragraphs.first().evaluate((el) => {
            return parseFloat(window.getComputedStyle(el).fontSize);
          });
          const lineHeightPx = parseFloat(lineHeight);
          const ratio = lineHeightPx / fontSize;
          expect(ratio).toBeGreaterThanOrEqual(1.6);
          expect(ratio).toBeLessThanOrEqual(1.9);
        }
      }
    }
  });

  test('Font size accessibility on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 640 });

    const testCases = [
      { selector: 'p, li', minSize: 14, description: 'Body text' },
      { selector: 'h1', minSize: 24, description: 'Main headings' },
      { selector: 'h2', minSize: 20, description: 'Section headings' },
      { selector: 'h3', minSize: 18, description: 'Subsection headings' },
      { selector: '.button, button', minSize: 14, description: 'Button text' }
    ];

    for (const pageUrl of testPages) {
      await page.goto(pageUrl);

      for (const testCase of testCases) {
        const elements = page.locator(testCase.selector);
        const elementCount = await elements.count();

        if (elementCount > 0) {
          const fontSize = await elements.first().evaluate((el) => {
            return parseFloat(window.getComputedStyle(el).fontSize);
          });

          expect(fontSize, `${testCase.description} on ${pageUrl}`).toBeGreaterThanOrEqual(testCase.minSize);
        }
      }
    }
  });

  test('Responsive typography scaling', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568, name: 'Small mobile' },
      { width: 390, height: 844, name: 'Standard mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1024, height: 768, name: 'Small desktop' },
      { width: 1440, height: 900, name: 'Large desktop' }
    ];

    await page.goto('/');

    const previousSizes = {};

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(100); // Allow for responsive changes

      const h1Elements = page.locator('h1');
      const pElements = page.locator('p');

      if (await h1Elements.count() > 0 && await pElements.count() > 0) {
        const h1Size = await h1Elements.first().evaluate((el) => {
          return parseFloat(window.getComputedStyle(el).fontSize);
        });

        const pSize = await pElements.first().evaluate((el) => {
          return parseFloat(window.getComputedStyle(el).fontSize);
        });

        // Store sizes for comparison
        previousSizes[viewport.name] = { h1: h1Size, p: pSize };

        // Ensure minimum sizes
        expect(h1Size, `H1 size on ${viewport.name}`).toBeGreaterThanOrEqual(20);
        expect(pSize, `Paragraph size on ${viewport.name}`).toBeGreaterThanOrEqual(14);
      }
    }
  });
});