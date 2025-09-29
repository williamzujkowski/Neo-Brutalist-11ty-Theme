# Neo-Brutalist 11ty Theme - Code Style Guide

## Overview

This document establishes the official coding standards for the Neo-Brutalist
11ty Theme project. All contributors must follow these guidelines to ensure
consistent, maintainable, and high-quality code across the entire codebase.

## 🎯 Core Principles

1. **Consistency**: Code should look like it was written by a single developer
2. **Readability**: Code should be self-documenting and easy to understand
3. **Security**: All code must follow security best practices
4. **Performance**: Write efficient, optimized code
5. **Maintainability**: Code should be easy to modify and extend

## 📝 JavaScript Standards

### General Rules

- **ES6+ Features**: Use modern JavaScript (ES2022) features
- **Module System**: Use ES6 imports/exports for source files
- **Variable Declarations**: Use `const` by default, `let` when reassignment
  needed
- **No `var`**: Never use `var` declarations
- **Semicolons**: Always use semicolons
- **Quotes**: Use single quotes for strings, double quotes in templates when
  needed

### Code Style

```javascript
// ✅ CORRECT: Modern class with proper spacing
export class ThemeManager {
  constructor(options = {}) {
    this.options = { ...this.defaultOptions, ...options };
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) {
      return;
    }

    try {
      await this.loadModules();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize theme:', error);
      throw error;
    }
  }
}

// ❌ INCORRECT: Old-style function with poor formatting
function themeManager(options) {
  var self = this;
  self.options = options || {};
  self.init = function () {
    // implementation
  };
}
```

### Function Guidelines

```javascript
// ✅ PREFERRED: Arrow functions for simple operations
const calculateDistance = (x1, y1, x2, y2) => {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
};

// ✅ ACCEPTABLE: Traditional functions for complex logic
function processUserInput(input) {
  if (!input || typeof input !== 'string') {
    throw new Error('Invalid input provided');
  }

  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .slice(0, 100);
}

// ❌ AVOID: Inconsistent parameter spacing
function badFunction(param1, param2, param3) {
  return param1 + param2 + param3;
}
```

### Error Handling

```javascript
// ✅ CORRECT: Proper async/await with error handling
async function loadThemeAssets() {
  try {
    const [css, js] = await Promise.all([
      loadStylesheet('/assets/css/theme.css'),
      loadScript('/assets/js/theme.js')
    ]);

    return { css, js };
  } catch (error) {
    console.error('Failed to load theme assets:', error);
    // Fallback behavior
    return { css: null, js: null };
  }
}

// ❌ INCORRECT: Unhandled promises
function badAsyncFunction() {
  fetch('/api/data'); // No error handling
  return true;
}
```

### Security Requirements

```javascript
// ✅ SECURE: Input validation and sanitization
function sanitizeUserInput(userInput) {
  if (!userInput || typeof userInput !== 'string') {
    return '';
  }

  return userInput.replace(/[&<>"']/g, char => {
    const entities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    };
    return entities[char];
  });
}

// ❌ INSECURE: Direct DOM manipulation without sanitization
function unsafeFunction(userInput) {
  document.innerHTML = userInput; // XSS vulnerability
}
```

## 🎨 CSS Standards

### Architecture

- **Component-based**: Organize styles by component
- **Utility classes**: Use utility classes for common patterns
- **BEM methodology**: Follow Block\_\_Element--Modifier naming
- **Custom properties**: Use CSS custom properties for theming

### Naming Conventions

```css
/* ✅ CORRECT: BEM naming with consistent structure */
.hero-section {
  /* Block */
}

.hero-section__title {
  /* Element */
}

.hero-section__title--large {
  /* Modifier */
}

.hero-section__cta-button {
  /* Element with descriptor */
}

/* ❌ INCORRECT: Inconsistent naming */
.heroSection {
  /* camelCase not used */
}

.hero_title {
  /* Underscore inconsistency */
}
```

### Property Organization

```css
/* ✅ CORRECT: Logical property grouping */
.component {
  /* Layout */
  display: flex;
  position: relative;
  z-index: 10;

  /* Box model */
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  /* Typography */
  font-family: var(--font-primary);
  font-size: 1.125rem;
  line-height: 1.6;

  /* Visual */
  background: var(--color-primary);
  border: 2px solid var(--color-accent);
  border-radius: 0.5rem;
  box-shadow: 4px 4px 0 var(--color-shadow);

  /* Animation */
  transition: transform 0.2s ease;
}

/* ❌ INCORRECT: Random property order */
.bad-component {
  color: red;
  position: absolute;
  font-size: 16px;
  display: block;
  margin: 10px;
  background: blue;
  width: 50%;
}
```

## 📄 HTML/Nunjucks Standards

### Template Structure

```njk
{# ✅ CORRECT: Well-structured template with proper indentation #}
<section class="hero-section" aria-labelledby="hero-title">
  <div class="hero-section__container">
    <h1 id="hero-title" class="hero-section__title hero-section__title--large">
      {{ title | escapeHTML }}
    </h1>

    {% if subtitle %}
      <p class="hero-section__subtitle">
        {{ subtitle | escapeHTML }}
      </p>
    {% endif %}

    <div class="hero-section__actions">
      <a href="{{ ctaLink }}" class="btn btn--primary hero-section__cta">
        {{ ctaText | escapeHTML }}
      </a>
    </div>
  </div>
</section>

{# ❌ INCORRECT: Poor structure and missing security #}
<div class="hero">
<h1>{{ title }}</h1>
<p>{{ subtitle }}</p>
<a href="{{ ctaLink }}">{{ ctaText }}</a>
</div>
```

