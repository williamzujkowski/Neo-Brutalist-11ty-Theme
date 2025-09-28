# Claude Code Configuration - SPARC Development Environment

## 🚨 CRITICAL: CONCURRENT EXECUTION & FILE MANAGEMENT

**ABSOLUTE RULES**:
1. ALL operations MUST be concurrent/parallel in a single message
2. **NEVER save working files, text/mds and tests to the root folder**
3. ALWAYS organize files in appropriate subdirectories
4. **USE CLAUDE CODE'S TASK TOOL** for spawning agents concurrently, not just MCP

### ⚡ GOLDEN RULE: "1 MESSAGE = ALL RELATED OPERATIONS"

**MANDATORY PATTERNS:**
- **TodoWrite**: ALWAYS batch ALL todos in ONE call (5-10+ todos minimum)
- **Task tool (Claude Code)**: ALWAYS spawn ALL agents in ONE message with full instructions
- **File operations**: ALWAYS batch ALL reads/writes/edits in ONE message
- **Bash commands**: ALWAYS batch ALL terminal operations in ONE message
- **Memory operations**: ALWAYS batch ALL memory store/retrieve in ONE message

### 🎯 CRITICAL: Claude Code Task Tool for Agent Execution

**Claude Code's Task tool is the PRIMARY way to spawn agents:**
```javascript
// ✅ CORRECT: Use Claude Code's Task tool for parallel agent execution
[Single Message]:
  Task("Research agent", "Analyze requirements and patterns...", "researcher")
  Task("Coder agent", "Implement core features...", "coder")
  Task("Tester agent", "Create comprehensive tests...", "tester")
  Task("Reviewer agent", "Review code quality...", "reviewer")
  Task("Architect agent", "Design system architecture...", "system-architect")
```

**MCP tools are ONLY for coordination setup:**
- `mcp__claude-flow__swarm_init` - Initialize coordination topology
- `mcp__claude-flow__agent_spawn` - Define agent types for coordination
- `mcp__claude-flow__task_orchestrate` - Orchestrate high-level workflows

### 📁 File Organization Rules

**NEVER save to root folder. Use these directories:**
- `/src` - Source code files
- `/tests` - Test files
- `/docs` - Documentation and markdown files
- `/config` - Configuration files
- `/scripts` - Utility scripts
- `/examples` - Example code

## Project Overview

**Neo-Brutalist 11ty Theme** - A complete, production-ready static site generator theme featuring massive typography, vivid colors, hard shadows, and modern Neo-Brutalist design. This comprehensive theme includes blog posts, project showcases, social media integration, and a full testing suite using Playwright.

## Recent Updates

### 🎯 Mobile Responsiveness Overhaul (Latest)
**Status**: ✅ Complete - Achieved A+ Mobile Readiness Score
- Fixed horizontal scrolling issues across all mobile devices (iPhone, Google Pixel, Samsung Galaxy)
- Improved social icon accessibility with 44px+ touch targets (WCAG 2.1 AA compliant)
- Enhanced mobile typography readability with better contrast and spacing
- Added proper navigation alignment and "Back to Blog/Projects" button styling
- Implemented viewport overflow prevention with max-width constraints
- Reduced box-shadow sizes on mobile to prevent layout breaks
- Comprehensive mobile testing with Playwright across multiple device viewports

**Files Modified**:
- `src/assets/css/main.css` - Added mobile color variables and footer social icons fixes
- `src/assets/css/utilities/responsive.css` - Enhanced mobile layout constraints and typography
- `src/assets/css/components/navigation.css` - Added mobile navigation styles and logo sizing
- `src/assets/css/components/post.css` - Improved mobile post layout and "Back to Blog" button
- `src/assets/css/components/social.css` - Enhanced mobile social icon accessibility
- `/tests/` - Created comprehensive mobile testing suite with Playwright

**Testing Results**: 185 automated tests across iPhone 12/13/14, iPhone SE, Google Pixel 5, and Samsung Galaxy S20 viewports - All passing with A+ mobile readiness score.

### Current Status
✅ **Fully Deployed**: https://williamzujkowski.github.io/Neo-Brutalist-11ty-Theme/
✅ **Complete Content**: 7 blog posts, 4 project showcases, all core pages
✅ **Social Integration**: Social icons system with custom configurations
✅ **Testing Suite**: 6 Playwright test files covering accessibility, performance, navigation
✅ **CI/CD Pipeline**: GitHub Actions for deployment and testing
✅ **Production Ready**: All features implemented and tested

