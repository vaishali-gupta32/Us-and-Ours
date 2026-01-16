"use client";
import { useState } from 'react';
import useSWR from 'swr';
import { GlassCard } from '@/components/ui/GlassCard';
import { TimelineNode } from '@/components/TimelineNode';
import { AddMomentModal } from '@/components/AddMomentModal';
import { Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const fetcher = async (url: string) => {
    const { apiFetch } = await import('@/lib/api');
    const res = await apiFetch(url);
    return res.json();
};

export default function TimelinePage() {
    const { data: moments, mutate } = useSWR('/timeline', fetcher);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    return (
        <div className="min-h-screen p-4 md:p-8 relative">
            {/* Header */}
            <div className="max-w-4xl mx-auto mb-12 flex items-center justify-between sticky top-4 z-40 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-lg">
                <Link href="/dashboard" className="p-2 hover:bg-white/20 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6 text-rose-900" />
                </Link>
                <h1 className="text-2xl font-bold text-rose-950 font-heading">Our Story</h1>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="p-2 bg-rose-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                    <Plus className="w-6 h-6" />
                </button>
            </div>

            {/* Timeline Container */}
            <div className="max-w-4xl mx-auto pb-20">
                {!moments ? (
                    <div className="text-center py-20 text-rose-900/50 animate-pulse">Loading our history...</div>
                ) : moments.length === 0 ? (
                    <GlassCard className="text-center py-20">
                        <h2 className="text-2xl font-bold text-rose-800 mb-2">Your story starts here.</h2>
                        <p className="text-rose-600/60 mb-6">Add the first moment of your journey together.</p>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="px-6 py-3 bg-rose-500 text-white rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
                        >
                            + Add First Memory
                        </button>
                    </GlassCard>
                ) : (
                    <div className="relative">
                        {moments.map((moment: any, index: number) => (
                            <TimelineNode
                                key={moment._id}
                                moment={moment}
                                index={index}
                                isLast={index === moments.length - 1}
                            />
                        ))}

                        {/* Ending Node */}
                        <div className="flex justify-center mt-12">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="bg-white/40 px-6 py-2 rounded-full border border-rose-200 text-rose-800 text-sm font-bold shadow-sm"
                            >
                                To never ending... ❤️
                            </motion.div>
                        </div>
                    </div>
                )}
            </div>

            <AddMomentModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={mutate}
            />
        </div>
    );
}
