# 🎨 Neo-Brutalist 11ty Theme

[![11ty](https://img.shields.io/badge/11ty-2.0.1-blue)](https://www.11ty.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Deploy to GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-green)](https://pages.github.com/)

A **bold and vibrant** Neo-Brutalist theme for 11ty. Features massive
typography, vivid colors, hard shadows, and unconventional web design patterns
that demand attention.

![Neo-Brutalist Theme Preview](preview.png)

## ✨ Features

- 🎯 **Bold Design**: Massive typography, vivid colors, hard shadows
- 📱 **Fully Responsive**: Looks amazing on all devices
- ⚡ **Lightning Fast**: Static site generation with 11ty
- 🚀 **GitHub Pages Ready**: Automated deployment with GitHub Actions
- 🎨 **Highly Customizable**: Easy theming via JSON configuration
- ♿ **Accessible**: WCAG compliant with proper ARIA labels
- 🔧 **Developer Friendly**: Clean code, modular components
- 🎪 **Interactive Elements**: Cursor effects, animations, floating shapes
- 📝 **Blog Ready**: Built-in support for posts and projects
- 🔍 **SEO Optimized**: Meta tags, Open Graph, structured data

## 🚀 Quick Start

### Use this template

1. Click the "Use this template" button above
2. Create a new repository
3. Clone your new repository:

```bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
```

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Deploy to GitHub Pages

1. Go to Settings → Pages in your repository
2. Set Source to "GitHub Actions"
3. Push to main branch - it will automatically deploy!

## 🎨 Customization

### Theme Configuration

Edit `src/_data/site.json` to customize:

```json
{
  "name": "YOUR NAME",
  "title": "Your Title",
  "description": "Your description",
  "url": "https://example.com",

  "theme": {
    "colors": {
      "primary": "#0066FF",
      "secondary": "#FF0099",
      "accent": "#00FF88"
    }
  }
}
```

### Color Palette

The theme includes 5 vibrant colors by default:

- **Electric Blue** (#0066FF)
- **Hot Pink** (#FF0099)
- **Acid Green** (#00FF88)
- **Cyber Yellow** (#FFEE00)
- **Deep Purple** (#6600FF)

### Typography

Customize fonts and sizes in `site.json`:

```json
"typography": {
  "headingFont": "'Arial Black', sans-serif",
  "bodyFont": "'Courier New', monospace",
  "megaSize": "clamp(4rem, 12vw, 10rem)"
}
```

### Content Sections

- **Hero**: Eye-catching landing section
- **About**: Introduction with stats
- **Skills/Services**: Customizable skill cards
- **Projects**: Portfolio showcase
- **Blog**: Article listings
- **Contact**: Call-to-action

## 📁 Project Structure

```
├── src/
│   ├── _data/           # Site configuration
│   │   └── site.json     # Main config file
│   ├── _includes/        # Templates & components
│   │   ├── layouts/      # Page layouts
│   │   └── components/   # Reusable components
│   ├── assets/           # Static assets
│   │   ├── css/          # Stylesheets
│   │   ├── js/           # JavaScript
│   │   └── images/       # Images
│   ├── pages/            # Site pages
│   ├── posts/            # Blog posts (markdown)
│   └── projects/         # Project showcases
├── .eleventy.js          # 11ty configuration
├── package.json          # Dependencies
└── .github/
    └── workflows/
        └── deploy.yml    # GitHub Pages deployment
```

## 📝 Creating Content

### Add a Blog Post

Create a new file in `src/posts/`:

```markdown
---
title: 'Your Post Title'
date: 2025-01-01
excerpt: 'Brief description'
tags: ['design', 'web']
---

Your content here...
```

### Add a Project

Create a new file in `src/projects/`:

```markdown
---
title: 'Project Name'
description: 'What you built'
image: '/assets/images/project.jpg'
tags: ['React', 'Design']
order: 1
---

Project details...
```

## 🛠 Commands

| Command                  | Description                              |
| ------------------------ | ---------------------------------------- |
| `npm run dev`            | Start development server with hot reload |
| `npm run build`          | Build for production                     |
| `npm run build:gh-pages` | Build with GitHub Pages path prefix      |
| `npm run serve`          | Serve production build locally           |
| `npm run clean`          | Clean build directory                    |

## 🎯 Design Philosophy

This theme embodies Neo-Brutalist principles:

- **Maximum Impact**: Typography that demands attention
- **Bold Colors**: Vivid, clashing color combinations
- **Hard Shadows**: Deep, dramatic shadow effects
- **Intentional Chaos**: Controlled randomness and slight rotations

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file
for details.

## 🙏 Acknowledgments

- Inspired by Neo-Brutalist design movement
- Built with [11ty](https://www.11ty.dev/)
- Deployed with [GitHub Pages](https://pages.github.com/)

## 🐛 Known Issues

- Glitch animations may cause performance issues on older devices (can be
  disabled in config)
- Custom cursor doesn't work on mobile (hidden by default)

## 📮 Support

- [Report a bug](https://github.com/williamzujkowski/Neo-Brutalist-11ty-Theme/issues)
- [Request a feature](https://github.com/williamzujkowski/Neo-Brutalist-11ty-Theme/issues)
- [Documentation](https://github.com/williamzujkowski/Neo-Brutalist-11ty-Theme/wiki)

## 🚧 Theme Status

✅ **Fully Functional**: All features implemented and tested ✅ **Theme
Status**: Feature-complete Neo-Brutalist theme for 11ty ✅ **Actively
Maintained**: Regular updates and improvements

---

**Neo-Brutalist 11ty Theme | Break the rules, make it bold!** 💥