### Project Statistics
- **Total Files**: 86 files across 23 directories
- **Templates**: 23 Nunjucks (.njk) files
- **Stylesheets**: 12 source CSS files (69 total including build output)
- **Blog Content**: 7 posts (~1,468 lines of content)
- **Projects**: 4 showcases (~263 lines of content)
- **Tests**: 6 comprehensive test suites + helpers
- **JavaScript**: 6 modules including animations and interactions

## SPARC Commands

### Core Commands
- `npx claude-flow sparc modes` - List available modes
- `npx claude-flow sparc run <mode> "<task>"` - Execute specific mode
- `npx claude-flow sparc tdd "<feature>"` - Run complete TDD workflow
- `npx claude-flow sparc info <mode>` - Get mode details

### Batchtools Commands
- `npx claude-flow sparc batch <modes> "<task>"` - Parallel execution
- `npx claude-flow sparc pipeline "<task>"` - Full pipeline processing
- `npx claude-flow sparc concurrent <mode> "<tasks-file>"` - Multi-task processing

### Build Commands
- `npm run build` - Build project
- `npm run test` - Run tests
- `npm run lint` - Linting
- `npm run typecheck` - Type checking

## SPARC Workflow Phases

1. **Specification** - Requirements analysis (`sparc run spec-pseudocode`)
2. **Pseudocode** - Algorithm design (`sparc run spec-pseudocode`)
3. **Architecture** - System design (`sparc run architect`)
4. **Refinement** - TDD implementation (`sparc tdd`)
5. **Completion** - Integration (`sparc run integration`)

## Code Style & Best Practices

- **Modular Design**: Files under 500 lines
- **Environment Safety**: Never hardcode secrets
- **Test-First**: Write tests before implementation
- **Clean Architecture**: Separate concerns
- **Documentation**: Keep updated

## DateTime Standards

- **Official Time Source**: Use time.gov as the authoritative datetime reference
- **Format**: ISO 8601 format (YYYY-MM-DD) for all dates
- **Consistency**: All dates must align with time.gov standards
- **Blog Posts**: Use frontmatter date field in YYYY-MM-DD format
- **Display Format**: Can be formatted for display but store in ISO format

## 🚀 Available Agents (54 Total)

### Core Development
`coder`, `reviewer`, `tester`, `planner`, `researcher`

### Swarm Coordination
`hierarchical-coordinator`, `mesh-coordinator`, `adaptive-coordinator`, `collective-intelligence-coordinator`, `swarm-memory-manager`

### Consensus & Distributed
`byzantine-coordinator`, `raft-manager`, `gossip-coordinator`, `consensus-builder`, `crdt-synchronizer`, `quorum-manager`, `security-manager`

### Performance & Optimization
`perf-analyzer`, `performance-benchmarker`, `task-orchestrator`, `memory-coordinator`, `smart-agent`

### GitHub & Repository
`github-modes`, `pr-manager`, `code-review-swarm`, `issue-tracker`, `release-manager`, `workflow-automation`, `project-board-sync`, `repo-architect`, `multi-repo-swarm`

### SPARC Methodology
`sparc-coord`, `sparc-coder`, `specification`, `pseudocode`, `architecture`, `refinement`

### Specialized Development
`backend-dev`, `mobile-dev`, `ml-developer`, `cicd-engineer`, `api-docs`, `system-architect`, `code-analyzer`, `base-template-generator`

### Testing & Validation
`tdd-london-swarm`, `production-validator`

### Migration & Planning
`migration-planner`, `swarm-init`

## 🎯 Claude Code vs MCP Tools

### Claude Code Handles ALL EXECUTION:
- **Task tool**: Spawn and run agents concurrently for actual work
- File operations (Read, Write, Edit, MultiEdit, Glob, Grep)
- Code generation and programming
- Bash commands and system operations
- Implementation work
- Project navigation and analysis
- TodoWrite and task management
- Git operations
- Package management
- Testing and debugging

### MCP Tools ONLY COORDINATE:
- Swarm initialization (topology setup)
- Agent type definitions (coordination patterns)
- Task orchestration (high-level planning)
- Memory management
- Neural features
- Performance tracking
- GitHub integration

