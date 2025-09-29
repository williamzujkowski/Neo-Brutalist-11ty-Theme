/**
 * CONSOLIDATED PERFORMANCE & LAYOUT TESTS
 * Merges: performance.spec.js, performance-layout.spec.js,
 * layout-spacing.spec.js, responsive.spec.js, cross-device-layout.spec.js
 *
 * Tests site performance, layout consistency, responsive behavior, and spacing across devices
 * Covers: Core Web Vitals, layout shifts, responsive design,
 * spacing consistency, performance benchmarks
 */

const { test, expect } = require('@playwright/test');
const { waitForPageLoad, _testResponsiveBreakpoints } = require('./helpers/test-utils');

// Performance test configurations
const performanceDevices = [
  { name: 'Desktop', width: 1920, height: 1080, isMobile: false },
  { name: 'Tablet', width: 768, height: 1024, isMobile: true },
  { name: 'iPhone 14', width: 393, height: 852, isMobile: true },
  { name: 'Galaxy S20', width: 360, height: 800, isMobile: true }
];

// Pages to test for performance
const performanceTestPages = [
  { url: '/', name: 'Homepage', critical: true },
  { url: '/blog/', name: 'Blog Index', critical: true },
  { url: '/projects/', name: 'Projects Page', critical: false },
  { url: '/pages/about/', name: 'About Page', critical: false }
];

// Responsive breakpoints for layout testing
const responsiveBreakpoints = [
  { name: 'Small Mobile', width: 320, height: 568 },
  { name: 'Mobile', width: 375, height: 667 },
  { name: 'Large Mobile', width: 414, height: 896 },
  { name: 'Tablet Portrait', width: 768, height: 1024 },
  { name: 'Tablet Landscape', width: 1024, height: 768 },
  { name: 'Small Desktop', width: 1280, height: 720 },
  { name: 'Desktop', width: 1920, height: 1080 },
  { name: 'Large Desktop', width: 2560, height: 1440 }
];

