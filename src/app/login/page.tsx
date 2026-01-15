"use client";

import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', partnerEmail: '' });
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <GlassCard className="w-full max-w-md p-8 text-center" gradient>
                <div className="flex justify-center mb-6">
                    <div className="bg-rose-100 p-4 rounded-full animate-float">
                        <Heart className="w-8 h-8 text-rose-500 fill-rose-500 animate-pulse" />
                    </div>
                </div>

                <h1 className="text-3xl font-hand font-bold text-rose-900 mb-2">
                    {isLogin ? 'Welcome Back!' : 'Start Your Journey'}
                </h1>
                <p className="text-rose-700/60 mb-8 font-medium">
                    A private space for just us two.
                </p>

                {error && (
                    <div className="mb-4 text-red-500 bg-red-100 p-2 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-rose-700 ml-1 mb-1">Your Name</label>
                            <input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-2xl glass-input"
                                placeholder="What should I call you?"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-rose-700 ml-1 mb-1">Email</label>
                        <input
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-2xl glass-input"
                            placeholder="love@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-rose-700 ml-1 mb-1">Password</label>
                        <input
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-2xl glass-input"
                            placeholder="••••••••"
                        />
                    </div>

                    <Button type="submit" className="w-full mt-4">
                        {isLogin ? 'Enter Our World' : 'Create Space'}
                    </Button>
                </form>

                <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="mt-6 text-sm text-rose-500 hover:text-rose-700 underline decoration-rose-300"
                >
                    {isLogin ? "No account yet? Create one" : "Already have a space? Login"}
                </button>
            </GlassCard>
        </div>
    );
}
