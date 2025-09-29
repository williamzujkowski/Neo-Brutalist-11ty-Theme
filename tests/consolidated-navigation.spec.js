/**
 * CONSOLIDATED NAVIGATION TESTS
 * Merges: navigation.spec.js, mobile-navigation.spec.js,
 * navigation-links.spec.js, mobile-blog-navigation.spec.js
 *
 * Tests all navigation functionality across desktop and mobile viewports
 * Covers: Main navigation, mobile hamburger menu, navigation links, blog navigation
 */

const { test, expect } = require('@playwright/test');
const { waitForPageLoad, _validateThemeElements } = require('./helpers/test-utils');

// Device configurations for comprehensive testing
const testDevices = [
  { name: 'Desktop', width: 1920, height: 1080, isMobile: false },
  { name: 'Tablet', width: 768, height: 1024, isMobile: true },
  { name: 'iPhone 14', width: 393, height: 852, isMobile: true },
  { name: 'iPhone SE', width: 375, height: 667, isMobile: true },
  { name: 'Pixel 5', width: 393, height: 851, isMobile: true },
  { name: 'Galaxy S20', width: 360, height: 800, isMobile: true }
];

// Navigation configuration
const navigationLinks = [
  { text: 'HOME', url: '/', selector: '.hero, [class*="hero"]' },
  { text: 'ABOUT', url: '/#about', selector: '#about, [id*="about"]' },
  { text: 'SERVICES', url: '/#services', selector: '#services, [id*="services"]' },
  { text: 'PROJECTS', url: '/projects/', selector: '.projects, [class*="projects"]' },
  { text: 'BLOG', url: '/blog/', selector: '.blog, [class*="blog"]' },
  { text: 'CONTACT', url: '/#contact', selector: '#contact, [id*="contact"]' }
];

