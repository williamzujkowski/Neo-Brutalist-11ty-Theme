---
title: "Building a Neo-Brutalist Theme with 11ty"
date: 2025-01-25
excerpt: "How we built this theme using Eleventy, pure CSS, and a complete disregard for subtlety"
tags: ["11ty", "development", "tutorial", "featured"]
---

## The Stack That Powers Rebellion

When we set out to build a theme that **breaks every design rule**, we needed a stack that could keep up with our chaos. Enter **Eleventy (11ty)** – the static site generator that's fast enough to handle our madness.

### Why 11ty?

While everyone else is drowning in React complexity and Next.js overhead, we chose **simplicity with attitude**:

- **Zero Client JS by Default**: Our chaos is CSS-powered, not JavaScript-bloated
- **Lightning Fast Builds**: < 1 second to generate the entire site
- **Template Freedom**: Mix and match Nunjucks, Markdown, and more
- **Data Cascade**: Powerful data management without the headaches

### The Architecture

```
📁 src/
  📁 _includes/
    📁 components/    # Modular chaos
    📁 layouts/       # Base templates
  📁 _data/          # Global data files
  📁 assets/
    📁 css/          # 14 component files
    📁 js/           # Minimal enhancement
  📁 posts/          # Blog content
  📁 projects/       # Portfolio items
  📁 pages/          # Static pages
```

### Component-Based CSS Architecture

Instead of a monolithic stylesheet, we broke our chaos into **manageable pieces**:

```css
/* main.css - The Orchestrator */
@import 'variables.css';      /* Design tokens */
@import 'base.css';           /* Reset & foundations */
@import 'components/nav.css';  /* Component styles */
@import 'components/hero.css';
@import 'components/about.css';
/* ... more components */
@import 'utilities.css';      /* Helper classes */
@import 'animations.css';     /* Motion & chaos */
```

### The Nunjucks Advantage

Nunjucks gives us **powerful templating** without the complexity:

```nunjucks
{# Dynamic component rendering #}
{% for skill in site.skills %}
<div class="skill-card" style="transform: rotate({{ range(-3, 3) | random }}deg)">
    <span class="skill-icon">{{ skill.icon }}</span>
    <h3>{{ skill.name }}</h3>
    <p>{{ skill.description }}</p>
</div>
{% endfor %}
```

### Data-Driven Design

All our content lives in **structured data files**:

```javascript
// _data/site.json
{
  "theme": {
    "colors": {
      "electricBlue": "#0066FF",
      "hotPink": "#FF0099",
      "acidGreen": "#00FF88"
    },
    "animations": {
      "glitchEnabled": true,
      "floatingShapes": true
    }
  }
}
```

### Performance Without Compromise

Despite the visual chaos, we achieve **perfect scores**:

- **100/100 Lighthouse Performance**
- **< 100KB Total Page Weight**
- **Zero Render-Blocking Resources**
- **Instant Page Loads**

### The Build Pipeline

Simple yet powerful:

```javascript
// .eleventy.js
module.exports = function(eleventyConfig) {
  // Copy assets directly
  eleventyConfig.addPassthroughCopy("src/assets");

  // Add custom filters
  eleventyConfig.addFilter("random", () => {
    return Math.floor(Math.random() * 5) - 2;
  });

  // Custom collections
  eleventyConfig.addCollection("featured", (collection) => {
    return collection.getFilteredByTag("featured");
  });

  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};
```

### Deployment via GitHub Actions

Automatic deployment on every push:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm ci && npm run build
      - uses: peaceiris/actions-gh-pages@v3
```

### CSS Variables for Dynamic Theming

The entire color scheme can be changed with **CSS custom properties**:

```css
:root {
  --electric-blue: #0066FF;
  --hot-pink: #FF0099;
  --acid-green: #00FF88;
  --border-width: 6px;
  --shadow-offset: 12px;
}

/* Dark mode? Psychedelic mode? Your choice */
[data-theme="psychedelic"] {
  --electric-blue: #FF00FF;
  --hot-pink: #00FFFF;
  --acid-green: #FFFF00;
}
```

### Accessibility in Chaos

Bold doesn't mean inaccessible:

- **WCAG 2.1 AA Compliant**
- **Semantic HTML Structure**
- **ARIA Labels Where Needed**
- **Keyboard Navigation Support**
- **Skip Links for Screen Readers**

### The Philosophy in Code

Our development philosophy:

1. **Performance First**: If it slows the site, it doesn't ship
2. **Progressive Enhancement**: CSS does the heavy lifting
3. **Maintainable Chaos**: Organized file structure despite visual anarchy
4. **Open Source**: Share the rebellion

### Lessons Learned

Building this theme taught us:

- **Constraints Breed Creativity**: No frameworks forced innovative solutions
- **CSS is Powerful**: You don't need JS for impressive animations
- **Static is Fast**: Server-side generation beats client-side rendering
- **Bold Designs Work**: Users remember experiences that stand out

### Get the Code

Ready to start your own rebellion?

```bash
git clone https://github.com/williamzujkowski/Neo-Brutalist-11ty-Theme
cd Neo-Brutalist-11ty-Theme
npm install
npm run dev
```

### The Future

This theme is just the beginning. We're planning:

- **More Animation Modes**: Glitch, wave, morph effects
- **Theme Variations**: Cyberpunk, Vaporwave, Brutalist Classic
- **Component Library**: Drag-and-drop Neo-Brutalist elements
- **11ty Plugin**: Easy integration for any project

### Join the Revolution

The web needs more personality. More attitude. More **rebellion**.

Stop building boring websites. Start breaking rules.

**The revolution will be `font-size: 10rem`** 🔥