test.describe('Consolidated Performance & Layout Tests', () => {
  // CORE WEB VITALS AND PERFORMANCE METRICS
  test.describe('Core Web Vitals', () => {
    performanceDevices.forEach(device => {
      test(`should meet Core Web Vitals benchmarks on ${device.name}`, async ({ page }) => {
        await page.setViewportSize({ width: device.width, height: device.height });

        // Enable performance monitoring
        await page.addInitScript(() => {
          window.performanceData = {
            layoutShifts: [],
            longTasks: [],
            navigationTiming: null,
            paintTiming: {}
          };

          // Monitor layout shifts (CLS)
          if ('PerformanceObserver' in window) {
            new PerformanceObserver(list => {
              window.performanceData.layoutShifts.push(...list.getEntries());
            }).observe({ type: 'layout-shift', buffered: true });

            // Monitor long tasks (for Total Blocking Time)
            new PerformanceObserver(list => {
              window.performanceData.longTasks.push(...list.getEntries());
            }).observe({ type: 'longtask', buffered: true });

            // Monitor paint timing (FCP, LCP)
            new PerformanceObserver(list => {
              list.getEntries().forEach(entry => {
                window.performanceData.paintTiming[entry.name] = entry.startTime;
              });
            }).observe({ type: 'paint', buffered: true });

            // Monitor largest contentful paint
            new PerformanceObserver(list => {
              const entries = list.getEntries();
              if (entries.length > 0) {
                window.performanceData.paintTiming['largest-contentful-paint'] =
                  entries[entries.length - 1].startTime;
              }
            }).observe({ type: 'largest-contentful-paint', buffered: true });
          }
        });

        const startTime = Date.now();
        await page.goto('/');
        await waitForPageLoad(page);
        await page.waitForTimeout(2000); // Allow for LCP and CLS stabilization

        const loadTime = Date.now() - startTime;
        const performanceData = await page.evaluate(() => window.performanceData);

        // 1. FIRST CONTENTFUL PAINT (FCP) - Should be < 1.8s (Good)
        const fcp = performanceData.paintTiming['first-contentful-paint'];
        if (fcp) {
          expect(fcp, `FCP on ${device.name} should be under 1800ms`).toBeLessThan(1800);
          console.log(`FCP on ${device.name}: ${fcp.toFixed(2)}ms`);
        }

        // 2. LARGEST CONTENTFUL PAINT (LCP) - Should be < 2.5s (Good)
        const lcp = performanceData.paintTiming['largest-contentful-paint'];
        if (lcp) {
          expect(lcp, `LCP on ${device.name} should be under 2500ms`).toBeLessThan(2500);
          console.log(`LCP on ${device.name}: ${lcp.toFixed(2)}ms`);
        }

        // 3. CUMULATIVE LAYOUT SHIFT (CLS) - Should be < 0.1 (Good)
        const cls = performanceData.layoutShifts.reduce((sum, shift) => sum + shift.value, 0);
        expect(cls, `CLS on ${device.name} should be under 0.1`).toBeLessThan(0.1);
        console.log(`CLS on ${device.name}: ${cls.toFixed(4)}`);

        // 4. TOTAL BLOCKING TIME (TBT) - Estimated from long tasks
        const tbt = performanceData.longTasks.reduce((sum, task) => {
          return sum + Math.max(0, task.duration - 50);
        }, 0);
        expect(tbt, `TBT on ${device.name} should be under 200ms`).toBeLessThan(200);
        console.log(`TBT on ${device.name}: ${tbt.toFixed(2)}ms`);

        // 5. SPEED INDEX - Overall page load time should be reasonable
        expect(loadTime, `Page load time on ${device.name} should be under 3000ms`).toBeLessThan(
          3000
        );
        console.log(`Total load time on ${device.name}: ${loadTime}ms`);
      });
    });

    test('should load critical resources efficiently', async ({ page }) => {
      // Monitor network requests
      const resourceLoads = [];
      page.on('response', response => {
        resourceLoads.push({
          url: response.url(),
          status: response.status(),
          contentType: response.headers()['content-type'],
          timing: response.timing()
        });
      });

      await page.goto('/');
      await waitForPageLoad(page);

      // Check critical resources loaded successfully
      const htmlRequests = resourceLoads.filter(r => r.contentType?.includes('text/html'));
      const cssRequests = resourceLoads.filter(r => r.contentType?.includes('text/css'));
      const jsRequests = resourceLoads.filter(r => r.contentType?.includes('javascript'));

      expect(htmlRequests.length, 'Should load HTML').toBeGreaterThan(0);
      expect(
        htmlRequests.every(r => r.status === 200),
        'HTML should load successfully'
      ).toBe(true);

      if (cssRequests.length > 0) {
        expect(
          cssRequests.every(r => r.status === 200),
          'CSS should load successfully'
        ).toBe(true);
      }

      if (jsRequests.length > 0) {
        expect(
          jsRequests.every(r => r.status === 200),
          'JavaScript should load successfully'
        ).toBe(true);
      }

      // Log resource loading summary
      console.log(
        `Loaded ${htmlRequests.length} HTML, ${cssRequests.length} CSS, ${jsRequests.length} JS files`
      );
    });
  });

  // RESPONSIVE DESIGN AND LAYOUT CONSISTENCY
  test.describe('Responsive Design', () => {
    test('should maintain layout integrity across all breakpoints', async ({ page }) => {
      await page.goto('/');
      await waitForPageLoad(page);

      for (const breakpoint of responsiveBreakpoints) {
        await page.setViewportSize({ width: breakpoint.width, height: breakpoint.height });
        await page.waitForTimeout(300); // Allow for responsive adjustments

        // Check essential elements are visible
        const essentialElements = [
          { selector: 'nav, .navigation', name: 'Navigation' },
          { selector: 'main, .main, .content', name: 'Main content' },
          { selector: 'footer, .footer', name: 'Footer' }
        ];

        for (const element of essentialElements) {
          const locator = page.locator(element.selector);
          if ((await locator.count()) > 0) {
            await expect(locator.first()).toBeVisible();
          }
        }

        // Check no horizontal overflow
        const hasHorizontalScroll = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        expect(
          hasHorizontalScroll,
          `No horizontal scroll at ${breakpoint.name} (${breakpoint.width}px)`
        ).toBe(false);

        // Check viewport meta tag is present
        const viewportMeta = page.locator('meta[name="viewport"]');
        if ((await viewportMeta.count()) > 0) {
          const content = await viewportMeta.getAttribute('content');
          expect(content, 'Viewport meta should include width=device-width').toContain(
            'width=device-width'
          );
        }

        console.log(
          `✅ Layout integrity maintained at ${breakpoint.name} (${breakpoint.width}x${breakpoint.height})`
        );
      }
    });

    test('should handle mobile navigation correctly across devices', async ({ page }) => {
      const mobileBreakpoints = responsiveBreakpoints.filter(bp => bp.width <= 768);

      for (const breakpoint of mobileBreakpoints) {
        await page.setViewportSize({ width: breakpoint.width, height: breakpoint.height });
        await page.goto('/');
        await waitForPageLoad(page);

        // Check for mobile navigation elements
        const hamburgerMenu = page.locator('.hamburger, .nav-toggle, .mobile-menu-toggle').first();
        const desktopNav = page.locator('.nav-menu, .nav-links').first();

        if ((await hamburgerMenu.count()) > 0) {
          await expect(hamburgerMenu).toBeVisible();

          // Desktop navigation should be hidden on mobile
          if ((await desktopNav.count()) > 0) {
            const isHidden = await desktopNav.evaluate(el => {
              const style = window.getComputedStyle(el);
              return (
                style.display === 'none' ||
                style.visibility === 'hidden' ||
                parseFloat(style.opacity) === 0
              );
            });
            expect(isHidden, `Desktop nav should be hidden at ${breakpoint.name}`).toBe(true);
          }

          // Test mobile menu functionality
          await hamburgerMenu.click();
          await page.waitForTimeout(300);

          const mobileMenu = page.locator('.nav-links, .nav-menu, .mobile-menu').first();
          if ((await mobileMenu.count()) > 0) {
            const isVisible = await mobileMenu.evaluate(el => {
              const style = window.getComputedStyle(el);
              return (
                style.display !== 'none' &&
                style.visibility !== 'hidden' &&
                parseFloat(style.opacity) > 0
              );
            });
            expect(
              isVisible,
              `Mobile menu should be visible after click at ${breakpoint.name}`
            ).toBe(true);
          }
        }

        console.log(`✅ Mobile navigation working at ${breakpoint.name}`);
      }
    });

    test('should maintain readable typography across devices', async ({ page }) => {
      await page.goto('/');
      await waitForPageLoad(page);

      for (const breakpoint of responsiveBreakpoints.slice(0, 5)) {
        // Test subset for performance
        await page.setViewportSize({ width: breakpoint.width, height: breakpoint.height });
        await page.waitForTimeout(200);

        // Check body text
        const bodyText = page.locator('body').first();
        const textStyles = await bodyText.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            fontSize: parseFloat(styles.fontSize),
            lineHeight: styles.lineHeight,
            color: styles.color
          };
        });

        // Font size should be readable
        const minFontSize = breakpoint.width <= 768 ? 16 : 14; // Larger on mobile
        expect(
          textStyles.fontSize,
          `Font size should be readable at ${breakpoint.name}`
        ).toBeGreaterThanOrEqual(minFontSize);

        // Check heading scales appropriately
        const h1 = page.locator('h1').first();
        if ((await h1.count()) > 0) {
          const h1Styles = await h1.evaluate(el => {
            const styles = window.getComputedStyle(el);
            return {
              fontSize: parseFloat(styles.fontSize)
            };
          });

          expect(
            h1Styles.fontSize,
            `H1 should be larger than body text at ${breakpoint.name}`
          ).toBeGreaterThan(textStyles.fontSize);
        }

        console.log(`✅ Typography readable at ${breakpoint.name}: ${textStyles.fontSize}px`);
      }
    });
  });

  // LAYOUT SPACING AND CONSISTENCY
  test.describe('Layout Spacing', () => {
    test('should maintain consistent spacing across components', async ({ page }) => {
      await page.goto('/');
      await waitForPageLoad(page);

      // Test spacing between major sections
      const sections = page.locator(
        'section, .section, main > *, .hero, .about, .services, .projects'
      );
      const sectionCount = await sections.count();

      if (sectionCount > 1) {
        const spacings = [];

        for (let i = 0; i < sectionCount - 1; i++) {
          const currentSection = sections.nth(i);
          const nextSection = sections.nth(i + 1);

          const currentBox = await currentSection.boundingBox();
          const nextBox = await nextSection.boundingBox();

          if (currentBox && nextBox) {
            const spacing = nextBox.y - (currentBox.y + currentBox.height);
            spacings.push(spacing);
          }
        }

        // Check spacing consistency (within reasonable variance)
        if (spacings.length > 0) {
          const avgSpacing = spacings.reduce((a, b) => a + b, 0) / spacings.length;
          const maxVariance = avgSpacing * 0.5; // Allow 50% variance

          spacings.forEach((spacing, index) => {
            const variance = Math.abs(spacing - avgSpacing);
            expect(variance, `Section spacing ${index + 1} should be consistent`).toBeLessThan(
              maxVariance
            );
          });

          console.log(`✅ Section spacing average: ${avgSpacing.toFixed(2)}px`);
        }
      }
    });

    test('should handle content overflow gracefully', async ({ page }) => {
      const narrowViewports = [
        { width: 320, height: 568 },
        { width: 280, height: 653 }, // Very narrow
        { width: 360, height: 640 }
      ];

      for (const viewport of narrowViewports) {
        await page.setViewportSize(viewport);
        await page.goto('/');
        await waitForPageLoad(page);

        // Check all content fits within viewport
        const allElements = page.locator('*:visible');
        const elementCount = await allElements.count();

        let overflowCount = 0;
        for (let i = 0; i < Math.min(elementCount, 20); i++) {
          // Test sample for performance
          const element = allElements.nth(i);
          const box = await element.boundingBox();

          if (box && box.x + box.width > viewport.width) {
            overflowCount++;
          }
        }

        expect(
          overflowCount,
          `Should have minimal content overflow at ${viewport.width}px`
        ).toBeLessThan(3);

        // Check specific problematic elements
        const wideElements = page.locator('pre, code, .code, img, video, iframe');
        const wideCount = await wideElements.count();

        for (let i = 0; i < wideCount; i++) {
          const element = wideElements.nth(i);
          if (await element.isVisible()) {
            const box = await element.boundingBox();
            if (box) {
              expect(
                box.x + box.width,
                `Wide element ${i + 1} should not overflow at ${viewport.width}px`
              ).toBeLessThanOrEqual(viewport.width + 2);
            }
          }
        }

        console.log(`✅ Content overflow handled at ${viewport.width}px`);
      }
    });
  });

  // PERFORMANCE ACROSS DIFFERENT PAGES
  test.describe('Cross-Page Performance', () => {
    performanceTestPages.forEach(testPage => {
      test(`should maintain performance standards on ${testPage.name}`, async ({ page }) => {
        // Enable performance monitoring
        await page.addInitScript(() => {
          window.performanceMetrics = {
            navigationStart: performance.timeOrigin,
            domLoaded: 0,
            fullyLoaded: 0,
            resourceCount: 0
          };

          document.addEventListener('DOMContentLoaded', () => {
            window.performanceMetrics.domLoaded = performance.now();
          });

          window.addEventListener('load', () => {
            window.performanceMetrics.fullyLoaded = performance.now();
            window.performanceMetrics.resourceCount =
              performance.getEntriesByType('resource').length;
          });
        });

        const startTime = Date.now();
        await page.goto(testPage.url);
        await waitForPageLoad(page);

        const loadTime = Date.now() - startTime;
        const metrics = await page.evaluate(() => window.performanceMetrics);

        // Performance thresholds based on page criticality
        const thresholds = testPage.critical
          ? {
              loadTime: 2000,
              domLoaded: 1500,
              fullyLoaded: 3000
            }
          : {
              loadTime: 3000,
              domLoaded: 2000,
              fullyLoaded: 4000
            };

        expect(loadTime, `${testPage.name} total load time`).toBeLessThan(thresholds.loadTime);

        if (metrics.domLoaded > 0) {
          expect(metrics.domLoaded, `${testPage.name} DOM loaded time`).toBeLessThan(
            thresholds.domLoaded
          );
        }

        if (metrics.fullyLoaded > 0) {
          expect(metrics.fullyLoaded, `${testPage.name} fully loaded time`).toBeLessThan(
            thresholds.fullyLoaded
          );
        }

        console.log(
          `✅ ${testPage.name} performance: Load=${loadTime}ms, DOM=${metrics.domLoaded}ms, Resources=${metrics.resourceCount}`
        );
      });
    });

    test('should handle navigation between pages efficiently', async ({ page }) => {
      await page.goto('/');
      await waitForPageLoad(page);

      const navigationTests = [
        { from: '/', to: '/blog/', name: 'Home to Blog' },
        { from: '/blog/', to: '/projects/', name: 'Blog to Projects' },
        { from: '/projects/', to: '/', name: 'Projects to Home' }
      ];

      for (const navTest of navigationTests) {
        await page.goto(navTest.from);
        await waitForPageLoad(page);

        const startTime = Date.now();
        await page.goto(navTest.to);
        await waitForPageLoad(page);
        const navigationTime = Date.now() - startTime;

        expect(navigationTime, `${navTest.name} navigation should be fast`).toBeLessThan(2000);
        console.log(`✅ ${navTest.name}: ${navigationTime}ms`);
      }
    });
  });

  // IMAGE AND MEDIA PERFORMANCE
  test.describe('Media Performance', () => {
    test('should optimize image loading and display', async ({ page }) => {
      await page.goto('/');
      await waitForPageLoad(page);

      const images = page.locator('img');
      const imageCount = await images.count();

      if (imageCount > 0) {
        console.log(`Testing ${imageCount} images`);

        for (let i = 0; i < imageCount; i++) {
          const img = images.nth(i);

          if (await img.isVisible()) {
            // Check image loads successfully
            const naturalWidth = await img.evaluate(el => el.naturalWidth);
            const naturalHeight = await img.evaluate(el => el.naturalHeight);

            expect(naturalWidth, `Image ${i + 1} should load successfully`).toBeGreaterThan(0);
            expect(naturalHeight, `Image ${i + 1} should have height`).toBeGreaterThan(0);

            // Check for appropriate sizing
            const displayedSize = await img.boundingBox();
            if (displayedSize) {
              // Image shouldn't be way larger than needed (performance issue)
              const scaleFactor = naturalWidth / displayedSize.width;
              if (scaleFactor > 3) {
                console.log(
                  `Image ${i + 1} might be oversized: ${naturalWidth}px displayed at ${displayedSize.width}px`
                );
              }
            }

            // Check for alt text
            const alt = await img.getAttribute('alt');
            expect(alt, `Image ${i + 1} should have alt text`).toBeTruthy();
          }
        }
      }
    });

    test('should handle responsive images appropriately', async ({ page }) => {
      const viewports = [
        { width: 375, height: 667, name: 'Mobile' },
        { width: 768, height: 1024, name: 'Tablet' },
        { width: 1920, height: 1080, name: 'Desktop' }
      ];

      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await page.goto('/');
        await waitForPageLoad(page);

        // Check that images scale appropriately
        const images = page.locator('img:visible');
        const imageCount = await images.count();

        for (let i = 0; i < Math.min(imageCount, 3); i++) {
          // Test first 3 images
          const img = images.nth(i);
          const box = await img.boundingBox();

          if (box) {
            // Image should not overflow viewport
            expect(
              box.x + box.width,
              `Image ${i + 1} should fit in ${viewport.name} viewport`
            ).toBeLessThanOrEqual(viewport.width + 2);

            // Image should have reasonable size
            expect(
              box.width,
              `Image ${i + 1} should have reasonable width on ${viewport.name}`
            ).toBeGreaterThan(10);
            expect(
              box.height,
              `Image ${i + 1} should have reasonable height on ${viewport.name}`
            ).toBeGreaterThan(10);
          }
        }

        console.log(`✅ Images responsive on ${viewport.name}`);
      }
    });
  });
});
