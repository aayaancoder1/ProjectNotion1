# Deployment Guide

## Environment Variables

| Variable | Description | Required | Rules |
|----------|-------------|----------|-------|
| `NODE_ENV` | Environment mode | Yes | `production` for Vercel |
| `NOTION_OAUTH_TOKEN` | Notion Integration Token | Optional | If missing -> `dry-run` mode |
| `ENABLE_NOTION_WRITES` | Write Permission Flag | Optional | Set explicitly to "true" to enable writes. Requires `NODE_ENV=production` or `staging`. |
| `NOTION_PARENT_PAGE_ID` | Parent Page ID | Optional | Required ONLY if writes enabled. |

## Runtime Modes

1. **dry-run** (Default with no token)
   - No Notion API calls.
   - Simulation only.
   - Safe for dev/preview.

2. **read-only** (Default with token)
   - Fetches data from Notion (Dashboards).
   - Validation checks.
   - NO writes / creations.

3. **write-enabled** (Strict)
   - Requires `NOTION_OAUTH_TOKEN`.
   - Requires `ENABLE_NOTION_WRITES=true`.
   - Requires `NODE_ENV=production` (*hard lock*).
   - Creates databases and pages.
