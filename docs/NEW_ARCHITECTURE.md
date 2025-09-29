# New Repository Architecture Design

_System Architecture Designer - Hive Mind Modernization Project_

## Executive Summary

This document proposes a comprehensive restructuring of the Neo-Brutalist 11ty
Theme repository to clearly separate AI agent systems from the web application,
establish consistent naming conventions, and create a maintainable architecture
for long-term development.

## Current State Analysis

### Identified Problems

1. **Multiple Overlapping AI Systems**: `.claude/`, `.hive-mind/`, `memory/`,
   `coordination/` directories create confusion
2. **Mixed Build Artifacts**: `_site/`, `test-results/`, `playwright-report/`
   pollute source structure
3. **Scattered Documentation**: Documentation spread across `docs/`, multiple
   README files
4. **Inconsistent Naming**: Mixed kebab-case, snake_case, and camelCase
   conventions
5. **Test Organization**: 30+ test files without clear categorization
6. **Memory Data Pollution**: AI agent data mixed throughout repository

### Strengths to Preserve

- Well-organized `src/` directory structure for 11ty
- Clean component/layout separation in `src/_includes/`
- Logical content organization (`posts/`, `projects/`, `pages/`)
- Good CSS organization by component and utility

## Proposed New Architecture

```
neo-brutalist-11ty-theme/
├── 📱 APPLICATION LAYER
│   ├── app/                          # Web application (renamed from src/)
│   │   ├── content/                  # Content management
│   │   │   ├── posts/               # Blog posts
│   │   │   ├── projects/            # Project showcases
│   │   │   ├── pages/               # Static pages
│   │   │   └── data/                # Site data (metadata, navigation)
│   │   ├── templates/               # Template system (renamed from _includes/)
│   │   │   ├── components/          # Reusable UI components
│   │   │   ├── layouts/             # Page layouts
│   │   │   └── partials/            # Small template fragments
│   │   ├── assets/                  # Static assets
│   │   │   ├── styles/              # CSS files (renamed from css/)
│   │   │   ├── scripts/             # JavaScript files (renamed from js/)
│   │   │   ├── images/              # Image assets
│   │   │   └── fonts/               # Typography assets
│   │   ├── public/                  # Public root files
│   │   │   ├── robots.txt
│   │   │   ├── favicon.ico
│   │   │   └── manifest.json
│   │   └── config/                  # Application configuration
│   │       ├── eleventy.config.js   # 11ty configuration
│   │       ├── build.config.js      # Build system config
│   │       └── deployment.config.js # Deployment settings
│   │
├── 🤖 AI AGENT SYSTEM
│   ├── agents/                      # Unified AI agent system
│   │   ├── core/                    # Core agent functionality
│   │   │   ├── claude-code/         # Claude Code system
│   │   │   ├── hive-mind/           # Hive mind coordination
│   │   │   └── claude-flow/         # Claude Flow orchestration
│   │   ├── memory/                  # Centralized memory management
│   │   │   ├── sessions/            # Session data
│   │   │   ├── knowledge/           # Knowledge base
│   │   │   └── coordination/        # Agent coordination data
│   │   ├── workflows/               # Agent workflow definitions
│   │   │   ├── development/         # Development workflows
│   │   │   ├── testing/             # Testing workflows
│   │   │   └── deployment/          # Deployment workflows
│   │   └── config/                  # Agent system configuration
│   │       ├── agents.config.js     # Agent definitions
│   │       ├── coordination.config.js # Coordination settings
│   │       └── memory.config.js     # Memory management config
│   │
├── 🧪 TESTING & QUALITY
│   ├── tests/                       # Comprehensive testing suite
│   │   ├── unit/                    # Unit tests
│   │   ├── integration/             # Integration tests
│   │   ├── e2e/                     # End-to-end tests
│   │   │   ├── accessibility/       # WCAG compliance tests
│   │   │   ├── performance/         # Performance benchmarks
│   │   │   ├── responsive/          # Responsive design tests
│   │   │   └── navigation/          # Navigation functionality
│   │   ├── fixtures/                # Test data and fixtures
│   │   ├── helpers/                 # Test utilities
│   │   └── config/                  # Testing configuration
│   │       ├── playwright.config.js
│   │       ├── jest.config.js
│   │       └── test-utils.config.js
│   │
├── 📚 DOCUMENTATION
│   ├── docs/                        # Centralized documentation
│   │   ├── architecture/            # Architecture decisions
│   │   │   ├── decisions/           # ADRs (Architecture Decision Records)
│   │   │   ├── diagrams/            # System diagrams
│   │   │   └── patterns/            # Design patterns
│   │   ├── guides/                  # User and developer guides
│   │   │   ├── development/         # Development setup
│   │   │   ├── deployment/          # Deployment guides
│   │   │   └── testing/             # Testing documentation
│   │   ├── api/                     # API documentation
│   │   └── examples/                # Code examples and tutorials
│   │
├── 🔧 DEVELOPMENT TOOLS
│   ├── tools/                       # Development utilities
│   │   ├── scripts/                 # Build and utility scripts
│   │   ├── generators/              # Code generators
│   │   └── validators/              # Code validators
│   │
├── 🏗️ BUILD & DEPLOYMENT
│   ├── build/                       # Build output (git-ignored)
│   │   ├── static/                  # Built static files
│   │   ├── assets/                  # Processed assets
│   │   └── reports/                 # Build reports
│   ├── .github/                     # GitHub Actions and templates
│   │   ├── workflows/               # CI/CD workflows
│   │   ├── templates/               # Issue/PR templates
│   │   └── actions/                 # Custom actions
│   │
├── 📋 PROJECT ROOT
│   ├── README.md                    # Primary project documentation
│   ├── CONTRIBUTING.md              # Contribution guidelines
│   ├── LICENSE                      # Project license
│   ├── CHANGELOG.md                 # Version history
│   ├── package.json                 # Node.js project configuration
│   ├── package-lock.json            # Dependency lock
│   ├── .gitignore                   # Git ignore patterns
│   ├── .editorconfig                # Editor configuration
│   └── .nvmrc                       # Node version specification
│
└── 🗂️ TEMPORARY/IGNORED
    ├── tmp/                         # Temporary files (git-ignored)
    ├── cache/                       # Cache files (git-ignored)
    └── logs/                        # Log files (git-ignored)
```