**KEY**: MCP coordinates the strategy, Claude Code's Task tool executes with real agents.

## 🚀 Quick Setup

```bash
# Add MCP servers (Claude Flow required, others optional)
claude mcp add claude-flow npx claude-flow@alpha mcp start
claude mcp add ruv-swarm npx ruv-swarm mcp start  # Optional: Enhanced coordination
claude mcp add flow-nexus npx flow-nexus@latest mcp start  # Optional: Cloud features
```

## MCP Tool Categories

### Coordination
`swarm_init`, `agent_spawn`, `task_orchestrate`

### Monitoring
`swarm_status`, `agent_list`, `agent_metrics`, `task_status`, `task_results`

### Memory & Neural
`memory_usage`, `neural_status`, `neural_train`, `neural_patterns`

### GitHub Integration
`github_swarm`, `repo_analyze`, `pr_enhance`, `issue_triage`, `code_review`

### System
`benchmark_run`, `features_detect`, `swarm_monitor`

### Flow-Nexus MCP Tools (Optional Advanced Features)
Flow-Nexus extends MCP capabilities with 70+ cloud-based orchestration tools:

**Key MCP Tool Categories:**
- **Swarm & Agents**: `swarm_init`, `swarm_scale`, `agent_spawn`, `task_orchestrate`
- **Sandboxes**: `sandbox_create`, `sandbox_execute`, `sandbox_upload` (cloud execution)
- **Templates**: `template_list`, `template_deploy` (pre-built project templates)
- **Neural AI**: `neural_train`, `neural_patterns`, `seraphina_chat` (AI assistant)
- **GitHub**: `github_repo_analyze`, `github_pr_manage` (repository management)
- **Real-time**: `execution_stream_subscribe`, `realtime_subscribe` (live monitoring)
- **Storage**: `storage_upload`, `storage_list` (cloud file management)

**Authentication Required:**
- Register: `mcp__flow-nexus__user_register` or `npx flow-nexus@latest register`
- Login: `mcp__flow-nexus__user_login` or `npx flow-nexus@latest login`
- Access 70+ specialized MCP tools for advanced orchestration

## 🚀 Agent Execution Flow with Claude Code

### The Correct Pattern:

1. **Optional**: Use MCP tools to set up coordination topology
2. **REQUIRED**: Use Claude Code's Task tool to spawn agents that do actual work
3. **REQUIRED**: Each agent runs hooks for coordination
4. **REQUIRED**: Batch all operations in single messages

### Example Full-Stack Development:

```javascript
// Single message with all agent spawning via Claude Code's Task tool
[Parallel Agent Execution]:
  Task("Backend Developer", "Build REST API with Express. Use hooks for coordination.", "backend-dev")
  Task("Frontend Developer", "Create React UI. Coordinate with backend via memory.", "coder")
  Task("Database Architect", "Design PostgreSQL schema. Store schema in memory.", "code-analyzer")
  Task("Test Engineer", "Write Jest tests. Check memory for API contracts.", "tester")
  Task("DevOps Engineer", "Setup Docker and CI/CD. Document in memory.", "cicd-engineer")
  Task("Security Auditor", "Review authentication. Report findings via hooks.", "reviewer")
  
  // All todos batched together
  TodoWrite { todos: [...8-10 todos...] }
  
  // All file operations together
  Write "backend/server.js"
  Write "frontend/App.jsx"
  Write "database/schema.sql"
```

## 📋 Agent Coordination Protocol

### Every Agent Spawned via Task Tool MUST:

**1️⃣ BEFORE Work:**
```bash
npx claude-flow@alpha hooks pre-task --description "[task]"
npx claude-flow@alpha hooks session-restore --session-id "swarm-[id]"
```

**2️⃣ DURING Work:**
```bash
npx claude-flow@alpha hooks post-edit --file "[file]" --memory-key "swarm/[agent]/[step]"
npx claude-flow@alpha hooks notify --message "[what was done]"
```

**3️⃣ AFTER Work:**
```bash
npx claude-flow@alpha hooks post-task --task-id "[task]"
npx claude-flow@alpha hooks session-end --export-metrics true
```

## 🎯 Concurrent Execution Examples

