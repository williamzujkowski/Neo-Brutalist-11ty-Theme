const { test, expect } = require('@playwright/test');

test.describe('Mobile Navigation Tests', () => {
  const mobileDevices = [
    { name: 'iPhone 12', width: 390, height: 844 },
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'Pixel 5', width: 393, height: 851 },
    { name: 'Galaxy S20', width: 360, height: 800 }
  ];

  mobileDevices.forEach(device => {
    test.describe(`${device.name} (${device.width}x${device.height})`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: device.width, height: device.height });
        await page.goto('/');
      });

      test('should display hamburger menu on mobile', async ({ page }) => {
        // Check if hamburger menu is visible
        const hamburgerButton = page.locator('.nav-toggle');
        await expect(hamburgerButton).toBeVisible();

        // Check if hamburger lines are present
        const hamburgerLines = page.locator('.hamburger-line');
        await expect(hamburgerLines).toHaveCount(3);

        // Verify hamburger button has correct aria attributes
        await expect(hamburgerButton).toHaveAttribute('aria-label', 'Menu');
        await expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false');
      });

      test('should hide desktop navigation on mobile', async ({ page }) => {
        // Check if desktop navigation is hidden on mobile
        const navLinks = page.locator('.nav-links');
        const isHidden = await navLinks.evaluate(el => {
          const style = window.getComputedStyle(el);
          return style.display === 'none' || style.visibility === 'hidden' ||
                 parseFloat(style.opacity) === 0;
        });
        expect(isHidden).toBe(true);
      });

      test('should toggle mobile menu correctly', async ({ page }) => {
        const hamburgerButton = page.locator('.nav-toggle');
        const navLinks = page.locator('.nav-links');

        // Initially menu should be closed
        await expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false');

        // Click to open menu
        await hamburgerButton.click();
        await expect(hamburgerButton).toHaveAttribute('aria-expanded', 'true');

        // Check if navigation becomes visible
        await expect(navLinks).toBeVisible();

        // Click to close menu
        await hamburgerButton.click();
        await expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false');
      });

      test('should navigate to correct pages from mobile menu', async ({ page }) => {
        const hamburgerButton = page.locator('.nav-toggle');
        await hamburgerButton.click();

        // Test About link
        const aboutLink = page.locator('.nav-links a[href*=\"about\"]');
        await aboutLink.click();
        await expect(page).toHaveURL(/.*about.*/);

        // Go back and test Services
        await page.goto('/');
        await hamburgerButton.click();
        const servicesLink = page.locator('.nav-links a[href*=\"services\"]');
        await servicesLink.click();
        await expect(page).toHaveURL(/.*services.*/);

        // Go back and test Blog
        await page.goto('/');
        await hamburgerButton.click();
        const blogLink = page.locator('.nav-links a[href*=\"blog\"]');
        await blogLink.click();
        await expect(page).toHaveURL(/.*blog.*/);

        // Go back and test Contact
        await page.goto('/');
        await hamburgerButton.click();
        const contactLink = page.locator('.nav-links a[href*=\"contact\"]');
        await contactLink.click();
        await expect(page).toHaveURL(/.*contact.*/);
      });

      test('should close menu when clicking outside', async ({ page }) => {
        const hamburgerButton = page.locator('.nav-toggle');
        const navLinks = page.locator('.nav-links');

        // Open menu
        await hamburgerButton.click();
        await expect(hamburgerButton).toHaveAttribute('aria-expanded', 'true');

        // Click outside the menu (on main content)
        await page.locator('main').click();

        // Menu should close
        await expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false');
      });

      test('should have proper touch targets for mobile', async ({ page }) => {
        const hamburgerButton = page.locator('.nav-toggle');

        // Check if hamburger button meets minimum touch target size (44px)
        const buttonBox = await hamburgerButton.boundingBox();
        expect(buttonBox.width).toBeGreaterThanOrEqual(44);
        expect(buttonBox.height).toBeGreaterThanOrEqual(44);

        // Open menu and check navigation links
        await hamburgerButton.click();
        const navLinkElements = await page.locator('.nav-links a').all();

        for (const link of navLinkElements) {
          const linkBox = await link.boundingBox();
          expect(linkBox.height).toBeGreaterThanOrEqual(44);
        }
      });

      test('should maintain logo visibility and functionality', async ({ page }) => {
        const logo = page.locator('.logo');

        // Logo should be visible
        await expect(logo).toBeVisible();

        // Logo should link to home
        await expect(logo).toHaveAttribute('href', '/');

        // Logo should be clickable
        await logo.click();
        await expect(page).toHaveURL('/');
      });

      test('should handle menu animations smoothly', async ({ page }) => {
        const hamburgerButton = page.locator('.nav-toggle');
        const navLinks = page.locator('.nav-links');

        // Open menu
        await hamburgerButton.click();

        // Wait for any animations to complete
        await page.waitForTimeout(500);

        // Menu should be fully visible
        await expect(navLinks).toBeVisible();

        // Close menu
        await hamburgerButton.click();

        // Wait for close animation
        await page.waitForTimeout(500);

        // Check final state
        const isHidden = await navLinks.evaluate(el => {
          const style = window.getComputedStyle(el);
          return style.display === 'none' || style.visibility === 'hidden' ||
                 parseFloat(style.opacity) === 0;
        });
        expect(isHidden).toBe(true);
      });
    });
  });
});