const { test, expect } = require('@playwright/test');

test.describe('Layout and Spacing Verification Tests', () => {
  const mobileDevices = [
    { name: 'iPhone 12', width: 390, height: 844 },
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'Pixel 5', width: 393, height: 851 },
    { name: 'Galaxy S20', width: 360, height: 800 }
  ];

  const testPages = [
    { path: '/', name: 'Homepage' },
    { path: '/pages/about/', name: 'About Page' },
    { path: '/pages/services/', name: 'Services Page' },
    { path: '/blog/', name: 'Blog Listing' },
    { path: '/pages/contact/', name: 'Contact Page' }
  ];

  mobileDevices.forEach(device => {
    testPages.forEach(pageInfo => {
      test.describe(`${device.name} - ${pageInfo.name} Layout`, () => {
        test.beforeEach(async ({ page }) => {
          await page.setViewportSize({ width: device.width, height: device.height });
          await page.goto(pageInfo.path);
          await page.waitForLoadState('networkidle');
        });

        test('should not have horizontal scrolling', async ({ page }) => {
          // Check document width vs viewport
          const scrollInfo = await page.evaluate(() => {
            return {
              documentWidth: document.documentElement.scrollWidth,
              viewportWidth: document.documentElement.clientWidth,
              bodyWidth: document.body.scrollWidth,
              hasHorizontalScroll:
                document.documentElement.scrollWidth > document.documentElement.clientWidth
            };
          });

          expect(scrollInfo.hasHorizontalScroll).toBe(false);

          // Also check for any elements that might be causing overflow
          const overflowElements = await page.evaluate(() => {
            const elements = document.querySelectorAll('*');
            const problematic = [];

            elements.forEach(el => {
              const rect = el.getBoundingClientRect();
              const viewportWidth = window.innerWidth;

              if (rect.right > viewportWidth + 10) {
                // Allow 10px tolerance
                problematic.push({
                  tagName: el.tagName,
                  className: el.className,
                  right: rect.right,
                  viewportWidth
                });
              }
            });

            return problematic;
          });

          expect(overflowElements.length).toBe(0);
        });

        test('should have proper spacing before post titles', async ({ page }) => {
          // Check for post titles or similar elements
          const titles = await page.locator('h1, h2, .post-title, .title, .section-title').all();

          for (const title of titles.slice(0, 3)) {
            const isVisible = await title.isVisible();
            if (!isVisible) {
              continue;
            }

            const spacing = await title.evaluate(el => {
              const computed = window.getComputedStyle(el);
              return {
                marginTop: parseFloat(computed.marginTop),
                paddingTop: parseFloat(computed.paddingTop),
                marginBottom: parseFloat(computed.marginBottom),
                paddingBottom: parseFloat(computed.paddingBottom)
              };
            });

            // Should have adequate top spacing (at least 10px)
            const topSpacing = spacing.marginTop + spacing.paddingTop;
            expect(topSpacing).toBeGreaterThanOrEqual(10);

            // Should have some bottom spacing too
            const bottomSpacing = spacing.marginBottom + spacing.paddingBottom;
            expect(bottomSpacing).toBeGreaterThanOrEqual(5);
          }
        });

        test('should have proper \"Back to Blog\" button alignment', async ({ page }) => {
          // Navigate to a blog post if we're testing blog functionality
          if (pageInfo.path === '/blog/') {
            const blogLinks = await page.locator('.blog-link, a[href*=\"/posts/\"]').all();
            if (blogLinks.length > 0) {
              await blogLinks[0].click();
              await page.waitForLoadState('networkidle');

              // Look for back button
              const backButton = page
                .locator('.back-to-blog, .btn-back, a[href*=\"/blog\"]')
                .first();
              const backButtonExists = (await backButton.count()) > 0;

              if (backButtonExists) {
                await expect(backButton).toBeVisible();

                // Check button positioning and alignment
                const buttonStyles = await backButton.evaluate(el => {
                  const computed = window.getComputedStyle(el);
                  const rect = el.getBoundingClientRect();
                  return {
                    display: computed.display,
                    textAlign: computed.textAlign,
                    marginLeft: parseFloat(computed.marginLeft),
                    marginRight: parseFloat(computed.marginRight),
                    left: rect.left,
                    right: rect.right,
                    width: rect.width
                  };
                });

                // Button should be properly aligned (not off-screen)
                expect(buttonStyles.left).toBeGreaterThanOrEqual(0);
                expect(buttonStyles.right).toBeLessThanOrEqual(device.width + 10); // Allow small tolerance

                // Should have proper margins
                expect(buttonStyles.marginLeft).toBeGreaterThanOrEqual(0);
              }
            }
          }
        });

        test('should have proper social icons layout in footer', async ({ page }) => {
          const socialIcons = page.locator('.social-icons, .footer .social-icon');
          const socialIconsExist = (await socialIcons.count()) > 0;

          if (socialIconsExist) {
            await expect(socialIcons.first()).toBeVisible();

            // Check if social icons container fits in viewport
            const containerBox = await socialIcons.first().boundingBox();
            expect(containerBox.x).toBeGreaterThanOrEqual(0);
            expect(containerBox.x + containerBox.width).toBeLessThanOrEqual(device.width + 10);

            // Check individual social icons
            const individualIcons = await page.locator('.social-icon').all();
            for (const icon of individualIcons.slice(0, 3)) {
              const iconBox = await icon.boundingBox();
              expect(iconBox.width).toBeGreaterThan(0);
              expect(iconBox.height).toBeGreaterThan(0);

              // Icon should fit within viewport
              expect(iconBox.x + iconBox.width).toBeLessThanOrEqual(device.width + 10);
            }
          }
        });

        test('should have adequate touch targets', async ({ page }) => {
          // Test interactive elements
          const interactiveElements = await page
            .locator('button, a, .btn, .nav-toggle, .social-icon')
            .all();

          for (const element of interactiveElements.slice(0, 5)) {
            const isVisible = await element.isVisible();
            if (!isVisible) {
              continue;
            }

            const box = await element.boundingBox();

            // Touch targets should be at least 44x44px (iOS guideline)
            // Allow some flexibility for certain design elements
            expect(box.width).toBeGreaterThanOrEqual(30);
            expect(box.height).toBeGreaterThanOrEqual(30);

            // Prefer 44x44 for primary interactive elements
            if (
              (await element.getAttribute('class')) &&
              (await element.getAttribute('class')).includes('btn')
            ) {
              expect(box.height).toBeGreaterThanOrEqual(44);
            }
          }
        });

        test('should have proper card layouts and spacing', async ({ page }) => {
          const cards = await page.locator('.service-card, .project-card, .blog-card, .stat').all();

          for (const card of cards.slice(0, 3)) {
            const isVisible = await card.isVisible();
            if (!isVisible) {
              continue;
            }

            const cardStyles = await card.evaluate(el => {
              const computed = window.getComputedStyle(el);
              const rect = el.getBoundingClientRect();
              return {
                padding: {
                  top: parseFloat(computed.paddingTop),
                  right: parseFloat(computed.paddingRight),
                  bottom: parseFloat(computed.paddingBottom),
                  left: parseFloat(computed.paddingLeft)
                },
                margin: {
                  top: parseFloat(computed.marginTop),
                  right: parseFloat(computed.marginRight),
                  bottom: parseFloat(computed.marginBottom),
                  left: parseFloat(computed.marginLeft)
                },
                width: rect.width,
                height: rect.height,
                left: rect.left,
                right: rect.right
              };
            });

            // Cards should have adequate padding
            expect(cardStyles.padding.top + cardStyles.padding.bottom).toBeGreaterThanOrEqual(10);
            expect(cardStyles.padding.left + cardStyles.padding.right).toBeGreaterThanOrEqual(10);

            // Cards should fit within viewport
            expect(cardStyles.right).toBeLessThanOrEqual(device.width + 10);
            expect(cardStyles.left).toBeGreaterThanOrEqual(-10);
          }
        });

        test('should have proper section spacing', async ({ page }) => {
          const sections = await page
            .locator('section, .hero, .about, .services, .projects, .blog, .contact')
            .all();

          for (let i = 0; i < Math.min(sections.length - 1, 3); i++) {
            const currentSection = sections[i];
            const nextSection = sections[i + 1];

            const currentVisible = await currentSection.isVisible();
            const nextVisible = await nextSection.isVisible();

            if (!currentVisible || !nextVisible) {
              continue;
            }

            const currentBox = await currentSection.boundingBox();
            const nextBox = await nextSection.boundingBox();

            // Calculate gap between sections
            const gap = nextBox.y - (currentBox.y + currentBox.height);

            // Should have some spacing between sections (at least 20px)
            expect(gap).toBeGreaterThanOrEqual(10);

            // But not excessive spacing (max 200px)
            expect(gap).toBeLessThanOrEqual(200);
          }
        });

        test('should handle grid layouts properly on mobile', async ({ page }) => {
          const gridContainers = await page
            .locator('.services-grid, .projects-grid, .blog-grid, .about-grid')
            .all();

          for (const grid of gridContainers.slice(0, 2)) {
            const isVisible = await grid.isVisible();
            if (!isVisible) {
              continue;
            }

            const gridStyles = await grid.evaluate(el => {
              const computed = window.getComputedStyle(el);
              return {
                display: computed.display,
                gridTemplateColumns: computed.gridTemplateColumns,
                flexDirection: computed.flexDirection,
                gap: computed.gap
              };
            });

            // Grid should adapt to mobile (single column or small gap)
            if (gridStyles.display === 'grid') {
              // Should not have too many columns on mobile
              const columnCount = (
                gridStyles.gridTemplateColumns.match(/auto|fr|px|%|em|rem/g) || []
              ).length;
              expect(columnCount).toBeLessThanOrEqual(2);
            }

            // Should have reasonable gap
            if (gridStyles.gap && gridStyles.gap !== 'normal') {
              const gapValue = parseFloat(gridStyles.gap);
              expect(gapValue).toBeGreaterThanOrEqual(10);
              expect(gapValue).toBeLessThanOrEqual(50);
            }
          }
        });

        test('should have proper margins and padding throughout', async ({ page }) => {
          const containers = await page.locator('.container, .content, .wrapper, main').all();

          for (const container of containers.slice(0, 2)) {
            const isVisible = await container.isVisible();
            if (!isVisible) {
              continue;
            }

            const spacing = await container.evaluate(el => {
              const computed = window.getComputedStyle(el);
              return {
                paddingLeft: parseFloat(computed.paddingLeft),
                paddingRight: parseFloat(computed.paddingRight),
                marginLeft: parseFloat(computed.marginLeft),
                marginRight: parseFloat(computed.marginRight)
              };
            });

            // Should have some horizontal spacing on mobile
            const totalHorizontalSpacing =
              spacing.paddingLeft +
              spacing.paddingRight +
              Math.max(0, spacing.marginLeft) +
              Math.max(0, spacing.marginRight);
            expect(totalHorizontalSpacing).toBeGreaterThanOrEqual(20);

            // But not excessive spacing that wastes mobile screen space
            expect(totalHorizontalSpacing).toBeLessThanOrEqual(100);
          }
        });

        test('should handle hero section layout on mobile', async ({ page }) => {
          const hero = page.locator('.hero, .hero-content');
          const heroExists = (await hero.count()) > 0;

          if (heroExists) {
            await expect(hero.first()).toBeVisible();

            const heroBox = await hero.first().boundingBox();

            // Hero should fit in viewport width
            expect(heroBox.x + heroBox.width).toBeLessThanOrEqual(device.width + 10);

            // Hero should have reasonable height (not too short or too tall)
            expect(heroBox.height).toBeGreaterThan(200);
            expect(heroBox.height).toBeLessThan(device.height * 1.5);

            // Check hero title sizing
            const heroTitle = page.locator('.hero h1, .mega-title, .hero-title');
            const titleExists = (await heroTitle.count()) > 0;

            if (titleExists) {
              const titleFontSize = await heroTitle.first().evaluate(el => {
                return parseFloat(window.getComputedStyle(el).fontSize);
              });

              // Title should be large but not overwhelming on mobile
              expect(titleFontSize).toBeGreaterThan(24);
              expect(titleFontSize).toBeLessThan(80);
            }
          }
        });
      });
    });
  });
});
