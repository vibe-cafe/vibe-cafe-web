# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## Architecture Overview

This is a Next.js 15 application using the App Router with a unique desktop-style windowing interface. Key architectural components:

- **Next.js 15** with App Router, React 19, and standalone output
- **TypeScript** with strict mode enabled
- **Tailwind CSS v4** for styling
- **Internationalization** via react-i18next with Chinese (zh) and English (en) support
- **Desktop UI System** with draggable, resizable windows using Framer Motion
- **Vercel Analytics** and Speed Insights integration

## Key Patterns

### Window Management System
The application features a desktop-like interface with draggable windows:
- `WindowManager.tsx` - Core window management logic and positioning
- `ThemedWindow.tsx` - Window chrome and theming
- `ManagedWindow` component handles drag, resize, and z-index management
- Windows auto-position to avoid overlap using grid-based placement

### Internationalization
- Default language: Chinese (zh)
- Fallback: English (en)  
- Translation keys organized by feature (hero, manifesto, vibeFriends, hacks, etc.)
- Configuration in `src/app/i18n/config.ts`
- Providers setup in `src/app/providers.tsx`

### SEO Implementation
- **Dynamic SEO**: Pages support language-specific meta tags that update on language switch
- **Structured Data**: JSON-LD schema markup for enhanced search visibility
- **Multi-language Support**: Separate TDK (Title, Description, Keywords) for each language
- **Social Media**: Open Graph and Twitter Card integration
- Implementation pattern:
  - `layout.tsx` provides server-side default metadata
  - `ClientSEO.tsx` handles dynamic client-side updates
  - `StructuredData.tsx` provides JSON-LD schema markup
  - Translation keys in `i18n/config.ts` under `*.seo` namespace

### Component Structure
- Components use single quotes for imports (configured in .cursorrules)
- Path aliases configured: `@/*` maps to `./src/*`
- Tailwind classes with custom font families for system fonts

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── hacks/          # VibeCafé hacks feature pages  
│   ├── i18n/           # Internationalization config
│   └── layout.tsx      # Root layout with providers
├── components/         # Reusable UI components
│   ├── WindowManager.tsx    # Core window management
│   ├── ThemedWindow.tsx     # Window theming
│   ├── MenuBar.tsx          # Desktop menu bar
│   └── LanguageSwitcher.tsx # i18n language toggle
└── hooks/              # Custom React hooks
    └── useWindowSize.ts     # Viewport size tracking
```

## Configuration Notes

- TypeScript strict mode enabled
- ESLint with Next.js config
- 2-space indentation, single quotes preferred
- Standalone build output for deployment
- Turbopack enabled for faster development builds
- Format on save enabled with Prettier as default formatter