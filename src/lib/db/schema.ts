import { text, boolean, integer, index } from "drizzle-orm/pg-core";
import { timestamps } from "./timestamps.helpers";
import { pgTableCreator } from 'drizzle-orm/pg-core';
import { users } from './auth-schema';

const createTable = pgTableCreator((name) => `todo_app_${name}`);

export const todos = createTable(
    "todos", // Chỉ định schema public trực tiếp
    {
        id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
        content: text("content").notNull(),
        is_completed: boolean("is_completed").default(false).notNull(),
        userId: text("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
        ...timestamps,
    },
    (table) => ({
        idx_is_completed: index("idx_todos_is_completed").on(table.is_completed),
        idx_created_at: index("idx_todos_created_at").on(table.created_at),
    })
);
