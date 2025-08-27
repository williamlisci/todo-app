full stack to do list App using React, typescript, NextJs, and postgreSQL as a database along with 
Drizzle ORM, and Auth.js for authentifcation, and Zustand for the state management.

pnpm add -D drizzle-kit dotenv @types/pg
pnpm add drizzle-orm pg next-auth zustand @auth/drizzle-adapter

pnpm drizzle-kit push
pnpm drizzle-kit generate
pnpm drizzle-kit migrate 
