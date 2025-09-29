/**
 * CONSOLIDATED COMPREHENSIVE TESTS
 * Merges: comprehensive-test.spec.js, comprehensive-links.spec.js,
 * mobile-comprehensive.spec.js, comprehensive-page-testing.spec.js
 *
 * Tests complete site functionality across multiple device viewports
 * Covers: Page loading, navigation, content rendering, responsive behavior,
 * cross-device compatibility
 */

const { test, expect } = require('@playwright/test');
const { waitForPageLoad, _validateThemeElements } = require('./helpers/test-utils');

// Comprehensive device matrix for testing
const testDevices = [
  { name: 'iPhone 14 Pro', viewport: { width: 393, height: 852 }, isMobile: true },
  { name: 'iPhone 15 Pro', viewport: { width: 430, height: 932 }, isMobile: true },
  { name: 'iPhone SE', viewport: { width: 375, height: 667 }, isMobile: true },
  { name: 'Google Pixel 7', viewport: { width: 412, height: 915 }, isMobile: true },
  { name: 'Google Pixel 8', viewport: { width: 412, height: 915 }, isMobile: true },
  { name: 'Samsung Galaxy S20', viewport: { width: 360, height: 800 }, isMobile: true },
  { name: 'Tablet Portrait', viewport: { width: 768, height: 1024 }, isMobile: false },
  { name: 'Tablet Landscape', viewport: { width: 1024, height: 768 }, isMobile: false },
  { name: 'Desktop', viewport: { width: 1920, height: 1080 }, isMobile: false },
  { name: 'Large Desktop', viewport: { width: 2560, height: 1440 }, isMobile: false }
];

// Core site pages to test
const testPages = [
  { url: '/', name: 'Homepage', selectors: ['.hero', '.hero-title'] },
  { url: '/pages/about/', name: 'About Page', selectors: ['#about', '.about-content'] },
  { url: '/pages/services/', name: 'Services Page', selectors: ['#services', '.services-content'] },
  { url: '/blog/', name: 'Blog Index', selectors: ['.blog', '.blog-grid'] },
  { url: '/projects/', name: 'Projects Page', selectors: ['.projects', '.project-card'] },
  { url: '/pages/contact/', name: 'Contact Page', selectors: ['#contact', '.contact-form'] }
];

// Expected navigation links
const navigationLinks = [
  { text: 'ABOUT', url: '/pages/about/', expectedContent: 'about' },
  { text: 'SERVICES', url: '/pages/services/', expectedContent: 'services' },
  { text: 'BLOG', url: '/blog/', expectedContent: 'blog' },
  { text: 'CONTACT', url: '/pages/contact/', expectedContent: 'contact' }
];

// Social media platforms expected
const _expectedSocialPlatforms = ['GitHub', 'Twitter', 'LinkedIn', 'Email'];

