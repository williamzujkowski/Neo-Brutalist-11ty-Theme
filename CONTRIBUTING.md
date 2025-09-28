# Contributing to Neo-Brutalist 11ty Theme

First off, thank you for considering contributing to the Neo-Brutalist 11ty Theme! It's people like you that make this theme better for everyone.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct: be respectful, inclusive, and constructive in all interactions.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps to reproduce the problem**
* **Provide specific examples**
* **Describe the behavior you observed and what you expected**
* **Include screenshots if relevant**
* **Include your environment details** (OS, browser, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a detailed description of the suggested enhancement**
* **Provide specific examples to demonstrate the enhancement**
* **Describe the current behavior and expected behavior**
* **Explain why this enhancement would be useful**

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

## Style Guide

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

Examples:
```
Add new glitch animation effect
Fix responsive layout issue on mobile devices
Update documentation for theme customization
```

### JavaScript Style Guide

* Use ES6+ features where appropriate
* Use meaningful variable names
* Comment complex logic
* Keep functions small and focused
* Use `const` and `let`, avoid `var`

### CSS Style Guide

* Use CSS custom properties for theming
* Follow BEM naming convention for classes
* Group related properties together
* Use shorthand properties where possible
* Comment complex selectors or hacks

### Template Style Guide

* Use semantic HTML elements
* Include proper ARIA labels for accessibility
* Keep components modular and reusable
* Use Nunjucks macros for repeated elements

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

* Update README.md if you change functionality
* Comment your code where necessary
* Update the wiki for major features
* Include JSDoc comments for JavaScript functions

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

## Recognition

Contributors who submit accepted PRs will be added to the README contributors section.

Thank you for contributing to make the web more bold and beautiful! 🎨⚡