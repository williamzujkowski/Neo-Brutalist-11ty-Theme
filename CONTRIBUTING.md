# Contributing to Neo-Brutalist 11ty Theme

First off, thank you for considering contributing to the Neo-Brutalist 11ty
Theme! It's people like you that make this theme better for everyone.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of
Conduct: be respectful, inclusive, and constructive in all interactions.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues as you might find out
that you don't need to create one. When you are creating a bug report, please
include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if relevant**
- **Include your environment details** (OS, browser, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an
enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Provide specific examples to demonstrate the enhancement**
- **Describe the current behavior and expected behavior**
- **Explain why this enhancement would be useful**

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. Ensure your code follows the existing style
4. Make sure your code lints
5. Issue that pull request!

## Development Setup

```bash
# Fork and clone the repo
git clone https://github.com/your-username/Neo-Brutalist-11ty-Theme.git
cd Neo-Brutalist-11ty-Theme

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Code Style Requirements

**IMPORTANT**: This project enforces strict code style standards. All
contributions must follow the official [Style Guide](docs/STYLE_GUIDE.md).

### Automated Style Enforcement

We use ESLint and Prettier to enforce consistent code style:

```bash
# Before submitting any code, run:
npm run style:fix      # Auto-fix all style issues
npm run lint:fix       # Fix JavaScript linting issues
npm run format         # Format all files with Prettier
npm run test          # Run all tests
```

### Pre-commit Checklist

Before committing any code, ensure:

- ✅ `npm run lint` passes without errors
- ✅ `npm run format:check` passes without issues
- ✅ `npm test` passes all tests
- ✅ Code follows security guidelines
- ✅ All user input is properly sanitized

### Git Commit Messages

Follow conventional commit format:

```bash
feat: add mobile navigation toggle functionality
fix: resolve XSS vulnerability in user input
docs: update installation instructions
style: format JavaScript files according to new standards
test: add comprehensive accessibility tests
refactor: improve component modularity
perf: optimize image loading performance
```

**Format**: `type(scope): description`

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `perf`, `chore`

### JavaScript Standards

**Required**:

- ES6+ features (classes, arrow functions, const/let)
- Single quotes for strings
- Semicolons always required
- 2-space indentation
- Max line length: 100 characters
- Proper error handling with try/catch
- Input validation and sanitization

**Example**:

```javascript
// ✅ CORRECT
export class ComponentManager {
  constructor(options = {}) {
    this.options = { ...this.defaultOptions, ...options };
  }

  async initialize() {
    try {
      await this.loadResources();
    } catch (error) {
      console.error('Initialization failed:', error);
      throw error;
    }
  }
}

// ❌ INCORRECT
function componentManager(options) {
  var self = this;
  self.options = options || {};
}
```

### CSS Standards

**Required**:

- BEM naming convention
- CSS custom properties for theming
- Component-based organization
- Mobile-first responsive design
- Logical property grouping

**Example**:

```css
/* ✅ CORRECT */
.hero-section {
  display: flex;
  flex-direction: column;
  padding: 2rem;
  background: var(--color-primary);
}

.hero-section__title {
  font-size: 2.5rem;
  color: var(--color-text);
}

.hero-section__title--large {
  font-size: 3.5rem;
}
```

### Security Requirements

**All code must follow security guidelines**:

- Sanitize all user input using `| escapeHTML` filter
- Validate SVG content with `| sanitizeIcon`
- Never use `innerHTML` with user data
- Implement proper error handling
- Use HTTPS for all external resources

### Template Standards

**Required for Nunjucks templates**:

- Semantic HTML elements
- ARIA labels for accessibility
- Proper escaping of dynamic content
- Component modularity

**Example**:

```njk
{# ✅ CORRECT #}
<section class="hero-section" aria-labelledby="hero-title">
  <h1 id="hero-title" class="hero-section__title">
    {{ title | escapeHTML }}
  </h1>
  {% if subtitle %}
    <p class="hero-section__subtitle">
      {{ subtitle | escapeHTML }}
    </p>
  {% endif %}
</section>
```

### Documentation Requirements

- Update [Style Guide](docs/STYLE_GUIDE.md) for new patterns
- Include JSDoc comments for complex functions
- Add README sections for new features
- Document breaking changes

## Project Structure

When adding new features, please maintain the existing structure:

```
src/
├── _data/          # Configuration files
├── _includes/      # Templates and components
├── assets/         # CSS, JS, images
├── pages/          # Page templates
├── posts/          # Blog posts
└── projects/       # Project showcases
```

## Adding New Components

When adding a new component:

1. Create the component in `src/_includes/components/`
2. Add corresponding styles in `src/assets/css/components/`
3. Add any JavaScript in `src/assets/js/`
4. Document the component usage
5. Add an example in the demo

## Testing

Before submitting a PR:

1. Test on multiple browsers (Chrome, Firefox, Safari, Edge)
2. Test responsive design on various screen sizes
3. Check accessibility with screen readers
4. Validate HTML and CSS
5. Run Lighthouse audit

## Documentation

- Update README.md if you change functionality
- Comment your code where necessary
- Update the wiki for major features
- Include JSDoc comments for JavaScript functions

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

## Recognition

Contributors who submit accepted PRs will be added to the README contributors
section.

Thank you for contributing to make the web more bold and beautiful! 🎨⚡
