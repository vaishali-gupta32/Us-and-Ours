"use client";
import React, { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Countdown } from "@/components/Countdown";
import { Plus, Heart, Music, Film, Calendar as CalendarIcon, ArrowRight, MoreHorizontal, Pencil, Trash2, Camera, CloudSun, MapPin } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface Post {
    _id: string;
    author: { name: string; avatar?: string };
    content: string;
    mood: string;
    images?: string[];
    date: string;
}

export default function Dashboard() {
    const [posts, setPosts] = useState<Post[]>([]);
    const router = useRouter();
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    const fetchPosts = () => {
        fetch('/api/posts').then(res => res.json()).then(data => {
            if (data.success) setPosts(data.posts);
        });
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this memory? 🥺')) return;
        await fetch(`/api/posts/${id}`, { method: 'DELETE' });
        setPosts(posts.filter(p => p._id !== id));
        setActiveMenu(null);
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { y: 30, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen p-4 md:p-8">
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-8"
            >
                {/* Top Header & Greeting */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <motion.div variants={item}>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-md">
                            Good Evening, Love <span className="animate-pulse">✨</span>
                        </h1>
                        <p className="text-white/80 font-medium text-lg mt-2">
                            Here's what used to be just ours, now shared forever.
                        </p>
                    </motion.div>

                    <motion.div variants={item} className="flex gap-4">
                        <Link href="/write">
                            <button className="px-8 py-4 bg-white text-rose-600 rounded-full font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-lg flex items-center gap-2">
                                <Plus className="w-6 h-6" /> Add Memory
                            </button>
                        </Link>
                    </motion.div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                    {/* Left Column: Stats & Tools (Span 4) */}
                    <div className="md:col-span-4 space-y-6">
                        {/* Countdown Widget */}
                        <motion.div variants={item}>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-orange-400 blur-xl opacity-50 group-hover:opacity-70 transition-opacity rounded-3xl" />
                                <GlassCard className="relative !bg-white/40 border-none !p-0 overflow-hidden">
                                    <div className="p-6">
                                        <Countdown />
                                    </div>
                                </GlassCard>
                            </div>
                        </motion.div>

                        {/* Quick Links Grid */}
                        <motion.div variants={item} className="grid grid-cols-2 gap-4">
                            <Link href="/calendar">
                                <GlassCard className="p-6 flex flex-col items-center justify-center gap-3 hover:bg-emerald-500/10 cursor-pointer h-32">
                                    <CalendarIcon className="w-8 h-8 text-emerald-600" />
                                    <span className="font-bold text-rose-900">Dates</span>
                                </GlassCard>
                            </Link>
                            <Link href="/gallery">
                                <GlassCard className="p-6 flex flex-col items-center justify-center gap-3 hover:bg-indigo-500/10 cursor-pointer h-32">
                                    <ImageIcon className="w-8 h-8 text-indigo-600" />
                                    <span className="font-bold text-rose-900">Gallery</span>
                                </GlassCard>
                            </Link>
                            <Link href="/movies">
                                <GlassCard className="p-6 flex flex-col items-center justify-center gap-3 hover:bg-purple-500/10 cursor-pointer h-32">
                                    <Film className="w-8 h-8 text-purple-600" />
                                    <span className="font-bold text-rose-900">Movies</span>
                                </GlassCard>
                            </Link>
                            <Link href="/playlist">
                                <GlassCard className="p-6 flex flex-col items-center justify-center gap-3 hover:bg-sky-500/10 cursor-pointer h-32">
                                    <Music className="w-8 h-8 text-sky-600" />
                                    <span className="font-bold text-rose-900">Music</span>
                                </GlassCard>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Right Column: Feed (Span 8) */}
                    <div className="md:col-span-8">
                        <motion.div variants={item} className="mb-6 flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-rose-950/80">Recent Moments</h3>
                            <div className="h-1 flex-1 bg-white/30 rounded-full mx-4" />
                        </motion.div>

                        {posts.length === 0 ? (
                            <GlassCard className="p-12 text-center text-rose-900/50 italic">
                                No memories recorded yet...
                            </GlassCard>
                        ) : (
                            <div className="columns-1 md:columns-2 gap-6 space-y-6">
                                {posts.map((post) => (
                                    <motion.div
                                        key={post._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        className="break-inside-avoid"
                                    >
                                        <GlassCard className="p-0 overflow-hidden hover:shadow-2xl transition-all duration-300 relative group">
                                            {/* Edit/Delete Overlay */}
                                            <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => { e.preventDefault(); handleDelete(post._id); }}
                                                    className="p-2 bg-white rounded-full shadow-lg text-rose-500 hover:text-red-500"
                                                    title="Delete Memory"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.preventDefault(); router.push(`/write?edit=${post._id}`); }}
                                                    className="p-2 bg-white rounded-full shadow-lg text-rose-500 hover:text-blue-500 ml-2"
                                                    title="Edit Memory"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {post.images && post.images.length > 0 && (
                                                <div className="relative">
                                                    <img src={post.images[0]} className="w-full h-auto object-cover" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                            )}

                                            <div className="p-5">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="px-3 py-1 bg-rose-100/50 rounded-full text-xs font-bold text-rose-700">
                                                        {post.mood.charAt(0).toUpperCase() + post.mood.slice(1)}
                                                    </div>
                                                    <span className="text-xs text-rose-900/40 font-bold ml-auto">
                                                        {new Date(post.date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-rose-950 font-medium leading-relaxed">
                                                    {post.content}
                                                </p>
                                            </div>
                                        </GlassCard>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </motion.div>
        </div>
    );
}

// Simple Icon component wrapper since lucide icons are components
function ImageIcon(props: any) { return <Camera {...props} /> }
