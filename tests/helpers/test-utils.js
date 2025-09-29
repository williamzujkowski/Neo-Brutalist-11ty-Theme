/**
 * Test utilities and helpers for Neo-Brutalist theme testing
 */

const { expect: _expect } = require('@playwright/test');

/**
 * Wait for page to be fully loaded including animations
 */
async function waitForPageLoad(page, _timeout = 5000) {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500); // Allow for animations to settle
}

/**
 * Check if element has Neo-Brutalist styling characteristics
 */
async function checkNeoBrutalistStyling(element) {
  const styles = await element.evaluate(el => {
    const computed = window.getComputedStyle(el);
    return {
      border: computed.border,
      borderWidth: computed.borderWidth,
      boxShadow: computed.boxShadow,
      transform: computed.transform,
      fontWeight: computed.fontWeight,
      textTransform: computed.textTransform
    };
  });

  // Check for thick borders (characteristic of neo-brutalist design)
  const borderWidth = parseInt(styles.borderWidth, 10);
  if (borderWidth >= 3) {
    console.log(`✅ Thick border detected: ${borderWidth}px`);
  }

  // Check for shadows
  if (styles.boxShadow && styles.boxShadow !== 'none') {
    console.log(`✅ Box shadow detected: ${styles.boxShadow}`);
  }

  // Check for rotations
  if (styles.transform && styles.transform.includes('rotate')) {
    console.log(`✅ Rotation detected: ${styles.transform}`);
  }

  return styles;
}

/**
 * Test responsive breakpoints
 */
async function testResponsiveBreakpoints(page, selector) {
  const breakpoints = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1024, height: 768 },
    { name: 'Large Desktop', width: 1440, height: 900 }
  ];

  const results = {};

  for (const breakpoint of breakpoints) {
    await page.setViewportSize({
      width: breakpoint.width,
      height: breakpoint.height
    });

    await page.waitForTimeout(300); // Allow for responsive adjustments

    const element = page.locator(selector);
    const isVisible = await element.isVisible();
    const boundingBox = await element.boundingBox();

    results[breakpoint.name] = {
      visible: isVisible,
      dimensions: boundingBox,
      viewport: { width: breakpoint.width, height: breakpoint.height }
    };
  }

  return results;
}

/**
 * Check color contrast for accessibility
 */
async function checkColorContrast(element) {
  const contrast = await element.evaluate(el => {
    const style = window.getComputedStyle(el);
    const { backgroundColor } = style;
    const { color } = style;

    // Simple contrast check (in real testing, you'd use a more sophisticated algorithm)
    return {
      backgroundColor,
      color
      // You could implement WCAG contrast ratio calculation here
    };
  });

  return contrast;
}

/**
 * Test social icons functionality
 */
async function testSocialIcons(page) {
  const socialIcons = page.locator('[data-testid="social-icons"] a, .social-links a, .social a');
  const count = await socialIcons.count();

  const results = [];

  for (let i = 0; i < count; i++) {
    const icon = socialIcons.nth(i);
    const href = await icon.getAttribute('href');
    const isVisible = await icon.isVisible();
    const hasIcon = (await icon.locator('svg, i, [class*="icon"]').count()) > 0;

    results.push({
      index: i,
      href,
      isVisible,
      hasIcon,
      isValidUrl: href && (href.startsWith('http') || href.startsWith('mailto:'))
    });
  }

  return results;
}

/**
 * Check for required Neo-Brutalist CSS custom properties
 */
async function checkNeoBrutalistCSSProperties(page) {
  const cssProperties = await page.evaluate(() => {
    const root = document.documentElement;
    const styles = window.getComputedStyle(root);

    const properties = {};
    for (let i = 0; i < styles.length; i++) {
      const prop = styles[i];
      if (prop.startsWith('--')) {
        properties[prop] = styles.getPropertyValue(prop);
      }
    }

    return properties;
  });

  // Check for expected Neo-Brutalist CSS variables
  const expectedProps = [
    '--electric-blue',
    '--hot-pink',
    '--acid-green',
    '--cyber-yellow',
    '--deep-purple'
  ];

  const missingProps = expectedProps.filter(prop => !cssProperties[prop]);

  return {
    allProperties: cssProperties,
    expectedProperties: expectedProps,
    missingProperties: missingProps,
    hasAllRequired: missingProps.length === 0
  };
}

/**
 * Test animation performance
 */
async function testAnimationPerformance(page) {
  // Monitor performance during animations
  await page.evaluate(() => {
    window.performanceMarks = [];

    // Mark start of animation test
    performance.mark('animation-test-start');

    // Trigger animations by hovering over elements
    const animatedElements = document.querySelectorAll(
      '[class*="animate"], [class*="glitch"], [class*="float"]'
    );
    animatedElements.forEach((el, index) => {
      setTimeout(() => {
        el.dispatchEvent(new Event('mouseenter'));
        performance.mark(`animation-${index}-triggered`);
      }, index * 100);
    });
  });

  await page.waitForTimeout(2000); // Allow animations to complete

  const performanceData = await page.evaluate(() => {
    performance.mark('animation-test-end');
    performance.measure('total-animation-time', 'animation-test-start', 'animation-test-end');

    const entries = performance.getEntriesByType('measure');
    return entries.map(entry => ({
      name: entry.name,
      duration: entry.duration,
      startTime: entry.startTime
    }));
  });

  return performanceData;
}

/**
 * Validate Neo-Brutalist theme elements
 */
async function validateThemeElements(page) {
  const elements = {
    hero: page.locator('.hero, [class*="hero"]').first(),
    navigation: page.locator('nav, .navigation, [class*="nav"]').first(),
    buttons: page.locator('button, .btn, [class*="button"]'),
    cards: page.locator('.card, [class*="card"]'),
    sections: page.locator('section, [class*="section"]')
  };

  const validation = {};

  for (const [name, locator] of Object.entries(elements)) {
    const count = await locator.count();
    validation[name] = {
      exists: count > 0,
      count,
      isVisible: count > 0 ? await locator.first().isVisible() : false
    };

    if (count > 0) {
      validation[name].styling = await checkNeoBrutalistStyling(locator.first());
    }
  }

  return validation;
}

module.exports = {
  waitForPageLoad,
  checkNeoBrutalistStyling,
  testResponsiveBreakpoints,
  checkColorContrast,
  testSocialIcons,
  checkNeoBrutalistCSSProperties,
  testAnimationPerformance,
  validateThemeElements
};
