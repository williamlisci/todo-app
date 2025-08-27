import { timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const timestamps = {
    created_at: timestamp("created_at", { withTimezone: true })
        .default(sql.raw("CURRENT_TIMESTAMP"))
        .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true })
        .default(sql.raw("CURRENT_TIMESTAMP"))
        .notNull()
        .$onUpdate(() => sql.raw("CURRENT_TIMESTAMP")),
    deleted_at: timestamp("deleted_at", { withTimezone: true }),
};
