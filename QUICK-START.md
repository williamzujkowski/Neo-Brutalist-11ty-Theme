# 🚀 Quick Start Guide

Get your Neo-Brutalist site up and running in 5 minutes!

## Option 1: Use as GitHub Template (Recommended)

1. **Use this template**
   - Go to [Neo-Brutalist 11ty Theme](https://github.com/williamzujkowski/Neo-Brutalist-11ty-Theme)
   - Click the green "Use this template" button
   - Name your new repository

2. **Clone your new repo**
   ```bash
   git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
   cd YOUR-REPO-NAME
   ```

3. **Install and run**
   ```bash
   npm install
   npm run dev
   ```
   Visit http://localhost:8080 to see your site!

4. **Customize**
   - Edit `src/_data/site.json` with your information
   - Replace content in `src/pages/index.njk`
   - Adjust colors and fonts in the theme section

5. **Deploy to GitHub Pages**
   - Go to Settings → Pages in your repo
   - Set source to "GitHub Actions"
   - Push your changes - auto-deploy activated! ✨

## Option 2: Fork and Clone

1. Fork the repository
2. Clone your fork
3. Follow steps 3-5 above

## First Steps After Setup

### 1. Update Site Information
Edit `src/_data/site.json`:
```json
{
  "name": "YOUR NAME",
  "title": "Your Title",
  "url": "https://example.com",
  "author": {
    "name": "Your Name",
    "email": "your-email@domain.com"
  }
}
```

### 2. Customize Colors
Still in `src/_data/site.json`:
```json
"colors": {
  "primary": "#0066FF",    // Your primary color
  "secondary": "#FF0099",  // Your secondary color
  "accent": "#00FF88"      // Your accent color
}
```

### 3. Add Your Content

**Add a blog post:**
Create `src/posts/my-first-post.md`:
```markdown
---
title: "Hello World"
date: 2024-01-01
excerpt: "My first post!"
---

Content here...
```

**Add a project:**
Create `src/projects/awesome-project.md`:
```markdown
---
title: "Awesome Project"
description: "What I built"
tags: ["JavaScript", "Design"]
---

Project details...
```

### 4. Custom Domain (Optional)

1. Create `src/CNAME`:
   ```
   example.com
   ```

2. Configure DNS with GitHub Pages IPs:
   - A records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - CNAME: `your-username.github.io`

## 📁 Key Files to Edit

| File | Purpose |
|------|---------|
| `src/_data/site.json` | Main configuration |
| `src/pages/index.njk` | Homepage content |
| `src/_includes/components/*.njk` | Reusable components |
| `src/assets/css/main.css` | Custom styles |

## 🎨 Theme Customization

The Neo-Brutalist aesthetic is defined by:
- **Massive typography** (controlled by `typography.megaSize`)
- **Vivid colors** (5 bold colors in the palette)
- **Hard shadows** (adjust `spacing.shadowOffset`)
- **Thick borders** (modify `spacing.borderWidth`)
- **Slight rotations** (tweak `layout.rotation`)

## 🚨 Common Issues

**Build fails?**
```bash
npm run clean
npm install
npm run build
```

**Styles not loading on GitHub Pages?**
Check that pathPrefix matches your repo name in package.json build script.

**Animations too intense?**
Disable in `site.json`:
```json
"animations": {
  "enabled": false
}
```

## 🎯 Next Steps

1. ⭐ Star the original repo
2. 📖 Read the full [documentation](https://github.com/williamzujkowski/Neo-Brutalist-11ty-Theme/wiki)
3. 🎨 Make it your own
4. 🚀 Share your site!

## Need Help?

- [Open an issue](https://github.com/williamzujkowski/Neo-Brutalist-11ty-Theme/issues)
- Check the [Wiki](https://github.com/williamzujkowski/Neo-Brutalist-11ty-Theme/wiki)
- Read the [CONTRIBUTING.md](CONTRIBUTING.md) guide

---

**Remember: Break the rules, make it bold! 💥**