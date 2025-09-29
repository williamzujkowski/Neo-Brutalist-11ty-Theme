# Testing Guide for Neo-Brutalist 11ty Theme

This guide covers the comprehensive Playwright test suite for the Neo-Brutalist
theme.

## 🚀 Quick Start

### Installation

```bash
# Install Playwright dependency
npm install @playwright/test --save-dev

# Install browsers
npx playwright install
```

### Running Tests

```bash
# Run all tests
npm test

# Run with interactive UI
npm run test:ui

# Run in headed mode (visible browser)
npm run test:headed

# Debug specific test
npm run test:debug
```

## 📁 Test Structure

```
tests/
├── README.md                  # Detailed test documentation
├── global-setup.js           # Global test configuration
├── helpers/
│   └── test-utils.js         # Utility functions
├── navigation.spec.js        # Navigation and routing tests
├── links.spec.js            # Link validation tests
├── social-icons.spec.js     # Social media icons tests
├── responsive.spec.js       # Responsive design tests
├── accessibility.spec.js    # A11y compliance tests
└── performance.spec.js      # Performance and Core Web Vitals
```

## 🧪 Test Categories

### 1. Navigation Testing (`navigation.spec.js`)

- ✅ Main navigation menu display and functionality
- ✅ Mobile navigation behavior and hamburger menus
- ✅ Smooth scrolling to anchor sections
- ✅ Navigation state persistence across pages
- ✅ Breadcrumb navigation (if implemented)
- ✅ Neo-Brutalist styling validation

### 2. Link Validation (`links.spec.js`)

- ✅ Internal link functionality and routing
- ✅ External link security attributes (`target="_blank"`, `rel="noopener"`)
- ✅ Hash anchor navigation and smooth scrolling
- ✅ Social media link URL validation
- ✅ Email link format validation
- ✅ Blog post and project link navigation
- ✅ Accessibility compliance for all links

### 3. Social Icons Testing (`social-icons.spec.js`)

- ✅ Social icon visibility and rendering
- ✅ Platform-specific URL validation
- ✅ Accessibility attributes (aria-label, title)
- ✅ Hover and interaction effects
- ✅ Mobile responsive behavior
- ✅ Configuration matching with site.json
- ✅ Neo-Brutalist styling characteristics

### 4. Responsive Design (`responsive.spec.js`)

- ✅ Cross-viewport compatibility (320px to 1920px)
- ✅ Typography scaling and readability
- ✅ Image responsiveness and optimization
- ✅ Grid layout adaptation
- ✅ Touch-friendly interactions on mobile
- ✅ Container and spacing responsiveness
- ✅ Neo-Brutalist elements maintain style across devices

### 5. Accessibility (`accessibility.spec.js`)

- ✅ Semantic HTML structure and landmarks
- ✅ ARIA attributes and proper labeling
- ✅ Keyboard navigation support
- ✅ Screen reader compatibility
- ✅ Color contrast validation
- ✅ Focus management and indicators
- ✅ Reduced motion preference support
- ✅ Form accessibility and error handling

### 6. Performance (`performance.spec.js`)

- ✅ Page load times (< 3 seconds target)
- ✅ Core Web Vitals monitoring (LCP, FID, CLS)
- ✅ Image loading optimization
- ✅ CSS/JavaScript bundle size analysis
- ✅ Animation performance testing
- ✅ Memory usage monitoring
- ✅ Network condition simulation
- ✅ Third-party script impact assessment

## 🎨 Neo-Brutalist Specific Tests

The test suite includes specialized validations for Neo-Brutalist design
elements:

- **Bold Typography**: Large font sizes and proper scaling
- **Thick Borders**: Border width >= 3px on key elements
- **Box Shadows**: Distinctive shadow effects
- **Vibrant Colors**: CSS custom properties validation
- **Element Rotations**: Transform effects on cards/elements
- **Hover Effects**: Interactive state changes

## 📊 Performance Budgets

Current targets for optimal user experience:

| Metric                         | Target        | Test Location       |
| ------------------------------ | ------------- | ------------------- |
| Page Load Time                 | < 3 seconds   | performance.spec.js |
| Largest Contentful Paint (LCP) | < 2.5 seconds | performance.spec.js |
| First Contentful Paint (FCP)   | < 1.8 seconds | performance.spec.js |
| Cumulative Layout Shift (CLS)  | < 0.1         | performance.spec.js |
| CSS Bundle Size                | < 100KB       | performance.spec.js |
| JavaScript Bundle Size         | < 200KB       | performance.spec.js |
| Font Bundle Size               | < 150KB       | performance.spec.js |

## 🌐 Browser Support

Tests run across multiple browsers and devices:

- **Desktop**: Chromium, Firefox, WebKit (Safari)
- **Mobile**: Pixel 5 (Android), iPhone 12 (iOS)
- **Viewports**: 7 different screen sizes tested

## 🔧 Configuration

### Environment Variables

```bash
# Test against GitHub Pages
GITHUB_PAGES_URL=https://williamzujkowski.github.io/Neo-Brutalist-11ty-Theme/ npm test

# Test against custom deployment
BASE_URL=https://your-domain.com npm test

# Enable CI mode
CI=true npm test
```

### Playwright Configuration

Key configuration in `playwright.config.js`:

```javascript
{
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:8080',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],
  webServer: {
    command: 'npm run serve',
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI,
  },
}
```

## 🚀 CI/CD Integration

GitHub Actions workflow (`.github/workflows/playwright.yml`):

- Runs on push to main/develop branches
- Tests both local build and GitHub Pages deployment
- Generates HTML reports with screenshots and traces
- Parallel execution across browsers
- Artifact retention for debugging

## 🛠️ Debugging Tests

### Common Commands

```bash
# Run specific test file
npx playwright test navigation.spec.js

# Run tests for specific browser
npx playwright test --project=chromium

# Run tests in headed mode
npx playwright test --headed

# Debug with Playwright Inspector
npx playwright test --debug

# Generate new test code
npx playwright codegen localhost:8080
```

### Visual Debugging

```bash
# View test report
npx playwright show-report

# Run with UI mode for interactive debugging
npx playwright test --ui
```

## 📈 Test Metrics

The complete test suite includes:

- **2,129+ lines** of test code
- **6 test specification files**
- **100+ individual test cases**
- **Multiple browser/device combinations**
- **Performance budget validation**
- **Accessibility compliance checking**

## 🔄 Maintenance

### Adding New Tests

1. Create test file in `/tests/` directory
2. Import required utilities from `/tests/helpers/test-utils.js`
3. Follow existing naming conventions
4. Add documentation to test descriptions
5. Update this guide if needed

### Updating Performance Budgets

Adjust targets in `performance.spec.js` based on:

- Site complexity changes
- New feature additions
- Performance optimization improvements
- User experience requirements

## 📝 Test Reports

After running tests, view detailed reports:

```bash
# Open HTML report
npx playwright show-report
```

Reports include:

- Test execution summary
- Screenshots of failures
- Performance metrics
- Accessibility audit results
- Network activity logs
- Browser console outputs

This comprehensive test suite ensures the Neo-Brutalist theme maintains high
quality, performance, and accessibility standards across all browsers and
devices.