test.describe('Consolidated Navigation Tests', () => {
  // Test across all device types
  testDevices.forEach(device => {
    test.describe(`${device.name} Navigation (${device.width}x${device.height})`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: device.width, height: device.height });
        await page.goto('/');
        await waitForPageLoad(page);
      });

      if (device.isMobile) {
        // MOBILE NAVIGATION TESTS
        test('should display hamburger menu correctly', async ({ page }) => {
          // Check hamburger button visibility and structure
          const hamburgerButton = page
            .locator('.nav-toggle, .hamburger, [class*="nav-toggle"]')
            .first();
          await expect(hamburgerButton).toBeVisible();

          // Check hamburger lines/structure
          const hamburgerLines = page.locator('.hamburger-line, .nav-toggle span').count();
          if ((await hamburgerLines) > 0) {
            expect(await hamburgerLines).toBeGreaterThanOrEqual(1);
          }

          // Verify accessibility attributes
          const ariaLabel = await hamburgerButton.getAttribute('aria-label');
          expect(ariaLabel).toBeTruthy();

          const ariaExpanded = await hamburgerButton.getAttribute('aria-expanded');
          expect(ariaExpanded).toBe('false');
        });

        test('should hide desktop navigation on mobile', async ({ page }) => {
          const navLinks = page.locator('.nav-links, .nav-menu, .navigation-menu').first();

          if ((await navLinks.count()) > 0) {
            const isHidden = await navLinks.evaluate(el => {
              const style = window.getComputedStyle(el);
              return (
                style.display === 'none' ||
                style.visibility === 'hidden' ||
                parseFloat(style.opacity) === 0 ||
                style.transform.includes('translateX') ||
                parseFloat(style.maxHeight) === 0
              );
            });
            expect(isHidden).toBe(true);
          }
        });

        test('should toggle mobile menu functionality', async ({ page }) => {
          const hamburgerButton = page.locator('.nav-toggle, .hamburger').first();
          const navLinks = page.locator('.nav-links, .nav-menu').first();

          // Initial state - menu closed
          await expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false');

          // Click to open menu
          await hamburgerButton.click();
          await page.waitForTimeout(300); // Animation time

          // Check if menu opened
          const isOpenAfterClick = await hamburgerButton.getAttribute('aria-expanded');
          expect(isOpenAfterClick).toBe('true');

          // Check if navigation links are now visible/accessible
          if ((await navLinks.count()) > 0) {
            const isVisible = await navLinks.evaluate(el => {
              const style = window.getComputedStyle(el);
              return (
                style.display !== 'none' &&
                style.visibility !== 'hidden' &&
                parseFloat(style.opacity) > 0
              );
            });
            expect(isVisible).toBe(true);
          }

          // Click to close menu
          await hamburgerButton.click();
          await page.waitForTimeout(300);

          // Verify menu closed
          await expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false');
        });

        test('should provide accessible mobile menu navigation', async ({ page }) => {
          const hamburgerButton = page.locator('.nav-toggle, .hamburger').first();

          // Open mobile menu
          await hamburgerButton.click();
          await page.waitForTimeout(300);

          // Test each navigation link in mobile menu
          for (const link of navigationLinks) {
            const mobileNavLink = page
              .locator(
                `
              .nav-links a[href*="${link.url}"],
              .nav-menu a[href*="${link.url}"],
              nav a[href*="${link.url}"]
            `
              )
              .first();

            if ((await mobileNavLink.count()) > 0) {
              await expect(mobileNavLink).toBeVisible();

              // Check for touch-friendly size
              const box = await mobileNavLink.boundingBox();
              if (box) {
                expect(box.height).toBeGreaterThanOrEqual(44); // WCAG touch target minimum
              }
            }
          }
        });
      } else {
        // DESKTOP NAVIGATION TESTS
        test('should display desktop navigation menu', async ({ page }) => {
          const nav = page.locator('nav, .navigation, [class*="nav"]').first();
          await expect(nav).toBeVisible();

          // Check for navigation items
          for (const item of navigationLinks) {
            const navLink = page
              .locator(`nav a, .navigation a`)
              .getByText(item.text, { exact: false })
              .first();
            if ((await navLink.count()) > 0) {
              await expect(navLink).toBeVisible();
            }
          }
        });

        test('should hide mobile hamburger menu on desktop', async ({ page }) => {
          const hamburgerButton = page.locator('.nav-toggle, .hamburger');

          if ((await hamburgerButton.count()) > 0) {
            const isHidden = await hamburgerButton.evaluate(el => {
              const style = window.getComputedStyle(el);
              return (
                style.display === 'none' ||
                style.visibility === 'hidden' ||
                parseFloat(style.opacity) === 0
              );
            });
            expect(isHidden).toBe(true);
          }
        });
      }

      // UNIVERSAL NAVIGATION TESTS (both mobile and desktop)
      test('should navigate to all main pages correctly', async ({ page }) => {
        for (const link of navigationLinks) {
          // Navigate back to home first
          await page.goto('/');
          await waitForPageLoad(page);

          // Open mobile menu if on mobile device
          if (device.isMobile) {
            const hamburgerButton = page.locator('.nav-toggle, .hamburger').first();
            if ((await hamburgerButton.count()) > 0) {
              await hamburgerButton.click();
              await page.waitForTimeout(300);
            }
          }

          // Find and click navigation link
          const navLink = page
            .locator(
              `
            nav a[href*="${link.url}"],
            .navigation a[href*="${link.url}"],
            .nav-links a[href*="${link.url}"],
            .nav-menu a[href*="${link.url}"]
          `
            )
            .first();

          if ((await navLink.count()) > 0) {
            await navLink.click();
            await waitForPageLoad(page);

            // Verify navigation worked
            if (link.url.startsWith('#')) {
              // Hash navigation - check for section
              const section = page.locator(link.selector);
              if ((await section.count()) > 0) {
                await expect(section).toBeVisible();
              }
            } else {
              // Page navigation - check URL
              await expect(page).toHaveURL(new RegExp(link.url.replace('/', '\\/')));

              // Check for expected content
              const targetElement = page.locator(link.selector);
              if ((await targetElement.count()) > 0) {
                await expect(targetElement.first()).toBeVisible();
              }
            }
          }
        }
      });

      test('should handle navigation link accessibility', async ({ page }) => {
        // Open mobile menu if needed
        if (device.isMobile) {
          const hamburgerButton = page.locator('.nav-toggle, .hamburger').first();
          if ((await hamburgerButton.count()) > 0) {
            await hamburgerButton.click();
            await page.waitForTimeout(300);
          }
        }

        const navLinks = page.locator('nav a, .navigation a, .nav-links a, .nav-menu a');
        const linkCount = await navLinks.count();

        for (let i = 0; i < linkCount; i++) {
          const link = navLinks.nth(i);

          // Check for valid href
          const href = await link.getAttribute('href');
          expect(href).toBeTruthy();

          // Check for accessible text
          const text = await link.textContent();
          expect(text?.trim()).toBeTruthy();

          // Check for keyboard navigation support
          await link.focus();
          expect(await link.evaluate(el => document.activeElement === el)).toBe(true);
        }
      });

      test('should maintain navigation state across viewport changes', async ({ page }) => {
        // Test navigation visibility after viewport changes
        const originalNav = page.locator('nav, .navigation').first();
        const isVisible = (await originalNav.count()) > 0 && (await originalNav.isVisible());

        // Temporarily change viewport
        await page.setViewportSize({ width: 1200, height: 800 });
        await page.waitForTimeout(300);

        // Restore original viewport
        await page.setViewportSize({ width: device.width, height: device.height });
        await page.waitForTimeout(300);

        // Navigation should still be functional
        const nav = page.locator('nav, .navigation').first();
        if (isVisible) {
          await expect(nav).toBeVisible();
        }
      });
    });
  });

  // BLOG NAVIGATION SPECIFIC TESTS
  test.describe('Blog Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/blog/');
      await waitForPageLoad(page);
    });

    test('should display blog navigation correctly', async ({ page }) => {
      // Check for blog page elements
      const blogContainer = page.locator('.blog, [class*="blog"], main');
      await expect(blogContainer.first()).toBeVisible();

      // Check for back to blog functionality if on individual post
      const _backToBlogLink = page.locator('a').getByText(/back to blog/i, { exact: false });
      // This may or may not exist depending on if we're on blog index or post
    });

    test('should navigate to individual blog posts', async ({ page }) => {
      // Look for blog post links
      const postLinks = page.locator('a[href*="/blog/"], .post-link, .blog-post-link');
      const postCount = await postLinks.count();

      if (postCount > 0) {
        // Test first blog post navigation
        const firstPost = postLinks.first();
        await firstPost.click();
        await waitForPageLoad(page);

        // Should be on a blog post page
        const postContent = page.locator('.post, .blog-post, article, main');
        await expect(postContent.first()).toBeVisible();

        // Check for back to blog link on post page
        const backLink = page.locator('a').getByText(/back to blog/i);
        if ((await backLink.count()) > 0) {
          await expect(backLink.first()).toBeVisible();

          // Test back navigation
          await backLink.first().click();
          await waitForPageLoad(page);

          // Should be back on blog index
          await expect(page).toHaveURL(/\/blog\/?$/);
        }
      }
    });
  });

  // NAVIGATION PERFORMANCE TESTS
  test.describe('Navigation Performance', () => {
    test('should load navigation quickly across devices', async ({ page }) => {
      for (const device of testDevices.slice(0, 3)) {
        // Test subset for performance
        await page.setViewportSize({ width: device.width, height: device.height });

        const startTime = Date.now();
        await page.goto('/');
        await waitForPageLoad(page);

        const nav = page.locator('nav, .navigation').first();
        await expect(nav).toBeVisible();

        const loadTime = Date.now() - startTime;
        expect(loadTime).toBeLessThan(3000); // Should load within 3 seconds
      }
    });

    test('should handle rapid navigation clicks', async ({ page }) => {
      await page.goto('/');
      await waitForPageLoad(page);

      // Rapidly click navigation links
      for (let i = 0; i < 3; i++) {
        const homeLink = page
          .locator('nav a, .navigation a')
          .getByText('HOME', { exact: false })
          .first();
        if ((await homeLink.count()) > 0) {
          await homeLink.click();
          await page.waitForTimeout(100);
        }
      }

      // Should still be functional
      const nav = page.locator('nav, .navigation').first();
      await expect(nav).toBeVisible();
    });
  });
});
