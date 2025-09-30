# Phase 0: NPM Package Scope Analysis

**Analysis Date**: 2025-09-29 **Current Version**: 1.0.0 **Analyst**: Claude
Code Agent

## Executive Summary

The Neo-Brutalist 11ty Theme currently publishes a **84.8 KB compressed package
(291.3 KB unpacked)** with 76 files. The package scope is generally
well-configured with appropriate exclusions, but includes unnecessary demo
content that bloats the package. This analysis recommends optimizations to
reduce package size by 30-40% while maintaining full theme functionality.

## 1. CURRENT PACKAGE SCOPE

### 1.1 Package Configuration

**Current `files` field in package.json:**

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

### 1.2 Current Package Contents (76 files, 291.3 KB)

**What Gets Published:**

| Category             | Files      | Size Estimate | Purpose                                   |
| -------------------- | ---------- | ------------- | ----------------------------------------- |
| **Core Theme**       |            |               |                                           |
| `.eleventy.js`       | 1          | 5.2 KB        | 11ty configuration                        |
| `src/_includes/`     | 13 files   | ~25 KB        | Templates (layouts, components, partials) |
| `src/assets/css/`    | 12 files   | ~48 KB        | Stylesheets                               |
| `src/assets/js/`     | 7 files    | ~15 KB        | JavaScript modules                        |
| `src/assets/images/` | 7 files    | ~25 KB        | Icons and SVGs                            |
| `src/_data/`         | 3 files    | ~24 KB        | Site configuration                        |
| **Demo Content**     |            |               |                                           |
| `src/posts/`         | 7 posts    | ~50 KB        | Blog post examples                        |
| `src/projects/`      | 4 projects | ~16 KB        | Project showcase examples                 |
| `src/blog/`          | 1 file     | ~10 KB        | Blog index template                       |
| `src/robots.txt`     | 1 file     | 104 B         | SEO file                                  |
| **Example Site**     |            |               |                                           |
| `example/`           | 4 files    | ~2.7 KB       | Minimal starter example                   |
| **Documentation**    |            |               |                                           |
| `README.md`          | 1 file     | 6.3 KB        | Main documentation                        |
| `LICENSE`            | 1 file     | 1.1 KB        | MIT License                               |
| `docs/advanced/`     | 2 files    | ~8 KB         | Advanced guides                           |

### 1.3 Current Exclusions (.npmignore)

**Properly Excluded (Good):**

```
.claude/              # 1.8 MB - Claude Flow automation
.hive-mind/           # 1.4 MB - Swarm coordination
memory/               # 28 KB - Session memory
coordination/         # 16 KB - Task coordination
tests/                # 36 MB - Playwright test suite
.playwright-mcp/      # 17 MB - Test screenshots
test-results/         # 7.2 MB - Test artifacts
playwright-report/    # 25 MB - Test reports
.github/              # CI/CD workflows
node_modules/         # 62 MB - Dependencies
_site/                # 732 KB - Build output
```

**Development Files (Excluded):**

```
PROGRESS.md           # Development progress
TESTING.md            # Testing documentation
swarm-prompt.md       # Agent prompts
CLAUDE.md             # Claude Code configuration
.eslintrc.js          # Linting config
.prettierrc           # Formatting config
playwright.config.js  # Test config
```

### 1.4 Size Analysis

**Total Package Breakdown:**

- **Compressed tarball**: 84.8 KB (what users download)
- **Unpacked size**: 291.3 KB (installed in node_modules)
- **Total files**: 76 files
- **Unnecessary bloat**: ~66 KB (23% of unpacked size)

**Bloat Sources:**

1. **Blog posts** (src/posts/): 7 markdown files, ~50 KB
2. **Project showcases** (src/projects/): 4 markdown files, ~16 KB
3. **Blog index template**: Full-featured instead of minimal example

## 2. OPTIMAL PACKAGE SCOPE

### 2.1 Core Theme Requirements (Essential)

