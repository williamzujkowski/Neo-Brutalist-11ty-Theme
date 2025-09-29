# Repository Structure Notice

## Claude-Flow Automation Directory

The `.claude/` directory contains internal Claude-Flow automation tools and
agent configurations used during development and maintenance of this repository.
**This directory is not part of the theme distribution.**

### What's in `.claude/`

- AI agent configurations and coordination systems
- Development automation workflows
- Internal tooling and scripts
- Hive-mind coordination patterns

### Distribution Exclusion

The `.claude/` directory is automatically excluded from:

- ✅ **NPM packages** (via `.npmignore` and `package.json` `files` field)
- ✅ **Code linting** (via `.eslintignore`)
- ✅ **Code formatting** (via `.prettierignore`)
- ✅ **CI/CD pipelines** (ignored by GitHub Actions)
- ✅ **Test suites** (not scanned by Playwright or other testing tools)

### For Theme Users

When you install this Eleventy theme via npm, you will **only receive**:

- `src/` - Theme source files (templates, styles, scripts)
- `.eleventy.js` - Eleventy configuration
- `example/` - Demo site showing theme usage
- `README.md` - Theme documentation and setup instructions
- `docs/` - User-facing documentation (excluding internal reports)

The Claude-Flow automation remains in the source repository for development
purposes but is completely invisible to theme consumers.

### For Contributors

If you're contributing to this theme:

- The `.claude/` directory should remain untouched unless you're specifically
  working with Claude-Flow
- All theme development should happen in `src/` and related user-facing
  directories
- Run `npm run lint` and `npm run format` to ensure code quality (`.claude/` is
  automatically ignored)

---

This approach ensures a clean distribution while preserving powerful development
automation capabilities.