### Security Requirements

- **Always escape user input**: Use `| escapeHTML` filter
- **Validate data**: Check data exists before using
- **Sanitize SVG content**: Use `| sanitizeIcon` for SVG icons
- **ARIA labels**: Include accessibility attributes

## 📊 JSON Standards

### Configuration Files

```json
{
  "name": "component-name",
  "version": "1.0.0",
  "description": "Brief description of the component",
  "author": "Author Name",
  "dependencies": {
    "package-name": "^1.0.0"
  },
  "scripts": {
    "build": "command here",
    "test": "test command"
  },
  "keywords": ["keyword1", "keyword2"],
  "license": "MIT"
}
```

### Data Files

```json
{
  "site": {
    "title": "Site Title",
    "description": "Site description",
    "url": "https://example.com",
    "author": {
      "name": "Author Name",
      "email": "author@example.com",
      "social": {
        "github": "username",
        "twitter": "username"
      }
    }
  },
  "navigation": [
    {
      "text": "Home",
      "url": "/",
      "active": true
    }
  ]
}
```

## 🧪 Testing Standards

### Test Structure

```javascript
// ✅ CORRECT: Well-organized test with clear structure
import { test, expect } from '@playwright/test';

test.describe('Navigation Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display all navigation links', async ({ page }) => {
    // Arrange
    const navigation = page.locator('nav[aria-label="Main navigation"]');

    // Act
    await navigation.waitFor();
    const links = navigation.locator('a');

    // Assert
    await expect(links).toHaveCount(5);
    await expect(links.first()).toBeVisible();
  });

  test('should highlight active page', async ({ page }) => {
    // Arrange
    const activeLink = page.locator('nav a[aria-current="page"]');

    // Assert
    await expect(activeLink).toHaveClass(/nav__link--active/);
  });
});

// ❌ INCORRECT: Poor test organization
test('nav test', async ({ page }) => {
  await page.goto('/');
  const links = page.locator('a');
  expect(links).toBeTruthy();
});
```

## 🔧 Tool Configuration

### ESLint Rules

Our ESLint configuration enforces:

- **Code Quality**: No unused variables, consistent naming
- **Security**: No eval, no unsafe operations
- **Best Practices**: Strict equality, proper error handling
- **ES6+**: Prefer const, arrow functions, template literals
- **Style**: 2-space indentation, single quotes, semicolons

### Prettier Settings

Our Prettier configuration ensures:

- **Indentation**: 2 spaces, no tabs
- **Quotes**: Single quotes for JavaScript, double for JSON
- **Line Length**: 100 characters maximum
- **Semicolons**: Always required
- **Trailing Commas**: Never used

## 📋 Development Workflow

### Before Committing

1. **Lint your code**: `npm run lint:fix`
2. **Format your code**: `npm run format`
3. **Run tests**: `npm test`
4. **Check style compliance**: `npm run style`

### Commit Messages

```bash
# ✅ CORRECT: Clear, descriptive commit messages
feat: add mobile navigation toggle functionality
fix: resolve accessibility issues in social icons
docs: update installation instructions
style: format JavaScript files according to new standards
test: add comprehensive navigation tests

# ❌ INCORRECT: Vague or unhelpful messages
update stuff
fix bug
changes
wip
```

## 🚀 Performance Guidelines

### JavaScript Performance

- **Minimize DOM queries**: Cache DOM references
- **Use event delegation**: Avoid excessive event listeners
- **Debounce/throttle**: Rate-limit expensive operations
- **Lazy loading**: Load resources when needed

### CSS Performance

- **Avoid deep nesting**: Keep selectors shallow
- **Use CSS custom properties**: Enable efficient theming
- **Minimize reflows**: Group style changes
- **Optimize animations**: Use transform and opacity

## 🔒 Security Checklist

### Input Validation

- ✅ All user input is validated and sanitized
- ✅ HTML content is properly escaped
- ✅ SVG content is validated before use
- ✅ URLs are validated before navigation

### XSS Prevention

- ✅ Use template filters for all dynamic content
- ✅ Avoid `innerHTML` with user data
- ✅ Sanitize all user-generated content
- ✅ Implement Content Security Policy

### Data Protection

- ✅ No sensitive data in client-side code
- ✅ Secure handling of API keys
- ✅ Proper error handling without data exposure
- ✅ Secure cookie and session management

## 📚 Resources

### Documentation

- [ESLint Configuration](/.eslintrc.js)
- [Prettier Configuration](/.prettierrc)
- [Package Scripts](/package.json)
- [Testing Guide](/TESTING.md)

### Style Commands

```bash
# Lint JavaScript files
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format all files
npm run format

# Check formatting
npm run format:check

# Run complete style check
npm run style

# Fix all style issues
npm run style:fix
```

## 🤝 Contributing

When contributing to this project:

1. **Read this guide completely**
2. **Set up your development environment**
3. **Configure your editor** with our ESLint and Prettier settings
4. **Run style checks** before submitting pull requests
5. **Follow naming conventions** consistently
6. **Include appropriate tests** for new features
7. **Update documentation** when necessary

## 📝 Editor Configuration

### VS Code Settings

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": ["javascript", "typescript"],
  "prettier.requireConfig": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

### EditorConfig

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
```

---

## 📞 Support

If you have questions about these style guidelines:

1. Check the existing code for examples
2. Run the style tools for automatic formatting
3. Consult the official documentation links
4. Ask in project discussions or issues

**Remember**: Consistent code style makes the entire project more maintainable
and professional. Thank you for following these guidelines!
