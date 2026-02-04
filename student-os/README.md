# Student OS (Notion Edition)

A strictly-typed, intelligent operating system for students, backed by Notion.

## Core Capabilities

1.  **Compiler (v1)**: Deterministic Intermediate Representation (IR) for semester planning.
2.  **Planner**: LLM-driven planning layer that converts natural language (e.g., "I take Physics and Math") into valid IR.
3.  **Executor**: Safe, write-once Notion integration.
    - Creates "Courses" and "Tasks" databases.
    - Populates initial data.
    - **Safety Lock**: Default is Read-Only. Writes require explicit `ENABLE_NOTION_WRITES=true` and Production environment.
4.  **Intelligence**:
    - Traceable decision making.
    - Detects execution patterns (e.g., "Lagging Courses").
    - Adapts urgency/importance weights dynamically.
5.  **Dashboards**:
    - "This Week"
    - "Upcoming"
    - "At Risk" (High priority tasks in lagging courses)
    - All rendered in the frontend, backed by Notion.

## Getting Started

### 1. Setup
```bash
npm install
cp .env.local.example .env.local
```

### 2. Configure .env.local
```bash
NOTION_OAUTH_TOKEN=secret_...
NOTION_PARENT_PAGE_ID=...
# ENABLE_NOTION_WRITES=true # Uncomment ONLY to create databases
```

### 3. Run
```bash
npm run dev
```

## Architecture
- **core/compiler**: Schema & Logic
- **core/planner**: LLM Prompting & Validation
- **core/executor**: Notion API & Dry-Run Simulation
- **core/intelligence**: Feedback & Self-Correction loops
- **core/views**: Frontend Dashboard Logic

## Deployment
See [DEPLOY.md](DEPLOY.md) for production details.
