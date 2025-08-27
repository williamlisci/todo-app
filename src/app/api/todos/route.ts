import { NextResponse } from 'next/server';
import { db } from '@/lib/db/db';
import { todos } from '@/lib/db/schema';
import { eq, sql, and } from 'drizzle-orm';
import { auth } from '@/lib/auth/auth';
import {createTodo} from "@/services/todoService";

export async function POST(request: Request) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const { content } = await request.json();
        if (!content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }

        // Sử dụng hàm service để tạo to-do
        const newTodo = await createTodo(content, session.user.id);

        return NextResponse.json(newTodo, { status: 201 });
    } catch (error) {
        console.error("Failed to create todo:", error);
        return NextResponse.json({ error: "Failed to create todo" }, { status: 500 });
    }
}


export async function GET() {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const allTodos = await db.select().from(todos)
            .where(eq(todos.userId, session.user.id))
            .orderBy(todos.created_at);
        return NextResponse.json(allTodos, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch todos:", error);
        return NextResponse.json({ error: "Failed to fetch todos" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const { id, is_completed } = await request.json();
        if (typeof id !== 'number' || typeof is_completed !== 'boolean') {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }
        const updatedTodo = await db.update(todos)
            .set({
                is_completed,
                updated_at: sql.raw('CURRENT_TIMESTAMP')
            })
            .where(
                and(
                    eq(todos.id, id),
                    eq(todos.userId, session.user.id)
                )
            )
            .returning();
        if (updatedTodo.length === 0) {
            return NextResponse.json({ error: "Todo not found" }, { status: 404 });
        }
        return NextResponse.json(updatedTodo[0], { status: 200 });
    } catch (error) {
        console.error("Failed to update todo:", error);
        return NextResponse.json({ error: "Failed to update todo" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const { id } = await request.json();
        if (typeof id !== 'number') {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }
        const deletedTodo = await db.delete(todos)
            .where(
                and(
                    eq(todos.id, id),
                    eq(todos.userId, session.user.id)
                )
            )
            .returning({ id: todos.id });
        if (deletedTodo.length === 0) {
            return NextResponse.json({ error: "Todo not found" }, { status: 404 });
        }
        return NextResponse.json(deletedTodo[0], { status: 200 });
    } catch (error) {
        console.error("Failed to delete todo:", error);
        return NextResponse.json({ error: "Failed to delete todo" }, { status: 500 });
    }
}