### ✅ CORRECT WORKFLOW: MCP Coordinates, Claude Code Executes

```javascript
// Step 1: MCP tools set up coordination (optional, for complex tasks)
[Single Message - Coordination Setup]:
  mcp__claude-flow__swarm_init { topology: "mesh", maxAgents: 6 }
  mcp__claude-flow__agent_spawn { type: "researcher" }
  mcp__claude-flow__agent_spawn { type: "coder" }
  mcp__claude-flow__agent_spawn { type: "tester" }

// Step 2: Claude Code Task tool spawns ACTUAL agents that do the work
[Single Message - Parallel Agent Execution]:
  // Claude Code's Task tool spawns real agents concurrently
  Task("Research agent", "Analyze API requirements and best practices. Check memory for prior decisions.", "researcher")
  Task("Coder agent", "Implement REST endpoints with authentication. Coordinate via hooks.", "coder")
  Task("Database agent", "Design and implement database schema. Store decisions in memory.", "code-analyzer")
  Task("Tester agent", "Create comprehensive test suite with 90% coverage.", "tester")
  Task("Reviewer agent", "Review code quality and security. Document findings.", "reviewer")
  
  // Batch ALL todos in ONE call
  TodoWrite { todos: [
    {id: "1", content: "Research API patterns", status: "in_progress", priority: "high"},
    {id: "2", content: "Design database schema", status: "in_progress", priority: "high"},
    {id: "3", content: "Implement authentication", status: "pending", priority: "high"},
    {id: "4", content: "Build REST endpoints", status: "pending", priority: "high"},
    {id: "5", content: "Write unit tests", status: "pending", priority: "medium"},
    {id: "6", content: "Integration tests", status: "pending", priority: "medium"},
    {id: "7", content: "API documentation", status: "pending", priority: "low"},
    {id: "8", content: "Performance optimization", status: "pending", priority: "low"}
  ]}
  
  // Parallel file operations
  Bash "mkdir -p app/{src,tests,docs,config}"
  Write "app/package.json"
  Write "app/src/server.js"
  Write "app/tests/server.test.js"
  Write "app/docs/API.md"
```

### ❌ WRONG (Multiple Messages):
```javascript
Message 1: mcp__claude-flow__swarm_init
Message 2: Task("agent 1")
Message 3: TodoWrite { todos: [single todo] }
Message 4: Write "file.js"
// This breaks parallel coordination!
```

## Performance Benefits

- **84.8% SWE-Bench solve rate**
- **32.3% token reduction**
- **2.8-4.4x speed improvement**
- **27+ neural models**

## Hooks Integration

### Pre-Operation
- Auto-assign agents by file type
- Validate commands for safety
- Prepare resources automatically
- Optimize topology by complexity
- Cache searches

### Post-Operation
- Auto-format code
- Train neural patterns
- Update memory
- Analyze performance
- Track token usage

### Session Management
- Generate summaries
- Persist state
- Track metrics
- Restore context
- Export workflows

## Advanced Features (v2.0.0)

- 🚀 Automatic Topology Selection
- ⚡ Parallel Execution (2.8-4.4x speed)
- 🧠 Neural Training
- 📊 Bottleneck Analysis
- 🤖 Smart Auto-Spawning
- 🛡️ Self-Healing Workflows
- 💾 Cross-Session Memory
- 🔗 GitHub Integration

## Integration Tips

1. Start with basic swarm init
2. Scale agents gradually
3. Use memory for context
4. Monitor progress regularly
5. Train patterns from success
6. Enable hooks automation
7. Use GitHub tools first

## Support

- Documentation: https://github.com/ruvnet/claude-flow
- Issues: https://github.com/ruvnet/claude-flow/issues
- Flow-Nexus Platform: https://flow-nexus.ruv.io (registration required for cloud features)

---

Remember: **Claude Flow coordinates, Claude Code creates!**

# Neo-Brutalist 11ty Theme - Complete File Structure

## 📁 Complete Project Inventory (86 Files)

