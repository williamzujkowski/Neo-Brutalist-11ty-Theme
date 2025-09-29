# Neo-Brutalist Theme - Repository Migration Plan

## 🎯 Migration Objective

**Goal**: Separate the AI agent coordination system from the Neo-Brutalist 11ty
website to create a clean, maintainable repository structure with clear
separation of concerns.

**Current Issue**: The repository mixes AI agent system files (.claude,
coordination, memory, etc.) with the website source code, creating confusion
about the project's primary purpose and making maintenance complex.

**Target**: Create a logical directory structure where the website is the
primary focus, with AI agent systems organized as supporting tools.

---

## 📊 Current Structure Analysis

### Current Root Directory (26 items):

```
Neo-Brutalist-11ty-Theme/
├── .claude/                    # AI Agent definitions (40+ subdirs)
├── .claude-flow/              # Claude Flow coordination
├── .github/                   # GitHub Actions (KEEP)
├── .hive-mind/               # Hive mind coordination
├── .swarm/                   # Swarm coordination
├── coordination/             # General coordination
├── memory/                   # Memory management
├── scripts/                  # Utility scripts
├── src/                      # Website source code (WEBSITE CORE)
├── tests/                    # Website tests (WEBSITE CORE)
├── docs/                     # Documentation (WEBSITE CORE)
├── node_modules/             # Dependencies (KEEP)
├── _site/                    # Build output (KEEP)
├── package.json              # Node config (KEEP)
├── .eleventy.js              # 11ty config (KEEP)
├── playwright.config.js      # Test config (KEEP)
└── ... (other config files)
```

### Issues Identified:

1. **Scattered AI Components**: 6 separate AI-related directories at root level
2. **Mixed Purpose**: Website and AI system intermingled
3. **Navigation Complexity**: 26+ items in root directory
4. **Unclear Boundaries**: No clear separation between website and tools

---

## 🏗️ Proposed New Architecture

### New Directory Structure:

```
Neo-Brutalist-11ty-Theme/
├── 📁 website/                    # CLEAN WEBSITE FOCUS
│   ├── src/                      # Website source (unchanged internally)
│   ├── tests/                    # Website tests
│   ├── docs/                     # Website documentation
│   ├── _site/                    # Build output
│   ├── .eleventy.js              # 11ty configuration
│   ├── playwright.config.js     # Test configuration
│   ├── package.json              # Website dependencies
│   └── package-lock.json         # Dependency lock
├── 📁 ai-system/                  # AI AGENT COORDINATION
│   ├── agents/                   # Moved from .claude/agents/
│   ├── commands/                 # Moved from .claude/commands/
│   ├── helpers/                  # Moved from .claude/helpers/
│   ├── checkpoints/              # Moved from .claude/checkpoints/
│   ├── coordination/             # Moved from ./coordination/
│   ├── memory/                   # Moved from ./memory/
│   ├── hive-mind/               # Moved from ./.hive-mind/
│   ├── swarm/                   # Moved from ./.swarm/
│   ├── claude-flow/             # Moved from ./.claude-flow/
│   ├── scripts/                 # Moved from ./scripts/
│   ├── settings.json            # Moved from .claude/settings.json
│   ├── settings.local.json      # Moved from .claude/settings.local.json
│   └── README.md                # AI system documentation
├── 📁 .github/                    # GitHub Actions (unchanged)
├── 📁 .playwright-mcp/            # Test screenshots (unchanged)
├── 📁 node_modules/               # Dependencies (unchanged)
├── 📁 test-results/               # Test output (unchanged)
├── 📁 playwright-report/          # Test reports (unchanged)
├── .gitignore                    # Git ignore (UPDATE PATHS)
├── .mcp.json                     # MCP config (UPDATE PATHS)
├── .repomixignore               # Repomix config (UPDATE PATHS)
├── claude-flow                  # Flow script (UPDATE PATHS)
├── README.md                    # Project overview (UPDATE)
├── CONTRIBUTING.md              # Contribution guide (UPDATE)
├── LICENSE                      # License (unchanged)
├── QUICK-START.md              # Quick start (UPDATE PATHS)
├── TESTING.md                  # Testing guide (UPDATE PATHS)
├── CLAUDE.md                   # Claude config (UPDATE PATHS)
├── project_plan.md             # Project plan (unchanged)
└── out.txt                     # Output file (cleanup candidate)
```

---

