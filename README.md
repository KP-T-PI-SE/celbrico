# Celbrico E-commerce Platform

This is a monorepo for the Celbrico platform, managed with Turborepo and pnpm workspaces.

## Structure

- `apps/web`: Next.js 15 Progressive Web App (Frontend)
- `apps/admin`: Admin dashboard for management
- `apps/mobile`: React Native mobile application
- `api/server`: Node.js Express backend API
- `packages/ui`: Shared React components
- `packages/config`: Shared configurations (eslint, prettier, tsconfig)

## Tech Stack
- Next.js 15, React 19
- Node.js, Express.js
- MongoDB, Redis
- TypeScript
- Tailwind CSS

## Getting Started

1. Install dependencies: `pnpm install`
2. Start development server: `pnpm run dev`
