# 11ty Neo-Brutalist Theme - Project Plan

## Project Overview
A reusable Neo-Brutalist theme for 11ty (Eleventy) with GitHub Pages deployment support. Perfect for portfolios, creative agencies, and anyone wanting to make a bold statement online.

## Repository
https://github.com/williamzujkowski/Neo-Brutalist-11ty-Theme

## Project Structure
```
Neo-Brutalist-11ty-Theme/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions for auto-deployment
├── src/
│   ├── _data/
│   │   ├── site.json           # Site-wide configuration
│   │   ├── navigation.json     # Nav menu items
│   │   └── metadata.json       # SEO metadata
│   ├── _includes/
│   │   ├── layouts/
│   │   │   ├── base.njk        # Base HTML layout
│   │   │   ├── home.njk        # Homepage layout
│   │   │   └── page.njk        # Generic page layout
│   │   ├── components/
│   │   │   ├── nav.njk         # Navigation component
│   │   │   ├── hero.njk        # Hero section
│   │   │   ├── about.njk       # About section
│   │   │   ├── services.njk    # Services/Skills section
│   │   │   ├── contact.njk     # Contact section
│   │   │   └── footer.njk      # Footer component
│   │   └── partials/
│   │       ├── floating-shapes.njk  # Animated shapes
│   │       └── cursor-dot.njk       # Custom cursor
│   ├── assets/
│   │   ├── css/
│   │   │   ├── main.css        # Main stylesheet
│   │   │   ├── components/     # Component-specific styles
│   │   │   └── utilities/      # Utility classes
│   │   ├── js/
│   │   │   ├── main.js         # Main JavaScript
│   │   │   ├── animations.js   # Animation scripts
│   │   │   └── interactions.js # User interactions
│   │   └── images/             # Image assets
│   ├── pages/
│   │   ├── index.njk           # Homepage
│   │   ├── about.njk           # About page
│   │   ├── projects.njk        # Projects page
│   │   └── contact.njk         # Contact page
│   └── posts/                  # Blog posts (optional)
├── .eleventy.js                # 11ty configuration
├── package.json                # Dependencies
├── README.md                   # Documentation
├── netlify.toml               # Netlify config (alternative to GitHub Pages)
└── .gitignore

```

## Phase 1: Project Setup (Day 1)

### 1.1 Initialize Project
- Create new GitHub repository
- Initialize npm project
- Install 11ty and dependencies
- Set up basic folder structure

### 1.2 Dependencies to Install
```json
{
  "devDependencies": {
    "@11ty/eleventy": "^2.0.1",
    "@11ty/eleventy-plugin-syntaxhighlight": "^5.0.0",
    "@11ty/eleventy-navigation": "^0.3.5",
    "npm-run-all": "^4.1.5",
    "cross-env": "^7.0.3"
  },
  "dependencies": {
    "modern-normalize": "^2.0.0"
  }
}
```

### 1.3 GitHub Actions Workflow
Create `.github/workflows/deploy.yml` for automatic deployment to GitHub Pages

## Phase 2: Core Configuration (Day 1-2)

### 2.1 11ty Configuration
- Set up input/output directories
- Configure Nunjucks templating
- Add passthrough for assets
- Configure collections for blog posts

### 2.2 Data Files
- Create site configuration JSON
- Set up navigation structure
- Configure theme customization options

## Phase 3: Component Development (Day 2-3)

### 3.1 Base Layout System
- Create base.njk with HTML structure
- Implement component slots
- Add SEO meta tags

### 3.2 Modular Components
- Convert each section to Nunjucks component
- Make components data-driven
- Add customization variables

### 3.3 Styling System
- Organize CSS with CSS custom properties
- Create theme variables
- Implement responsive design

## Phase 4: JavaScript Modules (Day 3)

### 4.1 Core Interactions
- Cursor tracking system
- Smooth scrolling
- Animation triggers

### 4.2 Dynamic Effects
- Glitch animations
- Random color changes
- Floating shapes movement

## Phase 5: Content Management (Day 4)

### 5.1 Markdown Support
- Configure markdown processing
- Add front matter support
- Create content templates

### 5.2 Collections
- Set up blog post collection
- Create project showcase collection
- Add tag system

## Phase 6: Build & Deploy (Day 4-5)

### 6.1 Build Process
- Configure production builds
- Optimize assets
- Add CSS/JS minification

### 6.2 GitHub Pages Setup
- Configure custom domain
- Set up GitHub Actions
- Test deployment pipeline

## Key Features to Implement

### Theme Customization Options
```javascript
// _data/theme.json
{
  "colors": {
    "primary": "#0066FF",
    "secondary": "#FF0099",
    "accent": "#00FF88",
    "warning": "#FFEE00",
    "danger": "#FF3333"
  },
  "typography": {
    "headingFont": "Arial Black, sans-serif",
    "bodyFont": "Courier New, monospace",
    "megaSize": "clamp(4rem, 12vw, 10rem)"
  },
  "animations": {
    "glitchEnabled": true,
    "floatingShapes": true,
    "cursorTrail": true
  }
}
```

### Component Props System
```nunjucks
{# Example: Reusable service card component #}
{% macro serviceCard(icon, title, description, rotation) %}
<div class="service-card" data-rotation="{{ rotation }}">
  <span class="service-icon">{{ icon }}</span>
  <h3 class="service-name">{{ title }}</h3>
  <p class="service-desc">{{ description }}</p>
</div>
{% endmacro %}
```

## Performance Optimizations

1. **Lazy Loading**: Implement for images and heavy components
2. **Code Splitting**: Separate critical and non-critical CSS
3. **Asset Optimization**: Compress images, minify CSS/JS
4. **Caching Strategy**: Leverage browser caching
5. **Prefetching**: Add link prefetching for navigation

## Accessibility Considerations

1. **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
2. **ARIA Labels**: Add proper ARIA attributes
3. **Color Contrast**: Maintain WCAG AA compliance
4. **Focus Indicators**: Visible focus states for all interactive elements
5. **Screen Reader Support**: Semantic HTML structure

## Testing Checklist

- [ ] Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsiveness (320px to 414px)
- [ ] Tablet responsiveness (768px to 1024px)
- [ ] Desktop scaling (1024px+)
- [ ] GitHub Pages deployment
- [ ] Custom domain configuration
- [ ] SEO meta tags
- [ ] Open Graph tags
- [ ] Performance metrics (Lighthouse score > 90)
- [ ] Accessibility audit

## Documentation Requirements

1. **README.md**: Installation, configuration, deployment
2. **THEME.md**: Customization guide
3. **CONTRIBUTING.md**: Contribution guidelines
4. **Examples**: Sample content and layouts

## Success Metrics

- Clean, modular codebase
- < 3 second load time
- Lighthouse score > 90
- Fully responsive design
- Easy theme customization
- Successful GitHub Pages deployment
- Documentation completeness

## Timeline
- **Day 1**: Setup & Configuration
- **Day 2-3**: Component Development
- **Day 3-4**: JavaScript & Interactions
- **Day 4**: Content Management
- **Day 5**: Deployment & Testing

## Notes for Claude Flow/CLI Implementation

1. Start with the `.eleventy.js` configuration file
2. Build components incrementally, testing each one
3. Use Nunjucks macros for reusable components
4. Implement GitHub Actions early for continuous deployment
5. Keep CSS modular using BEM or similar methodology
6. Test on GitHub Pages with each major feature addition
