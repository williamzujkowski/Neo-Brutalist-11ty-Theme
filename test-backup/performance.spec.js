/**
 * Performance Testing
 * Tests load times, Core Web Vitals, and overall site performance
 */

const { test, expect } = require('@playwright/test');
const { waitForPageLoad, testAnimationPerformance } = require('./helpers/test-utils');

test.describe('Performance Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Clear cache to ensure consistent testing
    await page.context().clearCookies();
  });

  test('should load homepage within acceptable time limits', async ({ page }) => {
    const startTime = Date.now();

    // Navigate to homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    console.log(`Homepage load time: ${loadTime}ms`);

    // Homepage should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);

    // Check that critical content is visible
    const hero = page.locator('.hero, [class*="hero"]').first();
    if ((await hero.count()) > 0) {
      await expect(hero).toBeVisible();
    }

    const nav = page.locator('nav').first();
    if ((await nav.count()) > 0) {
      await expect(nav).toBeVisible();
    }
  });

  test('should measure Core Web Vitals', async ({ page }) => {
    await page.goto('/');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Allow for metrics to be collected

    // Measure Core Web Vitals using Performance API
    const webVitals = await page.evaluate(() => {
      return new Promise(resolve => {
        const vitals = {};

        // Largest Contentful Paint (LCP)
        new PerformanceObserver(entryList => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          vitals.lcp = lastEntry.startTime;
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID) - simulated
        vitals.fid = 0; // Will be 0 in automated tests

        // Cumulative Layout Shift (CLS)
        let clsScore = 0;
        new PerformanceObserver(entryList => {
          for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) {
              clsScore += entry.value;
            }
          }
          vitals.cls = clsScore;
        }).observe({ entryTypes: ['layout-shift'] });

        // First Contentful Paint (FCP)
        new PerformanceObserver(entryList => {
          const entries = entryList.getEntries();
          vitals.fcp = entries[0].startTime;
        }).observe({ entryTypes: ['paint'] });

        // Time to Interactive (TTI) approximation
        const navigationEntry = performance.getEntriesByType('navigation')[0];
        vitals.tti = navigationEntry.loadEventEnd - navigationEntry.fetchStart;

        // Total Blocking Time (TBT) approximation
        const longTasks = performance.getEntriesByType('longtask');
        vitals.tbt = longTasks.reduce((sum, task) => sum + Math.max(0, task.duration - 50), 0);

        setTimeout(() => resolve(vitals), 1000);
      });
    });

    console.log('Core Web Vitals:', webVitals);

    // LCP should be under 2.5 seconds for good performance
    if (webVitals.lcp) {
      expect(webVitals.lcp).toBeLessThan(2500);
    }

    // FCP should be under 1.8 seconds
    if (webVitals.fcp) {
      expect(webVitals.fcp).toBeLessThan(1800);
    }

    // CLS should be under 0.1 for good user experience
    if (webVitals.cls !== undefined) {
      expect(webVitals.cls).toBeLessThan(0.1);
    }

    // TTI should be reasonable
    if (webVitals.tti) {
      expect(webVitals.tti).toBeLessThan(5000);
    }
  });

  test('should optimize image loading performance', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);

    // Check image loading performance
    const images = page.locator('img');
    const imageCount = await images.count();

    if (imageCount > 0) {
      console.log(`Found ${imageCount} images to test`);

      const imageMetrics = [];

      for (let i = 0; i < Math.min(5, imageCount); i++) {
        const img = images.nth(i);
        const src = await img.getAttribute('src');
        const loading = await img.getAttribute('loading');
        const sizes = await img.getAttribute('sizes');
        const srcset = await img.getAttribute('srcset');

        const imageData = await img.evaluate(image => {
          return {
            naturalWidth: image.naturalWidth,
            naturalHeight: image.naturalHeight,
            displayWidth: image.offsetWidth,
            displayHeight: image.offsetHeight,
            complete: image.complete,
            currentSrc: image.currentSrc
          };
        });

        imageMetrics.push({
          src,
          loading,
          sizes,
          srcset: !!srcset,
          ...imageData
        });

        // Images should load successfully
        expect(imageData.complete).toBeTruthy();
        expect(imageData.naturalWidth).toBeGreaterThan(0);
      }

      console.log('Image metrics:', imageMetrics);

      // Check for lazy loading implementation
      const lazyImages = imageMetrics.filter(img => img.loading === 'lazy');
      if (lazyImages.length > 0) {
        console.log(`✅ ${lazyImages.length} images use lazy loading`);
      }

      // Check for responsive images
      const responsiveImages = imageMetrics.filter(img => img.srcset);
      if (responsiveImages.length > 0) {
        console.log(`✅ ${responsiveImages.length} images use responsive srcset`);
      }
    }
  });

  test('should test CSS and JavaScript bundle sizes', async ({ page }) => {
    // Monitor network requests
    const resourceSizes = {
      css: [],
      js: [],
      fonts: [],
      images: []
    };

    page.on('response', response => {
      const url = response.url();
      const contentLength = response.headers()['content-length'];
      const size = contentLength ? parseInt(contentLength) : 0;

      if (url.endsWith('.css')) {
        resourceSizes.css.push({ url, size });
      } else if (url.endsWith('.js')) {
        resourceSizes.js.push({ url, size });
      } else if (url.match(/\.(woff|woff2|ttf|otf)$/)) {
        resourceSizes.fonts.push({ url, size });
      } else if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
        resourceSizes.images.push({ url, size });
      }
    });

    await page.goto('/');
    await waitForPageLoad(page);

    console.log('Resource sizes:', resourceSizes);

    // CSS bundle size recommendations
    const totalCSSSize = resourceSizes.css.reduce((sum, file) => sum + file.size, 0);
    console.log(`Total CSS size: ${totalCSSSize} bytes`);

    // CSS should be reasonably sized (under 100KB for good performance)
    if (totalCSSSize > 0) {
      expect(totalCSSSize).toBeLessThan(100 * 1024); // 100KB
    }

    // JavaScript bundle size recommendations
    const totalJSSize = resourceSizes.js.reduce((sum, file) => sum + file.size, 0);
    console.log(`Total JS size: ${totalJSSize} bytes`);

    // JavaScript should be optimized (under 200KB for initial load)
    if (totalJSSize > 0) {
      expect(totalJSSize).toBeLessThan(200 * 1024); // 200KB
    }

    // Font loading optimization
    if (resourceSizes.fonts.length > 0) {
      const totalFontSize = resourceSizes.fonts.reduce((sum, file) => sum + file.size, 0);
      console.log(`Total font size: ${totalFontSize} bytes`);

      // Fonts should be optimized (prefer WOFF2, reasonable size)
      expect(totalFontSize).toBeLessThan(150 * 1024); // 150KB
    }
  });

  test('should test animation performance', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);

    // Test animation performance using the helper function
    const animationData = await testAnimationPerformance(page);

    console.log('Animation performance data:', animationData);

    // Check that total animation time is reasonable
    const totalAnimationTime = animationData.find(entry => entry.name === 'total-animation-time');
    if (totalAnimationTime) {
      expect(totalAnimationTime.duration).toBeLessThan(2000); // 2 seconds max
    }

    // Test scroll performance
    const scrollPerformance = await page.evaluate(() => {
      return new Promise(resolve => {
        const startTime = performance.now();
        let frameCount = 0;
        const lastFrameTime = startTime;

        function measureFrame() {
          frameCount++;
          const currentTime = performance.now();
          const elapsed = currentTime - startTime;

          if (elapsed > 1000) {
            // Test for 1 second
            const fps = frameCount / (elapsed / 1000);
            resolve({ fps, frameCount, duration: elapsed });
          } else {
            requestAnimationFrame(measureFrame);
          }
        }

        // Trigger scroll to test performance
        window.scrollTo(0, 100);
        requestAnimationFrame(measureFrame);
      });
    });

    console.log('Scroll performance:', scrollPerformance);

    // Should maintain reasonable FPS during scroll
    expect(scrollPerformance.fps).toBeGreaterThan(30); // Minimum 30 FPS
  });

  test('should test memory usage and performance', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);

    // Measure memory usage
    const memoryUsage = await page.evaluate(() => {
      if ('memory' in performance) {
        return {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
        };
      }
      return null;
    });

    if (memoryUsage) {
      console.log('Memory usage:', memoryUsage);

      // Memory usage should be reasonable
      expect(memoryUsage.usedJSHeapSize).toBeLessThan(50 * 1024 * 1024); // 50MB
    }

    // Test DOM complexity
    const domMetrics = await page.evaluate(() => {
      return {
        elementCount: document.querySelectorAll('*').length,
        scriptCount: document.querySelectorAll('script').length,
        stylesheetCount: document.querySelectorAll('link[rel="stylesheet"]').length
      };
    });

    console.log('DOM metrics:', domMetrics);

    // DOM should not be overly complex
    expect(domMetrics.elementCount).toBeLessThan(2000); // Reasonable DOM size
  });

  test('should test page performance across different networks', async ({ page, context }) => {
    // Test different network conditions
    const networkConditions = [
      {
        name: 'Fast 3G',
        downloadThroughput: 1.6 * 1024,
        uploadThroughput: 0.75 * 1024,
        latency: 150
      },
      {
        name: 'Slow 3G',
        downloadThroughput: 0.5 * 1024,
        uploadThroughput: 0.5 * 1024,
        latency: 300
      }
    ];

    for (const condition of networkConditions) {
      console.log(`Testing ${condition.name} network conditions`);

      // Simulate network conditions
      await context.route('**/*', async route => {
        await new Promise(resolve => setTimeout(resolve, condition.latency / 4));
        await route.continue();
      });

      const startTime = Date.now();
      await page.goto('/', { waitUntil: 'networkidle' });
      const loadTime = Date.now() - startTime;

      console.log(`${condition.name} load time: ${loadTime}ms`);

      // Adjust expectations based on network speed
      if (condition.name === 'Fast 3G') {
        expect(loadTime).toBeLessThan(5000); // 5 seconds on Fast 3G
      } else if (condition.name === 'Slow 3G') {
        expect(loadTime).toBeLessThan(10000); // 10 seconds on Slow 3G
      }

      // Clear route handlers
      await context.unroute('**/*');
    }
  });

  test('should test performance of interactive elements', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);

    // Test button interaction performance
    const buttons = page.locator('button, .btn, [role="button"]');
    const buttonCount = await buttons.count();

    if (buttonCount > 0) {
      const button = buttons.first();

      // Measure click response time
      const clickStartTime = Date.now();
      await button.click();
      await page.waitForTimeout(100); // Allow for any animations

      const clickResponseTime = Date.now() - clickStartTime;
      console.log(`Button click response time: ${clickResponseTime}ms`);

      // Click response should be immediate (under 100ms)
      expect(clickResponseTime).toBeLessThan(100);
    }

    // Test form interaction performance (if forms exist)
    const inputs = page.locator('input, textarea');
    const inputCount = await inputs.count();

    if (inputCount > 0) {
      const input = inputs.first();

      const typeStartTime = Date.now();
      await input.fill('Test input performance');
      const typeResponseTime = Date.now() - typeStartTime;

      console.log(`Input response time: ${typeResponseTime}ms`);

      // Input should be responsive
      expect(typeResponseTime).toBeLessThan(500);
    }
  });

  test('should test third-party script performance impact', async ({ page }) => {
    const resourceLoadTimes = new Map();

    page.on('response', response => {
      const url = response.url();
      const timing = response.timing();

      if (timing) {
        resourceLoadTimes.set(url, {
          dns: timing.domainLookupEnd - timing.domainLookupStart,
          connect: timing.connectEnd - timing.connectStart,
          request: timing.responseStart - timing.requestStart,
          response: timing.responseEnd - timing.responseStart,
          total: timing.responseEnd - timing.requestStart
        });
      }
    });

    await page.goto('/');
    await waitForPageLoad(page);

    // Analyze third-party resources
    const thirdPartyDomains = ['google', 'facebook', 'twitter', 'youtube', 'linkedin'];
    const thirdPartyResources = [];

    for (const [url, timing] of resourceLoadTimes) {
      const isThirdParty = thirdPartyDomains.some(domain => url.includes(domain));
      if (isThirdParty) {
        thirdPartyResources.push({ url, ...timing });
      }
    }

    console.log('Third-party resource performance:', thirdPartyResources);

    // Third-party resources should not block page load excessively
    for (const resource of thirdPartyResources) {
      expect(resource.total).toBeLessThan(3000); // 3 seconds max per resource
    }
  });

  test('should measure page navigation performance', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);

    // Test navigation between pages
    const navigationPages = ['/projects/', '/blog/', '/'];

    for (let i = 0; i < navigationPages.length - 1; i++) {
      const startTime = Date.now();

      await page.click(`nav a[href="${navigationPages[i + 1]}"]`);
      await waitForPageLoad(page);

      const navigationTime = Date.now() - startTime;
      console.log(`Navigation to ${navigationPages[i + 1]}: ${navigationTime}ms`);

      // Navigation should be fast (under 2 seconds)
      expect(navigationTime).toBeLessThan(2000);
    }
  });
});
