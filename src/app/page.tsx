'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";

type Todo = {
    id: number;
    content: string;
    is_completed: boolean;
};

export default function Home() {
    const { data: session, status } = useSession();
    const [newTodoContent, setNewTodoContent] = useState('');
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingTodos, setLoadingTodos] = useState(true);

    const fetchTodos = async () => {
        try {
            const response = await fetch('/api/todos');
            if (!response.ok) {
                console.error('Failed to fetch todos:', response.status, response.statusText);
                alert('Failed to load todos. Please try again.');
                return;
            }
            const data = await response.json();
            setTodos(data);
        } catch (error) {
            console.error('Error fetching todos:', error);
            alert('Failed to load todos. Please check your connection.');
        } finally {
            setLoadingTodos(false);
        }
    };

    useEffect(() => {
        if (status === 'authenticated') {
            fetchTodos()
                .then(() => console.log('Todos loaded successfully'))
                .catch(error => console.error('Failed to load todos:', error));
        }
    }, [status]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newTodoContent }),
            });
            if (!response.ok) {
                console.error('Failed to create todo:', response.status);
                alert('Failed to create todo. Please try again.');
                return;
            }

            const createdTodo: Todo = await response.json();
            setTodos((prevTodos) => [...prevTodos, createdTodo]);
            setNewTodoContent('');
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to create todo. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const toggleTodoCompletion = async (id: number, is_completed: boolean) => {
        try {
            const response = await fetch('/api/todos', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, is_completed: !is_completed }),
            });
            if (!response.ok) {
                console.error('Failed to update todo:', response.status);
                alert('Failed to update todo. Please try again.');
                return;
            }

            setTodos((prevTodos) =>
                prevTodos.map((todo) =>
                    todo.id === id ? { ...todo, is_completed: !is_completed } : todo
                )
            );
        } catch (error) {
            console.error('Error toggling todo completion:', error);
            alert('Failed to update todo. Please try again.');
        }
    };

    const deleteTodo = async (id: number) => {
        try {
            const response = await fetch('/api/todos', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            if (!response.ok) {
                console.error('Failed to delete todo:', response.status);
                alert('Failed to delete todo. Please try again.');
                return;
            }

            setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
        } catch (error) {
            console.error('Error deleting todo:', error);
            alert('Failed to delete todo. Please try again.');
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="text-4xl font-bold mb-8">To-Do App</h1>
            {status === 'authenticated' ? (
                <div className="text-center mb-8">
                    {session.user && (
                        <p className="mb-2 text-black">Welcome, {session.user.name}!</p>
                    )}
                    <button
                        onClick={() => signOut()}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Sign out
                    </button>
                </div>
            ) : (
                <div className="text-center mb-8">
                    <p className="mb-2 text-black">Please sign in to view your to-dos.</p>
                    <button
                        onClick={() => signIn('github')}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Sign in with GitHub
                    </button>
                </div>
            )}

            {status === 'authenticated' && (
                <>
                    <form onSubmit={handleSubmit} className="flex gap-4 mb-8">
                        <input
                            type="text"
                            value={newTodoContent}
                            onChange={(e) => setNewTodoContent(e.target.value)}
                            placeholder="What needs to be done?"
                            className="p-2 border rounded text-black"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            disabled={loading}
                        >
                            {loading ? 'Adding...' : 'Add To-do'}
                        </button>
                    </form>

                    {loadingTodos ? (
                        <p>Loading todos...</p>
                    ) : (
                        <ul className="w-full max-w-md">
                            {todos.length === 0 ? (
                                <p className="text-center">No todos yet. Add one!</p>
                            ) : (
                                todos.map((todo) => (
                                    <li
                                        key={todo.id}
                                        className="p-4 mb-2 bg-gray-100 rounded flex items-center justify-between text-black"
                                    >
                                        <span
                                            style={{ textDecoration: todo.is_completed ? 'line-through' : 'none' }}
                                        >
                                            {todo.content}
                                        </span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => toggleTodoCompletion(todo.id, todo.is_completed)}
                                                className={`px-3 py-1 rounded text-white font-bold ${
                                                    todo.is_completed ? 'bg-yellow-500' : 'bg-green-500'
                                                }`}
                                            >
                                                {todo.is_completed ? 'Undo' : 'Complete'}
                                            </button>
                                            <button
                                                onClick={() => deleteTodo(todo.id)}
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                    )}
                </>
            )}
        </main>
    );
}
