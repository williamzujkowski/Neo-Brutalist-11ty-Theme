/**
 * Navigation and Routing Tests
 * Tests all navigation functionality and routing for the Neo-Brutalist theme
 */

const { test, expect } = require('@playwright/test');
const { waitForPageLoad, validateThemeElements } = require('./helpers/test-utils');

test.describe('Navigation Testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
  });

  test('should display main navigation menu', async ({ page }) => {
    // Test navigation visibility
    const nav = page.locator('nav, .navigation, [class*="nav"]').first();
    await expect(nav).toBeVisible();

    // Check for navigation items based on site data
    const expectedNavItems = ['HOME', 'ABOUT', 'SERVICES', 'PROJECTS', 'BLOG', 'CONTACT'];

    for (const item of expectedNavItems) {
      const navLink = page.locator(`nav a, .navigation a`, { hasText: item }).first();
      await expect(navLink).toBeVisible();
    }
  });

  test('should navigate to all main pages', async ({ page }) => {
    const navigationLinks = [
      { text: 'HOME', url: '/', selector: '.hero, [class*="hero"]' },
      { text: 'ABOUT', url: '/#about', selector: '#about, [id*="about"]' },
      { text: 'SERVICES', url: '/#services', selector: '#services, [id*="services"]' },
      { text: 'PROJECTS', url: '/projects/', selector: '.projects, [class*="projects"]' },
      { text: 'BLOG', url: '/blog/', selector: '.blog, [class*="blog"]' },
      { text: 'CONTACT', url: '/#contact', selector: '#contact, [id*="contact"]' },
    ];

    for (const link of navigationLinks) {
      // Click navigation link
      const navLink = page.locator(`nav a, .navigation a`, { hasText: link.text }).first();
      await navLink.click();

      // Wait for navigation
      await page.waitForTimeout(500);

      // Check URL (handle both full URLs and hash fragments)
      if (link.url.startsWith('#')) {
        await expect(page).toHaveURL(new RegExp(`${link.url.substring(1)}$`));
      } else {
        await expect(page).toHaveURL(link.url);
      }

      // Verify target section is visible
      if (link.selector) {
        const section = page.locator(link.selector).first();
        if (await section.count() > 0) {
          await expect(section).toBeVisible();
        }
      }

      // Return to home for next test
      if (link.url !== '/') {
        await page.goto('/');
        await waitForPageLoad(page);
      }
    }
  });

  test('should handle mobile navigation', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await waitForPageLoad(page);

    // Look for mobile menu toggle
    const mobileToggle = page.locator(
      '.mobile-toggle, .nav-toggle, .hamburger, [class*="menu-toggle"], [aria-label*="menu"]'
    ).first();

    if (await mobileToggle.count() > 0) {
      // Test mobile menu functionality
      await mobileToggle.click();
      await page.waitForTimeout(300);

      // Check if mobile menu is visible
      const mobileMenu = page.locator(
        '.mobile-menu, .nav-mobile, [class*="mobile-nav"]'
      ).first();

      if (await mobileMenu.count() > 0) {
        await expect(mobileMenu).toBeVisible();

        // Close mobile menu
        await mobileToggle.click();
        await page.waitForTimeout(300);
      }
    }
  });

  test('should have accessible navigation', async ({ page }) => {
    const nav = page.locator('nav').first();

    // Check for navigation landmarks
    await expect(nav).toHaveAttribute('role', 'navigation');

    // Check for proper link structure
    const navLinks = page.locator('nav a');
    const linkCount = await navLinks.count();

    for (let i = 0; i < linkCount; i++) {
      const link = navLinks.nth(i);

      // Each link should have href
      await expect(link).toHaveAttribute('href');

      // Links should have accessible text
      const text = await link.textContent();
      expect(text?.trim()).toBeTruthy();
    }
  });

  test('should maintain navigation state during page transitions', async ({ page }) => {
    // Navigate to projects page
    await page.click('nav a[href="/projects/"]');
    await waitForPageLoad(page);

    // Check navigation is still visible and functional
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();

    // Verify current page indicator (if implemented)
    const activeLink = page.locator('nav a.active, nav a[aria-current="page"]').first();
    if (await activeLink.count() > 0) {
      await expect(activeLink).toBeVisible();
    }
  });

  test('should handle breadcrumb navigation (if present)', async ({ page }) => {
    // Navigate to a blog post or project
    await page.goto('/blog/');
    await waitForPageLoad(page);

    // Check for breadcrumbs
    const breadcrumbs = page.locator('.breadcrumbs, [aria-label="breadcrumb"], .breadcrumb');

    if (await breadcrumbs.count() > 0) {
      await expect(breadcrumbs.first()).toBeVisible();

      // Check breadcrumb links are functional
      const breadcrumbLinks = breadcrumbs.locator('a');
      const linkCount = await breadcrumbLinks.count();

      if (linkCount > 0) {
        const firstLink = breadcrumbLinks.first();
        await expect(firstLink).toHaveAttribute('href');
      }
    }
  });

  test('should scroll to sections smoothly', async ({ page }) => {
    // Test smooth scrolling for anchor links
    const aboutLink = page.locator('nav a[href="#about"], nav a[href="/#about"]').first();

    if (await aboutLink.count() > 0) {
      await aboutLink.click();
      await page.waitForTimeout(1000); // Allow for smooth scroll

      // Check if we're at the about section
      const aboutSection = page.locator('#about, [id*="about"]').first();
      if (await aboutSection.count() > 0) {
        await expect(aboutSection).toBeInViewport();
      }
    }
  });

  test('should handle external links properly', async ({ page, context }) => {
    // Look for external links in navigation (social media, etc.)
    const externalLinks = page.locator('nav a[href^="http"], .navigation a[href^="http"]');
    const linkCount = await externalLinks.count();

    if (linkCount > 0) {
      // Test first external link
      const firstExternalLink = externalLinks.first();

      // Should have proper attributes for external links
      const target = await firstExternalLink.getAttribute('target');
      const rel = await firstExternalLink.getAttribute('rel');

      // External links should open in new tab and have security attributes
      expect(target).toBe('_blank');
      expect(rel).toContain('noopener');
    }
  });

  test('should validate navigation styling matches Neo-Brutalist theme', async ({ page }) => {
    const nav = page.locator('nav').first();

    // Check for Neo-Brutalist styling characteristics
    const navStyles = await nav.evaluate((element) => {
      const styles = window.getComputedStyle(element);
      return {
        fontWeight: styles.fontWeight,
        textTransform: styles.textTransform,
        letterSpacing: styles.letterSpacing,
        fontSize: styles.fontSize,
      };
    });

    // Navigation should have bold, uppercase styling typical of Neo-Brutalist design
    expect(parseInt(navStyles.fontWeight)).toBeGreaterThanOrEqual(600);

    // Check navigation links styling
    const navLinks = page.locator('nav a');
    const firstLink = navLinks.first();

    const linkStyles = await firstLink.evaluate((element) => {
      const styles = window.getComputedStyle(element);
      return {
        textDecoration: styles.textDecoration,
        borderWidth: styles.borderWidth,
        padding: styles.padding,
      };
    });

    // Links should have no default text decoration (using custom styling)
    expect(linkStyles.textDecoration).toContain('none');
  });
});