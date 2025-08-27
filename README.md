full stack to do list App using React, typescript, NextJs, and postgreSQL as a database along with 
Drizzle ORM, and Auth.js for authentifcation, and Zustand for the state management.

pnpm add -D drizzle-kit dotenv @types/pg
pnpm add drizzle-orm pg next-auth zustand @auth/drizzle-adapter

pnpm drizzle-kit generate
pnpm drizzle-kit migrate 

src/
├── app/                    # App Router
│   ├── (auth)/            # Route groups
│   ├── (dashboard)/
│   ├── api/               # API routes
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/            # Reusable components
│   ├── ui/               # Basic UI components
│   ├── forms/            # Form components
│   └── layouts/          # Layout components
├── lib/                  # Utilities & configurations
│   ├── db/              # Database setup
│   ├── auth/            # Authentication
│   ├── utils/           # Helper functions
│   └── constants.ts
├── hooks/               # Custom React hooks
├── stores/              # State management (Zustand/Jotai)
├── types/               # TypeScript definitions
└── styles/              # Global styles