## 📋 Detailed Migration Checklist

### Phase 1: Preparation & Backup

#### 1.1 Create Backup

- [ ] **Action**: Create full repository backup
- [ ] **Command**:
      `cp -r /home/william/git/Neo-Brutalist-11ty-Theme /home/william/git/Neo-Brutalist-11ty-Theme-backup`
- [ ] **Verification**: Confirm backup directory exists and has all files
- [ ] **Risk**: Data loss prevention

#### 1.2 Create New Directory Structure

- [ ] **Action**: Create main directories
- [ ] **Commands**:
  ```bash
  mkdir -p website/
  mkdir -p ai-system/{agents,commands,helpers,checkpoints,coordination,memory,hive-mind,swarm,claude-flow,scripts}
  ```
- [ ] **Verification**: Verify directory structure with `tree -L 2`

### Phase 2: Website Core Migration

#### 2.1 Move Website Source Files

- [ ] **Action**: Move core website files
- [ ] **Commands**:
  ```bash
  mv src/ website/
  mv tests/ website/
  mv docs/ website/
  mv _site/ website/
  mv .eleventy.js website/
  mv playwright.config.js website/
  mv package.json website/
  mv package-lock.json website/
  ```
- [ ] **Verification**: Confirm all files moved successfully
- [ ] **Dependencies**: None

#### 2.2 Update Website Configuration

- [ ] **Action**: Update .eleventy.js paths
- [ ] **File**: `website/.eleventy.js`
- [ ] **Changes Required**:
  - Path references remain relative (no changes needed)
  - BrowserSync 404 path: `'_site/404.html'` (already relative)
- [ ] **Verification**: Run `cd website && npm run build` to test

#### 2.3 Update Website Tests

- [ ] **Action**: Update test configuration
- [ ] **File**: `website/playwright.config.js`
- [ ] **Changes Required**:
  - Update `webServer.command` if it references npm scripts
  - Verify test paths are relative to website directory
- [ ] **Verification**: Run `cd website && npm test` to verify

### Phase 3: AI System Migration

#### 3.1 Move AI Agent Files

- [ ] **Action**: Move .claude directory contents
- [ ] **Commands**:
  ```bash
  mv .claude/agents/* ai-system/agents/
  mv .claude/commands/* ai-system/commands/
  mv .claude/helpers/* ai-system/helpers/
  mv .claude/checkpoints/* ai-system/checkpoints/
  mv .claude/settings.json ai-system/
  mv .claude/settings.local.json ai-system/
  rmdir .claude
  ```
- [ ] **Verification**: Confirm .claude directory is empty and removed
- [ ] **Dependencies**: None

#### 3.2 Move Coordination Files

- [ ] **Action**: Move coordination directories
- [ ] **Commands**:
  ```bash
  mv coordination/* ai-system/coordination/
  mv memory/* ai-system/memory/
  mv .hive-mind/* ai-system/hive-mind/
  mv .swarm/* ai-system/swarm/
  mv .claude-flow/* ai-system/claude-flow/
  mv scripts/* ai-system/scripts/
  rmdir coordination memory .hive-mind .swarm .claude-flow scripts
  ```
- [ ] **Verification**: Confirm source directories are removed
- [ ] **Dependencies**: Complete after AI Agent Files (3.1)

### Phase 4: Configuration Updates

#### 4.1 Update Git Configuration

- [ ] **Action**: Update .gitignore paths
- [ ] **File**: `.gitignore`
- [ ] **Changes Required**:
  ```diff
  + website/node_modules/
  + website/_site/
  + website/test-results/
  + website/playwright-report/
  + ai-system/memory/*.db
  + ai-system/coordination/cache/
  - node_modules/
  - _site/
  - test-results/
  - playwright-report/
  ```
- [ ] **Verification**: Check git status shows correct ignored files

#### 4.2 Update MCP Configuration

- [ ] **Action**: Update .mcp.json paths
- [ ] **File**: `.mcp.json`
- [ ] **Changes Required**:
  - Update any file paths that reference moved directories
  - Update AI system paths to `ai-system/`
- [ ] **Verification**: Test MCP connection

#### 4.3 Update Claude Flow Script

- [ ] **Action**: Update claude-flow executable
- [ ] **File**: `claude-flow`
- [ ] **Changes Required**:
  - Update paths to AI system components
  - Update working directory references
- [ ] **Verification**: Test script execution

