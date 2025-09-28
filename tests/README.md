# Neo-Brutalist Theme Test Suite

This directory contains comprehensive Playwright tests for the Neo-Brutalist 11ty theme.

## Test Structure

### Test Files

- **`navigation.spec.js`** - Navigation and routing functionality
- **`links.spec.js`** - Link validation (internal, external, social)
- **`social-icons.spec.js`** - Social media icons functionality
- **`responsive.spec.js`** - Responsive design across breakpoints
- **`accessibility.spec.js`** - A11y compliance and screen reader support
- **`performance.spec.js`** - Load times and Core Web Vitals

### Helper Files

- **`helpers/test-utils.js`** - Utility functions for testing
- **`global-setup.js`** - Global test configuration

## Running Tests

### Prerequisites

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Test Commands

```bash
# Run all tests
npm test

# Run with UI mode (interactive)
npm run test:ui

# Run in headed mode (visible browser)
npm run test:headed

# Debug mode
npm run test:debug

# Run specific test file
npx playwright test navigation.spec.js

# Run tests for specific browser
npx playwright test --project=chromium
```

### Environment Variables

```bash
# Test against GitHub Pages
GITHUB_PAGES_URL=https://williamzujkowski.github.io/Neo-Brutalist-11ty-Theme/ npm test

# Test against custom URL
BASE_URL=https://your-domain.com npm test
```

## Test Coverage

### Navigation Testing
- Main navigation menu functionality
- Mobile navigation behavior
- Breadcrumb navigation (if present)
- Smooth scrolling to anchors
- Navigation state persistence

### Link Validation
- Internal link functionality
- External link security attributes
- Hash anchor navigation
- Social media link validation
- Email link format validation
- Blog and project link navigation

### Social Icons Testing
- Icon visibility and styling
- URL validation for social platforms
- Accessibility attributes
- Hover and interaction effects
- Mobile responsive behavior
- Configuration matching

### Responsive Design
- Cross-browser compatibility
- Multiple viewport testing
- Typography scaling
- Image responsiveness
- Grid layout adaptation
- Touch-friendly interactions

### Accessibility
- Semantic HTML structure
- ARIA attributes and labels
- Keyboard navigation support
- Screen reader compatibility
- Color contrast validation
- Focus management
- Reduced motion support

### Performance
- Page load times
- Core Web Vitals (LCP, FID, CLS)
- Image optimization
- Bundle size analysis
- Animation performance
- Memory usage monitoring
- Network condition testing

## Neo-Brutalist Specific Tests

The test suite includes specific validations for Neo-Brutalist design characteristics:

- **Bold Typography** - Large, impactful text scaling
- **Thick Borders** - Prominent border styling
- **Box Shadows** - Distinctive shadow effects
- **Color Vibrance** - Bright, contrasting colors
- **Rotations** - Subtle element rotations
- **Hover Effects** - Interactive state changes

## Browser Support

Tests run across multiple browsers and devices:

- **Desktop**: Chrome, Firefox, Safari
- **Mobile**: iOS Safari, Android Chrome
- **Viewports**: 320px to 1920px wide

## CI/CD Integration

The test suite is configured for GitHub Actions with:

- Parallel test execution
- Visual regression detection
- Performance budgets
- Accessibility auditing
- Cross-browser compatibility

## Contributing

When adding new features to the theme:

1. Add corresponding tests
2. Update test utilities if needed
3. Ensure tests pass on all browsers
4. Maintain accessibility standards
5. Validate performance impact

## Debugging Tests

### Common Issues

1. **Test Timeouts**: Increase timeout in playwright.config.js
2. **Flaky Tests**: Add proper wait conditions
3. **Element Not Found**: Check selectors match theme structure
4. **Performance Failures**: Adjust performance budgets

### Debug Tools

```bash
# Run specific test in debug mode
npx playwright test navigation.spec.js --debug

# Generate test report
npx playwright show-report

# Record new tests
npx playwright codegen localhost:8080
```

## Test Data

Tests use the following data sources:

- `src/_data/site.json` - Site configuration
- `src/_data/navigation.json` - Navigation structure
- `src/_data/metadata.json` - Meta information

## Performance Budgets

Current performance targets:

- **Load Time**: < 3 seconds
- **LCP**: < 2.5 seconds
- **FCP**: < 1.8 seconds
- **CLS**: < 0.1
- **CSS Bundle**: < 100KB
- **JS Bundle**: < 200KB

Adjust these in the performance tests as needed for your specific requirements.