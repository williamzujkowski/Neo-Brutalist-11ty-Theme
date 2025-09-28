# Implementation Guide for Neo-Brutalist 11ty Theme

## Quick Start Commands

```bash
# 1. Clone the template repository
git clone https://github.com/williamzujkowski/Neo-Brutalist-11ty-Theme.git
cd Neo-Brutalist-11ty-Theme

# 2. Initialize npm and install dependencies
npm init -y
npm install --save-dev @11ty/eleventy @11ty/eleventy-navigation @11ty/eleventy-plugin-syntaxhighlight cross-env markdown-it markdown-it-attrs

# 3. Create folder structure
mkdir -p src/{_data,_includes/{layouts,components,partials},assets/{css,js,images},pages,posts,projects}
mkdir -p .github/workflows

# 4. Copy configuration files
# Copy .eleventy.js to root
# Copy package.json to root
# Copy deploy.yml to .github/workflows/

# 5. Create data files
# Copy site.json to src/_data/

# 6. Create layouts and components
# Copy base.njk to src/_includes/layouts/
# Copy hero.njk to src/_includes/components/
# Copy index.njk to src/pages/

# 7. Test locally
npm run dev

# 8. Build for production
npm run build

# 9. Deploy to GitHub Pages
git add .
git commit -m "Initial 11ty theme setup"
git push origin main
```

## Step-by-Step Implementation

### Step 1: Repository Setup
```bash
# Fork or use the template from GitHub
# https://github.com/williamzujkowski/Neo-Brutalist-11ty-Theme
# Clone your fork
git clone https://github.com/yourusername/your-site-name.git
cd your-site-name

# Create README
echo "# My Neo-Brutalist Site" > README.md
```

### Step 2: Project Structure Creation
```bash
# Create all directories
mkdir -p src/_data
mkdir -p src/_includes/layouts
mkdir -p src/_includes/components  
mkdir -p src/_includes/partials
mkdir -p src/assets/css/components
mkdir -p src/assets/css/utilities
mkdir -p src/assets/js
mkdir -p src/assets/images
mkdir -p src/assets/fonts
mkdir -p src/pages
mkdir -p src/posts
mkdir -p src/projects
mkdir -p .github/workflows

# Create .gitignore
cat > .gitignore << 'EOF'
node_modules/
_site/
.DS_Store
.env
.cache
*.log
dist/
.eleventy
EOF
```

### Step 3: Core Files Implementation

#### 3.1 Create Main CSS File
```css
/* src/assets/css/main.css */
/* Import modern-normalize if using it */
@import 'modern-normalize';

/* CSS Custom Properties */
:root {
  /* Colors - Neo-Brutalist Palette */
  --electric-blue: #0066FF;
  --hot-pink: #FF0099;
  --acid-green: #00FF88;
  --cyber-yellow: #FFEE00;
  --deep-purple: #6600FF;
  --stark-black: #000000;
  --pure-white: #FFFFFF;
  --warning-red: #FF3333;
  
  /* Typography */
  --font-heading: 'Arial Black', 'Helvetica Neue', sans-serif;
  --font-body: 'Courier New', monospace;
  
  /* Spacing */
  --border-width: 6px;
  --shadow-offset: 12px;
  --container-padding: 40px;
  --section-padding: 80px;
  
  /* Animation */
  --duration-fast: 0.2s;
  --duration-normal: 0.3s;
  --duration-slow: 0.6s;
}

/* Base styles - copy from original website CSS */
/* Component styles - modularize from original */
/* Utility classes */
/* Responsive styles */
```

#### 3.2 Create Main JavaScript
```javascript
// src/assets/js/main.js
document.addEventListener('DOMContentLoaded', () => {
  console.log('Neo-Brutalist theme loaded');
  
  // Initialize all modules
  initCursor();
  initSmoothScroll();
  initAnimations();
});

function initCursor() {
  const cursor = document.getElementById('cursorDot');
  if (!cursor) return;
  
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function initAnimations() {
  // Glitch effect, floating shapes, etc.
  console.log('Animations initialized');
}
```

### Step 4: Component Creation

Create each component from the original HTML as a Nunjucks template:

