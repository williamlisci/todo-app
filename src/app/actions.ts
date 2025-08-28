// app/actions.ts
"use server";

import { db } from "@/lib/db/db";
import { todos } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getTodos() {
    const data = await db.select().from(todos);
    return data;
}
