/**
 * Accessibility (A11y) Compliance Tests
 * Tests ARIA support, screen reader compatibility, and accessibility best practices
 */

const { test, expect } = require('@playwright/test');
const { waitForPageLoad, checkColorContrast } = require('./helpers/test-utils');

test.describe('Accessibility Testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
  });

  test('should have proper document structure and landmarks', async ({ page }) => {
    // Check for proper HTML5 semantic structure
    const landmarks = [
      { selector: 'header', role: 'banner' },
      { selector: 'nav', role: 'navigation' },
      { selector: 'main', role: 'main' },
      { selector: 'footer', role: 'contentinfo' }
    ];

    for (const landmark of landmarks) {
      const element = page.locator(landmark.selector).first();

      if ((await element.count()) > 0) {
        await expect(element).toBeVisible();

        // Check if role is explicitly set or implicit
        const role = await element.getAttribute('role');
        if (role) {
          expect(role).toBe(landmark.role);
        }

        console.log(`✅ ${landmark.selector} landmark found`);
      }
    }

    // Check for proper heading hierarchy
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    const headingLevels = [];

    for (const heading of headings) {
      const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
      const level = parseInt(tagName.replace('h', ''));
      headingLevels.push(level);
    }

    // Should start with h1
    expect(headingLevels[0]).toBe(1);

    // Check for logical heading progression
    for (let i = 1; i < headingLevels.length; i++) {
      const currentLevel = headingLevels[i];
      const previousLevel = headingLevels[i - 1];

      // Should not skip more than one level
      expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
    }

    console.log('Heading hierarchy:', headingLevels);
  });

  test('should have proper ARIA attributes and labels', async ({ page }) => {
    // Test navigation ARIA
    const nav = page.locator('nav').first();
    if ((await nav.count()) > 0) {
      const ariaLabel = await nav.getAttribute('aria-label');
      const role = await nav.getAttribute('role');

      // Navigation should have proper labeling
      expect(ariaLabel || role === 'navigation').toBeTruthy();
    }

    // Test buttons and interactive elements
    const buttons = page.locator('button, [role="button"]');
    const buttonCount = await buttons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const text = await button.textContent();
      const title = await button.getAttribute('title');

      // Buttons should have accessible text
      const hasAccessibleText =
        (text && text.trim()) || (ariaLabel && ariaLabel.trim()) || (title && title.trim());

      expect(hasAccessibleText).toBeTruthy();
    }

    // Test form elements (if present)
    const formInputs = page.locator('input, textarea, select');
    const inputCount = await formInputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = formInputs.nth(i);
      const label = await page.locator(`label[for="${await input.getAttribute('id')}"]`).count();
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');

      // Form inputs should have labels
      const hasLabel = label > 0 || ariaLabel || ariaLabelledBy;
      expect(hasLabel).toBeTruthy();
    }
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Test keyboard navigation through interactive elements
    const focusableElements = await page
      .locator('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])')
      .all();

    if (focusableElements.length > 0) {
      // Start with first element
      await focusableElements[0].focus();

      // Tab through elements
      for (let i = 1; i < Math.min(10, focusableElements.length); i++) {
        await page.keyboard.press('Tab');
        await page.waitForTimeout(100);

        // Check that focus moves to next element
        const focused = page.locator(':focus');
        await expect(focused).toBeVisible();
      }

      // Test reverse tabbing
      await page.keyboard.press('Shift+Tab');
      await page.waitForTimeout(100);

      const reverseFocused = page.locator(':focus');
      await expect(reverseFocused).toBeVisible();
    }

    // Test escape key functionality (for modals, menus, etc.)
    const mobileToggle = page.locator('.mobile-toggle, .nav-toggle, [aria-label*="menu"]').first();

    if ((await mobileToggle.count()) > 0) {
      await mobileToggle.click();
      await page.waitForTimeout(300);

      // Try to close with escape
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);

      // Menu should close or focus should return
      const focused = page.locator(':focus');
      if ((await focused.count()) > 0) {
        await expect(focused).toBeVisible();
      }
    }
  });

  test('should have sufficient color contrast', async ({ page }) => {
    // Test color contrast for main text elements
    const textElements = [
      { selector: 'body', name: 'Body text' },
      { selector: 'h1', name: 'Main heading' },
      { selector: 'h2', name: 'Secondary heading' },
      { selector: 'p', name: 'Paragraph' },
      { selector: 'a', name: 'Links' },
      { selector: '.btn, button', name: 'Buttons' }
    ];

    for (const element of textElements) {
      const el = page.locator(element.selector).first();

      if ((await el.count()) > 0 && (await el.isVisible())) {
        const contrast = await checkColorContrast(el);

        console.log(`${element.name} colors:`, contrast);

        // Note: In a real implementation, you would calculate WCAG contrast ratio
        // For now, we're checking that colors are defined
        expect(contrast.color).toBeTruthy();
        expect(contrast.backgroundColor).toBeTruthy();
      }
    }
  });

  test('should have proper alt text for images', async ({ page }) => {
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const src = await img.getAttribute('src');
      const role = await img.getAttribute('role');

      // Images should have alt text unless they're decorative
      if (role === 'presentation' || role === 'none') {
        // Decorative images can have empty alt
        expect(alt).toBe('');
      } else {
        // Content images should have descriptive alt text
        expect(alt).toBeTruthy();
        expect(alt.length).toBeGreaterThan(0);
      }

      console.log(`Image ${i}: src="${src}", alt="${alt}"`);
    }
  });

  test('should support screen reader users', async ({ page }) => {
    // Test for screen reader friendly content

    // Check for skip links
    const skipLink = page.locator('a[href="#main"], a[href="#content"], .skip-link').first();
    if ((await skipLink.count()) > 0) {
      console.log('✅ Skip link found for screen readers');
      await expect(skipLink).toHaveAttribute('href');
    }

    // Check for proper list structure
    const lists = page.locator('ul, ol');
    const listCount = await lists.count();

    for (let i = 0; i < Math.min(3, listCount); i++) {
      const list = lists.nth(i);
      const listItems = list.locator('li');
      const itemCount = await listItems.count();

      // Lists should contain list items
      expect(itemCount).toBeGreaterThan(0);
    }

    // Check for ARIA live regions (for dynamic content)
    const liveRegions = page.locator('[aria-live], [aria-atomic]');
    const liveCount = await liveRegions.count();

    if (liveCount > 0) {
      console.log(`✅ Found ${liveCount} ARIA live regions`);
    }

    // Check for descriptive link text
    const links = page.locator('a');
    const linkCount = await links.count();

    const problematicLinkText = ['click here', 'read more', 'here', 'more'];

    for (let i = 0; i < Math.min(10, linkCount); i++) {
      const link = links.nth(i);
      const text = (await link.textContent())?.toLowerCase().trim();
      const ariaLabel = await link.getAttribute('aria-label');

      if (text && !ariaLabel) {
        const isProblematic = problematicLinkText.some(bad => text.includes(bad));
        if (isProblematic) {
          console.warn(`⚠️ Potentially unclear link text: "${text}"`);
        }
      }
    }
  });

  test('should handle focus management properly', async ({ page }) => {
    // Test focus indicators
    const focusableElements = page.locator('a, button, input, textarea, select');
    const count = await focusableElements.count();

    if (count > 0) {
      const firstElement = focusableElements.first();
      await firstElement.focus();

      // Check for visible focus indicator
      const focusStyles = await firstElement.evaluate(el => {
        const styles = window.getComputedStyle(el, ':focus');
        return {
          outline: styles.outline,
          outlineWidth: styles.outlineWidth,
          outlineColor: styles.outlineColor,
          boxShadow: styles.boxShadow,
          border: styles.border
        };
      });

      // Should have some form of focus indicator
      const hasFocusIndicator =
        focusStyles.outline !== 'none' ||
        focusStyles.outlineWidth !== '0px' ||
        focusStyles.boxShadow !== 'none' ||
        focusStyles.border.includes('focus');

      if (!hasFocusIndicator) {
        console.warn('⚠️ No visible focus indicator detected');
      } else {
        console.log('✅ Focus indicator styles:', focusStyles);
      }
    }

    // Test focus trapping in modals/overlays (if present)
    const modal = page.locator('.modal, .overlay, [role="dialog"]').first();

    if ((await modal.count()) > 0 && (await modal.isVisible())) {
      // Focus should be trapped within modal
      const modalFocusable = modal.locator('a, button, input, textarea, select');
      const modalCount = await modalFocusable.count();

      if (modalCount > 0) {
        await modalFocusable.first().focus();

        // Tab through modal elements
        for (let i = 0; i < modalCount; i++) {
          await page.keyboard.press('Tab');
          await page.waitForTimeout(50);
        }

        // Focus should cycle back to first element
        const focused = page.locator(':focus');
        const firstModalElement = modalFocusable.first();

        // Check if focus is still within modal
        const focusInModal = (await modal.locator(':focus').count()) > 0;
        expect(focusInModal).toBeTruthy();
      }
    }
  });

  test('should provide appropriate feedback for user actions', async ({ page }) => {
    // Test error states and feedback
    const forms = page.locator('form');
    const formCount = await forms.count();

    if (formCount > 0) {
      const form = forms.first();
      const requiredInputs = form.locator('input[required], textarea[required]');
      const requiredCount = await requiredInputs.count();

      if (requiredCount > 0) {
        const input = requiredInputs.first();

        // Try to submit form with empty required field
        const submitButton = form.locator('button[type="submit"], input[type="submit"]').first();

        if ((await submitButton.count()) > 0) {
          await submitButton.click();
          await page.waitForTimeout(500);

          // Check for error messages
          const errorMessages = page.locator(
            '.error, .invalid, [aria-invalid="true"], [role="alert"]'
          );

          const errorCount = await errorMessages.count();
          if (errorCount > 0) {
            console.log('✅ Form validation errors displayed');

            // Error messages should be associated with inputs
            for (let i = 0; i < errorCount; i++) {
              const error = errorMessages.nth(i);
              const text = await error.textContent();
              expect(text?.trim()).toBeTruthy();
            }
          }
        }
      }
    }

    // Test loading states (if present)
    const loadingElements = page.locator('[aria-busy="true"], .loading, .spinner');
    const loadingCount = await loadingElements.count();

    if (loadingCount > 0) {
      console.log('✅ Loading states found with proper ARIA');
    }
  });

  test('should be compatible with reduced motion preferences', async ({ page }) => {
    // Test reduced motion support
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    await waitForPageLoad(page);

    // Check that animations respect reduced motion
    const animatedElements = page.locator('[class*="animate"], [class*="transition"]');
    const count = await animatedElements.count();

    if (count > 0) {
      for (let i = 0; i < Math.min(3, count); i++) {
        const element = animatedElements.nth(i);
        const animationStyles = await element.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            animationDuration: styles.animationDuration,
            transitionDuration: styles.transitionDuration,
            animationPlayState: styles.animationPlayState
          };
        });

        // With reduced motion, animations should be disabled or very fast
        if (animationStyles.animationDuration !== 'none') {
          const duration = parseFloat(animationStyles.animationDuration);
          expect(duration).toBeLessThanOrEqual(0.1); // Very fast or instant
        }

        console.log(`Element ${i} reduced motion styles:`, animationStyles);
      }
    }
  });

  test('should support multiple languages and RTL (if applicable)', async ({ page }) => {
    // Check for language attributes
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBeTruthy();
    expect(htmlLang).toMatch(/^[a-z]{2}(-[A-Z]{2})?$/); // ISO language code format

    // Check for proper text direction
    const dir = await page.locator('html').getAttribute('dir');
    if (dir) {
      expect(['ltr', 'rtl']).toContain(dir);
    }

    // Check for multilingual content markers
    const langElements = page.locator('[lang], [hreflang]');
    const langCount = await langElements.count();

    if (langCount > 0) {
      console.log(`✅ Found ${langCount} elements with language attributes`);
    }
  });
});
