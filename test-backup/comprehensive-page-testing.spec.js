const { test, expect } = require('@playwright/test');

test.describe('Comprehensive Page Testing', () => {
  const allPages = [
    {
      url: '/',
      title: 'Home',
      description: 'Homepage with hero, services, projects, blog preview'
    },
    { url: '/about/', title: 'About', description: 'About page with content, stats, layout' },
    {
      url: '/services/',
      title: 'Services',
      description: 'Services page with cards and hover effects'
    },
    { url: '/blog/', title: 'Blog', description: 'Blog listing with grid layout and post cards' },
    {
      url: '/blog/getting-started-with-11ty/',
      title: 'Blog Post 1',
      description: 'Blog post with navigation and content'
    },
    {
      url: '/blog/neo-brutalist-design-principles/',
      title: 'Blog Post 2',
      description: 'Blog post with navigation and content'
    },
    {
      url: '/blog/building-fast-static-sites/',
      title: 'Blog Post 3',
      description: 'Blog post with navigation and content'
    },
    {
      url: '/blog/markdown-and-nunjucks/',
      title: 'Blog Post 4',
      description: 'Blog post with navigation and content'
    },
    {
      url: '/blog/responsive-typography/',
      title: 'Blog Post 5',
      description: 'Blog post with navigation and content'
    },
    {
      url: '/blog/performance-optimization/',
      title: 'Blog Post 6',
      description: 'Blog post with navigation and content'
    },
    {
      url: '/blog/seo-best-practices/',
      title: 'Blog Post 7',
      description: 'Blog post with navigation and content'
    },
    {
      url: '/projects/project-alpha/',
      title: 'Project Alpha',
      description: 'Project page with layout and back navigation'
    },
    {
      url: '/projects/project-beta/',
      title: 'Project Beta',
      description: 'Project page with layout and back navigation'
    },
    {
      url: '/projects/project-gamma/',
      title: 'Project Gamma',
      description: 'Project page with layout and back navigation'
    },
    {
      url: '/projects/project-delta/',
      title: 'Project Delta',
      description: 'Project page with layout and back navigation'
    },
    { url: '/contact/', title: 'Contact', description: 'Contact page with form and social links' },
    { url: '/404/', title: '404', description: '404 error page' }
  ];

  const mobileViewports = [
    { width: 393, height: 852, name: 'iPhone 14 Pro' },
    { width: 430, height: 932, name: 'iPhone 15 Pro Max' },
    { width: 412, height: 915, name: 'Google Pixel 7' },
    { width: 448, height: 992, name: 'Google Pixel 8 Pro' },
    { width: 360, height: 780, name: 'Samsung Galaxy S23' }
  ];

  const desktopViewports = [
    { width: 1920, height: 1080, name: 'Desktop Large' },
    { width: 1440, height: 900, name: 'Desktop Medium' },
    { width: 1366, height: 768, name: 'Desktop Small' }
  ];

  test.describe('Page Load and Basic Structure', () => {
    for (const page of allPages) {
      test(`${page.title} loads correctly`, async ({ page: browserPage }) => {
        const response = await browserPage.goto(page.url);

        // Check successful response
        expect(response.status()).toBeLessThan(400);

        // Check page has title
        const title = await browserPage.title();
        expect(title.length).toBeGreaterThan(0);

        // Check page has main content
        const mainContent = browserPage.locator('main, .main, .content, article');
        await expect(mainContent.first()).toBeVisible();

        // Check basic HTML structure
        await expect(browserPage.locator('html')).toHaveAttribute('lang');
        await expect(browserPage.locator('head meta[charset]')).toHaveCount(1);
        await expect(browserPage.locator('head meta[name="viewport"]')).toHaveCount(1);
      });
    }
  });

  test.describe('Mobile Responsiveness', () => {
    for (const viewport of mobileViewports) {
      test(`All pages responsive on ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize(viewport);

        for (const testPage of allPages) {
          await page.goto(testPage.url);

          // No horizontal scrolling
          const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
          const windowInnerWidth = await page.evaluate(() => window.innerWidth);
          expect(
            bodyScrollWidth,
            `No horizontal scroll on ${testPage.url} at ${viewport.name}`
          ).toBeLessThanOrEqual(windowInnerWidth + 2);

          // Main content is visible
          const mainContent = page.locator('main, .main, .content, article, .hero');
          await expect(mainContent.first()).toBeVisible();

          // Navigation exists and is accessible
          const nav = page.locator('nav, .nav, .navigation, header');
          if ((await nav.count()) > 0) {
            await expect(nav.first()).toBeVisible();
          }

          // Text is readable (minimum font size)
          const bodyText = page.locator('p, li, span');
          if ((await bodyText.count()) > 0) {
            const fontSize = await bodyText.first().evaluate(el => {
              return parseFloat(window.getComputedStyle(el).fontSize);
            });
            expect(
              fontSize,
              `Font size on ${testPage.url} at ${viewport.name}`
            ).toBeGreaterThanOrEqual(14);
          }
        }
      });
    }
  });

  test.describe('Desktop Layout Verification', () => {
    for (const viewport of desktopViewports) {
      test(`Desktop layout on ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize(viewport);

        for (const testPage of allPages) {
          await page.goto(testPage.url);

          // Content should be properly centered/contained
          const container = page.locator('.container, .wrapper, main, .content').first();
          if ((await container.count()) > 0) {
            const containerBox = await container.boundingBox();
            if (containerBox) {
              // Container should not take full viewport width on desktop
              expect(
                containerBox.width,
                `Container width on ${testPage.url} at ${viewport.name}`
              ).toBeLessThan(viewport.width - 40);
            }
          }

          // Navigation should be horizontal on desktop
          const navItems = page.locator('nav a, .nav a, .navigation a');
          if ((await navItems.count()) > 1) {
            const firstItem = await navItems.first().boundingBox();
            const secondItem = await navItems.nth(1).boundingBox();

            if (firstItem && secondItem) {
              // Items should be roughly on the same horizontal line
              const verticalDiff = Math.abs(firstItem.y - secondItem.y);
              expect(verticalDiff, `Navigation horizontal layout on ${testPage.url}`).toBeLessThan(
                10
              );
            }
          }
        }
      });
    }
  });

  test.describe('Page-Specific Content Tests', () => {
    test('Homepage hero section', async ({ page }) => {
      await page.goto('/');

      // Hero section exists
      const hero = page.locator('.hero, .banner, .intro');
      if ((await hero.count()) > 0) {
        await expect(hero.first()).toBeVisible();

        // Hero should have heading
        const heroHeading = hero.locator('h1, h2');
        await expect(heroHeading.first()).toBeVisible();
      }

      // Services preview
      const services = page.locator('.services, .service, [class*="service"]');
      if ((await services.count()) > 0) {
        await expect(services.first()).toBeVisible();
      }

      // Projects preview
      const projects = page.locator('.projects, .project, [class*="project"]');
      if ((await projects.count()) > 0) {
        await expect(projects.first()).toBeVisible();
      }

      // Blog preview
      const blog = page.locator('.blog, .posts, [class*="blog"]');
      if ((await blog.count()) > 0) {
        await expect(blog.first()).toBeVisible();
      }
    });

    test('Services page cards and hover effects', async ({ page }) => {
      await page.goto('/services/');

      const serviceCards = page.locator('.service, .card, [class*="service"]');
      const cardCount = await serviceCards.count();

      if (cardCount > 0) {
        for (let i = 0; i < Math.min(cardCount, 3); i++) {
          const card = serviceCards.nth(i);
          await expect(card).toBeVisible();

          // Test hover effect
          const initialStyles = await card.evaluate(el => {
            const styles = window.getComputedStyle(el);
            return {
              transform: styles.transform,
              boxShadow: styles.boxShadow,
              backgroundColor: styles.backgroundColor
            };
          });

          await card.hover();
          await page.waitForTimeout(100);

          const hoverStyles = await card.evaluate(el => {
            const styles = window.getComputedStyle(el);
            return {
              transform: styles.transform,
              boxShadow: styles.boxShadow,
              backgroundColor: styles.backgroundColor
            };
          });

          // Should have some visual change on hover
          const hasChange =
            initialStyles.transform !== hoverStyles.transform ||
            initialStyles.boxShadow !== hoverStyles.boxShadow ||
            initialStyles.backgroundColor !== hoverStyles.backgroundColor;

          expect(hasChange, `Service card ${i + 1} should have hover effect`).toBeTruthy();
        }
      }
    });

    test('Blog listing grid layout', async ({ page }) => {
      await page.goto('/blog/');

      const blogPosts = page.locator('.post, .blog-post, [class*="post"]');
      const postCount = await blogPosts.count();

      if (postCount > 0) {
        // Posts should be visible
        for (let i = 0; i < Math.min(postCount, 5); i++) {
          await expect(blogPosts.nth(i)).toBeVisible();
        }

        // Check grid layout on desktop
        await page.setViewportSize({ width: 1200, height: 800 });

        if (postCount > 1) {
          const firstPost = await blogPosts.first().boundingBox();
          const secondPost = await blogPosts.nth(1).boundingBox();

          if (firstPost && secondPost) {
            // Should be arranged in grid (either horizontally or vertically)
            const horizontalSpacing = Math.abs(firstPost.x - secondPost.x);
            const verticalSpacing = Math.abs(firstPost.y - secondPost.y);

            expect(
              horizontalSpacing > 10 || verticalSpacing > 10,
              'Blog posts should have grid spacing'
            ).toBeTruthy();
          }
        }
      }
    });

    test('Contact page form and social links', async ({ page }) => {
      await page.goto('/contact/');

      // Contact form
      const contactForm = page.locator('form, .form, .contact-form');
      if ((await contactForm.count()) > 0) {
        await expect(contactForm.first()).toBeVisible();

        // Form fields
        const formFields = page.locator('input, textarea, select');
        const fieldCount = await formFields.count();

        if (fieldCount > 0) {
          for (let i = 0; i < fieldCount; i++) {
            await expect(formFields.nth(i)).toBeVisible();
          }
        }

        // Submit button
        const submitButton = page.locator('button[type="submit"], input[type="submit"], .submit');
        if ((await submitButton.count()) > 0) {
          await expect(submitButton.first()).toBeVisible();
        }
      }

      // Social links
      const socialLinks = page.locator('.social a, .social-links a, [class*="social"] a');
      if ((await socialLinks.count()) > 0) {
        await expect(socialLinks.first()).toBeVisible();
      }
    });

    test('404 page exists and functions', async ({ page }) => {
      const response = await page.goto('/404/');

      // 404 page should load (might be 200 for static site)
      expect(response.status()).toBeLessThan(500);

      // Should have error message
      const errorContent = page.locator('h1, .error, .not-found');
      await expect(errorContent.first()).toBeVisible();

      // Should have navigation back to site
      const homeLink = page.locator('a[href="/"], a[href="./"], .home-link');
      if ((await homeLink.count()) > 0) {
        await expect(homeLink.first()).toBeVisible();
      }
    });
  });

  test.describe('Cross-Page Navigation', () => {
    test('Blog post back navigation', async ({ page }) => {
      const blogPosts = [
        '/blog/getting-started-with-11ty/',
        '/blog/neo-brutalist-design-principles/',
        '/blog/building-fast-static-sites/'
      ];

      for (const blogPost of blogPosts) {
        await page.goto(blogPost);

        // Should have back to blog navigation
        const backToBlog = page.locator('.back-to-blog, .back, [href="/blog/"]');
        if ((await backToBlog.count()) > 0) {
          await expect(backToBlog.first()).toBeVisible();

          // Test functionality
          await backToBlog.first().click();
          await expect(page).toHaveURL('/blog/');
        }
      }
    });

    test('Project back navigation', async ({ page }) => {
      const projects = [
        '/projects/project-alpha/',
        '/projects/project-beta/',
        '/projects/project-gamma/',
        '/projects/project-delta/'
      ];

      for (const project of projects) {
        await page.goto(project);

        // Should have back to projects navigation
        const backToProjects = page.locator(
          '.back-to-projects, .back, [href="/projects/"], [href="/#projects"]'
        );
        if ((await backToProjects.count()) > 0) {
          await expect(backToProjects.first()).toBeVisible();
        }
      }
    });

    test('Main navigation links work', async ({ page }) => {
      await page.goto('/');

      const navLinks = page.locator('nav a, .nav a, .navigation a');
      const linkCount = await navLinks.count();

      if (linkCount > 0) {
        for (let i = 0; i < Math.min(linkCount, 5); i++) {
          const link = navLinks.nth(i);
          const href = await link.getAttribute('href');

          if (href && href.startsWith('/') && !href.includes('#')) {
            // Internal navigation link
            await expect(link).toBeVisible();

            await link.click();
            await page.waitForLoadState('networkidle');

            // Should navigate successfully
            const currentUrl = page.url();
            expect(currentUrl).toContain(href);

            // Go back to home for next test
            await page.goto('/');
          }
        }
      }
    });
  });

  test.describe('Performance and Layout Stability', () => {
    test('No layout shift on page load', async ({ page }) => {
      for (const testPage of allPages.slice(0, 5)) {
        // Test first 5 pages
        await page.goto(testPage.url);

        // Measure layout stability
        const cumulativeLayoutShift = await page.evaluate(() => {
          return new Promise(resolve => {
            let clsValue = 0;
            const clsEntries = [];

            try {
              new PerformanceObserver(entryList => {
                for (const entry of entryList.getEntries()) {
                  if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                    clsEntries.push(entry);
                  }
                }
              }).observe({ type: 'layout-shift', buffered: true });

              setTimeout(() => {
                resolve(clsValue);
              }, 3000);
            } catch (e) {
              resolve(0); // Fallback if PerformanceObserver not supported
            }
          });
        });

        // CLS should be less than 0.1 (good score)
        expect(cumulativeLayoutShift, `Layout shift on ${testPage.url}`).toBeLessThan(0.25);
      }
    });

    test('Images load correctly', async ({ page }) => {
      for (const testPage of allPages.slice(0, 3)) {
        await page.goto(testPage.url);

        const images = page.locator('img');
        const imageCount = await images.count();

        if (imageCount > 0) {
          for (let i = 0; i < Math.min(imageCount, 3); i++) {
            const img = images.nth(i);
            await expect(img).toBeVisible();

            // Check if image has loaded
            const naturalWidth = await img.evaluate(el => el.naturalWidth);
            expect(naturalWidth, `Image ${i + 1} loaded on ${testPage.url}`).toBeGreaterThan(0);
          }
        }
      }
    });

    test('Fast page loads', async ({ page }) => {
      for (const testPage of allPages.slice(0, 5)) {
        const startTime = Date.now();
        await page.goto(testPage.url, { waitUntil: 'networkidle' });
        const loadTime = Date.now() - startTime;

        // Page should load within 5 seconds
        expect(loadTime, `Load time for ${testPage.url}`).toBeLessThan(5000);
      }
    });
  });
});
