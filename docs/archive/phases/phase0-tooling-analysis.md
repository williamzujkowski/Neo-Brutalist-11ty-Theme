# Phase 0: Tooling & Configuration Analysis

**Analysis Date:** 2025-09-29 **Status:** Complete **Purpose:** Audit build
configs, identify duplicates, plan consolidation

---

## 1. CONFIG INVENTORY

### 1.1 Root Configuration Files

**Core Build & Runtime:**

- ✅ `package.json` - Node.js project configuration
- ✅ `.eleventy.js` - 11ty static site generator config
- ✅ `playwright.config.js` - Playwright testing configuration (ROOT LOCATION)

**Code Quality & Formatting:**

- ✅ `.eslintrc.js` - ESLint linting rules
- ✅ `.eslintignore` - ESLint exclusions
- ✅ `.prettierrc` - Prettier formatting rules
- ✅ `.prettierignore` - Prettier exclusions

**Deployment & Distribution:**

- ✅ `.gitignore` - Git exclusions (comprehensive)
- ✅ `.npmignore` - npm package exclusions (needs updates)

**CI/CD Workflows:**

- ✅ `.github/workflows/deploy.yml` - GitHub Pages deployment
- ✅ `.github/workflows/playwright.yml` - Automated testing

### 1.2 Duplicate Configs Identified

**Backup Files:**

- ❌ `tests/playwright.config.js.bak` - Backup file, should be removed

**Nested Duplicates:**

- ❌ `.playwright-mcp/.playwright-mcp/` - Duplicate nested directory structure

**Temporary Files in Root:**

- ❌ `cleanup.md` - Temporary documentation in root
- ❌ Various docs marked with "?" in git status

### 1.3 Current package.json Scripts Audit

**Build Scripts:**

```json
"build": "cross-env NODE_ENV=production eleventy",
"build:gh-pages": "cross-env PATHPREFIX=/Neo-Brutalist-11ty-Theme/ eleventy --pathprefix=/Neo-Brutalist-11ty-Theme/",
"serve": "eleventy --serve",
"dev": "eleventy --serve --watch",
"debug": "DEBUG=* eleventy",
"clean": "rm -rf _site"
```

**Test Scripts:**

```json
"test": "playwright test",
"test:ui": "playwright test --ui",
"test:headed": "playwright test --headed",
"test:debug": "playwright test --debug"
```

**Code Quality Scripts:**

```json
"lint": "eslint .",
"lint:fix": "eslint . --fix",
"lint:js": "eslint '**/*.js'",
"format": "prettier --write .",
"format:check": "prettier --check .",
"format:js": "prettier --write '**/*.js'",
"format:json": "prettier --write '**/*.json'",
"format:md": "prettier --write '**/*.md'",
"style": "npm run lint && npm run format:check",
"style:fix": "npm run lint:fix && npm run format",
"lint:ci": "npm run lint && npm run format:check",
"precommit": "npm run style:fix"
```

**Assessment:** Scripts are well-organized but include some redundancy:

- `lint:js` is redundant with `lint` (which already covers all JS files)
- Multiple format scripts could be consolidated
- `style` and `lint:ci` are identical

### 1.4 package.json Files Field

**Current Configuration:**

```json
"files": [
  "src/**",
  ".eleventy.js",
  "example/**",
  "README.md",
  "LICENSE",
  "docs/advanced/**"
]
```

**Issues:**

- Does not exclude `.claude/` automation files
- Does not exclude test files (`tests/`)
- Does not exclude temporary documentation
- `docs/advanced/**` may include unwanted files

### 1.5 Missing Ignore Patterns for .claude/

**Claude Flow Automation Structure:**

```
.claude/
├── agents/           (54+ agent templates)
├── checkpoints/      (session management)
├── commands/         (coordination commands)
├── helpers/          (automation scripts)
├── settings.json
└── settings.local.json
```

**Current Ignore Status:**

