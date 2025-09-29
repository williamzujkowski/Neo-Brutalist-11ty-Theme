# Advanced Customization Guide

## Theme Structure

The Neo-Brutalist theme is organized into these key areas:

### Templates (`src/_includes/`)

- `layouts/` - Page layouts (base, home, post, page)
- `components/` - Reusable components (nav, footer, hero, etc.)
- `partials/` - Small UI elements (cursor, shapes, etc.)

### Styles (`src/assets/css/`)

- `main.css` - Main stylesheet with imports
- `components/` - Component-specific styles
- `utilities/` - Responsive and animation utilities

### Scripts (`src/assets/js/`)

- `main.js` - Main JavaScript entry point
- Individual modules for animations, interactions, cursor effects

## Customization Approaches

### 1. Override Styles

Create your own CSS files and import after the theme:

```css
@import 'neo-brutalist-theme/src/assets/css/main.css';
@import './custom-overrides.css';
```

### 2. Extend Templates

Copy theme templates to your project and modify:

```
your-project/
├── src/_includes/
│   ├── layouts/
│   │   └── base.njk  # Your customized version
│   └── components/
│       └── nav.njk   # Your customized nav
```

### 3. Configure Data

Override theme data files:

```json
// src/_data/site.json
{
  "title": "Your Site Name",
  "description": "Your description",
  "author": {
    "name": "Your Name",
    "email": "you@example.com"
  },
  "social": {
    "github": "your-username",
    "twitter": "your-handle"
  }
}
```

## Advanced Features

### Custom Color Schemes

Override CSS custom properties:

```css
:root {
  --color-primary: #ff6b35;
  --color-secondary: #004e89;
  --color-accent: #ffc425;
  --color-background: #1a1a1a;
  --color-text: #ffffff;
}
```

### Typography Customization

Use system fonts or web fonts:

```css
:root {
  --font-primary: 'Your Font', system-ui, sans-serif;
  --font-secondary: 'Your Display Font', serif;
}
```

### Animation Controls

Customize motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Component Extensions

Add new components following the theme patterns:

```njk
{# src/_includes/components/your-component.njk #}
<div class="your-component" data-component="your-component">
  <!-- Your component HTML -->
</div>
```

```css
/* src/assets/css/components/your-component.css */
.your-component {
  /* Follow theme design patterns */
  background: var(--color-accent);
  box-shadow: var(--shadow-brutal);
  border: var(--border-thick);
}
```

## Performance Optimization

### Image Optimization

Use responsive images:

```njk
<picture>
  <source media="(max-width: 768px)" srcset="image-mobile.webp">
  <source media="(min-width: 769px)" srcset="image-desktop.webp">
  <img src="image-fallback.jpg" alt="Description">
</picture>
```

### JavaScript Optimization

Load scripts conditionally:

```njk
{% if page.url != "/" %}
  <script src="/assets/js/page-specific.js" defer></script>
{% endif %}
```

### CSS Optimization

Use CSS custom properties for dynamic theming:

```css
.theme-dark {
  --color-background: #000000;
  --color-text: #ffffff;
}

.theme-light {
  --color-background: #ffffff;
  --color-text: #000000;
}
```