**What theme consumers MUST have:**

```
neo-brutalist-11ty-theme/
├── .eleventy.js                 # Theme configuration (REQUIRED)
├── README.md                    # Installation & usage docs (REQUIRED)
├── LICENSE                      # MIT license (REQUIRED)
├── package.json                 # Package metadata (AUTO-INCLUDED)
└── src/                         # Theme source files (REQUIRED)
    ├── _includes/
    │   ├── layouts/             # 4 layout templates
    │   ├── components/          # 7 component templates
    │   └── partials/            # 2 partial templates
    ├── assets/
    │   ├── css/
    │   │   ├── main.css         # Main stylesheet
    │   │   ├── components/      # 9 component styles
    │   │   └── utilities/       # 2 utility styles
    │   ├── js/
    │   │   ├── main.js          # Main JS entry
    │   │   ├── main-standalone.js
    │   │   └── [5 modules]      # Individual JS modules
    │   └── images/
    │       └── [7 icons/SVGs]   # Favicon and basic assets
    └── _data/
        ├── metadata.json        # SEO configuration template
        ├── navigation.json      # Navigation structure template
        └── site.json            # Site configuration template
```

**Estimated Size**: ~140 KB unpacked (~50 KB compressed)

### 2.2 Example/Starter Site (Recommended)

**Minimal starter example:**

```
example/
├── README.md                    # How to use the example
├── package.json                 # Dependencies for example
├── .eleventy.js                 # Config extending theme
└── src/
    ├── index.md                 # Minimal homepage
    ├── _data/
    │   └── site.json            # Example site configuration
    └── posts/
        └── welcome.md           # ONE example post (not 7)
```

**Estimated Size**: ~5 KB unpacked

### 2.3 Documentation (Minimal but Complete)

```
README.md                        # Main docs (installation, quick start)
LICENSE                          # Required
docs/
└── advanced/
    ├── customization.md         # Theme customization guide
    └── development.md           # Development guide
```

**Estimated Size**: ~10 KB unpacked

### 2.4 Recommended Package Total

**Optimal Package Size:**

- **Unpacked**: ~155 KB (47% reduction from 291.3 KB)
- **Compressed**: ~55 KB (35% reduction from 84.8 KB)
- **Files**: ~45 files (41% reduction from 76 files)

### 2.5 Optimal `files` Field

**Recommended package.json configuration:**

```json
{
  "files": [
    "src/_includes/",
    "src/assets/",
    "src/_data/",
    ".eleventy.js",
    "example/",
    "!example/node_modules/",
    "!example/_site/",
    "README.md",
    "LICENSE",
    "docs/advanced/"
  ]
}
```

**Key Changes:**

- ✅ Keep: Core theme files (templates, assets, data)
- ✅ Keep: Minimal example site
- ✅ Keep: Essential documentation
- ❌ Remove: Blog posts (src/posts/) - demo content
- ❌ Remove: Project showcases (src/projects/) - demo content
- ❌ Remove: Blog index (src/blog/) - demo template
- ❌ Remove: robots.txt - site-specific

## 3. IGNORE FILES STRATEGY

### 3.1 Comprehensive .npmignore

**Current .npmignore is solid but can be enhanced:**

