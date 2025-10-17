# VibeCafé Web

[VibeCafé](https://vibecafe.ai) Website
[VibeCafé](https://vibecafe.ai) 官方网站

## Getting Started

```bash
# Clone with submodule
git clone --recurse-submodules <repo-url>

# Or initialize submodule after clone
git submodule init
git submodule update

# Install and run
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Places Data

Places data comes from [vibe-places-data](https://github.com/vibe-cafe/vibe-places-data) submodule and updates automatically.

### Auto-Deployment

When new places are added to `vibe-places-data`, the website automatically rebuilds and deploys:

1. Contributor submits place → Merged to `vibe-places-data`
2. GitHub Action triggers Vercel Deploy Hook
3. Website rebuilds with latest data (2-3 minutes)

**Setup (one-time):**
1. Create Vercel Deploy Hook in project settings
2. Add `VERCEL_DEPLOY_HOOK` secret to [vibe-places-data](https://github.com/vibe-cafe/vibe-places-data/settings/secrets/actions)

The build script uses `--remote` flag to always fetch latest data:
```json
"build": "git submodule update --remote --init --recursive && npm run copy-images && next build"
```
