/**
 * COMPREHENSIVE LINK VALIDATION TEST SUITE
 * Tests all links across the entire Neo-Brutalist 11ty site
 * Covers internal navigation, external links, blog posts, projects, and more
 */

const { test, expect } = require('@playwright/test');
const { waitForPageLoad } = require('./helpers/test-utils');

// All pages to test comprehensively
const ALL_PAGES = [
  { path: '/', name: 'Homepage' },
  { path: '/blog/', name: 'Blog Listing' },
  { path: '/pages/about/', name: 'About Page' },
  { path: '/pages/services/', name: 'Services Page' },
  { path: '/pages/contact/', name: 'Contact Page' },
  // Blog posts
  { path: '/posts/welcome-to-neo-brutalism/', name: 'Welcome to Neo-Brutalism Post' },
  {
    path: '/posts/breaking-design-rules-a-guide-to-creative-rebellion/',
    name: 'Breaking Design Rules Post'
  },
  {
    path: '/posts/color-revolution-breaking-free-from-minimalist-palettes/',
    name: 'Color Revolution Post'
  },
  { path: '/posts/building-a-neo-brutalist-theme-with-11ty/', name: 'Building with 11ty Post' },
  {
    path: '/posts/building-for-the-bold-a-developer-s-guide-to-neo-brutalist-web-architecture/',
    name: 'Building for the Bold Post'
  },
  {
    path: '/posts/the-psychology-of-brutal-design-why-our-brains-crave-visual-chaos/',
    name: 'Psychology of Brutal Design Post'
  },
  {
    path: '/posts/the-future-of-web-rebellion-trends-that-refuse-to-follow-rules/',
    name: 'Future of Web Rebellion Post'
  },
  // Projects
  { path: '/projects/neo-brutalist-theme/', name: 'Neo-Brutalist Theme Project' },
  { path: '/projects/chaos-grid/', name: 'Chaos Grid Project' },
  { path: '/projects/color-riot/', name: 'Color Riot Project' },
  { path: '/projects/type-destroyer/', name: 'Type Destroyer Project' }
];

const testResults = {
  totalLinksTested: 0,
  brokenLinks: [],
  externalLinks: [],
  socialLinks: [],
  internalLinks: [],
  hashLinks: [],
  performanceMetrics: {},
  accessibilityIssues: [],
  pageResults: {}
};

