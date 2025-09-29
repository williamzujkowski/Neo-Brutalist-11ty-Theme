# Development Guide

## Setting Up Development Environment

### Prerequisites

- Node.js 14+ and npm 6+
- Git for version control
- Code editor with syntax highlighting

### Installation

```bash
git clone https://github.com/williamzujkowski/Neo-Brutalist-11ty-Theme.git
cd Neo-Brutalist-11ty-Theme
npm install
```

### Development Commands

```bash
npm run dev          # Start development server with live reload
npm run build        # Build for production
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run test         # Run Playwright tests
npm run style:fix    # Fix linting and formatting issues
```

## Code Standards

### JavaScript

- ES6+ features preferred
- Use `const` and `let`, avoid `var`
- Follow ESLint configuration
- Document functions with JSDoc comments

```javascript
/**
 * Initialize smooth scrolling behavior
 * @param {NodeList} links - Navigation links to enhance
 */
function initSmoothScroll(links) {
  // Implementation
}
```

### CSS

- Use BEM methodology for class naming
- Leverage CSS custom properties for theming
- Mobile-first responsive design
- Use semantic HTML elements

```css
.component__element--modifier {
  property: value;
}
```

### HTML/Nunjucks

- Semantic HTML5 elements
- Accessible markup with ARIA attributes
- Progressive enhancement approach
- Validate templates with HTML validator

```njk
<nav class="navigation" role="navigation" aria-label="Main navigation">
  <ul class="navigation__list">
    {% for item in navigation %}
      <li class="navigation__item">
        <a href="{{ item.url }}" class="navigation__link">{{ item.title }}</a>
      </li>
    {% endfor %}
  </ul>
</nav>
```

## Testing

### Running Tests

```bash
npm test                    # Run all tests
npm run test:ui            # Run tests with UI
npm run test:headed        # Run tests in headed mode
npm run test:debug         # Debug tests
```

### Writing Tests

Follow the existing patterns in `tests/`:

```javascript
import { test, expect } from '@playwright/test';

test('navigation should be accessible', async ({ page }) => {
  await page.goto('/');

  // Check for proper navigation structure
  const nav = page.locator('nav[role="navigation"]');
  await expect(nav).toBeVisible();

  // Verify keyboard navigation
  await page.keyboard.press('Tab');
  const focusedElement = page.locator(':focus');
  await expect(focusedElement).toBeVisible();
});
```

### Test Categories

- **Accessibility**: WCAG compliance, keyboard navigation
- **Performance**: Core Web Vitals, loading times
- **Responsive**: Mobile device compatibility
- **Navigation**: Link functionality, routing
- **Social**: Social media integration

## Build Process

### Eleventy Configuration

The `.eleventy.js` file controls:

- Input/output directories
- Template processing
- Plugins and filters
- Collections and pagination

### Asset Processing

- CSS: Processed through Eleventy's asset pipeline
- JavaScript: ES6 modules with fallbacks
- Images: Optimized for web delivery
- Fonts: Web font loading strategies

### Environment Variables

```javascript
// Development vs Production
const isDev = process.env.NODE_ENV === 'development';

// GitHub Pages deployment
const pathPrefix = process.env.PATHPREFIX || '';
```

## Deployment

### GitHub Pages

Automatic deployment via GitHub Actions:

- Triggered on push to main branch
- Runs linting and tests
- Builds site with proper path prefix
- Deploys to GitHub Pages

### Custom Deployment

For other platforms:

```bash
npm run build
# Upload _site/ directory contents
```

## Security Considerations

### Content Security Policy

The theme implements CSP headers:

```javascript
// In base.njk template
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self' 'unsafe-inline';">
```

### Input Sanitization

All user content is properly escaped:

```njk
{{ userContent | escape }}        <!-- Safe -->
{{ userContent | safe }}         <!-- Only for trusted content -->
```

### Dependency Management

- Regular security audits with `npm audit`
- Automated dependency updates
- Minimal dependency footprint

## Performance Optimization

### Bundle Size

- CSS is automatically minified
- JavaScript uses tree shaking
- Images are optimized
- Fonts are subset and compressed

### Core Web Vitals

- Largest Contentful Paint: < 2.5s
- First Input Delay: < 100ms
- Cumulative Layout Shift: < 0.1

### Monitoring

Use Lighthouse CI for continuous performance monitoring:

```bash
npx @lhci/cli@latest autorun
```

## Contributing

### Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make changes following code standards
4. Add/update tests as needed
5. Ensure all checks pass
6. Submit pull request with clear description

### Issue Reporting

When reporting issues:

- Provide minimal reproduction case
- Include environment details
- Add relevant logs or screenshots
- Tag with appropriate labels