```bash
# ============================================================================
# CLAUDE FLOW / AUTOMATION (CRITICAL EXCLUSIONS)
# ============================================================================
.claude/
.hive-mind/
.claude-flow/
memory/
coordination/
.swarm/
*.db
*.db-journal
*.db-wal
*.sqlite*
.mcp.json
claude-flow.config.json
claude-flow

# ============================================================================
# DEVELOPMENT & TESTING
# ============================================================================
tests/
test-results/
playwright-report/
.playwright-mcp/
coverage/
.nyc_output/

# Test configurations
playwright.config.js
.playwright/

# ============================================================================
# BUILD ARTIFACTS
# ============================================================================
_site/
dist/
.cache/
.parcel-cache/
*.log
npm-debug.log*

# ============================================================================
# VERSION CONTROL & CI/CD
# ============================================================================
.git/
.github/
.gitignore
.gitattributes

# ============================================================================
# IDE & EDITOR FILES
# ============================================================================
.vscode/
.idea/
*.swp
*.swo
*~

# ============================================================================
# OS FILES
# ============================================================================
.DS_Store
Thumbs.db
Desktop.ini

# ============================================================================
# DEVELOPMENT DOCUMENTATION (not for package consumers)
# ============================================================================
PROGRESS.md
TESTING.md
CLAUDE.md
swarm-prompt.md
cleanup.md
project_plan.md
NOTICE.md
out.txt

# Development reports (keep only docs/advanced/)
docs/ANALYSIS_REPORT.md
docs/SAST_REPORT.md
docs/DEPENDENCY_VULNERABILITIES.md
docs/TEST_CONSOLIDATION_REPORT.md
docs/SECURITY_FIXES_REPORT.md
docs/CLEANUP-REPORT.md
docs/mobile-responsiveness-report.md
docs/MIGRATION_PLAN.md
docs/ARCHITECTURE_RATIONALE.md
docs/COMPREHENSIVE-LINK-TEST-REPORT.md
docs/CONSOLIDATION_SUMMARY.md
docs/FINAL_VALIDATION_REPORT.md
docs/LIVE_SITE_VALIDATION.md
docs/MOBILE_FIX_REPORT.md
docs/NEW_ARCHITECTURE.md
docs/PR_DESCRIPTION.md
docs/STYLE_GUIDE.md
docs/VIEWPORT_TEST_REPORT.md
docs/phase0-*.md

# ============================================================================
# DEVELOPMENT CONFIGURATION
# ============================================================================
.eslintrc.js
.eslintignore
.eslintcache
.prettierrc
.prettierignore
.repomixignore

# ============================================================================
# DEMO CONTENT (Reduce package bloat)
# ============================================================================
# NOTE: This is optional - you may want to keep some examples
src/posts/
src/projects/
src/blog/
src/robots.txt
src/pages/

# Keep only example/ for starter template

# ============================================================================
# ENVIRONMENT & SECRETS
# ============================================================================
.env*
!.env.example

# ============================================================================
# NODE MODULES
# ============================================================================
node_modules/
example/node_modules/
example/_site/

# ============================================================================
# OPTIONAL: ADDITIONAL EXCLUSIONS
# ============================================================================
# Scripts (if not needed by consumers)
scripts/

# Backup files
*.bak
*.backup
test-backup/
```

### 3.2 Relationship to .gitignore

**Key Differences:**

| File               | Git      | NPM        | Rationale                       |
| ------------------ | -------- | ---------- | ------------------------------- |
| `PROGRESS.md`      | ✅ Track | ❌ Exclude | Dev docs not for consumers      |
| `TESTING.md`       | ✅ Track | ❌ Exclude | Dev docs not for consumers      |
| `CLAUDE.md`        | ✅ Track | ❌ Exclude | Project-specific config         |
| `.github/`         | ✅ Track | ❌ Exclude | CI/CD not needed in package     |
| `tests/`           | ✅ Track | ❌ Exclude | Consumers don't run theme tests |
| `docs/phase0-*.md` | ✅ Track | ❌ Exclude | Internal analysis docs          |
| `docs/advanced/`   | ✅ Track | ✅ Include | User-facing documentation       |
| `example/`         | ✅ Track | ✅ Include | Starter template for users      |

**Golden Rule**: Git tracks development history and process. NPM publishes
consumer-facing functionality.

### 3.3 Ensuring .claude/ Exclusion

**Multiple layers of protection:**

1. **.npmignore** explicit exclusion:

   ```
   .claude/
   ```

2. **.gitignore** tracking (for visibility):

   ```
   .claude/settings.local.json
   ```

3. **files field** (whitelist approach - .claude/ not listed):
   ```json
   "files": ["src/", ".eleventy.js", ...]
   ```

