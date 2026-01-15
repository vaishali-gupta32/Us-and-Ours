"use client";
import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Countdown } from "@/components/Countdown";
import { Plus, Heart, Music, Film, Calendar as CalendarIcon, MoreHorizontal, Pencil, Trash2, Camera, UserCircle } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import useSWR from "swr"; // Real-time polling

interface Post {
    _id: string;
    author: { _id: string; name: string; avatar?: string };
    content: string;
    mood: string;
    images?: string[];
    date: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Dashboard() {
    const router = useRouter();
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    // Poll every 3 seconds for near-real-time updates
    const { data: postsData, mutate: mutatePosts } = useSWR('/api/posts', fetcher, {
        refreshInterval: 3000,
        revalidateOnFocus: true
    });

    const { data: coupleData } = useSWR('/api/couple', fetcher, { revalidateOnFocus: false });

    const posts: Post[] = postsData?.posts || [];
    const currentUserId = postsData?.currentUser;
    const secretCode = coupleData?.secretCode;
    const isSolo = !coupleData?.partner2;

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this memory?')) return;
        await fetch(`/api/posts/${id}`, { method: 'DELETE' });
        mutatePosts(); // Optimistic update or re-fetch
        setActiveMenu(null);
    };

    const copyCode = () => {
        if (secretCode) {
            navigator.clipboard.writeText(secretCode);
            alert('Secret Code copied to clipboard! Share it with your partner. 💌');
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };
    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen p-4 md:p-8">
            <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <motion.div variants={item}>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-md font-heading">
                            Welcome Home <span className="animate-pulse">❤️</span>
                        </h1>
                        <p className="text-white/80 font-medium text-lg mt-1">
                            Your shared world, updated live.
                        </p>
                    </motion.div>

                    <motion.div variants={item}>
                        <Link href="/write">
                            <button className="px-8 py-3 bg-white text-rose-600 rounded-full font-bold shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                                <Plus className="w-5 h-5" /> New Post
                            </button>
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-4 space-y-6">
                        {/* Secret Code Widget */}
                        <motion.div variants={item}>
                            <GlassCard className="p-6 bg-white/30 border-white/40 relative overflow-hidden group">
                                {isSolo && <div className="absolute top-0 right-0 p-2"><span className="animate-pulse flex h-3 w-3 bg-rose-500 rounded-full"></span></div>}
                                <p className="text-xs font-bold text-rose-900/60 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <UserCircle className="w-4 h-4" />
                                    {isSolo ? 'Waiting for Partner...' : 'Connected'}
                                </p>

                                {secretCode ? (
                                    <div className="text-center py-2" onClick={copyCode}>
                                        <div className="text-3xl font-black text-rose-950 tracking-widest font-mono border-2 border-dashed border-rose-300/50 rounded-xl py-3 bg-white/30 cursor-pointer hover:bg-white/50 hover:scale-105 transition-all active:scale-95" title="Click to Copy">
                                            {secretCode}
                                        </div>
                                        <p className="text-[10px] text-rose-900/50 font-bold mt-2 uppercase">Click to Copy Invitation Code</p>
                                    </div>
                                ) : (
                                    <div className="animate-pulse h-12 bg-white/20 rounded-xl" />
                                )}
                            </GlassCard>
                        </motion.div>

                        <motion.div variants={item}>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-orange-400 blur-xl opacity-40 rounded-3xl" />
                                <GlassCard className="relative !bg-white/40 border-none !p-0 overflow-hidden">
                                    <div className="p-6"><Countdown /></div>
                                </GlassCard>
                            </div>
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div variants={item} className="grid grid-cols-2 gap-4">
                            {[{ icon: CalendarIcon, label: 'Dates', href: '/calendar', color: 'emerald' }, { icon: Film, label: 'Movies', href: '/movies', color: 'purple' }, { icon: Music, label: 'Music', href: '/playlist', color: 'sky' }].map((action, i) => (
                                <Link key={i} href={action.href}>
                                    <GlassCard className="p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/40 cursor-pointer h-24">
                                        <action.icon className={`w-6 h-6 text-${action.color}-600`} />
                                        <span className="font-bold text-rose-900 text-sm">{action.label}</span>
                                    </GlassCard>
                                </Link>
                            ))}
                        </motion.div>
                    </div>

                    {/* Feed */}
                    <div className="md:col-span-8">
                        <motion.div variants={item} className="mb-4"><h3 className="text-2xl font-bold text-rose-950/80">Live Feed</h3></motion.div>

                        {posts.length === 0 ? (
                            <GlassCard className="p-12 text-center text-rose-900/50 italic">No memories yet. Start writing!</GlassCard>
                        ) : (
                            <div className="columns-1 md:columns-2 gap-6 space-y-6">
                                {posts.map((post) => {
                                    const isMe = post.author?._id === currentUserId;
                                    return (
                                        <motion.div key={post._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="break-inside-avoid">
                                            <GlassCard className={`p-0 overflow-hidden hover:shadow-xl transition-all relative group ${isMe ? 'border-rose-200 bg-white/60' : 'border-indigo-100 bg-white/50'}`}>
                                                {/* Author Badge */}
                                                <div className="absolute top-3 left-3 z-10">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm ${isMe ? 'bg-rose-500 text-white' : 'bg-indigo-500 text-white'}`}>
                                                        {isMe ? 'You' : (post.author?.name || 'Partner')}
                                                    </span>
                                                </div>

                                                <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={(e) => { e.preventDefault(); handleDelete(post._id); }} className="p-2 bg-white rounded-full text-red-500 shadow-sm hover:bg-red-50"><Trash2 className="w-3 h-3" /></button>
                                                </div>

                                                {post.images && post.images.length > 0 && <img src={post.images[0]} className="w-full h-auto object-cover" />}

                                                <div className="p-5 pt-8">
                                                    <p className="text-rose-950 font-medium leading-relaxed mb-3">{post.content}</p>
                                                    <div className="flex items-center justify-between border-t border-rose-900/5 pt-3">
                                                        <span className="text-[10px] font-bold text-rose-400 bg-rose-50 px-2 py-1 rounded-md uppercase">{post.mood}</span>
                                                        <span className="text-[10px] text-rose-900/40 font-bold">{new Date(post.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                </div>
                                            </GlassCard>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
