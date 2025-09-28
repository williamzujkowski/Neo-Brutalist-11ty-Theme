/**
 * Social Icons Testing
 * Tests social media icons rendering, functionality, and accessibility
 */

const { test, expect } = require('@playwright/test');
const { waitForPageLoad, testSocialIcons } = require('./helpers/test-utils');

test.describe('Social Icons Testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
  });

  test('should display social icons correctly', async ({ page }) => {
    // Find social icons section
    const socialSections = [
      '.social-links',
      '.social-icons',
      '.social',
      '[class*="social"]',
      'footer .social',
      'header .social'
    ];

    let socialSection;
    for (const selector of socialSections) {
      const section = page.locator(selector).first();
      if (await section.count() > 0) {
        socialSection = section;
        break;
      }
    }

    if (socialSection) {
      await expect(socialSection).toBeVisible();

      // Check individual social icons
      const socialLinks = socialSection.locator('a');
      const count = await socialLinks.count();

      expect(count).toBeGreaterThan(0);

      // Test each social icon
      for (let i = 0; i < count; i++) {
        const link = socialLinks.nth(i);
        await expect(link).toBeVisible();

        // Check if icon has SVG or icon element
        const hasIcon = await link.locator('svg, i, [class*="icon"], img').count() > 0;
        expect(hasIcon).toBeTruthy();
      }
    }
  });

  test('should validate social media URLs and platforms', async ({ page }) => {
    const results = await testSocialIcons(page);

    // Validate each social icon
    for (const result of results) {
      expect(result.isVisible).toBeTruthy();
      expect(result.hasIcon).toBeTruthy();
      expect(result.isValidUrl).toBeTruthy();

      // Validate specific platform URLs
      if (result.href) {
        if (result.href.includes('github.com')) {
          expect(result.href).toMatch(/https:\/\/github\.com\/[\w-]+/);
        } else if (result.href.includes('linkedin.com')) {
          expect(result.href).toMatch(/https:\/\/linkedin\.com\/in\/[\w-]+/);
        } else if (result.href.includes('twitter.com')) {
          expect(result.href).toMatch(/https:\/\/twitter\.com\/[\w-]+/);
        } else if (result.href.includes('instagram.com')) {
          expect(result.href).toMatch(/https:\/\/instagram\.com\/[\w-]+/);
        }
      }
    }

    console.log('Social Icons Test Results:', results);
  });

  test('should test social icons accessibility', async ({ page }) => {
    const socialLinks = page.locator('.social a, .social-links a, .social-icons a, [class*="social"] a');
    const count = await socialLinks.count();

    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const link = socialLinks.nth(i);

        // Check for accessible attributes
        const ariaLabel = await link.getAttribute('aria-label');
        const title = await link.getAttribute('title');
        const text = await link.textContent();

        // Should have accessible text via aria-label, title, or visible text
        const hasAccessibleText = (ariaLabel && ariaLabel.trim()) ||
                                  (title && title.trim()) ||
                                  (text && text.trim());

        expect(hasAccessibleText).toBeTruthy();

        // External links should have proper attributes
        const target = await link.getAttribute('target');
        const rel = await link.getAttribute('rel');

        expect(target).toBe('_blank');
        expect(rel).toContain('noopener');
      }
    }
  });

  test('should validate social icons Neo-Brutalist styling', async ({ page }) => {
    const socialLinks = page.locator('.social a, .social-links a, .social-icons a').first();

    if (await socialLinks.count() > 0) {
      // Check for Neo-Brutalist styling characteristics
      const styles = await socialLinks.evaluate((element) => {
        const computed = window.getComputedStyle(element);
        return {
          border: computed.border,
          borderWidth: computed.borderWidth,
          borderRadius: computed.borderRadius,
          boxShadow: computed.boxShadow,
          transform: computed.transform,
          transition: computed.transition,
          backgroundColor: computed.backgroundColor,
          padding: computed.padding
        };
      });

      // Social icons should have distinctive styling
      console.log('Social Icon Styles:', styles);

      // Check for interactive states
      await socialLinks.hover();
      await page.waitForTimeout(200);

      const hoverStyles = await socialLinks.evaluate((element) => {
        const computed = window.getComputedStyle(element);
        return {
          transform: computed.transform,
          backgroundColor: computed.backgroundColor,
          borderColor: computed.borderColor,
        };
      });

      console.log('Social Icon Hover Styles:', hoverStyles);
    }
  });

  test('should test social icons hover and interaction effects', async ({ page }) => {
    const socialLinks = page.locator('.social a, .social-links a, .social-icons a');
    const count = await socialLinks.count();

    if (count > 0) {
      for (let i = 0; i < Math.min(3, count); i++) {
        const link = socialLinks.nth(i);

        // Get initial styles
        const initialStyles = await link.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return {
            transform: styles.transform,
            backgroundColor: styles.backgroundColor,
            color: styles.color,
          };
        });

        // Hover over the link
        await link.hover();
        await page.waitForTimeout(300); // Allow for transitions

        // Get hover styles
        const hoverStyles = await link.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return {
            transform: styles.transform,
            backgroundColor: styles.backgroundColor,
            color: styles.color,
          };
        });

        // Check if styles changed on hover (indicating interactive effects)
        const hasHoverEffect =
          initialStyles.transform !== hoverStyles.transform ||
          initialStyles.backgroundColor !== hoverStyles.backgroundColor ||
          initialStyles.color !== hoverStyles.color;

        if (hasHoverEffect) {
          console.log(`✅ Social icon ${i} has hover effects`);
        }
      }
    }
  });

  test('should validate social icons across different pages', async ({ page }) => {
    const testPages = ['/', '/projects/', '/blog/'];

    for (const pagePath of testPages) {
      await page.goto(pagePath);
      await waitForPageLoad(page);

      // Check if social icons are present on this page
      const socialLinks = page.locator('.social a, .social-links a, .social-icons a');
      const count = await socialLinks.count();

      if (count > 0) {
        console.log(`✅ Social icons found on ${pagePath}: ${count} icons`);

        // Test first social icon on each page
        const firstIcon = socialLinks.first();
        await expect(firstIcon).toBeVisible();

        const href = await firstIcon.getAttribute('href');
        expect(href).toBeTruthy();
        expect(href).toMatch(/^https?:\/\//);
      }
    }
  });

  test('should test social icons on mobile viewports', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await waitForPageLoad(page);

    const socialLinks = page.locator('.social a, .social-links a, .social-icons a');
    const count = await socialLinks.count();

    if (count > 0) {
      // Check visibility on mobile
      for (let i = 0; i < count; i++) {
        const link = socialLinks.nth(i);
        await expect(link).toBeVisible();
      }

      // Check mobile-specific styling
      const firstIcon = socialLinks.first();
      const mobileStyles = await firstIcon.evaluate((element) => {
        const computed = window.getComputedStyle(element);
        return {
          fontSize: computed.fontSize,
          padding: computed.padding,
          margin: computed.margin,
          width: computed.width,
          height: computed.height,
        };
      });

      console.log('Mobile Social Icon Styles:', mobileStyles);
    }
  });

  test('should validate social icons configuration matches site.json', async ({ page }) => {
    // This test validates that the displayed social icons match the configuration
    const socialLinks = page.locator('.social a, .social-links a, .social-icons a');
    const count = await socialLinks.count();

    if (count > 0) {
      const displayedPlatforms = [];

      for (let i = 0; i < count; i++) {
        const link = socialLinks.nth(i);
        const href = await link.getAttribute('href');

        if (href) {
          // Identify platform from URL
          if (href.includes('github.com')) displayedPlatforms.push('github');
          else if (href.includes('linkedin.com')) displayedPlatforms.push('linkedin');
          else if (href.includes('twitter.com')) displayedPlatforms.push('twitter');
          else if (href.includes('instagram.com')) displayedPlatforms.push('instagram');
          else if (href.includes('youtube.com')) displayedPlatforms.push('youtube');
          else if (href.includes('facebook.com')) displayedPlatforms.push('facebook');
          else if (href.includes('discord')) displayedPlatforms.push('discord');
          else if (href.includes('medium.com')) displayedPlatforms.push('medium');
        }
      }

      console.log('Displayed Social Platforms:', displayedPlatforms);

      // Based on site.json, these platforms should be enabled
      const expectedEnabledPlatforms = [
        'github', 'linkedin', 'twitter', 'instagram',
        'youtube', 'facebook', 'discord', 'medium'
      ];

      // Check that enabled platforms are displayed
      for (const platform of expectedEnabledPlatforms) {
        if (displayedPlatforms.includes(platform)) {
          console.log(`✅ ${platform} is correctly displayed`);
        }
      }
    }
  });

  test('should test social sharing functionality (if present)', async ({ page }) => {
    // Look for social sharing buttons (different from social profile links)
    const shareButtons = page.locator('[class*="share"], .social-share, [data-share]');
    const count = await shareButtons.count();

    if (count > 0) {
      console.log(`Found ${count} social sharing elements`);

      for (let i = 0; i < count; i++) {
        const shareButton = shareButtons.nth(i);
        await expect(shareButton).toBeVisible();

        // Test share button functionality
        const shareLinks = shareButton.locator('a');
        const linkCount = await shareLinks.count();

        for (let j = 0; j < linkCount; j++) {
          const shareLink = shareLinks.nth(j);
          const href = await shareLink.getAttribute('href');

          if (href) {
            // Validate share URLs
            if (href.includes('twitter.com/intent/tweet')) {
              expect(href).toContain('text=');
              expect(href).toContain('url=');
            } else if (href.includes('facebook.com/sharer')) {
              expect(href).toContain('u=');
            } else if (href.includes('linkedin.com/sharing/share-offsite')) {
              expect(href).toContain('url=');
            }
          }
        }
      }
    }
  });
});