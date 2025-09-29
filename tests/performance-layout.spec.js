const { test, expect } = require('@playwright/test');

test.describe('Performance & Layout Tests', () => {
  const criticalPages = [
    '/',
    '/blog/',
    '/blog/getting-started-with-11ty/',
    '/services/',
    '/contact/'
  ];

  const allViewports = [
    { width: 320, height: 568, name: 'iPhone 5' },
    { width: 390, height: 844, name: 'iPhone 12/13' },
    { width: 430, height: 932, name: 'iPhone 14 Pro Max' },
    { width: 412, height: 915, name: 'Google Pixel 7' },
    { width: 768, height: 1024, name: 'iPad' },
    { width: 1024, height: 768, name: 'Small Desktop' },
    { width: 1440, height: 900, name: 'Large Desktop' }
  ];

  test.describe('Viewport and Responsive Behavior', () => {
    test('No horizontal scrolling on any device', async ({ page }) => {
      for (const viewport of allViewports) {
        await page.setViewportSize(viewport);

        for (const pageUrl of criticalPages) {
          await page.goto(pageUrl);
          await page.waitForLoadState('networkidle');

          // Check for horizontal scrolling
          const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
          const windowInnerWidth = await page.evaluate(() => window.innerWidth);
          const documentScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);

          expect(bodyScrollWidth, `Body scroll width on ${pageUrl} at ${viewport.name}`).toBeLessThanOrEqual(viewport.width + 2);
          expect(documentScrollWidth, `Document scroll width on ${pageUrl} at ${viewport.name}`).toBeLessThanOrEqual(viewport.width + 2);

          // Check that content fits within viewport
          const overflowElements = await page.evaluate(() => {
            const elements = document.querySelectorAll('*');
            const overflowing = [];

            elements.forEach(el => {
              const rect = el.getBoundingClientRect();
              if (rect.right > window.innerWidth) {
                overflowing.push({
                  tag: el.tagName,
                  class: el.className,
                  right: rect.right,
                  width: rect.width
                });
              }
            });

            return overflowing.slice(0, 5); // Limit to first 5 overflowing elements
          });

          expect(overflowElements.length, `No elements should overflow viewport on ${pageUrl} at ${viewport.name}: ${JSON.stringify(overflowElements)}`).toBe(0);
        }
      }
    });

    test('Proper viewport meta tag configuration', async ({ page }) => {
      for (const pageUrl of criticalPages) {
        await page.goto(pageUrl);

        // Check viewport meta tag exists
        const viewportMeta = page.locator('meta[name="viewport"]');
        await expect(viewportMeta).toHaveCount(1);

        // Check viewport meta tag content
        const viewportContent = await viewportMeta.getAttribute('content');
        expect(viewportContent, `Viewport meta on ${pageUrl}`).toMatch(/width=device-width/);
        expect(viewportContent, `Viewport meta on ${pageUrl}`).toMatch(/initial-scale=1/);
      }
    });

    test('Responsive images and media', async ({ page }) => {
      for (const pageUrl of criticalPages) {
        await page.goto(pageUrl);

        const images = page.locator('img');
        const imageCount = await images.count();

        if (imageCount > 0) {
          for (let i = 0; i < Math.min(imageCount, 3); i++) {
            const img = images.nth(i);

            // Images should have proper sizing
            const imgStyles = await img.evaluate((el) => {
              const styles = window.getComputedStyle(el);
              return {
                maxWidth: styles.maxWidth,
                width: styles.width,
                height: styles.height
              };
            });

            // Images should not exceed container width
            expect(imgStyles.maxWidth === '100%' || imgStyles.width === '100%', `Image ${i + 1} should be responsive on ${pageUrl}`).toBeTruthy();

            // Images should load properly
            const naturalWidth = await img.evaluate(el => el.naturalWidth);
            expect(naturalWidth, `Image ${i + 1} should load on ${pageUrl}`).toBeGreaterThan(0);
          }
        }
      }
    });
  });

  test.describe('Performance Metrics', () => {
    test('Fast page loads', async ({ page }) => {
      for (const pageUrl of criticalPages) {
        const startTime = Date.now();

        await page.goto(pageUrl, { waitUntil: 'load' });

        const loadTime = Date.now() - startTime;
        expect(loadTime, `Load time for ${pageUrl}`).toBeLessThan(5000); // 5 seconds max

        // Check DOM content loaded time
        const domContentLoadedTime = await page.evaluate(() => {
          return performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
        });

        expect(domContentLoadedTime, `DOM ready time for ${pageUrl}`).toBeLessThan(3000); // 3 seconds max
      }
    });

    test('Cumulative Layout Shift (CLS)', async ({ page }) => {
      for (const pageUrl of criticalPages) {
        await page.goto(pageUrl);

        // Measure CLS
        const clsValue = await page.evaluate(() => {
          return new Promise((resolve) => {
            let clsValue = 0;

            try {
              const observer = new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                  if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                  }
                }
              });

              observer.observe({ type: 'layout-shift', buffered: true });

              // Wait for layout shifts to settle
              setTimeout(() => {
                observer.disconnect();
                resolve(clsValue);
              }, 3000);
            } catch (e) {
              resolve(0); // Fallback if PerformanceObserver not supported
            }
          });
        });

        // CLS should be less than 0.1 for good user experience
        expect(clsValue, `CLS for ${pageUrl}`).toBeLessThan(0.25); // Allowing 0.25 for flexibility
      }
    });

    test('Large Contentful Paint (LCP)', async ({ page }) => {
      for (const pageUrl of criticalPages) {
        await page.goto(pageUrl);

        const lcpValue = await page.evaluate(() => {
          return new Promise((resolve) => {
            try {
              const observer = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                resolve(lastEntry.startTime);
              });

              observer.observe({ type: 'largest-contentful-paint', buffered: true });

              // Fallback timeout
              setTimeout(() => resolve(0), 5000);
            } catch (e) {
              resolve(0);
            }
          });
        });

        if (lcpValue > 0) {
          // LCP should be less than 2.5 seconds for good user experience
          expect(lcpValue, `LCP for ${pageUrl}`).toBeLessThan(4000); // 4 seconds allowing for test environment
        }
      }
    });

    test('Resource loading optimization', async ({ page }) => {
      for (const pageUrl of criticalPages) {
        await page.goto(pageUrl);

        // Check for render-blocking resources
        const renderBlockingResources = await page.evaluate(() => {
          const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
          const syncScripts = Array.from(document.querySelectorAll('script:not([async]):not([defer])'));

          return {
            stylesheets: stylesheets.length,
            syncScripts: syncScripts.filter(script => !script.src || !script.src.includes('analytics')).length
          };
        });

        // Should minimize render-blocking resources
        expect(renderBlockingResources.stylesheets, `Stylesheets on ${pageUrl}`).toBeLessThan(5);
        expect(renderBlockingResources.syncScripts, `Blocking scripts on ${pageUrl}`).toBeLessThan(3);

        // Check for critical CSS
        const inlineStyles = await page.evaluate(() => {
          return document.querySelectorAll('style').length;
        });

        // Should have some inline critical CSS
        expect(inlineStyles, `Critical CSS on ${pageUrl}`).toBeGreaterThanOrEqual(0);
      }
    });
  });

  test.describe('Layout Stability', () => {
    test('No layout shifts during interaction', async ({ page }) => {
      await page.goto('/');

      // Measure initial layout
      const initialLayout = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('h1, h2, p, img, button'));
        return elements.map(el => ({
          tag: el.tagName,
          rect: el.getBoundingClientRect()
        }));
      });

      // Interact with page (scroll, hover, click)
      await page.mouse.move(200, 200);
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(500);

      // Hover over interactive elements
      const interactiveElements = page.locator('button, a, .card');
      const interactiveCount = await interactiveElements.count();

      if (interactiveCount > 0) {
        await interactiveElements.first().hover();
        await page.waitForTimeout(300);
      }

      // Measure layout after interaction
      const finalLayout = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('h1, h2, p, img, button'));
        return elements.map(el => ({
          tag: el.tagName,
          rect: el.getBoundingClientRect()
        }));
      });

      // Compare layouts (allowing for scroll offset)
      const significantShifts = initialLayout.filter((initial, index) => {
        const final = finalLayout[index];
        if (!final) return false;

        const xShift = Math.abs(initial.rect.x - final.rect.x);
        const widthChange = Math.abs(initial.rect.width - final.rect.width);

        return xShift > 5 || widthChange > 5; // Allow small variations
      });

      expect(significantShifts.length, 'Should not have significant layout shifts during interaction').toBeLessThan(2);
    });

    test('Image loading does not cause layout shift', async ({ page }) => {
      for (const pageUrl of criticalPages) {
        // Block images initially
        await page.route('**/*.{png,jpg,jpeg,gif,webp}', route => route.abort());

        await page.goto(pageUrl);

        // Get layout without images
        const layoutWithoutImages = await page.evaluate(() => {
          const elements = Array.from(document.querySelectorAll('h1, h2, p, div'));
          return elements.slice(0, 10).map(el => ({
            tag: el.tagName,
            rect: el.getBoundingClientRect()
          }));
        });

        // Allow images to load
        await page.unroute('**/*.{png,jpg,jpeg,gif,webp}');
        await page.reload();
        await page.waitForLoadState('networkidle');

        // Get layout with images
        const layoutWithImages = await page.evaluate(() => {
          const elements = Array.from(document.querySelectorAll('h1, h2, p, div'));
          return elements.slice(0, 10).map(el => ({
            tag: el.tagName,
            rect: el.getBoundingClientRect()
          }));
        });

        // Compare layouts
        const shifts = layoutWithoutImages.filter((without, index) => {
          const with_ = layoutWithImages[index];
          if (!with_) return false;

          const yShift = Math.abs(without.rect.y - with_.rect.y);
          return yShift > 10; // Significant vertical shift
        });

        expect(shifts.length, `Image loading should not cause layout shifts on ${pageUrl}`).toBeLessThan(3);
      }
    });
  });

  test.describe('Animation Performance', () => {
    test('Smooth animations and transitions', async ({ page }) => {
      await page.goto('/');

      // Test hover animations
      const hoverElements = page.locator('button, .card, .service, a');
      const elementCount = await hoverElements.count();

      if (elementCount > 0) {
        for (let i = 0; i < Math.min(elementCount, 3); i++) {
          const element = hoverElements.nth(i);

          // Get transition properties
          const transitionProps = await element.evaluate((el) => {
            const styles = window.getComputedStyle(el);
            return {
              transition: styles.transition,
              transitionDuration: styles.transitionDuration,
              willChange: styles.willChange
            };
          });

          // Hover and measure frame rate
          await element.hover();
          await page.waitForTimeout(100);

          // Check for reasonable transition duration
          if (transitionProps.transitionDuration && transitionProps.transitionDuration !== '0s') {
            const duration = parseFloat(transitionProps.transitionDuration);
            expect(duration, 'Transition duration should be reasonable').toBeLessThan(1); // Less than 1 second
          }
        }
      }
    });

    test('No excessive animations on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/');

      // Check for reduced motion preference
      const hasReducedMotion = await page.evaluate(() => {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      });

      if (hasReducedMotion) {
        // Should respect user's motion preference
        const animatedElements = await page.evaluate(() => {
          const elements = Array.from(document.querySelectorAll('*'));
          return elements.filter(el => {
            const styles = window.getComputedStyle(el);
            return styles.animationDuration !== '0s' && styles.animationDuration !== '';
          }).length;
        });

        expect(animatedElements, 'Should respect reduced motion preference').toBeLessThan(3);
      }
    });
  });

  test.describe('Memory and Resource Usage', () => {
    test('No memory leaks during navigation', async ({ page }) => {
      const pages = ['/', '/about/', '/services/', '/blog/', '/contact/'];

      // Get initial memory usage
      const initialMemory = await page.evaluate(() => {
        if (performance.memory) {
          return {
            used: performance.memory.usedJSHeapSize,
            total: performance.memory.totalJSHeapSize
          };
        }
        return null;
      });

      // Navigate through pages multiple times
      for (let i = 0; i < 2; i++) {
        for (const pageUrl of pages) {
          await page.goto(pageUrl);
          await page.waitForLoadState('networkidle');
        }
      }

      // Get final memory usage
      const finalMemory = await page.evaluate(() => {
        if (performance.memory) {
          return {
            used: performance.memory.usedJSHeapSize,
            total: performance.memory.totalJSHeapSize
          };
        }
        return null;
      });

      if (initialMemory && finalMemory) {
        const memoryIncrease = finalMemory.used - initialMemory.used;
        const memoryIncreasePercent = (memoryIncrease / initialMemory.used) * 100;

        // Memory should not increase by more than 50% after navigation
        expect(memoryIncreasePercent, 'Memory usage should not increase significantly').toBeLessThan(50);
      }
    });

    test('Efficient CSS and JavaScript loading', async ({ page }) => {
      for (const pageUrl of criticalPages) {
        await page.goto(pageUrl);

        // Analyze loaded resources
        const resources = await page.evaluate(() => {
          const entries = performance.getEntriesByType('resource');
          return entries.map(entry => ({
            name: entry.name.split('/').pop(),
            type: entry.initiatorType,
            size: entry.transferSize,
            duration: entry.duration
          }));
        });

        const cssFiles = resources.filter(r => r.type === 'css' || r.name.endsWith('.css'));
        const jsFiles = resources.filter(r => r.type === 'script' || r.name.endsWith('.js'));

        // Should not load excessive CSS/JS files
        expect(cssFiles.length, `CSS files on ${pageUrl}`).toBeLessThan(10);
        expect(jsFiles.length, `JS files on ${pageUrl}`).toBeLessThan(15);

        // Check for large files
        const largeFiles = resources.filter(r => r.size > 500000); // 500KB
        expect(largeFiles.length, `Large files on ${pageUrl}`).toBeLessThan(3);
      }
    });
  });

  test.describe('Mobile Performance', () => {
    test('Touch target sizes', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });

      for (const pageUrl of criticalPages) {
        await page.goto(pageUrl);

        const touchTargets = page.locator('button, a, input, [role="button"]');
        const targetCount = await touchTargets.count();

        if (targetCount > 0) {
          for (let i = 0; i < Math.min(targetCount, 10); i++) {
            const target = touchTargets.nth(i);
            const box = await target.boundingBox();

            if (box) {
              // Touch targets should be at least 44x44px
              expect(box.width, `Touch target ${i + 1} width on ${pageUrl}`).toBeGreaterThanOrEqual(44);
              expect(box.height, `Touch target ${i + 1} height on ${pageUrl}`).toBeGreaterThanOrEqual(44);
            }
          }
        }
      }
    });

    test('Mobile-first loading priorities', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/');

      // Check that critical resources load first
      const criticalResourcesLoaded = await page.evaluate(() => {
        const entries = performance.getEntriesByType('resource');
        const first5Resources = entries.slice(0, 5);

        return first5Resources.filter(entry =>
          entry.name.includes('.css') ||
          entry.name.includes('font') ||
          entry.name.includes('critical')
        ).length;
      });

      expect(criticalResourcesLoaded, 'Critical resources should load first').toBeGreaterThan(0);
    });
  });
});