"use client";
import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Countdown } from "@/components/Countdown";
import { Plus, Heart, Music, Film, Calendar as CalendarIcon, MoreHorizontal, Pencil, Trash2, Camera, UserCircle, BookHeart } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import useSWR from "swr";

interface Post {
    _id: string;
    author: { _id: string; name: string; avatar?: string };
    content: string;
    mood: string;
    images?: string[];
    date: string;
}

const fetcher = async (url: string) => {
    const { apiFetch } = await import('@/lib/api');
    const res = await apiFetch(url);
    return res.json();
};

export default function Dashboard() {
    const router = useRouter();
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    // Handle Google Calendar auth errors/success
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const error = params.get('error');
        const success = params.get('success');

        if (error) {
            alert(`❌ ${error}`);
            window.history.replaceState({}, '', '/dashboard');
        }

        if (success === 'calendar_connected') {
            alert('✅ Google Calendar connected successfully!');
            window.history.replaceState({}, '', '/dashboard');
        }
    }, []);

    const { data: postsData, mutate: mutatePosts } = useSWR('/posts', fetcher, {
        refreshInterval: 3000,
        revalidateOnFocus: true
    });

    const { data: coupleData, mutate: mutateCouple } = useSWR('/couple', fetcher, { revalidateOnFocus: false });

    const posts: Post[] = postsData?.posts || [];
    const currentUserId = postsData?.currentUser;
    const secretCode = coupleData?.secretCode;
    const isSolo = !coupleData?.partner2;

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this memory?')) return;
        const { apiFetch } = await import('@/lib/api');
        await apiFetch(`/posts/${id}`, { method: 'DELETE' });
        mutatePosts();
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
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <motion.div variants={item}>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-md font-heading">
                            Welcome Home <span className="animate-pulse">❤️</span>
                        </h1>
                        <p className="text-white/80 font-medium text-lg mt-1">
                            Your shared world, updated live.
                        </p>
                    </motion.div>

                    <motion.div variants={item} className="flex gap-3">
                        <a href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/auth/google`} className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-full font-bold backdrop-blur-md transition-all flex items-center gap-2 border border-white/40">
                            <CalendarIcon className="w-5 h-5" /> Sync Cal
                        </a>

                        <Link href="/write">
                            <button className="px-8 py-3 bg-white text-rose-600 rounded-full font-bold shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                                <Plus className="w-5 h-5" /> New Post
                            </button>
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-4 space-y-6">
                        <motion.div variants={item}>
                            <GlassCard className="p-0 border-white/40 relative overflow-hidden group min-h-[180px] flex flex-col justify-center" gradient>
                                {!isSolo ? (
                                    <>
                                        <div className="absolute inset-0 bg-gradient-to-r from-rose-100/50 to-orange-100/50 opacity-50" />
                                        <div className="relative z-10 p-6 flex flex-col items-center justify-center text-center">
                                            <div className="relative flex items-center justify-center -space-x-4 mb-4">
                                                {[coupleData?.partner1, coupleData?.partner2].map((p, i) => (
                                                    <div key={i} className={`w-14 h-14 rounded-full border-4 border-white shadow-lg overflow-hidden flex items-center justify-center ${i === 1 ? 'z-10' : 'z-0'} bg-gradient-to-br from-rose-200 to-orange-200`}>
                                                        {p?.avatar ? (
                                                            <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="text-xl font-bold text-rose-800">{p?.name?.[0]?.toUpperCase()}</span>
                                                        )}
                                                    </div>
                                                ))}
                                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white rounded-full p-1 shadow-md z-20">
                                                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                                                </div>
                                            </div>

                                            <div>
                                                <h2 className="text-xl font-bold text-rose-900 font-heading">
                                                    {coupleData?.partner1?._id === currentUserId ? coupleData?.partner2?.name : coupleData?.partner1?.name} & You
                                                </h2>
                                                {coupleData?.createdAt && (
                                                    <p className="text-xs font-bold text-rose-500 uppercase tracking-widest mt-2 bg-white/40 px-3 py-1 rounded-full inline-block">
                                                        Together {Math.floor((new Date().getTime() - new Date(coupleData.createdAt).getTime()) / (1000 * 60 * 60 * 24))} Days
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="p-6">
                                        <div className="absolute top-0 right-0 p-2"><span className="animate-pulse flex h-3 w-3 bg-rose-500 rounded-full"></span></div>
                                        <p className="text-xs font-bold text-rose-900/60 uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <UserCircle className="w-4 h-4" />
                                            Waiting for Partner...
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
                                    </div>
                                )}
                            </GlassCard>
                        </motion.div>

                        <motion.div variants={item}>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-orange-400 blur-xl opacity-40 rounded-3xl" />
                                <GlassCard className="relative !bg-white/40 border-none !p-0 overflow-hidden">
                                    <div className="p-6">
                                        <Countdown
                                            targetDate={coupleData?.nextMeetingDate}
                                            onUpdate={mutateCouple}
                                        />
                                    </div>
                                </GlassCard>
                            </div>
                        </motion.div>
                        <motion.div variants={item} className="grid grid-cols-2 gap-4">
                            {[{ icon: CalendarIcon, label: 'Dates', href: '/calendar', color: 'emerald' }, { icon: BookHeart, label: 'Our Story', href: '/timeline', color: 'rose' }, { icon: Film, label: 'Movies', href: '/movies', color: 'purple' }, { icon: Music, label: 'Music', href: '/playlist', color: 'sky' }].map((action, i) => (
                                <Link key={i} href={action.href}>
                                    <GlassCard className="p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/40 cursor-pointer h-24">
                                        <action.icon className={`w-6 h-6 text-${action.color}-600`} />
                                        <span className="font-bold text-rose-900 text-sm">{action.label}</span>
                                    </GlassCard>
                                </Link>
                            ))}
                        </motion.div>
                    </div>

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
