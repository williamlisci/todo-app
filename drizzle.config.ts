import "dotenv/config";
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing");
}

export default defineConfig({
    schema: "./src/lib/db/*",// Thay đổi đường dẫn để bao gồm cả schema và auth-schema
    out: "./src/lib/db/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_URL.includes("sslmode=require") || process.env.NODE_ENV === "production"
            ? { rejectUnauthorized: false } // Bật SSL nếu cần
            : undefined,
    },
    verbose: true,
    strict: true,
    breakpoints: true,
});