#### 4.4 Update Documentation

- [ ] **Action**: Update documentation files
- [ ] **Files**: `README.md`, `CONTRIBUTING.md`, `QUICK-START.md`, `TESTING.md`,
      `CLAUDE.md`
- [ ] **Changes Required**:
  - Update build commands: `cd website && npm run build`
  - Update test commands: `cd website && npm test`
  - Update file references to new structure
  - Update AI system documentation paths
- [ ] **Verification**: Review all documentation for accuracy

### Phase 5: Create New Documentation

#### 5.1 Create Website README

- [ ] **Action**: Create website-specific documentation
- [ ] **File**: `website/README.md`
- [ ] **Content**:
  - Build instructions
  - Development workflow
  - Deployment process
  - Testing procedures
- [ ] **Dependencies**: Complete after website migration (Phase 2)

#### 5.2 Create AI System README

- [ ] **Action**: Create AI system documentation
- [ ] **File**: `ai-system/README.md`
- [ ] **Content**:
  - Agent system overview
  - Command reference
  - Coordination mechanisms
  - Configuration guide
- [ ] **Dependencies**: Complete after AI migration (Phase 3)

#### 5.3 Update Root README

- [ ] **Action**: Update main project README
- [ ] **File**: `README.md`
- [ ] **Content**:
  - Clear project overview
  - Directory structure explanation
  - Quick start for both website and AI system
  - Link to specific READMEs
- [ ] **Dependencies**: Complete after all migrations

---

## ⚠️ Risk Assessment & Mitigation

### High Risk Items

#### 1. Build Process Breakage

- **Risk**: Website build fails after moving files
- **Impact**: High - Deployment broken
- **Probability**: Medium
- **Mitigation**:
  - Test build after each phase
  - Keep backup of working state
  - Use relative paths in configuration
- **Rollback**: Restore from backup

#### 2. CI/CD Pipeline Failure

- **Risk**: GitHub Actions fail due to path changes
- **Impact**: High - Automated testing broken
- **Probability**: High
- **Mitigation**:
  - Update workflow files in Phase 4
  - Test workflows locally first
  - Update working directories in actions
- **Rollback**: Revert workflow files

#### 3. AI System Configuration Loss

- **Risk**: AI coordination systems fail to reconnect
- **Impact**: Medium - AI features broken
- **Probability**: Medium
- **Mitigation**:
  - Document current configurations
  - Test AI system after migration
  - Update all config files systematically
- **Rollback**: Restore configuration files

### Medium Risk Items

#### 4. Test Suite Failure

- **Risk**: Tests fail due to path changes
- **Impact**: Medium - Quality assurance affected
- **Probability**: Medium
- **Mitigation**:
  - Update test configurations
  - Test after each major phase
  - Use relative paths where possible
- **Rollback**: Restore test directory

#### 5. Development Workflow Disruption

- **Risk**: Developer commands and scripts break
- **Impact**: Medium - Development efficiency reduced
- **Probability**: Low
- **Mitigation**:
  - Update all documentation
  - Create migration guide for developers
  - Test all documented commands
- **Rollback**: Provide legacy command aliases

### Low Risk Items

#### 6. Documentation Inconsistency

- **Risk**: Documentation references wrong paths
- **Impact**: Low - User confusion
- **Probability**: High
- **Mitigation**:
  - Systematic documentation review
  - Update all references
  - Cross-reference validation
- **Rollback**: Document corrections

---

## 🔄 Migration Sequence & Dependencies

### Critical Path:

1. **Backup Creation** (1.1) → **Prerequisites for all other steps**
2. **Directory Creation** (1.2) → **Required before any moves**
3. **Website Migration** (2.1-2.3) → **Core functionality must work first**
4. **AI System Migration** (3.1-3.2) → **Secondary system migration**
5. **Configuration Updates** (4.1-4.4) → **Integration and testing**
6. **Documentation** (5.1-5.3) → **Finalization**

### Parallel Opportunities:

- After Phase 2: Documentation creation (5.1) can start
- After Phase 3: AI documentation (5.2) can start
- Phase 4 tasks can run in parallel after dependencies met

### Rollback Points:

1. **After Phase 1**: Full backup available
2. **After Phase 2**: Website working, AI system untouched
3. **After Phase 3**: Both systems migrated, configs need updates
4. **After Phase 4**: All configurations updated
5. **After Phase 5**: Complete migration with documentation

