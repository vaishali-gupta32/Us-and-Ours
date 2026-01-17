"use client";
import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { Plus, Check, Trash2, Link as LinkIcon, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Item {
    _id: string;
    title: string;
    status: 'pending' | 'completed';
    link?: string;
}

interface ListPageProps {
    type: 'movie' | 'song';
    title: string;
    icon: React.ElementType;
}

export default function GenericListPage({ type, title, icon: Icon }: ListPageProps) {
    const router = useRouter();
    const [items, setItems] = useState<Item[]>([]);
    const [newItem, setNewItem] = useState('');
    const [newLink, setNewLink] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const fetchItems = async () => {
        const { apiFetch } = await import('@/lib/api');
        const res = await apiFetch(`/items?type=${type}`);
        const data = await res.json();
        if (data.success) setItems(data.items);
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItem.trim()) return;

        const { apiFetch } = await import('@/lib/api');
        await apiFetch('/items', {
            method: 'POST',
            body: JSON.stringify({ title: newItem, link: newLink, type })
        });

        setNewItem('');
        setNewLink('');
        setIsAdding(false);
        fetchItems();
    };

    const toggleStatus = async (id: string, current: string) => {
        const status = current === 'pending' ? 'completed' : 'pending';
        // Optimistic update
        setItems(items.map(i => i._id === id ? { ...i, status } : i));

        const { apiFetch } = await import('@/lib/api');
        await apiFetch('/items', {
            method: 'PATCH', // Helper supports PATCH if backend does, using PUT for now if needed, but keeping PATCH as per route def
            body: JSON.stringify({ _id: id, status })
        });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this item?')) return;
        setItems(items.filter(i => i._id !== id));
        const { apiFetch } = await import('@/lib/api');
        await apiFetch(`/items/${id}`, { method: 'DELETE' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100 pb-24 p-4">
            <header className="flex items-center gap-4 mb-8 max-w-2xl mx-auto">
                <button onClick={() => router.back()} className="p-3 rounded-full bg-white/50 hover:bg-white text-rose-500 transition-all shadow-sm">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-2">
                    <Icon className="w-8 h-8 text-rose-500" />
                    <h1 className="text-3xl font-hand font-bold text-rose-950">{title}</h1>
                </div>
            </header>

            <div className="max-w-2xl mx-auto space-y-6">
                <Button onClick={() => setIsAdding(!isAdding)} className="w-full flex items-center justify-center gap-2 py-4">
                    <Plus className="w-5 h-5" /> Add {type === 'movie' ? 'Movie' : 'Song'}
                </Button>

                <AnimatePresence>
                    {isAdding && (
                        <motion.form
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            onSubmit={handleAdd}
                            className="overflow-hidden"
                        >
                            <GlassCard className="p-4 space-y-3 !rounded-2xl">
                                <input
                                    value={newItem}
                                    onChange={e => setNewItem(e.target.value)}
                                    placeholder={`Name of ${type}...`}
                                    className="w-full p-3 rounded-xl bg-white/50 focus:outline-none border border-transparent focus:border-rose-300"
                                    autoFocus
                                />
                                <input
                                    value={newLink}
                                    onChange={e => setNewLink(e.target.value)}
                                    placeholder="Optional Link (IMDb/Spotify)..."
                                    className="w-full p-3 rounded-xl bg-white/50 focus:outline-none border border-transparent focus:border-rose-300 text-sm"
                                />
                                <div className="flex justify-end gap-2">
                                    <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-rose-500 font-bold text-sm">Cancel</button>
                                    <button type="submit" className="px-6 py-2 bg-rose-500 text-white rounded-xl font-bold shadow-lg shadow-rose-200">Save</button>
                                </div>
                            </GlassCard>
                        </motion.form>
                    )}
                </AnimatePresence>

                <div className="space-y-3">
                    {items.length === 0 && !isAdding && (
                        <p className="text-center text-rose-900/40 font-medium py-10">Empty list. Add something!</p>
                    )}
                    {items.map(item => (
                        <GlassCard key={item._id} className={`p-4 flex items-center gap-4 transition-all duration-300 ${item.status === 'completed' ? 'opacity-60 grayscale-[0.5]' : ''}`}>
                            <button
                                onClick={() => toggleStatus(item._id, item.status)}
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${item.status === 'completed' ? 'bg-rose-500 border-rose-500 text-white' : 'border-rose-300 hover:border-rose-500'}`}
                            >
                                {item.status === 'completed' && <Check className="w-4 h-4" />}
                            </button>

                            <div className="flex-1">
                                <p className={`font-bold text-rose-900 ${item.status === 'completed' ? 'line-through' : ''}`}>{item.title}</p>
                                {item.link && (
                                    <a href={item.link} target="_blank" rel="noreferrer" className="text-xs text-rose-500 flex items-center gap-1 hover:underline">
                                        <LinkIcon className="w-3 h-3" /> Link
                                    </a>
                                )}
                            </div>

                            <button onClick={() => handleDelete(item._id)} className="text-rose-300 hover:text-red-500 transition-colors p-2">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </GlassCard>
                    ))}
                </div>
            </div>
        </div>
    );
}