### 🏗️ Root Configuration & Documentation
```
├── .eleventy.js              # 11ty configuration with pathPrefix and filters
├── .gitignore                # Git ignore patterns
├── package.json              # Node.js dependencies and scripts
├── package-lock.json         # Dependency lock file
├── playwright.config.js      # Playwright testing configuration
├── README.md                 # Project documentation
├── CONTRIBUTING.md           # Contribution guidelines
├── LICENSE                   # MIT License
├── QUICK-START.md           # Quick start guide
├── TESTING.md               # Testing documentation
├── CLAUDE.md                # Claude Code configuration (this file)
└── swarm-prompt.md          # Swarm coordination prompts
```

### 🤖 CI/CD & Automation
```
├── .github/
│   └── workflows/
│       ├── deploy.yml        # GitHub Pages deployment
│       └── playwright.yml    # Automated testing workflow
```

### 🖼️ Visual Documentation (.playwright-mcp/)
```
├── .playwright-mcp/          # Test screenshots and visual documentation
│   ├── about-page.png
│   ├── after-fixes-local.png
│   ├── before-fixes.png
│   ├── final-live-site.png
│   ├── live-site-after-deploy.png
│   ├── live-site-check.png
│   ├── post-page-themed.png
│   └── site-current-state.png
```

### 🎨 Source Code Structure (src/)

#### 📊 Data Configuration
```
├── src/_data/
│   ├── metadata.json         # SEO metadata and site information
│   ├── navigation.json       # Main navigation menu structure
│   └── site.json            # Global site configuration and author info
```

#### 🧩 Templates & Components
```
├── src/_includes/
│   ├── components/           # Reusable UI components
│   │   ├── about.njk         # About section component
│   │   ├── contact.njk       # Contact form component
│   │   ├── footer.njk        # Site footer with social links
│   │   ├── hero.njk          # Homepage hero section
│   │   ├── nav.njk           # Main navigation component
│   │   ├── services.njk      # Services showcase component
│   │   └── social-icons.njk  # Social media icons system
│   ├── layouts/              # Page layout templates
│   │   ├── base.njk          # Base HTML template with head/meta
│   │   ├── home.njk          # Homepage layout
│   │   ├── page.njk          # Generic page layout
│   │   └── post.njk          # Blog post layout with metadata
│   └── partials/             # Small reusable partials
│       ├── cursor-dot.njk    # Custom cursor component
│       └── floating-shapes.njk # Animated background shapes
```

#### 🎨 Stylesheets (12 Source Files)
```
├── src/assets/css/
│   ├── main.css              # Main stylesheet with imports
│   ├── components/           # Component-specific styles
│   │   ├── about.css         # About page styling
│   │   ├── blog.css          # Blog listing page styles
│   │   ├── contact.css       # Contact form styles
│   │   ├── hero.css          # Hero section styling
│   │   ├── navigation.css    # Navigation menu styles
│   │   ├── post.css          # Individual blog post styles
│   │   ├── projects.css      # Project showcase styles
│   │   ├── services.css      # Services section styles
│   │   └── social.css        # Social icons styling
│   └── utilities/            # Utility stylesheets
│       ├── animations.css    # CSS animations and transitions
│       └── responsive.css    # Responsive design utilities
```

#### ⚡ JavaScript Modules (6 Files)
```
├── src/assets/js/
│   ├── main.js               # Main JavaScript entry point
│   ├── main-standalone.js    # Standalone version (no ES6 imports)
│   ├── animations.js         # Page animations and effects
│   ├── cursor.js             # Custom cursor interactions
│   ├── interactions.js       # User interaction handlers
│   └── smooth-scroll.js      # Smooth scrolling functionality
```

#### 🖼️ Assets
```
├── src/assets/
│   ├── fonts/                # Typography assets (empty, using web fonts)
│   └── images/
│       └── project-1.svg     # Sample project image
```

#### 📝 Content - Blog Posts (7 Articles, ~1,468 lines)
```
├── src/posts/
│   ├── posts.json            # Posts collection configuration
│   ├── welcome-to-neo-brutalism.md          # Introduction to theme
│   ├── breaking-design-rules.md             # Guide to creative rebellion
│   ├── building-with-11ty.md               # 11ty development guide
│   ├── psychology-of-brutal-design.md      # Design psychology article
│   ├── building-for-the-bold.md            # Architecture guide
│   ├── color-revolution.md                 # Color theory article
│   └── future-of-web-rebellion.md          # Future trends analysis
```