| File               | .gitignore | .npmignore | .eslintignore | .prettierignore |
| ------------------ | ---------- | ---------- | ------------- | --------------- |
| `.claude/`         | ✅ Partial | ❌ Missing | ❌ Missing    | ❌ Missing      |
| `.hive-mind/`      | ✅ Yes     | ✅ Yes     | ✅ Yes        | ❌ Missing      |
| `memory/`          | ✅ Yes     | ✅ Yes     | ✅ Yes        | ❌ Missing      |
| `coordination/`    | ✅ Yes     | ✅ Yes     | ✅ Yes        | ❌ Missing      |
| `.playwright-mcp/` | ❌ Missing | ✅ Yes     | ✅ Yes        | ❌ Missing      |
| `test-backup/`     | ❌ Missing | ❌ Missing | ✅ Yes        | ❌ Missing      |
| `cleanup.md`       | ❌ Missing | ❌ Missing | ❌ Missing    | ❌ Missing      |

---

## 2. CONSOLIDATION PLAN

### 2.1 Single Playwright Config Location

**Decision:** Keep `playwright.config.js` in ROOT directory

**Rationale:**

- Standard Playwright convention is root-level config
- Easier for CI/CD workflows to reference
- Tests directory (`testDir: './tests'`) referenced from root
- All Playwright documentation assumes root config

**Action Items:**

1. ✅ Confirm root `playwright.config.js` is canonical (DONE)
2. 🔧 Remove `tests/playwright.config.js.bak` backup file
3. 🔧 Verify all CI workflows reference root config

### 2.2 Unified Ignore Files Strategy

**Philosophy:** "Ignore Once, Ignore Everywhere"

**Proposed Hierarchy:**

1. `.gitignore` - Version control exclusions (most comprehensive)
2. `.npmignore` - Package distribution exclusions (extends .gitignore)
3. `.eslintignore` - Linting exclusions (extends .gitignore)
4. `.prettierignore` - Formatting exclusions (extends .gitignore)

**Rule:** All automation, testing, and development files should be in ALL ignore
files.

### 2.3 package.json Scripts Normalization

**Proposed Consolidation:**

**Remove Redundant Scripts:**

```diff
- "lint:js": "eslint '**/*.js'"          # Redundant with "lint"
- "style": "npm run lint && npm run format:check"  # Duplicate of "lint:ci"
```

**Consolidate Format Scripts:**

```json
"format": "prettier --write .",
"format:check": "prettier --check .",
"format:specific": "prettier --write"  # For manual use with glob patterns
```

**Keep Essential Scripts:**

- Build scripts (all needed for different environments)
- Test scripts (all provide different debugging modes)
- `lint`, `lint:fix`, `lint:ci` (distinct purposes)
- `format`, `format:check` (distinct purposes)
- `style:fix`, `precommit` (workflow helpers)

### 2.4 Files Field for Packaging Scope

**Proposed Update:**

```json
"files": [
  "src/**",
  ".eleventy.js",
  "example/**",
  "README.md",
  "LICENSE",
  "CONTRIBUTING.md",
  "QUICK-START.md",
  "docs/FINAL_VALIDATION_REPORT.md"
]
```

**Removed:**

- `docs/advanced/**` - Too broad, may include unwanted files

**Added:**

- `CONTRIBUTING.md` - Useful for package users
- `QUICK-START.md` - Helpful documentation
- Specific final validation report (useful for users)

**Philosophy:** Only include files that end users of the theme need.

---

## 3. IGNORE RULES UPDATES

### 3.1 .gitignore Additions

```gitignore
# Add after existing Claude Flow section (line 66):

# Temporary files and test cleanup
test-backup/
cleanup.md
docs/phase*.md
.playwright-mcp/.playwright-mcp/

# Additional Playwright artifacts
playwright-report/
test-results/
```

**Rationale:**

- `test-backup/` contains old redundant tests
- `cleanup.md` is temporary working file
- `docs/phase*.md` are internal analysis docs
- `.playwright-mcp/.playwright-mcp/` is duplicate nested structure
- Explicit Playwright artifacts (may already be covered but be explicit)

### 3.2 .npmignore Additions