---

## ✅ Verification & Testing Plan

### Phase Verification:

#### After Phase 1:

- [ ] Backup directory exists and contains all files
- [ ] New directory structure created correctly

#### After Phase 2:

- [ ] `cd website && npm install` succeeds
- [ ] `cd website && npm run build` succeeds
- [ ] `cd website && npm run test` passes
- [ ] Website deploys correctly to GitHub Pages

#### After Phase 3:

- [ ] All AI system files present in ai-system/
- [ ] No files remain in old locations
- [ ] Directory structure matches plan

#### After Phase 4:

- [ ] Git ignores correct files
- [ ] MCP configuration works
- [ ] Claude Flow script executes
- [ ] All documentation references correct paths

#### After Phase 5:

- [ ] All README files accurate and helpful
- [ ] No broken links in documentation
- [ ] Quick start guides work end-to-end

### Integration Testing:

- [ ] Full website build and deployment
- [ ] Complete test suite execution
- [ ] AI system coordination verification
- [ ] Documentation accuracy review

### Performance Testing:

- [ ] Build time comparison (before/after)
- [ ] Test execution time comparison
- [ ] Navigation efficiency improvement
- [ ] Developer workflow timing

---

## 📈 Success Metrics

### Quantitative Goals:

- **Root Directory Items**: Reduce from 26 to ≤15 items
- **Website Build Time**: Maintain or improve current speed
- **Test Suite**: 100% tests pass after migration
- **Documentation Coverage**: 100% path references updated

### Qualitative Goals:

- **Clear Separation**: Website and AI system distinct
- **Improved Navigation**: Logical directory structure
- **Better Maintainability**: Reduced cognitive overhead
- **Enhanced Onboarding**: Clearer project purpose

### Acceptance Criteria:

- [ ] Website functions identically to pre-migration
- [ ] AI system maintains all coordination features
- [ ] All tests pass without modification
- [ ] Documentation is accurate and complete
- [ ] New contributors can understand structure immediately

---

## 🚀 Post-Migration Actions

### Immediate Tasks:

1. **Update CI/CD Workflows**: Ensure all automation works
2. **Test Full Deployment**: Verify production deployment
3. **Update Issue Templates**: Reference new file structure
4. **Create Migration Guide**: Document changes for contributors

### Follow-up Tasks:

1. **Performance Optimization**: Leverage new structure for improvements
2. **Documentation Enhancement**: Add architecture diagrams
3. **Developer Experience**: Create convenience scripts
4. **Maintenance Planning**: Schedule regular structure reviews

---

## 📚 Migration Commands Reference

### Quick Migration Script:

```bash
#!/bin/bash
# Neo-Brutalist Theme Migration Script

echo "🚀 Starting repository migration..."

# Phase 1: Backup and setup
echo "📦 Creating backup..."
cp -r . ../Neo-Brutalist-11ty-Theme-backup

echo "📁 Creating new structure..."
mkdir -p website/
mkdir -p ai-system/{agents,commands,helpers,checkpoints,coordination,memory,hive-mind,swarm,claude-flow,scripts}

# Phase 2: Website migration
echo "🌐 Migrating website..."
mv src/ website/
mv tests/ website/
mv docs/ website/
mv _site/ website/
mv .eleventy.js website/
mv playwright.config.js website/
mv package.json website/
mv package-lock.json website/

# Phase 3: AI system migration
echo "🤖 Migrating AI system..."
mv .claude/agents/* ai-system/agents/
mv .claude/commands/* ai-system/commands/
mv .claude/helpers/* ai-system/helpers/
mv .claude/checkpoints/* ai-system/checkpoints/
mv .claude/settings*.json ai-system/

mv coordination/* ai-system/coordination/
mv memory/* ai-system/memory/
mv .hive-mind/* ai-system/hive-mind/
mv .swarm/* ai-system/swarm/
mv .claude-flow/* ai-system/claude-flow/
mv scripts/* ai-system/scripts/

# Cleanup empty directories
rmdir .claude coordination memory .hive-mind .swarm .claude-flow scripts

echo "✅ Migration complete! Verify with: cd website && npm test"
```

---

**Migration Plan Created**: 2025-09-29 **Prepared By**: Migration Planner Agent
**Status**: Ready for Execution **Estimated Duration**: 2-4 hours with testing
**Risk Level**: Medium (with proper backup and testing)