#### 🚀 Projects Showcase (4 Projects, ~263 lines)
```
├── src/projects/
│   ├── neo-brutalist-theme.md  # This theme project
│   ├── chaos-grid.md           # Grid system project
│   ├── type-destroyer.md       # Typography project
│   └── color-riot.md           # Color system project
```

#### 📄 Static Pages
```
├── src/pages/
│   ├── index.njk             # Pages collection listing
│   ├── about.njk             # About page with expanded content
│   ├── contact.njk           # Contact form page
│   ├── services.njk          # Services showcase page
│   └── 404.njk               # Custom 404 error page
```

#### 🏠 Site Root & Special Pages
```
├── src/
│   ├── index.njk             # Homepage template
│   ├── robots.txt            # SEO robots file
│   └── blog/
│       └── index.njk         # Blog listing page
```

### 🧪 Testing Suite (7 Files)
```
├── tests/
│   ├── README.md             # Testing documentation
│   ├── global-setup.js       # Playwright global configuration
│   ├── helpers/
│   │   └── test-utils.js     # Shared testing utilities
│   ├── accessibility.spec.js # WCAG accessibility tests
│   ├── links.spec.js         # Link validation tests
│   ├── navigation.spec.js    # Navigation functionality tests
│   ├── performance.spec.js   # Performance benchmarking
│   ├── responsive.spec.js    # Responsive design tests
│   └── social-icons.spec.js  # Social media integration tests
```

## 🏗️ Key Features Implemented

### ✨ Design System
- **Neo-Brutalist Aesthetic**: Bold typography, vivid colors, hard shadows
- **Responsive Design**: Mobile-first approach with breakpoint utilities
- **Component Architecture**: Modular CSS and template system
- **Animation System**: Smooth transitions and interactive effects

### 📱 Social Media Integration
- **Social Icons Component**: Configurable icon system
- **Platform Support**: GitHub, Twitter, LinkedIn, Email, Website
- **Inline SVG**: Performance-optimized vector icons
- **Customizable Styling**: Theme-consistent social media links

### 📝 Content Management
- **Blog System**: 7 comprehensive articles on design and development
- **Project Showcase**: 4 detailed project presentations
- **Rich Metadata**: SEO-optimized frontmatter and meta tags
- **Time Standards**: ISO 8601 dates aligned with time.gov standards

### 🧪 Quality Assurance
- **Comprehensive Testing**: 6 test suites covering all major functionality
- **Accessibility**: WCAG compliance testing
- **Performance**: Core Web Vitals monitoring
- **CI/CD Pipeline**: Automated testing and deployment

### ⚙️ Technical Standards
- **11ty Static Site Generator**: Modern Jamstack architecture
- **Nunjucks Templating**: Powerful template engine with inheritance
- **GitHub Pages Deployment**: Automated deployment with GitHub Actions
- **Modern JavaScript**: ES6+ features with fallback support

## 📋 Development Guidelines

### File Organization Rules
- **Source Code**: All development files in `/src` directory
- **Tests**: Comprehensive test suite in `/tests` directory
- **Documentation**: Project docs in root and dedicated files
- **Assets**: Images, fonts, and media in `/src/assets`
- **Never Root**: No working files saved to root directory

### Content Standards
- **Blog Posts**: Minimum 150 lines, comprehensive coverage
- **Projects**: Detailed showcases with technical specifications
- **Metadata**: Complete frontmatter with SEO optimization
- **Dates**: ISO 8601 format aligned with time.gov standards

### Quality Benchmarks
- **Testing Coverage**: 6 comprehensive test suites
- **Performance**: Optimized loading and interaction
- **Accessibility**: WCAG 2.1 AA compliance
- **SEO**: Complete meta tags and structured data

## 🚀 Theme Capabilities

This Neo-Brutalist theme is a complete solution for modern web development, featuring:

- **Full Static Site**: 11ty-powered with optimized build process
- **Rich Content**: 7 blog posts and 4 project showcases
- **Interactive Elements**: Custom cursor, animations, smooth scrolling
- **Social Integration**: Complete social media icon system
- **Testing Infrastructure**: Playwright test suite with 6 specialized tests
- **CI/CD Ready**: GitHub Actions for automated deployment and testing
- **Production Optimized**: Performance-tuned with modern best practices

**Total Project Size**: 86 files across 23 directories, representing a comprehensive, production-ready theme for modern web development.
