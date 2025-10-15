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

## Update Places Data

Places data comes from [vibe-places-data](https://github.com/vibe-cafe/vibe-places-data) submodule.

```bash
# Update to latest
git submodule update --remote data/places-data
git add data/places-data
git commit -m "Update places data"
```

## Deploy

Deploy to Vercel by pushing to your connected Git repository:

```bash
git add .
git commit -m "Deploy updates"
git push origin main
```
