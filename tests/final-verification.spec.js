const { test, expect, devices } = require('@playwright/test');

test.describe('Final Verification - Neo-Brutalist Theme', () => {
  // Test on latest iPhone and Pixel devices
  const mobileDevices = [
    { ...devices['iPhone 14 Pro'], name: 'iPhone 14 Pro' },
    { ...devices['iPhone 15 Pro Max'], name: 'iPhone 15 Pro Max' },
    { ...devices['Pixel 7'], name: 'Pixel 7' },
    { name: 'Pixel 8 Pro', viewport: { width: 412, height: 915 } }
  ];

  const pages = [
    '/',
    '/about/',
    '/services/',
    '/blog/',
    '/blog/getting-started-with-11ty/',
    '/blog/neo-brutalist-design-principles/',
    '/projects/',
    '/projects/project-alpha/',
    '/contact/'
  ];

  // Test mobile devices
  mobileDevices.forEach(device => {
    test.describe(`${device.name}`, () => {
      test.use(device);

      test('Navigation and typography on all pages', async ({ page }) => {
        for (const url of pages) {
          await page.goto(url);

          // Check navigation is present
          const nav = page.locator('nav').first();
          await expect(nav).toBeVisible();

          // Check typography contrast
          const bodyText = page.locator('p').first();
          if (await bodyText.count() > 0) {
            const color = await bodyText.evaluate(el =>
              window.getComputedStyle(el).color
            );

            // Verify dark text for readability
            const rgbMatch = color.match(/rgb\((\d+), (\d+), (\d+)\)/);
            if (rgbMatch) {
              const [, r, g, b] = rgbMatch.map(Number);
              expect(r).toBeLessThan(50);
              expect(g).toBeLessThan(50);
              expect(b).toBeLessThan(50);
            }
          }

          // Check footer social icons
          const socialIcons = page.locator('.social-link');
          if (await socialIcons.count() > 0) {
            const firstIcon = socialIcons.first();
            const box = await firstIcon.boundingBox();
            if (box) {
              // Verify 48px minimum touch target
              expect(box.width).toBeGreaterThanOrEqual(44);
              expect(box.height).toBeGreaterThanOrEqual(44);
            }
          }
        }
      });

      test('Blog post navigation alignment', async ({ page }) => {
        await page.goto('/blog/getting-started-with-11ty/');

        // Check post navigation bar
        const postNav = page.locator('.post-navigation');
        await expect(postNav).toBeVisible();

        // Check "Back to Blog" button
        const backBtn = page.locator('.post-back-btn');
        await expect(backBtn).toBeVisible();
        await expect(backBtn).toContainText('BACK TO BLOG');

        // Check spacing before title
        const postTitle = page.locator('.post-title');
        const titleStyles = await postTitle.evaluate(el => ({
          marginTop: window.getComputedStyle(el).marginTop,
          paddingTop: window.getComputedStyle(el).paddingTop
        }));

        // Verify adequate spacing
        const marginTop = parseFloat(titleStyles.marginTop);
        const paddingTop = parseFloat(titleStyles.paddingTop);
        expect(marginTop + paddingTop).toBeGreaterThanOrEqual(60);
      });
    });
  });

  // Test desktop view
  test.describe('Desktop', () => {
    test.use({ viewport: { width: 1440, height: 900 } });

    test('All navigation links work', async ({ page }) => {
      await page.goto('/');

      const navLinks = [
        { text: 'ABOUT', url: '/about/' },
        { text: 'SERVICES', url: '/services/' },
        { text: 'BLOG', url: '/blog/' },
        { text: 'PROJECTS', url: '/projects/' },
        { text: 'CONTACT', url: '/contact/' }
      ];

      for (const link of navLinks) {
        await page.goto('/');
        const navLink = page.locator(`.nav-link:has-text("${link.text}")`);
        await navLink.click();
        await expect(page).toHaveURL(new RegExp(link.url));
      }
    });

    test('Theme consistency across pages', async ({ page }) => {
      for (const url of pages) {
        await page.goto(url);

        // Check Neo-Brutalist elements
        const elements = [
          { selector: 'h1, h2, h3', property: 'textTransform', expected: 'uppercase' },
          { selector: '.hero, .about-text, .service-card', property: 'border', contains: 'solid' }
        ];

        for (const element of elements) {
          const els = page.locator(element.selector);
          const count = await els.count();

          if (count > 0) {
            const style = await els.first().evaluate((el, prop) =>
              window.getComputedStyle(el)[prop], element.property
            );

            if (element.expected) {
              expect(style).toBe(element.expected);
            } else if (element.contains) {
              expect(style).toContain(element.contains);
            }
          }
        }
      }
    });

    test('No broken images or resources', async ({ page }) => {
      const brokenResources = [];

      page.on('response', response => {
        if (response.status() >= 400) {
          brokenResources.push({
            url: response.url(),
            status: response.status()
          });
        }
      });

      for (const url of pages) {
        await page.goto(url);
        await page.waitForLoadState('networkidle');
      }

      expect(brokenResources).toHaveLength(0);
    });
  });

  // Performance and accessibility checks
  test.describe('Quality Checks', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test('Page load performance', async ({ page }) => {
      const metrics = [];

      for (const url of pages.slice(0, 3)) { // Test first 3 pages
        await page.goto(url);

        const performanceTiming = await page.evaluate(() =>
          JSON.stringify(window.performance.timing)
        );

        const timing = JSON.parse(performanceTiming);
        const loadTime = timing.loadEventEnd - timing.navigationStart;

        metrics.push({ url, loadTime });

        // Pages should load in under 3 seconds
        expect(loadTime).toBeLessThan(3000);
      }
    });

    test('ARIA labels and accessibility', async ({ page }) => {
      await page.goto('/');

      // Check for ARIA labels on interactive elements
      const buttons = page.locator('button, a.btn, .contact-cta');
      const buttonCount = await buttons.count();

      for (let i = 0; i < buttonCount; i++) {
        const button = buttons.nth(i);
        const text = await button.textContent();
        const ariaLabel = await button.getAttribute('aria-label');

        // Should have either text content or aria-label
        expect(text || ariaLabel).toBeTruthy();
      }

      // Check for alt text on images
      const images = page.locator('img');
      const imageCount = await images.count();

      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        expect(alt).toBeTruthy();
      }
    });
  });
});