#### Navigation Component (src/_includes/components/nav.njk)
```nunjucks
<nav class="main-nav">
  <a href="/" class="logo">{{ site.name }}</a>
  <ul class="nav-links">
    {% for item in navigation %}
    <li>
      <a href="{{ item.url }}" 
         {% if page.url == item.url %}class="active"{% endif %}>
        {{ item.text }}
      </a>
    </li>
    {% endfor %}
  </ul>
</nav>
```

#### Footer Component (src/_includes/components/footer.njk)
```nunjucks
<footer class="main-footer">
  <p class="footer-text">
    {{ site.footer.copyright }} → {{ site.footer.tagline }}
  </p>
</footer>
```

### Step 5: Data Files Creation

#### Navigation Data (src/_data/navigation.json)
```json
[
  { "text": "HOME", "url": "/" },
  { "text": "ABOUT", "url": "/#about" },
  { "text": "SERVICES", "url": "/#services" },
  { "text": "PROJECTS", "url": "/projects/" },
  { "text": "BLOG", "url": "/blog/" },
  { "text": "CONTACT", "url": "/#contact" }
]
```

### Step 6: Sample Content Creation

#### Sample Project (src/projects/sample-project.md)
```markdown
---
title: "Amazing Project"
description: "A revolutionary web application that changes everything"
date: 2024-01-15
tags: ["JavaScript", "Design", "React"]
image: "/assets/images/project-1.jpg"
order: 1
---

Project content goes here...
```

#### Sample Blog Post (src/posts/first-post.md)
```markdown
---
title: "Welcome to My Neo-Brutalist World"
date: 2024-01-01
excerpt: "Exploring the bold aesthetics of neo-brutalism in web design"
tags: ["design", "web", "brutalism"]
---

Blog post content...
```

### Step 7: GitHub Pages Configuration

1. **Enable GitHub Pages:**
   - Go to Settings → Pages in your GitHub repository
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)

2. **Create CNAME file (if using custom domain):**
```bash
echo "your-domain.com" > src/CNAME
```

3. **Update package.json scripts:**
```json
{
  "scripts": {
    "build:gh-pages": "eleventy --pathprefix=/your-repo-name/"
  }
}
```

### Step 8: Testing & Debugging

```bash
# Run development server
npm run dev
# Visit http://localhost:8080

# Build for production
npm run build
# Check _site folder

# Test GitHub Pages build
npm run build:gh-pages
```

### Step 9: Deployment

```bash
# Commit all changes
git add .
git commit -m "Complete 11ty Neo-Brutalist theme implementation"
git push origin main

# GitHub Actions will automatically build and deploy
# Check Actions tab in GitHub for build status
# Site will be available at: https://yourusername.github.io/your-repo-name/
# Or at custom domain if configured
```

## Troubleshooting

### Common Issues:

1. **Build fails on GitHub Actions:**
   - Check node version in workflow matches local
   - Ensure all dependencies are in package.json
   - Check for missing files in git

2. **Styles not loading on GitHub Pages:**
   - Check pathPrefix in build command
   - Ensure CSS paths use `{{ '/assets/css/main.css' | url }}`

3. **JavaScript not working:**
   - Check console for errors
   - Ensure defer attribute on script tags
   - Verify file paths are correct

4. **Custom domain not working:**
   - CNAME file must be in output directory
   - DNS settings must point to GitHub Pages
   - May take up to 24 hours to propagate

## Final Checklist

- [ ] All components created and working
- [ ] CSS properly organized and minified
- [ ] JavaScript modules loading correctly
- [ ] Images optimized and lazy loading
- [ ] SEO meta tags in place
- [ ] GitHub Actions deploying successfully
- [ ] Site accessible on GitHub Pages
- [ ] Custom domain configured (if applicable)
- [ ] README documentation complete
- [ ] License file added

## Next Steps

1. Customize theme colors in site.json
2. Add more content (projects, blog posts)
3. Implement additional features (search, comments)
4. Optimize performance (image optimization, caching)
5. Add PWA capabilities (optional)
6. Create theme variations

## Resources

- [11ty Documentation](https://www.11ty.dev/docs/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Nunjucks Templating](https://mozilla.github.io/nunjucks/)
- [Neo-Brutalism Design Principles](https://www.awwwards.com/neo-brutalism-web-design-trend.html)