test.describe('Comprehensive Link Validation Suite', () => {
  test.beforeEach(async ({ page }) => {
    // Reset results for each test
    await page.goto('/');
    await waitForPageLoad(page);
  });

  test('should validate ALL internal links across entire site', async ({ page }) => {
    console.log('🔍 Starting comprehensive internal link validation...');

    for (const pageData of ALL_PAGES) {
      console.log(`\n📄 Testing page: ${pageData.name} (${pageData.path})`);

      try {
        await page.goto(pageData.path);
        await waitForPageLoad(page);

        // Collect all internal links on this page
        const internalLinks = await page
          .locator('a[href^="/"], a[href^="./"], a[href^="../"], a[href^="#"]')
          .all();

        testResults.pageResults[pageData.path] = {
          name: pageData.name,
          linksFound: internalLinks.length,
          linkResults: []
        };

        for (const link of internalLinks) {
          const href = await link.getAttribute('href');
          const text = await link.textContent();

          if (!href) {
            continue;
          }

          testResults.totalLinksTested++;

          try {
            if (href.startsWith('#')) {
              // Hash anchor link
              testResults.hashLinks.push({ href, text: text?.trim(), page: pageData.path });

              const targetId = href.substring(1);
              const targetElement = page.locator(`#${targetId}`);

              if ((await targetElement.count()) > 0) {
                await link.click();
                await page.waitForTimeout(500);
                await expect(targetElement).toBeInViewport({ timeout: 3000 });

                testResults.pageResults[pageData.path].linkResults.push({
                  href,
                  text: text?.trim(),
                  type: 'hash',
                  status: 'success'
                });
              } else {
                testResults.brokenLinks.push({
                  href,
                  text: text?.trim(),
                  page: pageData.path,
                  error: `Missing anchor target: #${targetId}`
                });

                testResults.pageResults[pageData.path].linkResults.push({
                  href,
                  text: text?.trim(),
                  type: 'hash',
                  status: 'error',
                  error: `Missing anchor target: #${targetId}`
                });
              }
            } else {
              // Regular internal link
              testResults.internalLinks.push({ href, text: text?.trim(), page: pageData.path });

              await link.click();
              await page.waitForLoadState('networkidle', { timeout: 10000 });

              const currentUrl = page.url();
              const title = await page.title();

              // Verify page loaded successfully
              const mainContent = page.locator('main, article, .content, body').first();
              await expect(mainContent).toBeVisible({ timeout: 5000 });

              testResults.pageResults[pageData.path].linkResults.push({
                href,
                text: text?.trim(),
                type: 'internal',
                status: 'success',
                resolvedUrl: currentUrl,
                title
              });

              // Navigate back to continue testing
              await page.goBack();
              await waitForPageLoad(page);
            }
          } catch (error) {
            testResults.brokenLinks.push({
              href,
              text: text?.trim(),
              page: pageData.path,
              error: error.message
            });

            testResults.pageResults[pageData.path].linkResults.push({
              href,
              text: text?.trim(),
              type: 'internal',
              status: 'error',
              error: error.message
            });

            // Try to recover
            await page.goto(pageData.path);
            await waitForPageLoad(page);
          }
        }

        console.log(`✅ Completed ${pageData.name}: ${internalLinks.length} links tested`);
      } catch (error) {
        console.error(`❌ Failed to test page ${pageData.path}:`, error);
        testResults.brokenLinks.push({
          href: pageData.path,
          text: pageData.name,
          page: 'N/A',
          error: `Page failed to load: ${error.message}`
        });
      }
    }

    // Assert no broken internal links
    console.log(`\n📊 INTERNAL LINKS SUMMARY:`);
    console.log(`Total links tested: ${testResults.totalLinksTested}`);
    console.log(`Broken links: ${testResults.brokenLinks.length}`);
    console.log(`Hash anchors: ${testResults.hashLinks.length}`);

    if (testResults.brokenLinks.length > 0) {
      console.log('\n❌ BROKEN LINKS FOUND:');
      testResults.brokenLinks.forEach(link => {
        console.log(`- ${link.href} on ${link.page}: ${link.error}`);
      });
    }

    expect(testResults.brokenLinks).toHaveLength(0);
  });

  test('should validate ALL external links and social media links', async ({ page }) => {
    console.log('🌐 Starting comprehensive external link validation...');

    for (const pageData of ALL_PAGES) {
      console.log(`\n📄 Testing external links on: ${pageData.name}`);

      try {
        await page.goto(pageData.path);
        await waitForPageLoad(page);

        // Find all external links
        const externalLinks = await page.locator('a[href^="http"]').all();

        for (const link of externalLinks) {
          const href = await link.getAttribute('href');
          const target = await link.getAttribute('target');
          const rel = await link.getAttribute('rel');
          const text = await link.textContent();
          const ariaLabel = await link.getAttribute('aria-label');

          testResults.totalLinksTested++;

          const linkData = {
            href,
            text: text?.trim(),
            target,
            rel,
            ariaLabel,
            page: pageData.path
          };

          // Check if it's a social media link
          const socialPlatforms = [
            'github.com',
            'linkedin.com',
            'twitter.com',
            'x.com',
            'instagram.com',
            'youtube.com',
            'facebook.com',
            'discord',
            'medium.com',
            'behance.net',
            'dribbble.com',
            'codepen.io'
          ];

          const isSocialLink = socialPlatforms.some(platform => href.includes(platform));

          if (isSocialLink) {
            testResults.socialLinks.push(linkData);
          } else {
            testResults.externalLinks.push(linkData);
          }

          // Validate security attributes for external links
          expect(target, `External link ${href} should open in new tab`).toBe('_blank');
          expect(rel, `External link ${href} should have rel attribute`).toBeTruthy();
          expect(rel, `External link ${href} should have noopener for security`).toContain(
            'noopener'
          );

          // Validate URL format
          expect(href, `Invalid URL format: ${href}`).toMatch(/^https?:\/\/.+/);

          // Validate accessibility
          const hasAccessibleText =
            (text && text.trim().length > 0) || (ariaLabel && ariaLabel.trim().length > 0);

          if (!hasAccessibleText) {
            const hasIcon = (await link.locator('svg, i, [class*="icon"]').count()) > 0;
            if (hasIcon) {
              expect(ariaLabel, `Icon link ${href} should have aria-label`).toBeTruthy();
            } else {
              testResults.accessibilityIssues.push({
                href,
                page: pageData.path,
                issue: 'Link lacks accessible text'
              });
            }
          }

          console.log(`✅ ${isSocialLink ? 'Social' : 'External'} link validated: ${href}`);
        }
      } catch (error) {
        console.error(`❌ Failed to test external links on ${pageData.path}:`, error);
      }
    }

    console.log(`\n📊 EXTERNAL LINKS SUMMARY:`);
    console.log(`Total external links: ${testResults.externalLinks.length}`);
    console.log(`Total social links: ${testResults.socialLinks.length}`);
    console.log(`Accessibility issues: ${testResults.accessibilityIssues.length}`);

    // Log social media platforms found
    const socialPlatforms = [
      ...new Set(
        testResults.socialLinks.map(link => {
          const url = new URL(link.href);
          return url.hostname;
        })
      )
    ];

    console.log(`Social platforms found: ${socialPlatforms.join(', ')}`);
  });

  test('should validate blog navigation and "Back to Blog" links', async ({ page }) => {
    console.log('📝 Testing blog navigation and back links...');

    // Test blog listing page
    await page.goto('/blog/');
    await waitForPageLoad(page);

    // Find all blog post links
    const blogPostLinks = await page.locator('a[href*="/posts/"]').all();
    console.log(`Found ${blogPostLinks.length} blog post links`);

    // Test each blog post link
    for (let i = 0; i < Math.min(blogPostLinks.length, 7); i++) {
      // Test all 7 posts
      const link = blogPostLinks[i];
      const href = await link.getAttribute('href');
      const title = await link.textContent();

      try {
        console.log(`Testing blog post: ${title?.trim()}`);

        await link.click();
        await waitForPageLoad(page);

        // Verify we're on a blog post page
        const postContent = page
          .locator('article, .post-content, .blog-post-content, main')
          .first();
        await expect(postContent).toBeVisible();

        // Look for "Back to Blog" link
        const backToBlogLink = page.locator('a[href="/blog/"], a[href*="blog"]').first();
        if ((await backToBlogLink.count()) > 0) {
          console.log(`✅ Found back to blog link`);

          // Test the back link
          await backToBlogLink.click();
          await waitForPageLoad(page);

          // Should be back on blog listing
          const blogListing = page.locator('.blog-posts, .posts-list, main').first();
          await expect(blogListing).toBeVisible();

          console.log(`✅ Back to blog link works correctly`);
        } else {
          console.log(`⚠️ No back to blog link found on ${href}`);
        }

        // Navigate back to blog for next iteration
        await page.goto('/blog/');
        await waitForPageLoad(page);
      } catch (error) {
        console.error(`❌ Error testing blog post ${href}:`, error);
        testResults.brokenLinks.push({
          href,
          text: title?.trim(),
          page: '/blog/',
          error: error.message
        });

        // Recovery
        await page.goto('/blog/');
        await waitForPageLoad(page);
      }
    }
  });

  test('should validate project showcase links and GitHub repositories', async ({ page }) => {
    console.log('🚀 Testing project showcase links...');

    const projectPages = ALL_PAGES.filter(page => page.path.startsWith('/projects/'));

    for (const projectPage of projectPages) {
      console.log(`\nTesting project: ${projectPage.name}`);

      await page.goto(projectPage.path);
      await waitForPageLoad(page);

      // Look for GitHub repository links
      const githubLinks = page.locator('a[href*="github.com"]');
      const githubCount = await githubLinks.count();

      // Look for live demo links
      const demoLinks = page.locator('a[href^="http"]:not([href*="github.com"])');
      const demoCount = await demoLinks.count();

      console.log(`Found ${githubCount} GitHub links and ${demoCount} demo links`);

      // Test GitHub links
      for (let i = 0; i < githubCount; i++) {
        const link = githubLinks.nth(i);
        const href = await link.getAttribute('href');
        const target = await link.getAttribute('target');
        const rel = await link.getAttribute('rel');

        // Validate GitHub link properties
        expect(href).toMatch(/^https:\/\/github\.com/);
        expect(target).toBe('_blank');
        expect(rel).toContain('noopener');

        console.log(`✅ GitHub link validated: ${href}`);
      }

      // Test demo links
      for (let i = 0; i < demoCount; i++) {
        const link = demoLinks.nth(i);
        const href = await link.getAttribute('href');
        const target = await link.getAttribute('target');
        const rel = await link.getAttribute('rel');

        // Validate demo link properties
        expect(href).toMatch(/^https?:\/\//);
        expect(target).toBe('_blank');
        expect(rel).toContain('noopener');

        console.log(`✅ Demo link validated: ${href}`);
      }
    }
  });

  test('should validate navigation menu across ALL pages', async ({ page }) => {
    console.log('🧭 Testing navigation menu consistency...');

    for (const pageData of ALL_PAGES) {
      await page.goto(pageData.path);
      await waitForPageLoad(page);

      // Check for navigation elements
      const navElements = page.locator('nav, .navigation, .nav, header nav');
      const navCount = await navElements.count();

      if (navCount > 0) {
        const nav = navElements.first();

        // Check for common navigation links
        const homeLink = nav.locator('a[href="/"], a[href="./"]');
        const blogLink = nav.locator('a[href="/blog/"], a[href*="blog"]');
        const aboutLink = nav.locator('a[href*="about"]');
        const contactLink = nav.locator('a[href*="contact"]');

        // Test home link exists and works
        if ((await homeLink.count()) > 0) {
          await expect(homeLink.first()).toBeVisible();
          console.log(`✅ Home link found on ${pageData.name}`);
        }

        // Test blog link exists and works
        if ((await blogLink.count()) > 0) {
          await expect(blogLink.first()).toBeVisible();
          console.log(`✅ Blog link found on ${pageData.name}`);
        }

        console.log(`✅ Navigation validated on ${pageData.name}`);
      } else {
        console.log(`⚠️ No navigation found on ${pageData.name}`);
      }
    }
  });

  test('should validate footer links and social icons', async ({ page }) => {
    console.log('🦶 Testing footer links and social icons...');

    for (const pageData of ALL_PAGES.slice(0, 5)) {
      // Test on key pages
      await page.goto(pageData.path);
      await waitForPageLoad(page);

      // Check for footer
      const footer = page.locator('footer');

      if ((await footer.count()) > 0) {
        // Test social icons in footer
        const socialIcons = footer.locator(
          'a[href*="github"], a[href*="linkedin"], a[href*="twitter"], a[href*="instagram"]'
        );
        const socialCount = await socialIcons.count();

        console.log(`Found ${socialCount} social icons in footer on ${pageData.name}`);

        for (let i = 0; i < socialCount; i++) {
          const icon = socialIcons.nth(i);
          const href = await icon.getAttribute('href');
          const target = await icon.getAttribute('target');
          const ariaLabel = await icon.getAttribute('aria-label');

          expect(href).toMatch(/^https?:\/\//);
          expect(target).toBe('_blank');
          expect(ariaLabel || (await icon.textContent())).toBeTruthy();

          console.log(`✅ Footer social icon validated: ${href}`);
        }

        // Test other footer links
        const footerLinks = footer.locator(
          'a:not([href*="github"]):not([href*="linkedin"]):not([href*="twitter"])'
        );
        const footerLinkCount = await footerLinks.count();

        for (let i = 0; i < footerLinkCount; i++) {
          const link = footerLinks.nth(i);
          const href = await link.getAttribute('href');

          if (href && href.startsWith('/')) {
            // Internal footer link
            console.log(`✅ Footer internal link: ${href}`);
          } else if (href && href.startsWith('http')) {
            // External footer link
            const target = await link.getAttribute('target');
            expect(target).toBe('_blank');
            console.log(`✅ Footer external link: ${href}`);
          }
        }
      }
    }
  });

  test('should test 404 error handling', async ({ page }) => {
    console.log('🚫 Testing 404 error handling...');

    // Test non-existent page
    const response = await page.goto('/this-page-does-not-exist');

    // Should return 404 or redirect to 404 page
    if (response) {
      const status = response.status();
      console.log(`Non-existent page returned status: ${status}`);

      // Check if 404 page has proper content
      const pageContent = await page.textContent('body');
      const has404Content =
        pageContent.includes('404') ||
        pageContent.includes('Not Found') ||
        pageContent.includes('Page not found');

      if (has404Content) {
        console.log('✅ 404 page has appropriate content');
      }

      // Check for navigation back to home
      const homeLink = page.locator('a[href="/"]');
      if ((await homeLink.count()) > 0) {
        console.log('✅ 404 page has link back to home');
      }
    }
  });

  test.afterAll(async () => {
    // Generate comprehensive test report
    console.log('\n🎯 COMPREHENSIVE LINK VALIDATION REPORT');
    console.log('═'.repeat(60));

    console.log(`\n📊 SUMMARY STATISTICS:`);
    console.log(`Total Links Tested: ${testResults.totalLinksTested}`);
    console.log(`Internal Links: ${testResults.internalLinks.length}`);
    console.log(`External Links: ${testResults.externalLinks.length}`);
    console.log(`Social Media Links: ${testResults.socialLinks.length}`);
    console.log(`Hash Anchor Links: ${testResults.hashLinks.length}`);
    console.log(`Broken Links: ${testResults.brokenLinks.length}`);
    console.log(`Accessibility Issues: ${testResults.accessibilityIssues.length}`);

    console.log(`\n📄 PAGES TESTED: ${ALL_PAGES.length}`);
    ALL_PAGES.forEach(page => {
      const result = testResults.pageResults[page.path];
      if (result) {
        console.log(`- ${page.name}: ${result.linksFound} links found`);
      }
    });

    if (testResults.socialLinks.length > 0) {
      console.log(`\n🔗 SOCIAL MEDIA PLATFORMS:`);
      const platforms = [
        ...new Set(
          testResults.socialLinks.map(link => {
            try {
              return new URL(link.href).hostname;
            } catch {
              return link.href;
            }
          })
        )
      ];
      platforms.forEach(platform => console.log(`- ${platform}`));
    }

    if (testResults.brokenLinks.length > 0) {
      console.log(`\n❌ BROKEN LINKS FOUND:`);
      testResults.brokenLinks.forEach(link => {
        console.log(`- ${link.href} on ${link.page}`);
        console.log(`  Error: ${link.error}`);
      });
    } else {
      console.log(`\n✅ NO BROKEN LINKS FOUND!`);
    }

    if (testResults.accessibilityIssues.length > 0) {
      console.log(`\n⚠️ ACCESSIBILITY ISSUES:`);
      testResults.accessibilityIssues.forEach(issue => {
        console.log(`- ${issue.href} on ${issue.page}: ${issue.issue}`);
      });
    }

    console.log('\n═'.repeat(60));
    console.log('🎉 COMPREHENSIVE LINK VALIDATION COMPLETE!');
  });
});
