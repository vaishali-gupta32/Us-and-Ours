"use client";
import React, { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';

export default function GalleryPage() {
    const [images, setImages] = useState<{ url: string, id: string, caption: string }[]>([]);

    useEffect(() => {
        import('@/lib/api').then(({ apiFetch }) => {
            apiFetch('/posts').then(res => res.json()).then(data => {
                if (data.posts) {
                    // Extract images from posts
                    const imgs: any[] = [];
                    data.posts.forEach((post: any) => {
                        if (post.images && post.images.length > 0) {
                            post.images.forEach((img: string) => {
                                imgs.push({ url: img, id: post._id, caption: post.content.substring(0, 20) + '...' });
                            });
                        }
                    });
                    setImages(imgs);
                }
            });
        });
    }, []);

    return (
        <div className="p-4 pb-24 max-w-2xl mx-auto">
            <h1 className="text-3xl font-hand font-bold text-rose-900 mb-6 text-center">Our Gallery 📸</h1>

            {images.length === 0 ? (
                <div className="text-center py-20 text-rose-400/60">
                    No photos yet! Paste some image links in your journal entries.
                </div>
            ) : (
                <div className="columns-2 gap-4 space-y-4">
                    {images.map((img, idx) => (
                        <div key={idx} className="break-inside-avoid">
                            <GlassCard className="p-3 !rounded-sm rotate-1 hover:rotate-0 transition-transform duration-300">
                                <img src={img.url} className="w-full rounded-sm aspect-auto bg-gray-100" />
                                <p className="mt-3 font-hand text-center text-rose-900/80 text-sm">{img.caption}</p>
                            </GlassCard>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
