/**
 * Responsive Design Tests
 * Tests responsive behavior across different viewports and devices
 */

const { test, expect } = require('@playwright/test');
const { waitForPageLoad, testResponsiveBreakpoints } = require('./helpers/test-utils');

test.describe('Responsive Design Testing', () => {
  const breakpoints = [
    { name: 'Mobile Small', width: 320, height: 568 }, // iPhone 5
    { name: 'Mobile', width: 375, height: 667 }, // iPhone 6/7/8
    { name: 'Mobile Large', width: 414, height: 896 }, // iPhone XR
    { name: 'Tablet', width: 768, height: 1024 }, // iPad
    { name: 'Desktop Small', width: 1024, height: 768 },
    { name: 'Desktop', width: 1440, height: 900 },
    { name: 'Desktop Large', width: 1920, height: 1080 }
  ];

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
  });

  test('should display correctly across all breakpoints', async ({ page }) => {
    for (const breakpoint of breakpoints) {
      console.log(`Testing ${breakpoint.name} (${breakpoint.width}x${breakpoint.height})`);

      await page.setViewportSize({
        width: breakpoint.width,
        height: breakpoint.height
      });

      await page.waitForTimeout(500); // Allow for responsive adjustments

      // Check main layout elements are visible
      const hero = page.locator('.hero, [class*="hero"]').first();
      const nav = page.locator('nav, .navigation').first();

      if ((await hero.count()) > 0) {
        await expect(hero).toBeVisible();
      }

      if ((await nav.count()) > 0) {
        await expect(nav).toBeVisible();
      }

      // Check no horizontal scrollbar (content fits viewport)
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      if (hasHorizontalScroll) {
        console.warn(`⚠️ Horizontal scroll detected on ${breakpoint.name}`);
      }

      // Validate text is readable (not too small)
      const bodyText = page.locator('body').first();
      const fontSize = await bodyText.evaluate(el => {
        return parseInt(window.getComputedStyle(el).fontSize);
      });

      expect(fontSize).toBeGreaterThanOrEqual(14); // Minimum readable font size
    }
  });

  test('should adapt navigation for mobile devices', async ({ page }) => {
    // Test mobile navigation behavior
    const mobileBreakpoint = { width: 375, height: 667 };

    await page.setViewportSize(mobileBreakpoint);
    await page.waitForTimeout(500);

    // Check for mobile navigation patterns
    const mobileToggle = page
      .locator('.mobile-toggle, .nav-toggle, .hamburger, [aria-label*="menu"], .menu-button')
      .first();

    const desktopNav = page.locator('nav ul, .nav-list').first();

    if ((await mobileToggle.count()) > 0) {
      // Mobile toggle pattern
      await expect(mobileToggle).toBeVisible();

      // Test mobile menu functionality
      await mobileToggle.click();
      await page.waitForTimeout(300);

      const mobileMenu = page.locator('.mobile-menu, .nav-mobile, nav.open').first();
      if ((await mobileMenu.count()) > 0) {
        await expect(mobileMenu).toBeVisible();
      }

      // Close menu
      await mobileToggle.click();
      await page.waitForTimeout(300);
    } else if ((await desktopNav.count()) > 0) {
      // Check if desktop nav adapts to mobile (e.g., stacking vertically)
      const navStyles = await desktopNav.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          flexDirection: styles.flexDirection,
          display: styles.display,
          position: styles.position
        };
      });

      console.log('Mobile Nav Styles:', navStyles);
    }
  });

  test('should scale typography appropriately', async ({ page }) => {
    const typographyElements = [
      { selector: 'h1, .h1', name: 'Heading 1' },
      { selector: 'h2, .h2', name: 'Heading 2' },
      { selector: 'h3, .h3', name: 'Heading 3' },
      { selector: 'p', name: 'Paragraph' },
      { selector: '.hero-title, .hero h1', name: 'Hero Title' }
    ];

    for (const breakpoint of [breakpoints[1], breakpoints[4], breakpoints[6]]) {
      await page.setViewportSize(breakpoint);
      await page.waitForTimeout(300);

      console.log(`\nTesting typography on ${breakpoint.name}:`);

      for (const element of typographyElements) {
        const el = page.locator(element.selector).first();

        if ((await el.count()) > 0) {
          const fontSize = await el.evaluate(elem => {
            return window.getComputedStyle(elem).fontSize;
          });

          console.log(`${element.name}: ${fontSize}`);

          // Ensure font sizes are reasonable for the viewport
          const fontSizeNum = parseInt(fontSize);
          if (breakpoint.width <= 414) {
            // Mobile: Text should not be too large
            expect(fontSizeNum).toBeLessThanOrEqual(60);
          } else if (breakpoint.width >= 1440) {
            // Desktop: Hero text can be very large
            if (element.name === 'Hero Title') {
              expect(fontSizeNum).toBeGreaterThanOrEqual(40);
            }
          }
        }
      }
    }
  });

  test('should adapt images and media for different screen sizes', async ({ page }) => {
    const images = page.locator('img');
    const imageCount = await images.count();

    if (imageCount > 0) {
      for (const breakpoint of [breakpoints[1], breakpoints[3], breakpoints[5]]) {
        await page.setViewportSize(breakpoint);
        await page.waitForTimeout(300);

        // Test first few images
        const testCount = Math.min(3, imageCount);

        for (let i = 0; i < testCount; i++) {
          const img = images.nth(i);

          if (await img.isVisible()) {
            const imgProps = await img.evaluate(image => {
              return {
                naturalWidth: image.naturalWidth,
                naturalHeight: image.naturalHeight,
                displayWidth: image.offsetWidth,
                displayHeight: image.offsetHeight,
                maxWidth: window.getComputedStyle(image).maxWidth
              };
            });

            // Images should not overflow their container
            expect(imgProps.displayWidth).toBeLessThanOrEqual(breakpoint.width);

            // Images should have responsive properties
            expect(imgProps.maxWidth).toBe('100%');

            console.log(`Image ${i} on ${breakpoint.name}:`, imgProps);
          }
        }
      }
    }
  });

  test('should test grid and layout responsiveness', async ({ page }) => {
    // Test grid layouts (projects, blog posts, etc.)
    const gridSelectors = [
      '.grid',
      '.projects-grid',
      '.blog-grid',
      '.cards-grid',
      '[class*="grid"]',
      '[style*="grid"]'
    ];

    let gridElement;
    for (const selector of gridSelectors) {
      const el = page.locator(selector).first();
      if ((await el.count()) > 0) {
        gridElement = el;
        break;
      }
    }

    if (gridElement) {
      for (const breakpoint of [breakpoints[1], breakpoints[3], breakpoints[5]]) {
        await page.setViewportSize(breakpoint);
        await page.waitForTimeout(300);

        const gridStyles = await gridElement.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            display: styles.display,
            gridTemplateColumns: styles.gridTemplateColumns,
            flexDirection: styles.flexDirection,
            gap: styles.gap
          };
        });

        console.log(`Grid styles on ${breakpoint.name}:`, gridStyles);

        // Verify grid adapts to smaller screens
        if (breakpoint.width <= 768) {
          // On mobile, grid should stack or have fewer columns
          if (gridStyles.display === 'grid') {
            const columnCount = gridStyles.gridTemplateColumns.split(' ').length;
            expect(columnCount).toBeLessThanOrEqual(2);
          }
        }
      }
    }
  });

  test('should handle touch interactions on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Test touch-friendly button sizes
    const buttons = page.locator('button, .btn, a[role="button"], input[type="submit"]');
    const buttonCount = await buttons.count();

    if (buttonCount > 0) {
      for (let i = 0; i < Math.min(5, buttonCount); i++) {
        const button = buttons.nth(i);

        if (await button.isVisible()) {
          const buttonSize = await button.evaluate(btn => {
            const rect = btn.getBoundingClientRect();
            return {
              width: rect.width,
              height: rect.height
            };
          });

          // Touch targets should be at least 44px (iOS) or 48px (Android) for accessibility
          expect(buttonSize.width).toBeGreaterThanOrEqual(44);
          expect(buttonSize.height).toBeGreaterThanOrEqual(44);

          console.log(`Button ${i} size: ${buttonSize.width}x${buttonSize.height}`);
        }
      }
    }
  });

  test('should test responsive text scaling', async ({ page }) => {
    // Test that text scales appropriately with clamp() or other responsive units
    const textElements = page.locator('h1, h2, h3, .hero-title, .mega-text');
    const count = await textElements.count();

    if (count > 0) {
      const measurements = {};

      // Measure on different screens
      for (const breakpoint of [breakpoints[0], breakpoints[3], breakpoints[6]]) {
        await page.setViewportSize(breakpoint);
        await page.waitForTimeout(300);

        measurements[breakpoint.name] = {};

        for (let i = 0; i < Math.min(3, count); i++) {
          const element = textElements.nth(i);
          const fontSize = await element.evaluate(el => {
            return parseInt(window.getComputedStyle(el).fontSize);
          });

          measurements[breakpoint.name][`element${i}`] = fontSize;
        }
      }

      console.log('Responsive text measurements:', measurements);

      // Verify text scales between breakpoints
      Object.keys(measurements[breakpoints[0].name]).forEach(elementKey => {
        const mobileSize = measurements[breakpoints[0].name][elementKey];
        const desktopSize = measurements[breakpoints[6].name][elementKey];

        // Desktop text should generally be larger than mobile
        expect(desktopSize).toBeGreaterThanOrEqual(mobileSize);
      });
    }
  });

  test('should test container and spacing responsiveness', async ({ page }) => {
    const container = page.locator('.container, .wrapper, main').first();

    if ((await container.count()) > 0) {
      for (const breakpoint of breakpoints) {
        await page.setViewportSize(breakpoint);
        await page.waitForTimeout(200);

        const containerStyles = await container.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            maxWidth: styles.maxWidth,
            paddingLeft: styles.paddingLeft,
            paddingRight: styles.paddingRight,
            margin: styles.margin,
            width: styles.width
          };
        });

        console.log(`Container styles on ${breakpoint.name}:`, containerStyles);

        // Container should have appropriate spacing
        const paddingValue = parseInt(containerStyles.paddingLeft);
        if (breakpoint.width <= 768) {
          // Mobile: Should have less padding
          expect(paddingValue).toBeLessThanOrEqual(40);
        }
      }
    }
  });

  test('should validate Neo-Brutalist elements remain distinctive across devices', async ({
    page
  }) => {
    // Test that Neo-Brutalist styling characteristics are maintained across devices
    const brutalistElements = page.locator(
      '.card, .btn, .project-card, .service-card, .hero, [class*="brutal"]'
    );

    const count = await brutalistElements.count();

    if (count > 0) {
      for (const breakpoint of [breakpoints[1], breakpoints[3], breakpoints[5]]) {
        await page.setViewportSize(breakpoint);
        await page.waitForTimeout(300);

        const element = brutalistElements.first();
        const styles = await element.evaluate(el => {
          const computed = window.getComputedStyle(el);
          return {
            borderWidth: computed.borderWidth,
            boxShadow: computed.boxShadow,
            transform: computed.transform,
            borderRadius: computed.borderRadius
          };
        });

        // Neo-brutalist characteristics should be maintained
        if (styles.borderWidth !== '0px') {
          expect(parseInt(styles.borderWidth)).toBeGreaterThanOrEqual(2);
        }

        console.log(`Neo-Brutalist styles on ${breakpoint.name}:`, styles);
      }
    }
  });
});
