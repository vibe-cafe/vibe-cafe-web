# VibeCafé Web

A unique digital space built with Next.js 15, TypeScript, and Tailwind CSS.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Setup vibe-places-data submodule

After pushing vibe-places-data to GitHub:

```bash
# Remove temporary copy
rm -rf data/places-data

# Add as real submodule
git submodule add https://github.com/vibe-cafe/vibe-places-data.git data/places-data
git commit -m "Add vibe-places-data as submodule"
```

## Update Places Data

```bash
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