test.describe('Consolidated Comprehensive Site Tests', () => {
  // CROSS-DEVICE FUNCTIONALITY TESTS
  testDevices.forEach(device => {
    test.describe(`${device.name} Tests (${device.viewport.width}x${device.viewport.height})`, () => {
      test.use({ viewport: device.viewport });

      test('should load homepage correctly with all essential elements', async ({ page }) => {
        await page.goto('/');
        await waitForPageLoad(page);

        // Check hero section
        const heroSelectors = ['.hero', '.hero-section', '[class*="hero"]'];
        let heroFound = false;
        for (const selector of heroSelectors) {
          const hero = page.locator(selector);
          if ((await hero.count()) > 0) {
            await expect(hero.first()).toBeVisible();
            heroFound = true;
            break;
          }
        }
        expect(heroFound, 'Hero section should be present').toBe(true);

        // Check hero title
        const heroTitleSelectors = ['.hero-title', '.hero h1', 'h1', '[class*="hero"] h1'];
        let titleFound = false;
        for (const selector of heroTitleSelectors) {
          const title = page.locator(selector);
          if ((await title.count()) > 0) {
            await expect(title.first()).toBeVisible();
            titleFound = true;
            break;
          }
        }
        expect(titleFound, 'Hero title should be present').toBe(true);

        // Check navigation based on device type
        if (device.isMobile) {
          // Mobile should have hamburger menu
          const hamburgerSelectors = [
            '.hamburger',
            '.nav-toggle',
            '.mobile-menu-toggle',
            '[class*="menu-toggle"]'
          ];
          let hamburgerFound = false;
          for (const selector of hamburgerSelectors) {
            const hamburger = page.locator(selector);
            if ((await hamburger.count()) > 0 && (await hamburger.isVisible())) {
              hamburgerFound = true;
              break;
            }
          }
          expect(hamburgerFound, 'Mobile navigation should be present').toBe(true);
        } else {
          // Desktop should have visible navigation menu
          const navSelectors = ['.nav-menu', '.navigation', 'nav', '.nav-links'];
          let navFound = false;
          for (const selector of navSelectors) {
            const nav = page.locator(selector);
            if ((await nav.count()) > 0 && (await nav.isVisible())) {
              navFound = true;
              break;
            }
          }
          expect(navFound, 'Desktop navigation should be present').toBe(true);
        }

        // Check footer with social icons
        const footerSelectors = ['footer', '.footer', '[class*="footer"]'];
        let footerFound = false;
        for (const selector of footerSelectors) {
          const footer = page.locator(selector);
          if ((await footer.count()) > 0) {
            await expect(footer.first()).toBeVisible();
            footerFound = true;
            break;
          }
        }
        expect(footerFound, 'Footer should be present').toBe(true);

        // Check social links in footer
        const socialLinkSelectors = [
          'footer .social-link',
          'footer .social a',
          '.footer .social a',
          'footer [class*="social"] a'
        ];
        let socialFound = false;
        for (const selector of socialLinkSelectors) {
          const socialLinks = page.locator(selector);
          const count = await socialLinks.count();
          if (count > 0) {
            expect(count).toBeGreaterThanOrEqual(2); // At least 2 social links
            socialFound = true;
            break;
          }
        }
        expect(socialFound, 'Social links should be present').toBe(true);
      });

      test('should navigate correctly to all main pages', async ({ page }) => {
        await page.goto('/');
        await waitForPageLoad(page);

        for (const link of navigationLinks) {
          // Navigate to homepage first
          await page.goto('/');
          await waitForPageLoad(page);

          // Handle mobile navigation
          if (device.isMobile) {
            const hamburgerSelectors = ['.hamburger', '.nav-toggle', '.mobile-menu-toggle'];
            for (const selector of hamburgerSelectors) {
              const hamburger = page.locator(selector);
              if ((await hamburger.count()) > 0 && (await hamburger.isVisible())) {
                await hamburger.click();
                await page.waitForTimeout(300);
                break;
              }
            }
          }

          // Find and click navigation link
          const linkSelectors = [
            `text="${link.text}"`,
            `nav a[href*="${link.url}"]`,
            `.nav-links a[href*="${link.url}"]`,
            `.navigation a[href*="${link.url}"]`
          ];

          let linkClicked = false;
          for (const selector of linkSelectors) {
            const navLink = page.locator(selector);
            if ((await navLink.count()) > 0 && (await navLink.isVisible())) {
              await navLink.click();
              await waitForPageLoad(page);
              linkClicked = true;
              break;
            }
          }

          if (linkClicked) {
            // Verify navigation worked
            await expect(page).toHaveURL(
              new RegExp(link.url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
            );

            // Check for expected content
            const contentSelectors = [
              `[id*="${link.expectedContent}"]`,
              `[class*="${link.expectedContent}"]`,
              'main',
              '.content',
              'article'
            ];
            let contentFound = false;
            for (const selector of contentSelectors) {
              const content = page.locator(selector);
              if ((await content.count()) > 0 && (await content.isVisible())) {
                contentFound = true;
                break;
              }
            }
            expect(contentFound, `Content should be present on ${link.text} page`).toBe(true);
          }
        }
      });

      test('should display and validate social icons functionality', async ({ page }) => {
        await page.goto('/');
        await waitForPageLoad(page);

        // Find social icons with flexible selectors
        const socialSelectors = [
          'footer .social-link',
          'footer .social a',
          '.footer .social a',
          'footer [class*="social"] a',
          '.social-icons a',
          '.social-links a'
        ];

        let socialLinks;
        let socialCount = 0;

        for (const selector of socialSelectors) {
          socialLinks = page.locator(selector);
          socialCount = await socialLinks.count();
          if (socialCount > 0) {
            break;
          }
        }

        expect(socialCount, 'Social icons should be present').toBeGreaterThan(0);

        // Test each social icon
        for (let i = 0; i < socialCount; i++) {
          const socialLink = socialLinks.nth(i);
          await expect(socialLink).toBeVisible();

          // Check for proper href
          const href = await socialLink.getAttribute('href');
          expect(href, `Social link ${i + 1} should have href`).toBeTruthy();
          expect(href, `Social link ${i + 1} should have valid URL format`).toMatch(
            /^(https?:\/\/|mailto:)/
          );

          // Check for accessibility attributes
          const ariaLabel = await socialLink.getAttribute('aria-label');
          const title = await socialLink.getAttribute('title');
          expect(
            ariaLabel || title,
            `Social link ${i + 1} should have accessible text`
          ).toBeTruthy();

          // Check for SVG icon presence
          const svg = socialLink.locator('svg');
          if ((await svg.count()) > 0) {
            await expect(svg).toBeVisible();
          }

          // Check external link attributes
          if (href && href.startsWith('http')) {
            const target = await socialLink.getAttribute('target');
            const rel = await socialLink.getAttribute('rel');
            expect(target, `External social link ${i + 1} should open in new tab`).toBe('_blank');
            expect(
              rel,
              `External social link ${i + 1} should have security rel attribute`
            ).toContain('noopener');
          }

          // Check touch targets on mobile
          if (device.isMobile) {
            const box = await socialLink.boundingBox();
            if (box) {
              expect(box.width, `Social icon ${i + 1} touch target width`).toBeGreaterThanOrEqual(
                44
              );
              expect(box.height, `Social icon ${i + 1} touch target height`).toBeGreaterThanOrEqual(
                44
              );
            }
          }
        }
      });

      test('should handle blog page and post navigation correctly', async ({ page }) => {
        await page.goto('/blog/');
        await waitForPageLoad(page);

        // Check blog page elements
        const blogSelectors = ['.blog-grid', '.blog', '.posts', '[class*="blog"]'];
        let blogFound = false;
        for (const selector of blogSelectors) {
          const blog = page.locator(selector);
          if ((await blog.count()) > 0) {
            await expect(blog.first()).toBeVisible();
            blogFound = true;
            break;
          }
        }
        expect(blogFound, 'Blog page should display blog content').toBe(true);

        // Look for blog posts/cards
        const blogCardSelectors = ['.blog-card', '.post-card', '.blog-post', 'article', '.post'];
        let blogCards;
        let cardCount = 0;

        for (const selector of blogCardSelectors) {
          blogCards = page.locator(selector);
          cardCount = await blogCards.count();
          if (cardCount > 0) {
            break;
          }
        }

        if (cardCount > 0) {
          // Click first blog post
          const firstPost = blogCards.first();
          await firstPost.click();
          await waitForPageLoad(page);

          // Check we're on a blog post page
          const postContentSelectors = [
            '.post-content',
            '.blog-post',
            'article',
            'main',
            '.content'
          ];
          let postContentFound = false;
          for (const selector of postContentSelectors) {
            const content = page.locator(selector);
            if ((await content.count()) > 0 && (await content.isVisible())) {
              postContentFound = true;
              break;
            }
          }
          expect(postContentFound, 'Blog post content should be visible').toBe(true);

          // Check for post navigation/back button
          const backSelectors = [
            '.post-back-btn',
            '.back-to-blog',
            'a[href*="/blog/"]',
            'text="BACK TO BLOG"',
            'text="Back to Blog"'
          ];
          const _backButtonFound = false;
          for (const selector of backSelectors) {
            const backBtn = page.locator(selector);
            if ((await backBtn.count()) > 0 && (await backBtn.isVisible())) {
              await backBtn.click();
              await waitForPageLoad(page);
              await expect(page).toHaveURL(/\/blog\/?$/);
              // _backButtonFound = true; // Variable would need to be let if used
              break;
            }
          }
          // Back button is optional, but if present should work
        }
      });

      test('should load and display project images correctly', async ({ page }) => {
        await page.goto('/');
        await waitForPageLoad(page);

        // Try to find projects section on homepage
        const projectsSectionSelectors = ['#projects', '.projects', '[class*="project"]'];
        let projectsSection;
        for (const selector of projectsSectionSelectors) {
          projectsSection = page.locator(selector);
          if ((await projectsSection.count()) > 0) {
            break;
          }
        }

        if (projectsSection && (await projectsSection.count()) > 0) {
          // Scroll to projects section
          await projectsSection.scrollIntoViewIfNeeded();

          // Check for project images
          const projectImageSelectors = [
            'img[src*="chaos-grid"]',
            'img[src*="type-destroyer"]',
            'img[src*="color-riot"]',
            'img[src*="project"]',
            '.project img'
          ];

          let foundImages = 0;
          for (const selector of projectImageSelectors) {
            const images = page.locator(selector);
            const imageCount = await images.count();
            foundImages += imageCount;

            // Verify images load successfully
            for (let i = 0; i < imageCount; i++) {
              const img = images.nth(i);
              if (await img.isVisible()) {
                const naturalWidth = await img.evaluate(el => el.naturalWidth);
                expect(
                  naturalWidth,
                  `Project image ${i + 1} should load successfully`
                ).toBeGreaterThan(0);
              }
            }
          }

          // Should have at least some project images
          expect(foundImages, 'Should have project images').toBeGreaterThan(0);
        } else {
          // Try projects page directly
          await page.goto('/projects/');
          await waitForPageLoad(page);

          const projectContent = page.locator('.projects, main, .content');
          if ((await projectContent.count()) > 0) {
            await expect(projectContent.first()).toBeVisible();
          }
        }
      });

      test('should maintain proper typography readability', async ({ page }) => {
        await page.goto('/');
        await waitForPageLoad(page);

        // Check body text readability
        const bodyText = page.locator('body').first();
        const textStyles = await bodyText.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            color: styles.color,
            fontSize: styles.fontSize,
            lineHeight: styles.lineHeight,
            fontFamily: styles.fontFamily
          };
        });

        // Font size should be readable (at least 16px on mobile, 14px on desktop)
        const fontSize = parseInt(textStyles.fontSize, 10);
        if (device.isMobile) {
          expect(fontSize, 'Mobile font size should be at least 16px').toBeGreaterThanOrEqual(16);
        } else {
          expect(fontSize, 'Desktop font size should be at least 14px').toBeGreaterThanOrEqual(14);
        }

        // Check text color for readability (should be dark enough)
        expect(textStyles.color, 'Text color should be defined').toBeTruthy();

        // Check line height for readability
        const lineHeight = parseFloat(textStyles.lineHeight);
        if (!isNaN(lineHeight)) {
          expect(lineHeight, 'Line height should be reasonable for readability').toBeGreaterThan(
            fontSize
          );
        }
      });

      test('should handle mobile menu toggle functionality', async ({ page }) => {
        if (device.isMobile) {
          await page.goto('/');
          await waitForPageLoad(page);

          // Find hamburger menu
          const hamburgerSelectors = ['.hamburger', '.nav-toggle', '.mobile-menu-toggle'];
          let hamburger;
          for (const selector of hamburgerSelectors) {
            hamburger = page.locator(selector);
            if ((await hamburger.count()) > 0 && (await hamburger.isVisible())) {
              break;
            }
          }

          if (hamburger && (await hamburger.count()) > 0) {
            // Check menu is initially hidden
            const navMenuSelectors = ['.nav-menu', '.nav-links', '.mobile-menu'];
            let navMenu;
            for (const selector of navMenuSelectors) {
              navMenu = page.locator(selector);
              if ((await navMenu.count()) > 0) {
                break;
              }
            }

            if (navMenu) {
              // Initial state should be closed
              const initiallyHidden = await navMenu.evaluate(el => {
                const style = window.getComputedStyle(el);
                return (
                  style.display === 'none' ||
                  style.visibility === 'hidden' ||
                  parseFloat(style.opacity) === 0 ||
                  el.getAttribute('aria-expanded') === 'false'
                );
              });
              expect(initiallyHidden, 'Mobile menu should be initially hidden').toBe(true);

              // Click to open menu
              await hamburger.click();
              await page.waitForTimeout(300);

              // Menu should be visible after click
              const afterClickVisible = await navMenu.evaluate(el => {
                const style = window.getComputedStyle(el);
                return (
                  style.display !== 'none' &&
                  style.visibility !== 'hidden' &&
                  parseFloat(style.opacity) > 0
                );
              });
              expect(afterClickVisible, 'Mobile menu should be visible after click').toBe(true);

              // Click again to close
              await hamburger.click();
              await page.waitForTimeout(300);

              // Menu should be hidden again
              const afterSecondClickHidden = await navMenu.evaluate(el => {
                const style = window.getComputedStyle(el);
                return (
                  style.display === 'none' ||
                  style.visibility === 'hidden' ||
                  parseFloat(style.opacity) === 0
                );
              });
              expect(
                afterSecondClickHidden,
                'Mobile menu should be hidden after second click'
              ).toBe(true);
            }
          }
        }
      });

      test('should pass basic accessibility checks', async ({ page }) => {
        await page.goto('/');
        await waitForPageLoad(page);

        // Check all images have alt text
        const images = page.locator('img');
        const imageCount = await images.count();
        for (let i = 0; i < imageCount; i++) {
          const img = images.nth(i);
          const alt = await img.getAttribute('alt');
          const ariaLabel = await img.getAttribute('aria-label');
          expect(
            alt || ariaLabel,
            `Image ${i + 1} should have alt text or aria-label`
          ).toBeTruthy();
        }

        // Check all links have accessible text
        const links = page.locator('a');
        const linkCount = await links.count();
        for (let i = 0; i < Math.min(linkCount, 10); i++) {
          // Test first 10 links for performance
          const link = links.nth(i);
          const text = await link.textContent();
          const ariaLabel = await link.getAttribute('aria-label');
          const title = await link.getAttribute('title');
          expect(
            text?.trim() || ariaLabel || title,
            `Link ${i + 1} should have accessible text`
          ).toBeTruthy();
        }

        // Check focus indicators work
        const firstFocusableElement = page
          .locator('a, button, input, select, textarea, [tabindex]')
          .first();
        if ((await firstFocusableElement.count()) > 0) {
          await firstFocusableElement.focus();
          const focusedElement = page.locator(':focus');
          expect(await focusedElement.count(), 'Focus should be visible').toBeGreaterThan(0);
        }
      });
    });
  });

  // CROSS-PAGE LINK VALIDATION TESTS
  test.describe('Cross-Page Link Validation', () => {
    test('should validate all internal links across pages', async ({ page }) => {
      const internalLinks = new Set();

      // Collect internal links from all test pages
      for (const testPage of testPages) {
        await page.goto(testPage.url);
        await waitForPageLoad(page);

        const links = page.locator('a[href^="/"], a[href^="./"], a[href^="../"], a[href^="#"]');
        const linkCount = await links.count();

        for (let i = 0; i < linkCount; i++) {
          const link = links.nth(i);
          const href = await link.getAttribute('href');
          if (href && !href.startsWith('http') && !href.startsWith('mailto:')) {
            internalLinks.add(href);
          }
        }
      }

      // Validate each internal link
      for (const linkHref of internalLinks) {
        try {
          await page.goto(linkHref);
          await page.waitForLoadState('domcontentloaded');

          // Check that page loads without 404
          const pageTitle = await page.title();
          expect(pageTitle, `Page at ${linkHref} should have a title`).toBeTruthy();
          expect(pageTitle.toLowerCase(), `Page at ${linkHref} should not be 404`).not.toContain(
            '404'
          );
        } catch (error) {
          throw new Error(`Internal link ${linkHref} failed to load: ${error.message}`);
        }
      }
    });

    test('should validate external links have proper attributes', async ({ page }) => {
      await page.goto('/');
      await waitForPageLoad(page);

      const externalLinks = page.locator('a[href^="http"]');
      const linkCount = await externalLinks.count();

      for (let i = 0; i < linkCount; i++) {
        const link = externalLinks.nth(i);
        const href = await link.getAttribute('href');
        const target = await link.getAttribute('target');
        const rel = await link.getAttribute('rel');

        expect(href, `External link ${i + 1} should have href`).toBeTruthy();
        expect(target, `External link ${i + 1} should open in new tab`).toBe('_blank');
        expect(rel, `External link ${i + 1} should have security rel attribute`).toContain(
          'noopener'
        );
      }
    });
  });

  // LAYOUT AND RESPONSIVE BEHAVIOR TESTS
  test.describe('Layout and Responsive Behavior', () => {
    test('should prevent horizontal scroll on mobile devices', async ({ page }) => {
      const mobileViewports = testDevices.filter(d => d.isMobile).slice(0, 4); // Test subset

      for (const device of mobileViewports) {
        await page.setViewportSize(device.viewport);

        for (const testPage of testPages.slice(0, 3)) {
          // Test key pages
          await page.goto(testPage.url);
          await waitForPageLoad(page);

          // Check for horizontal scroll
          const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
          const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

          expect(
            scrollWidth,
            `No horizontal scroll on ${testPage.name} at ${device.name}`
          ).toBeLessThanOrEqual(clientWidth + 1);

          // Check viewport meta tag
          const viewportMeta = page.locator('meta[name="viewport"]');
          if ((await viewportMeta.count()) > 0) {
            const content = await viewportMeta.getAttribute('content');
            expect(content, 'Viewport meta should include width=device-width').toContain(
              'width=device-width'
            );
          }
        }
      }
    });

    test('should maintain consistent layout across breakpoints', async ({ page }) => {
      await page.goto('/');
      await waitForPageLoad(page);

      // Test key breakpoints
      const breakpoints = [
        { width: 320, height: 568 },
        { width: 768, height: 1024 },
        { width: 1024, height: 768 },
        { width: 1920, height: 1080 }
      ];

      for (const breakpoint of breakpoints) {
        await page.setViewportSize(breakpoint);
        await page.waitForTimeout(300); // Allow for responsive adjustments

        // Check that main layout elements are visible
        const mainElementSelectors = ['main', '.main', 'nav', 'footer'];
        for (const selector of mainElementSelectors) {
          const element = page.locator(selector);
          if ((await element.count()) > 0) {
            await expect(element.first()).toBeVisible();
          }
        }

        // Check no layout overflow
        const hasOverflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        expect(hasOverflow, `No horizontal overflow at ${breakpoint.width}px`).toBe(false);
      }
    });
  });

  // PERFORMANCE AND LOADING TESTS
  test.describe('Performance and Loading', () => {
    test('should load pages within acceptable time limits', async ({ page }) => {
      for (const testPage of testPages.slice(0, 3)) {
        // Test key pages
        const startTime = Date.now();

        await page.goto(testPage.url);
        await waitForPageLoad(page);

        const loadTime = Date.now() - startTime;
        expect(loadTime, `${testPage.name} should load within 5 seconds`).toBeLessThan(5000);

        // Check that essential content is visible
        const mainContent = page.locator('main, .content, .container, body > *');
        await expect(mainContent.first()).toBeVisible();
      }
    });

    test('should not cause layout shifts during load', async ({ page }) => {
      // Enable layout shift monitoring
      await page.addInitScript(() => {
        window.layoutShifts = [];
        if ('PerformanceObserver' in window) {
          new PerformanceObserver(list => {
            window.layoutShifts.push(...list.getEntries());
          }).observe({ type: 'layout-shift', buffered: true });
        }
      });

      await page.goto('/');
      await waitForPageLoad(page);
      await page.waitForTimeout(1000); // Allow for any additional loading

      const layoutShifts = await page.evaluate(() => window.layoutShifts || []);
      const cls = layoutShifts.reduce((sum, shift) => sum + shift.value, 0);

      // Cumulative Layout Shift should be less than 0.1 for good UX
      expect(cls, 'Cumulative Layout Shift should be minimal').toBeLessThan(0.1);
    });
  });
});