## Key Architectural Principles

### 1. Clear Separation of Concerns

- **Application Layer**: Pure 11ty web application code
- **AI Agent System**: All AI/automation functionality
- **Testing**: Comprehensive quality assurance
- **Documentation**: Centralized knowledge management

### 2. Consistent Naming Conventions

- **Directories**: kebab-case for all directory names
- **Files**: kebab-case for configuration, camelCase for JavaScript modules
- **Components**: PascalCase for component names in templates
- **Assets**: descriptive kebab-case names

### 3. Logical Grouping

- Related functionality grouped together
- Clear hierarchies with intuitive navigation
- Minimal nesting depth (max 3-4 levels)

### 4. Build System Integration

- Clean separation of source and built files
- All build outputs in dedicated `build/` directory
- Temporary files clearly isolated

### 5. Scalability Considerations

- Modular structure supports growth
- Plugin-based architecture for extensions
- Clear interfaces between layers

## Migration Strategy

### Phase 1: Core Restructuring

1. Create new directory structure
2. Move application files from `src/` to `app/`
3. Consolidate AI systems into `agents/`
4. Reorganize tests by category

### Phase 2: Configuration Updates

1. Update build configuration paths
2. Modify CI/CD workflows
3. Update import/require statements
4. Fix asset references

### Phase 3: Documentation Migration

1. Consolidate documentation in `docs/`
2. Create architecture decision records
3. Update all README files
4. Create developer guides

### Phase 4: Cleanup & Optimization

1. Remove redundant files
2. Update .gitignore patterns
3. Test all functionality
4. Performance validation

## Benefits of New Architecture

### For Developers

- **Clear Mental Model**: Intuitive directory structure
- **Faster Navigation**: Logical grouping reduces search time
- **Better Maintainability**: Separated concerns easier to modify
- **Consistent Patterns**: Standardized naming and organization

### For AI Agents

- **Centralized Management**: All agent systems in one location
- **Better Coordination**: Clear interfaces between systems
- **Improved Memory**: Centralized knowledge management
- **Simplified Workflows**: Standardized patterns

### For Operations

- **Cleaner Builds**: Separate source and output
- **Better CI/CD**: Clear test organization
- **Easier Deployment**: Standardized configuration
- **Simplified Debugging**: Logical file organization

## Implementation Considerations

### Breaking Changes

- File paths will change (requires import updates)
- Build configuration needs modification
- CI/CD workflows require updates
- Documentation links need updating

### Compatibility

- Maintain 11ty functionality
- Preserve existing content
- Keep current build outputs
- Maintain deployment process

### Risk Mitigation

- Implement in phases
- Maintain backup branches
- Test thoroughly at each phase
- Document all changes

## Next Steps

1. **Review and Approval**: Stakeholder review of architecture
2. **Implementation Planning**: Detailed migration timeline
3. **Tool Development**: Scripts for automated migration
4. **Testing Strategy**: Validation approach for each phase
5. **Documentation Updates**: Update all project documentation

---

_This architecture design prioritizes maintainability, scalability, and
developer experience while preserving the functionality and content of the
existing Neo-Brutalist 11ty theme._