**Verification Command:**

```bash
npm pack --dry-run 2>&1 | grep -i "claude"
# Should return NO matches
```

## 4. VERIFICATION

### 4.1 Pre-Publish Checklist

**Step 1: Dry Run**

```bash
npm pack --dry-run
```

**Expected Output:**

```
npm notice 📦  neo-brutalist-11ty-theme@1.0.0
npm notice Tarball Details
npm notice name: neo-brutalist-11ty-theme
npm notice version: 1.0.0
npm notice package size: ~55 kB      # Target (currently 84.8 kB)
npm notice unpacked size: ~155 kB    # Target (currently 291.3 kB)
npm notice total files: ~45          # Target (currently 76)
```

**Step 2: Inspect Tarball Contents**

```bash
npm pack
tar -tzf neo-brutalist-11ty-theme-1.0.0.tgz | head -50
```

**Step 3: Check for Unwanted Files**

```bash
tar -tzf neo-brutalist-11ty-theme-1.0.0.tgz | grep -E "(claude|test|\.github|swarm|hive)"
# Should return NOTHING
```

**Step 4: Verify Size**

```bash
ls -lh neo-brutalist-11ty-theme-1.0.0.tgz
# Should be ~55 KB or less
```

### 4.2 Package Size Targets

**Benchmark Comparison:**

| Metric     | Current       | Optimal      | Industry Standard |
| ---------- | ------------- | ------------ | ----------------- |
| Compressed | 84.8 KB       | ~55 KB       | < 100 KB (Good)   |
| Unpacked   | 291.3 KB      | ~155 KB      | < 500 KB (Good)   |
| Files      | 76            | ~45          | < 100 (Good)      |
| **Status** | ✅ Acceptable | ✅ Excellent | -                 |

**Popular 11ty Themes for Comparison:**

- `eleventy-base-blog`: ~30 KB (minimal)
- `eleventy-high-performance-blog`: ~85 KB (comparable)
- `hylia`: ~150 KB (feature-rich)

**Verdict**: Current package size is acceptable for a feature-rich theme.
Optimizations would achieve "excellent" status but are not critical.

### 4.3 Consumer Experience Validation

**Installation Test:**

```bash
# Create test project
mkdir theme-test && cd theme-test
npm init -y
npm install neo-brutalist-11ty-theme

# Verify contents
ls -la node_modules/neo-brutalist-11ty-theme/
```

**Expected Consumer Experience:**

1. **Fast Installation**: < 5 seconds download
2. **Clean node_modules**: No test files, no .claude/, no development docs
3. **Complete Functionality**: All templates, styles, scripts present
4. **Working Example**: example/ directory provides working starter
5. **Documentation**: README.md + docs/advanced/ available

**Red Flags to Check For:**

- ❌ `.claude/` directory present
- ❌ `tests/` directory present
- ❌ `playwright-report/` directory present
- ❌ 7 blog posts in src/posts/ (demo content)
- ❌ CLAUDE.md, PROGRESS.md, TESTING.md

**Green Flags (Should See):**

- ✅ `src/_includes/layouts/`
- ✅ `src/assets/css/`
- ✅ `src/assets/js/`
- ✅ `.eleventy.js`
- ✅ `example/` with minimal starter
- ✅ `README.md` with clear instructions

### 4.4 Automated Verification Script

**Create `scripts/verify-package.sh`:**

