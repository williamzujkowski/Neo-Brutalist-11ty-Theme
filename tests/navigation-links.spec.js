const { test, expect } = require('@playwright/test');

test.describe('Navigation Links Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Main Navigation Links', () => {
    test('All main navigation links work', async ({ page }) => {
      // Get all navigation links
      const navLinks = page.locator('nav a, .nav a, .navigation a, header a');
      const linkCount = await navLinks.count();

      const testedLinks = [];

      if (linkCount > 0) {
        for (let i = 0; i < linkCount; i++) {
          const link = navLinks.nth(i);
          const href = await link.getAttribute('href');
          const text = await link.textContent();

          if (href && !testedLinks.includes(href)) {
            testedLinks.push(href);

            console.log(`Testing navigation link: ${text} -> ${href}`);

            if (href.startsWith('/') && !href.includes('#')) {
              // Internal page link
              await link.click();
              await page.waitForLoadState('networkidle');

              // Verify navigation worked
              const currentUrl = page.url();
              expect(currentUrl, `Navigation to ${href} from ${text}`).toMatch(new RegExp(href.replace(/\/$/, '') + '/?$'));

              // Verify page loaded correctly
              const title = await page.title();
              expect(title.length, `Page title exists for ${href}`).toBeGreaterThan(0);

              // Go back to home for next test
              await page.goto('/');
            } else if (href.startsWith('#')) {
              // Anchor link - test scroll behavior
              await link.click();
              await page.waitForTimeout(500);

              // Check if target section exists
              const targetId = href.substring(1);
              const targetElement = page.locator(`#${targetId}`);
              if (await targetElement.count() > 0) {
                // Should scroll to element
                const isInViewport = await targetElement.isVisible();
                expect(isInViewport, `Anchor link ${href} should scroll to target`).toBeTruthy();
              }
            } else if (href.startsWith('http') || href.startsWith('mailto:')) {
              // External link - verify attributes
              const target = await link.getAttribute('target');
              const rel = await link.getAttribute('rel');

              expect(target, `External link ${href} should open in new tab`).toBe('_blank');
              expect(rel, `External link ${href} should have security attributes`).toMatch(/noopener|noreferrer/);
            }
          }
        }
      }
    });

    test('Mobile hamburger menu functionality', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });

      // Look for mobile menu toggle
      const menuToggle = page.locator('.menu-toggle, .nav-toggle, .hamburger, [aria-label*="menu"]');

      if (await menuToggle.count() > 0) {
        // Menu should be hidden initially
        const mobileNav = page.locator('.nav-menu, .mobile-nav, .nav-items');

        if (await mobileNav.count() > 0) {
          const initialVisibility = await mobileNav.isVisible();

          // Click menu toggle
          await menuToggle.click();
          await page.waitForTimeout(300);

          // Menu should be visible now
          const toggledVisibility = await mobileNav.isVisible();
          expect(toggledVisibility, 'Mobile menu should open when toggle is clicked').toBe(!initialVisibility);

          // Test menu links
          const mobileLinks = mobileNav.locator('a');
          const mobileLinkCount = await mobileLinks.count();

          if (mobileLinkCount > 0) {
            for (let i = 0; i < Math.min(mobileLinkCount, 3); i++) {
              const link = mobileLinks.nth(i);
              await expect(link).toBeVisible();

              const href = await link.getAttribute('href');
              if (href && href.startsWith('/') && !href.includes('#')) {
                await link.click();
                await page.waitForLoadState('networkidle');

                // Should navigate correctly
                const currentUrl = page.url();
                expect(currentUrl).toMatch(new RegExp(href.replace(/\/$/, '') + '/?$'));

                // Go back for next test
                await page.goto('/');
                await page.setViewportSize({ width: 390, height: 844 });

                // Reopen menu for next link
                if (i < mobileLinkCount - 1) {
                  await menuToggle.click();
                  await page.waitForTimeout(300);
                }
              }
            }
          }

          // Close menu
          await menuToggle.click();
          await page.waitForTimeout(300);
        }
      }
    });
  });

  test.describe('Blog Navigation', () => {
    test('Back to Blog navigation on all blog posts', async ({ page }) => {
      const blogPosts = [
        '/blog/getting-started-with-11ty/',
        '/blog/neo-brutalist-design-principles/',
        '/blog/building-fast-static-sites/',
        '/blog/markdown-and-nunjucks/',
        '/blog/responsive-typography/',
        '/blog/performance-optimization/',
        '/blog/seo-best-practices/'
      ];

      for (const blogPost of blogPosts) {
        await page.goto(blogPost);

        // Find back to blog navigation
        const backToBlog = page.locator('.back-to-blog a, .back a, [href="/blog/"]').first();

        if (await backToBlog.count() > 0) {
          await expect(backToBlog).toBeVisible();

          const href = await backToBlog.getAttribute('href');
          expect(href, `Back to blog link on ${blogPost}`).toBe('/blog/');

          // Test functionality
          await backToBlog.click();
          await page.waitForLoadState('networkidle');

          // Should be on blog listing page
          await expect(page).toHaveURL('/blog/');

          // Verify blog listing loaded
          const blogTitle = page.locator('h1');
          await expect(blogTitle).toBeVisible();
        }
      }
    });

    test('Blog post internal links', async ({ page }) => {
      await page.goto('/blog/getting-started-with-11ty/');

      // Check for internal links within blog content
      const contentLinks = page.locator('article a, .content a, .post-content a');
      const linkCount = await contentLinks.count();

      if (linkCount > 0) {
        for (let i = 0; i < Math.min(linkCount, 3); i++) {
          const link = contentLinks.nth(i);
          const href = await link.getAttribute('href');

          if (href && href.startsWith('/')) {
            // Internal link
            await expect(link).toBeVisible();

            await link.click();
            await page.waitForLoadState('networkidle');

            // Should navigate successfully
            const currentUrl = page.url();
            expect(currentUrl).toMatch(new RegExp(href.replace(/\/$/, '') + '/?$'));

            // Go back to blog post
            await page.goBack();
          }
        }
      }
    });

    test('Blog listing to post navigation', async ({ page }) => {
      await page.goto('/blog/');

      // Find blog post links
      const postLinks = page.locator('.post a, .blog-post a, [class*="post"] a').first();

      if (await postLinks.count() > 0) {
        const href = await postLinks.getAttribute('href');

        if (href && href.includes('/blog/')) {
          await postLinks.click();
          await page.waitForLoadState('networkidle');

          // Should be on individual blog post
          const currentUrl = page.url();
          expect(currentUrl).toContain('/blog/');
          expect(currentUrl).not.toBe('http://localhost:8080/blog/');

          // Should have article content
          const article = page.locator('article, .post-content, .content');
          await expect(article.first()).toBeVisible();
        }
      }
    });
  });

  test.describe('Project Navigation', () => {
    test('Back to Projects navigation', async ({ page }) => {
      const projects = [
        '/projects/project-alpha/',
        '/projects/project-beta/',
        '/projects/project-gamma/',
        '/projects/project-delta/'
      ];

      for (const project of projects) {
        await page.goto(project);

        // Find back to projects navigation
        const backToProjects = page.locator('.back-to-projects a, .back a, [href*="projects"], [href="/#projects"]').first();

        if (await backToProjects.count() > 0) {
          await expect(backToProjects).toBeVisible();

          const href = await backToProjects.getAttribute('href');
          expect(href, `Back to projects link on ${project}`).toMatch(/(\/projects\/|#projects)/);

          // Test functionality
          await backToProjects.click();
          await page.waitForLoadState('networkidle');

          // Should navigate to projects section
          const currentUrl = page.url();
          expect(currentUrl).toMatch(/(\/projects|#projects)/);
        }
      }
    });

    test('Project showcase links from homepage', async ({ page }) => {
      await page.goto('/');

      // Find project links on homepage
      const projectLinks = page.locator('.project a, .projects a, [class*="project"] a');
      const linkCount = await projectLinks.count();

      if (linkCount > 0) {
        for (let i = 0; i < Math.min(linkCount, 2); i++) {
          const link = projectLinks.nth(i);
          const href = await link.getAttribute('href');

          if (href && href.includes('/projects/')) {
            await link.click();
            await page.waitForLoadState('networkidle');

            // Should be on project page
            const currentUrl = page.url();
            expect(currentUrl).toContain('/projects/');

            // Should have project content
            const projectContent = page.locator('main, .content, .project-content');
            await expect(projectContent.first()).toBeVisible();

            // Go back to home
            await page.goto('/');
          }
        }
      }
    });
  });

  test.describe('External Links', () => {
    test('External links have proper attributes', async ({ page }) => {
      const pages = ['/', '/about/', '/contact/'];

      for (const pageUrl of pages) {
        await page.goto(pageUrl);

        const externalLinks = page.locator('a[href^="http"], a[href^="mailto:"]');
        const linkCount = await externalLinks.count();

        if (linkCount > 0) {
          for (let i = 0; i < linkCount; i++) {
            const link = externalLinks.nth(i);
            const href = await link.getAttribute('href');
            const target = await link.getAttribute('target');
            const rel = await link.getAttribute('rel');

            if (href && href.startsWith('http')) {
              // External HTTP links
              expect(target, `External link ${href} should open in new tab`).toBe('_blank');
              expect(rel, `External link ${href} should have security attributes`).toMatch(/noopener/);
            } else if (href && href.startsWith('mailto:')) {
              // Email links
              expect(href, `Email link should be valid`).toMatch(/^mailto:[^@]+@[^@]+\.[^@]+/);
            }
          }
        }
      }
    });

    test('Social media links functionality', async ({ page }) => {
      const pages = ['/', '/contact/', '/about/'];

      for (const pageUrl of pages) {
        await page.goto(pageUrl);

        const socialLinks = page.locator('.social a, .social-links a, [class*="social"] a');
        const linkCount = await socialLinks.count();

        if (linkCount > 0) {
          for (let i = 0; i < linkCount; i++) {
            const link = socialLinks.nth(i);
            const href = await link.getAttribute('href');
            const ariaLabel = await link.getAttribute('aria-label');
            const title = await link.getAttribute('title');

            // Should have valid href
            expect(href, `Social link ${i + 1} should have href`).toBeTruthy();
            expect(href.length, `Social link ${i + 1} href should not be empty`).toBeGreaterThan(0);

            // Should have accessibility attributes
            expect(ariaLabel || title, `Social link ${i + 1} should have aria-label or title`).toBeTruthy();

            // Should have proper security attributes for external links
            if (href && href.startsWith('http')) {
              const target = await link.getAttribute('target');
              const rel = await link.getAttribute('rel');

              expect(target, `Social link ${href} should open in new tab`).toBe('_blank');
              expect(rel, `Social link ${href} should have noopener`).toMatch(/noopener/);
            }
          }
        }
      }
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('Tab navigation works correctly', async ({ page }) => {
      await page.goto('/');

      // Start tabbing through page
      let focusableElements = [];
      let tabCount = 0;
      const maxTabs = 20; // Prevent infinite loop

      while (tabCount < maxTabs) {
        await page.keyboard.press('Tab');
        tabCount++;

        const focusedElement = await page.evaluate(() => {
          const element = document.activeElement;
          return {
            tagName: element.tagName,
            href: element.href || null,
            text: element.textContent?.trim().substring(0, 50) || '',
            ariaLabel: element.getAttribute('aria-label'),
            className: element.className
          };
        });

        if (focusedElement.tagName === 'A' || focusedElement.tagName === 'BUTTON') {
          focusableElements.push(focusedElement);
        }

        // Stop if we've cycled back to the first element
        if (focusableElements.length > 1 &&
            focusedElement.href === focusableElements[0].href &&
            focusedElement.text === focusableElements[0].text) {
          break;
        }
      }

      // Should have found some focusable navigation elements
      expect(focusableElements.length, 'Should have focusable navigation elements').toBeGreaterThan(0);

      // Test Enter key activation on first focusable link
      if (focusableElements.length > 0 && focusableElements[0].href) {
        await page.keyboard.press('Tab'); // Focus first element again
        await page.keyboard.press('Enter');
        await page.waitForLoadState('networkidle');

        // Should navigate (unless it's an external link)
        const currentUrl = page.url();
        if (focusableElements[0].href.startsWith('/')) {
          expect(currentUrl).toContain(focusableElements[0].href);
        }
      }
    });

    test('Skip links for accessibility', async ({ page }) => {
      await page.goto('/');

      // Check for skip link (usually first focusable element)
      await page.keyboard.press('Tab');

      const firstFocused = await page.evaluate(() => {
        const element = document.activeElement;
        return {
          text: element.textContent?.toLowerCase() || '',
          href: element.href || null
        };
      });

      // Skip link typically contains "skip" and links to main content
      if (firstFocused.text.includes('skip')) {
        expect(firstFocused.href, 'Skip link should point to main content').toMatch(/#main|#content|#skip/);
      }
    });
  });

  test.describe('Link Performance', () => {
    test('No broken internal links', async ({ page }) => {
      const internalLinks = new Set();
      const pages = ['/', '/about/', '/services/', '/blog/', '/contact/'];

      // Collect all internal links
      for (const pageUrl of pages) {
        await page.goto(pageUrl);

        const links = page.locator('a[href^="/"]');
        const linkCount = await links.count();

        for (let i = 0; i < linkCount; i++) {
          const href = await links.nth(i).getAttribute('href');
          if (href && !href.includes('#') && !internalLinks.has(href)) {
            internalLinks.add(href);
          }
        }
      }

      // Test each unique internal link
      for (const link of Array.from(internalLinks).slice(0, 10)) { // Limit to first 10
        const response = await page.goto(link);
        expect(response.status(), `Link ${link} should not be broken`).toBeLessThan(400);
      }
    });

    test('Links load quickly', async ({ page }) => {
      await page.goto('/');

      const navigationLinks = page.locator('nav a, .nav a').first();

      if (await navigationLinks.count() > 0) {
        const href = await navigationLinks.getAttribute('href');

        if (href && href.startsWith('/')) {
          const startTime = Date.now();
          await navigationLinks.click();
          await page.waitForLoadState('networkidle');
          const loadTime = Date.now() - startTime;

          expect(loadTime, 'Navigation should be fast').toBeLessThan(3000);
        }
      }
    });
  });
});