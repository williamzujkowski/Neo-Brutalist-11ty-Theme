# Neo-Brutalist 11ty Theme - Template Files

## Repository: https://github.com/williamzujkowski/Neo-Brutalist-11ty-Theme

This package contains all the files needed to create a complete Neo-Brutalist 11ty theme template repository.

## 📁 Core Configuration Files

1. **eleventy.config.js** → Rename to `.eleventy.js` in repo root
   - Complete 11ty configuration with plugins, filters, and collections
   - Configured for GitHub Pages deployment

2. **package.json** → Place in repo root
   - All necessary dependencies
   - Build scripts for development and production
   - GitHub Pages build script included

3. **gitignore.txt** → Rename to `.gitignore` in repo root
   - Comprehensive ignore patterns for 11ty projects

## 📁 GitHub Configuration

4. **deploy.yml** → Place in `.github/workflows/`
   - GitHub Actions workflow for automatic deployment
   - Builds and deploys to GitHub Pages on push to main

## 📁 Templates & Layouts

5. **base.njk** → Place in `src/_includes/layouts/`
   - Base HTML template with SEO and meta tags
   - Configurable theme settings

6. **hero.njk** → Place in `src/_includes/components/`
   - Reusable hero component with animations
   - Shows component architecture pattern

7. **index.njk** → Place in `src/pages/`
   - Homepage template showcasing all sections
   - Example of using components

## 📁 Data & Configuration

8. **site.json** → Place in `src/_data/`
   - Complete site configuration
   - Theme colors, typography, animations
   - Content for all sections
   - Social links and metadata

## 📁 Documentation

9. **README.md** → Place in repo root
   - Complete repository documentation
   - Features, installation, customization guide
   - Badges and professional formatting

10. **QUICK-START.md** → Place in repo root
    - 5-minute setup guide
    - Step-by-step instructions
    - Common customizations

11. **CONTRIBUTING.md** → Place in repo root
    - Contribution guidelines
    - Development setup
    - Style guides

12. **LICENSE** → Place in repo root
    - MIT License

## 📁 Reference Files

13. **demo.html** → Static demo for reference
    - Complete working example of the theme
    - Can be used as reference for component creation

14. **implementation-guide.md** → Developer reference
    - Detailed implementation steps
    - Troubleshooting guide
    - Best practices

15. **11ty-neo-brutalist-project-plan.md** → Project structure reference
    - Complete folder structure
    - Component organization
    - Feature list

## 🚀 Setup Instructions

1. Create a new repository at https://github.com/williamzujkowski/Neo-Brutalist-11ty-Theme
2. Initialize with README
3. Upload all files to their respective locations
4. Create the folder structure as outlined in the project plan
5. Enable GitHub Pages in repository settings (use GitHub Actions as source)
6. Add "Use this template" capability by going to Settings → General → Template repository ✓

## 📁 Required Folder Structure

```
Neo-Brutalist-11ty-Theme/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── src/
│   ├── _data/
│   │   └── site.json
│   ├── _includes/
│   │   ├── layouts/
│   │   │   └── base.njk
│   │   └── components/
│   │       └── hero.njk
│   ├── assets/
│   │   ├── css/
│   │   │   └── main.css (create from demo.html styles)
│   │   ├── js/
│   │   │   └── main.js (create from demo.html scripts)
│   │   └── images/
│   └── pages/
│       └── index.njk
├── .eleventy.js
├── .gitignore
├── package.json
├── README.md
├── QUICK-START.md
├── CONTRIBUTING.md
└── LICENSE
```

## ✨ Features of This Template

- **Neo-Brutalist Design**: Bold, vibrant, attention-grabbing
- **GitHub Template Ready**: Users can create new repos with one click
- **Automated Deployment**: Push to main = deployed to GitHub Pages
- **Fully Customizable**: Everything configurable via JSON
- **Developer Friendly**: Clean code, good documentation
- **Performance Optimized**: Fast builds, optimized assets
- **Accessibility Built-in**: Semantic HTML, ARIA labels

## 🎯 Success Metrics

Your template is ready when:
- ✅ Repository is public and marked as template
- ✅ Demo site deploys successfully to GitHub Pages
- ✅ "Use this template" button appears on repo
- ✅ Documentation is complete and clear
- ✅ First user can set up in under 5 minutes

---

**Ready to break the rules and make the web bold! 🎨⚡**