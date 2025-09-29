# Repository Cleanup & Theme Hardening (Safe for Claude-Flow)

## Changes proposed in this pull request

- **Exclude `.claude/` from npm publish, lint, format, and test** - Quarantines
  Claude-Flow automation while preserving functionality
- **Consolidate Playwright configs** - Uses root config only, removes duplicate
  test configuration
- **Add unified lint + format scripts** - Provides `lint:ci` command for CI
  enforcement
- **Update CI workflow** - Enforces lint + test in GitHub Actions before
  deployment
- **Restructure documentation** - Moves advanced docs to `docs/advanced/` with
  comprehensive guides
- **Add example demo site** - Creates `/example/` directory showing theme usage
  for consumers
- **Establish theme distribution prep** - Configures package.json for clean npm
  publishing

## Rationale

This modernization preserves Claude-Flow automation capabilities while shipping
a clean, professional Eleventy theme package. Key improvements:

### Claude-Flow Preservation

- `.claude/` directory remains untouched at root (required for Claude-Flow)
- All automation workflows continue to function normally
- Development capabilities fully preserved

### Distribution Optimization

- **npm package** excludes development artifacts via `.npmignore` and `files`
  whitelist
- **Code quality** enforced with ESLint/Prettier on source files only
- **CI/CD** validates code before deployment but ignores meta directories
- **Documentation** organized for theme consumers vs. contributors

### Developer Experience

- **Unified commands**: `npm run lint:ci`, `npm run test:ui` for consistent
  workflows
- **Example site**: Clear demonstration of theme usage in `/example/`
- **Advanced docs**: Comprehensive customization and development guides
- **Clean builds**: No Claude-Flow artifacts in production packages

## Security considerations

None - this is a dev-only reorganization with no runtime code path changes.
Security improvements include:

- Exclusion of development tools from production packages
- Proper linting enforcement in CI
- Clear separation between development automation and theme distribution

## Testing

- ✅ All existing Playwright tests continue to pass
- ✅ Claude-Flow automation remains fully functional
- ✅ npm package excludes development artifacts properly
- ✅ CI workflow enforces code quality
- ✅ Example site demonstrates theme usage
- ✅ Documentation restructuring complete

## Files Modified

### Package Configuration

- `.npmignore` - Excludes Claude-Flow and development files from npm package
- `.eslintignore` - Prevents linting of automation directories
- `.prettierignore` - Prevents formatting of generated/automation files
- `package.json` - Adds `files` whitelist, `lint:ci` script, postinstall notice

### Documentation

- `NOTICE.md` - Explains Claude-Flow quarantine for users
- `docs/advanced/customization.md` - Theme customization guide
- `docs/advanced/development.md` - Development setup and standards

### Example Site

- `example/` - Complete demo site showing theme usage
- `example/README.md` - Quick start guide for theme consumers

### CI/CD

- `.github/workflows/deploy.yml` - Added lint and test enforcement

### Playwright Configuration

- Archived duplicate `tests/playwright.config.js` - Uses root config only

## Impact

- **Theme consumers** get a clean, professional package without development
  artifacts
- **Contributors** maintain full access to Claude-Flow automation capabilities
- **CI/CD** enforces code quality while ignoring automation directories
- **npm package size** reduced by excluding development tooling
- **Documentation** better organized for different audiences

This change enables professional theme distribution while preserving powerful
development automation.
