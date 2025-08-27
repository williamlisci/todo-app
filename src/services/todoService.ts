import { db } from '@/lib/db/db';
import { todos } from '@/lib/db/schema';

export async function createTodo(content: string, userId: string) {
    const [newTodo] = await db.insert(todos).values({
        content,
        is_completed: false,
        userId,
    }).returning({
        id: todos.id,
        content: todos.content,
        is_completed: todos.is_completed,
    });

    return newTodo;
}