```bash
#!/bin/bash
set -e

echo "🔍 Verifying NPM Package Configuration..."

# Clean previous builds
rm -f *.tgz

# Create tarball
echo "📦 Creating test package..."
npm pack

# Extract tarball name
TARBALL=$(ls *.tgz)
echo "✅ Created: $TARBALL"

# Check size
SIZE=$(du -h "$TARBALL" | cut -f1)
echo "📊 Package size: $SIZE"

# List contents
echo "📋 Package contents:"
tar -tzf "$TARBALL" | head -20

# Check for unwanted files
echo ""
echo "🚫 Checking for unwanted files..."
UNWANTED=$(tar -tzf "$TARBALL" | grep -E "(claude|test|\.github|swarm|hive|PROGRESS|TESTING)" || true)

if [ -z "$UNWANTED" ]; then
    echo "✅ No unwanted files found"
else
    echo "❌ Found unwanted files:"
    echo "$UNWANTED"
    exit 1
fi

# Check for required files
echo ""
echo "✅ Checking for required files..."
for file in "package/.eleventy.js" "package/README.md" "package/LICENSE" "package/example/README.md"; do
    if tar -tzf "$TARBALL" | grep -q "$file"; then
        echo "  ✅ $file"
    else
        echo "  ❌ Missing: $file"
        exit 1
    fi
done

echo ""
echo "🎉 Package verification complete!"
```

## 5. RECOMMENDATIONS

### 5.1 Immediate Actions (Before npm publish)

**Priority 1: Critical Exclusions**

1. ✅ Verify .npmignore includes all Claude Flow directories
2. ✅ Verify .npmignore includes all test directories
3. ✅ Run `npm pack --dry-run` and inspect output

**Priority 2: Size Optimization (Optional)** 4. ⚠️ Consider removing demo blog
posts (src/posts/) 5. ⚠️ Consider removing demo projects (src/projects/) 6. ⚠️
Keep only 1 example blog post in example/

**Priority 3: Documentation** 7. ✅ Ensure README.md has clear installation
instructions 8. ✅ Ensure example/README.md explains how to use starter 9. ✅
Update package.json postinstall message

### 5.2 Package Scope Strategy

**Option A: Current (Keep Demo Content)**

- **Pros**: Users see full theme capabilities immediately
- **Cons**: Larger package (84.8 KB), users need to delete demo content
- **Use Case**: Showcase theme, users expect to customize heavily

**Option B: Minimal (Remove Demo Content)** - RECOMMENDED

- **Pros**: Smaller package (~55 KB), cleaner starting point
- **Cons**: Users don't see examples in installed package
- **Use Case**: Theme as library, users build from scratch

**Recommendation**: Go with Option B (Minimal) because:

1. Demo site is already deployed at GitHub Pages
2. Example/ directory provides working starter template
3. Users can view demo online without package bloat
4. Professional theme packages prioritize small size

### 5.3 Long-Term Maintenance

**Package Monitoring:**

```bash
# Add to CI/CD pipeline
npm run verify-package

# Monitor package size over time
npm pack --dry-run | grep "package size"
```

**Version Strategy:**

- **Patch versions** (1.0.x): Bug fixes, no size increase
- **Minor versions** (1.x.0): New features, max +20% size
- **Major versions** (x.0.0): Breaking changes, re-evaluate scope

**Quarterly Review:**

- Check for new unwanted files
- Verify .npmignore still effective
- Update documentation as needed

## 6. CONCLUSION

### Current Status: ✅ GOOD (84.8 KB, 76 files)

The Neo-Brutalist 11ty Theme package configuration is **production-ready** with
proper exclusions of development artifacts. The current 84.8 KB size is
acceptable for a feature-rich theme.

### Optimization Opportunity: ⚠️ OPTIONAL (Target: 55 KB, 45 files)

Removing demo content (blog posts, projects) would reduce package size by 35%
while maintaining full theme functionality. This is **recommended but not
required** for initial release.

### Critical Success Factors:

1. ✅ **No Development Artifacts**: .claude/, tests/, .github/ properly excluded
2. ✅ **Complete Functionality**: All theme templates, styles, scripts included
3. ✅ **Working Example**: example/ directory provides starter template
4. ✅ **Documentation**: README.md and docs/advanced/ guide users

### Publication Readiness: ✅ APPROVED

**The package is ready for npm publication** with current configuration. Proceed
with confidence.

---

**Next Steps**: See `phase0-inventory-plan.md` for file organization and cleanup
strategy.