```npmignore
# Add comprehensive Claude automation exclusions:

# Claude Flow automation (complete)
.claude/
.hive-mind/
.claude-flow/
.swarm/
memory/
coordination/
*.db
*.db-journal
*.db-wal
*.sqlite
*.sqlite-journal
*.sqlite-wal
.mcp.json
claude-flow.config.json
swarm-prompt.md

# Test artifacts and screenshots
.playwright-mcp/
test-backup/
tests/screenshots/
tests/test-results/

# Temporary and cleanup files
cleanup.md
docs/phase*.md
docs/*-REPORT.md
docs/ANALYSIS_REPORT.md
docs/SAST_REPORT.md
docs/DEPENDENCY_VULNERABILITIES.md
docs/TEST_CONSOLIDATION_REPORT.md
docs/SECURITY_FIXES_REPORT.md
docs/CLEANUP-REPORT.md
docs/mobile-responsiveness-report.md
docs/MOBILE_FIX_REPORT.md
project_plan.md
out.txt
repomix-output.xml

# Backup files
*.bak
*.backup
*~
```

### 3.3 .eslintignore Additions

```gitignore
# Add after line 5 (Claude Flow automation):

# Complete Claude automation exclusions
.claude/
.hive-mind/
.claude-flow/
.swarm/

# Additional test artifacts
.playwright-mcp/
test-backup/

# Temporary documentation
cleanup.md
docs/phase*.md
```

### 3.4 .prettierignore Additions

```gitignore
# Add new section for Claude automation:

# Claude Flow automation
.claude/
.hive-mind/
.claude-flow/
.swarm/
memory/
coordination/

# Playwright artifacts
.playwright-mcp/
test-backup/

# Temporary files
cleanup.md
docs/phase*.md
```

### 3.5 Test Ignore Patterns

**In playwright.config.js**, consider adding explicit test exclusions:

```javascript
testIgnore: [
  '**/node_modules/**',
  '**/test-backup/**',
  '**/*.bak',
  '**/backup/**'
];
```

---

## 4. CI/CD UPDATES

### 4.1 deploy.yml Workflow Adjustments

**Current State:**

- ✅ Uses root `playwright.config.js` (implicit)
- ✅ Runs `npm run lint:ci`
- ⚠️ Tests currently commented out (line 38-40)

**Recommended Changes:**

```yaml
# No changes needed to config paths
# Consider re-enabling tests once consolidation is complete:
- name: Run tests
  run: npm test
  continue-on-error: false # Fail fast on test failures
```

**Script Reference Updates:**

- ✅ `npm run lint:ci` - No change needed
- ✅ `npm run build:gh-pages` - No change needed
- ✅ `npm test` - References root playwright.config.js

### 4.2 playwright.yml Workflow Adjustments

**Current State:**

- ✅ Uses root `playwright.config.js` (implicit)
- ✅ Two jobs: local tests + GitHub Pages tests
- ✅ Proper artifact uploads

**Recommended Changes:**

```yaml
# No changes needed
# Workflow correctly uses root config
# All script references are correct
```

**Script Reference Updates:**

- ✅ `npm test` - Uses root playwright.config.js
- ✅ `npm run build` - No config conflicts

### 4.3 Script References to Update

**None required.** All CI workflows already reference scripts correctly:

| Workflow       | Script                   | Config Used                 |
| -------------- | ------------------------ | --------------------------- |
| deploy.yml     | `npm run lint:ci`        | .eslintrc.js (root)         |
| deploy.yml     | `npm run build:gh-pages` | .eleventy.js (root)         |
| playwright.yml | `npm test`               | playwright.config.js (root) |
| playwright.yml | `npm run build`          | .eleventy.js (root)         |

---

## 5. IMPLEMENTATION PRIORITY

### High Priority (Phase 1)

1. 🔴 Update `.npmignore` with comprehensive exclusions
2. 🔴 Update `.gitignore` for temporary files
3. 🔴 Remove `tests/playwright.config.js.bak`
4. 🔴 Fix `.playwright-mcp/.playwright-mcp/` nested duplicate

### Medium Priority (Phase 2)

5. 🟡 Update `.eslintignore` and `.prettierignore`
6. 🟡 Consolidate package.json scripts (remove redundant)
7. 🟡 Update `files` field in package.json

### Low Priority (Phase 3)

