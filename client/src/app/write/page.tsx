"use client";
import React, { useState, useRef, useEffect, Suspense } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { useRouter, useSearchParams } from 'next/navigation';
import { Smile, Frown, Heart, ArrowLeft, Upload, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function WriteContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('edit');

    const [content, setContent] = useState('');
    const [mood, setMood] = useState('happy');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (editId) {
            // We need to fetch the specific post. For now, let's just fetch all and filter
            // In a real app we'd have a GET /api/posts/[id] endpoint
            import('@/lib/api').then(({ apiFetch }) => {
                apiFetch('/posts').then(res => res.json()).then(data => {
                    const post = data.posts.find((p: any) => p._id === editId);
                    if (post) {
                        setContent(post.content);
                        setMood(post.mood);
                        if (post.images && post.images.length > 0) setPreviewUrl(post.images[0]);
                    }
                });
            });
        }
    }, [editId]);

    const moods = [
        { id: 'happy', icon: Smile, label: 'Happy', color: 'text-yellow-500', bg: 'bg-yellow-50' },
        { id: 'romantic', icon: Heart, label: 'Loved', color: 'text-rose-500', bg: 'bg-rose-50' },
        { id: 'sad', icon: Frown, label: 'Sad', color: 'text-blue-500', bg: 'bg-blue-50' },
    ];

    const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800;
                    const scaleSize = MAX_WIDTH / img.width;
                    const newWidth = MAX_WIDTH < img.width ? MAX_WIDTH : img.width;
                    const newHeight = MAX_WIDTH < img.width ? img.height * scaleSize : img.height;
                    canvas.width = newWidth;
                    canvas.height = newHeight;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, newWidth, newHeight);
                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                    resolve(compressedBase64);
                };
                img.onerror = (err) => reject(err);
            };
            reader.onerror = (err) => reject(err);
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                if (file.size > 500 * 1024) {
                    const compressed = await compressImage(file);
                    setPreviewUrl(compressed);
                } else {
                    const reader = new FileReader();
                    reader.onloadend = () => setPreviewUrl(reader.result as string);
                    reader.readAsDataURL(file);
                }
                setError('');
            } catch (err) {
                setError("Failed to process image");
            }
        }
    };

    const handleSubmit = async () => {
        if (!content.trim()) {
            setError("Please write something!");
            return;
        }
        setIsSubmitting(true);
        setError('');

        try {
            const { apiFetch } = await import('@/lib/api');
            let imageUrl = '';

            // 1. Handle Image Upload if exists
            if (previewUrl && previewUrl.startsWith('data:')) {
                // Get Signature
                const signRes = await apiFetch('/auth/cloudinary-sign');
                const signData = await signRes.json();

                if (!signData.signature) throw new Error('Failed to sign upload');

                // Convert Base64 to Blob
                const fetchRes = await fetch(previewUrl);
                const blob = await fetchRes.blob();

                // Upload to Cloudinary
                const formData = new FormData();
                formData.append('file', blob);
                formData.append('api_key', signData.apiKey);
                formData.append('timestamp', signData.timestamp.toString());
                formData.append('signature', signData.signature);

                const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`, {
                    method: 'POST',
                    body: formData
                });

                const uploadData = await uploadRes.json();
                if (!uploadData.secure_url) throw new Error('Image upload failed');

                imageUrl = uploadData.secure_url;
            } else if (previewUrl) {
                // If editing and didn't change image (still an http url)
                imageUrl = previewUrl;
            }

            // 2. Submit Post
            const url = editId ? `/posts/${editId}` : '/posts';
            const method = editId ? 'PUT' : 'POST';

            const res = await apiFetch(url, {
                method,
                body: JSON.stringify({
                    content,
                    mood,
                    images: imageUrl ? [imageUrl] : []
                })
            });

            const data = await res.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to save entry');
            }

            router.push('/dashboard');
        } catch (e: any) {
            console.error(e);
            setError(e.message || "Something went wrong.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <header className="flex items-center gap-4 mb-8 pt-4">
                <button onClick={() => router.back()} className="p-3 rounded-full bg-white/50 hover:bg-white text-rose-500 transition-all shadow-sm">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-3xl font-hand font-bold text-rose-950 bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-purple-600">
                    {editId ? 'Edit Memory' : 'New Memory'}
                </h1>
            </header>

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-red-100 border border-red-200 text-red-600 p-4 rounded-2xl mb-6 font-medium text-center"
                    >
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            <GlassCard className="p-8 space-y-8 !rounded-[2.5rem] border-rose-100/50 shadow-xl shadow-rose-200/20 backdrop-blur-xl">
                <div>
                    <label className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-4 block ml-1">Current Mood</label>
                    <div className="flex gap-4">
                        {moods.map((m) => (
                            <button
                                key={m.id}
                                onClick={() => setMood(m.id)}
                                className={`flex-1 py-4 px-2 rounded-3xl transition-all duration-300 flex flex-col items-center gap-2 border-2 ${mood === m.id
                                    ? `border-${m.color.split('-')[1]}-400 ${m.bg} scale-105 shadow-md`
                                    : 'border-transparent hover:bg-rose-50/50'
                                    }`}
                            >
                                <div className={`p-2 rounded-full bg-white/60 ${mood === m.id ? 'shadow-inner' : ''}`}>
                                    <m.icon className={`w-8 h-8 ${m.color}`} />
                                </div>
                                <span className={`text-sm font-bold ${mood === m.id ? 'text-rose-900' : 'text-rose-900/40'}`}>{m.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What's happening in our world today? ✨"
                        className="w-full h-48 bg-rose-50/30 p-6 rounded-3xl text-lg text-rose-900 placeholder:text-rose-300/80 resize-none focus:outline-none focus:ring-2 focus:ring-rose-200 focus:bg-white/50 transition-all font-medium leading-relaxed"
                    />
                </div>

                <div>
                    <label className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-4 block ml-1">Photo Memory</label>

                    {!previewUrl ? (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-rose-200 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-rose-50/50 hover:border-rose-400 transition-all group"
                        >
                            <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Upload className="w-8 h-8 text-rose-400" />
                            </div>
                            <p className="text-rose-900/60 font-medium">Click to upload a photo</p>
                        </div>
                    ) : (
                        <div className="relative rounded-3xl overflow-hidden shadow-lg group">
                            <img src={previewUrl} alt="Preview" className="w-full h-64 object-cover" />
                            <button
                                onClick={() => setPreviewUrl('')}
                                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                </div>

                <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full py-6 text-lg rounded-2xl shadow-rose-300/50 shadow-lg hover:shadow-rose-400/50 transition-all"
                >
                    {isSubmitting ? 'Saving...' : (editId ? 'Update Memory' : 'Save to Journal ❤️')}
                </Button>
            </GlassCard>
        </div>
    );
}

export default function WritePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100 pb-24">
            <Suspense fallback={<div>Loading...</div>}>
                <WriteContent />
            </Suspense>
        </div>
    );
}