8. 🟢 Add test ignore patterns to playwright.config.js
9. 🟢 Re-enable tests in deploy.yml workflow
10. 🟢 Document configuration decisions in README.md

---

## 6. CONFIGURATION STANDARDS

### 6.1 File Naming Conventions

**Established Standards:**

- ✅ Config files use dotfile format (`.eslintrc.js`, `.prettierrc`)
- ✅ Build configs use standard names (`playwright.config.js`, `.eleventy.js`)
- ✅ Backup files use `.bak` suffix

**Recommendations:**

- Never commit `.bak` files to version control
- Use `docs/` directory for all markdown documentation
- Temporary working files should have clear prefixes (`temp-`, `working-`,
  `phase-`)

### 6.2 Config File Locations

**Standards:**

- ✅ All build/test configs in root directory
- ✅ CI/CD workflows in `.github/workflows/`
- ✅ Test files in `tests/` directory
- ✅ Documentation in `docs/` directory
- ✅ Automation in `.claude/` directory

### 6.3 Ignore File Philosophy

**Layered Approach:**

1. `.gitignore` - Most comprehensive (all dev/build artifacts)
2. `.npmignore` - Extends .gitignore for package distribution
3. `.eslintignore` - Extends .gitignore for linting exclusions
4. `.prettierignore` - Extends .gitignore for formatting exclusions

**Rule:** If it shouldn't be in git, it shouldn't be linted or formatted.

---

## 7. VERIFICATION CHECKLIST

After implementing consolidation plan:

### Configuration Verification

- [ ] Single playwright.config.js in root (no duplicates)
- [ ] All ignore files include .claude/ automation
- [ ] No .bak files in repository
- [ ] package.json files field is minimal and correct
- [ ] No redundant scripts in package.json

### CI/CD Verification

- [ ] Deploy workflow passes lint checks
- [ ] Deploy workflow builds successfully
- [ ] Playwright workflow runs all tests
- [ ] GitHub Pages deployment works
- [ ] All script references are correct

### File Structure Verification

- [ ] No nested duplicate directories
- [ ] No temporary files in root
- [ ] All documentation in docs/
- [ ] Test artifacts properly ignored

### Package Distribution Verification

- [ ] npm pack excludes automation files
- [ ] npm pack excludes test files
- [ ] npm pack includes necessary configs
- [ ] npm pack includes essential documentation

---

## 8. RISK ASSESSMENT

### Low Risk Changes

- ✅ Updating ignore files (additive, no breaking changes)
- ✅ Removing backup files (not referenced anywhere)
- ✅ Fixing nested directories (duplicate removal)

### Medium Risk Changes

- ⚠️ Removing redundant package.json scripts (check for external references)
- ⚠️ Updating files field (test package distribution)

### High Risk Changes

- None identified. All changes are cleanup/optimization.

---

## 9. SUCCESS METRICS

### Quantitative Metrics

- **Before:** 2 playwright configs (1 active, 1 backup)
- **After:** 1 playwright config (root only)
- **Before:** 4 incomplete ignore files
- **After:** 4 comprehensive, consistent ignore files
- **Before:** 19 package.json scripts (some redundant)
- **After:** 15-17 essential scripts

### Qualitative Metrics

- Cleaner repository structure
- Consistent ignore patterns across all tools
- Easier for contributors to understand tooling
- Faster CI/CD builds (less linting/formatting)
- Smaller npm package size

---

## 10. MEMORY STORAGE

Analysis findings stored in memory at:

- **Key:** `hive/phase0/tooling`
- **Namespace:** `default`
- **Timestamp:** 2025-09-30T02:21:40.178Z
- **Size:** 1207 bytes

---

## CONCLUSION

The Neo-Brutalist theme has a solid foundation of build tooling and
configuration. Key consolidation opportunities:

1. **Remove duplicates** - 1 backup config file, 1 nested directory
2. **Unify ignore patterns** - Ensure .claude/ automation is excluded everywhere
3. **Streamline scripts** - Remove 2-4 redundant package.json scripts
4. **Refine packaging** - Update files field for cleaner distribution

All changes are low-risk and will improve maintainability without breaking
functionality.

**Next Steps:** Proceed to Phase 1 implementation of high-priority items.
