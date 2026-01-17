"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Heart, Lock, Sparkles, KeyRound } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [mode, setMode] = useState<'create' | 'join'>('create'); // For signup

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        secretCode: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { apiFetch } = await import('@/lib/api');
            // Mapped: /api/auth/login -> /auth/login, /api/auth/signup -> /auth/register
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const body = isLogin
                ? { email: formData.email, password: formData.password }
                : { ...formData, action: mode };

            const res = await apiFetch(endpoint, {
                method: 'POST',
                body: JSON.stringify(body),
            });

            console.log('Response received:', res.status, res.statusText);

            // Check content type before parsing
            const contentType = res.headers.get('content-type');
            console.log('Content-Type:', contentType);

            if (!contentType || !contentType.includes('application/json')) {
                const text = await res.text();
                console.error('Non-JSON response:', text.substring(0, 200));
                throw new Error(`Server returned non-JSON response. Status: ${res.status}`);
            }

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Authentication failed');
            }

            // If created a room, maybe show the secret code? 
            // For now, simpler to just redirect to dashboard where we can show it.
            router.push('/dashboard');
            router.refresh();
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-100 via-rose-50 to-white flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-rose-950 font-heading mb-2">
                        Us and Ours
                    </h1>
                    <p className="text-rose-800/60 font-medium">A private space for just the two of us.</p>
                </div>

                <GlassCard className="p-8 shadow-2xl shadow-rose-200/50 !bg-white/60 !backdrop-blur-xl">
                    {/* Toggle Login/Signup */}
                    <div className="flex bg-white/50 rounded-full p-1 mb-8 shadow-inner">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2 rounded-full font-bold text-sm transition-all ${isLogin ? 'bg-rose-500 text-white shadow-lg' : 'text-rose-900/50 hover:text-rose-900'}`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2 rounded-full font-bold text-sm transition-all ${!isLogin ? 'bg-rose-500 text-white shadow-lg' : 'text-rose-900/50 hover:text-rose-900'}`}
                        >
                            Signup
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.form
                            key={isLogin ? 'login' : 'signup'}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            {error && (
                                <div className="bg-red-50 text-red-500 text-sm p-3 rounded-xl border border-red-100 text-center font-bold">
                                    {error}
                                </div>
                            )}

                            {!isLogin && (
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <button
                                        type="button"
                                        onClick={() => setMode('create')}
                                        className={`p-3 rounded-2xl border-2 text-center text-xs font-bold transition-all ${mode === 'create' ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-transparent bg-white/50 text-rose-900/50'}`}
                                    >
                                        <Sparkles className="w-6 h-6 mx-auto mb-2" />
                                        Create Room
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setMode('join')}
                                        className={`p-3 rounded-2xl border-2 text-center text-xs font-bold transition-all ${mode === 'join' ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-transparent bg-white/50 text-rose-900/50'}`}
                                    >
                                        <KeyRound className="w-6 h-6 mx-auto mb-2" />
                                        Join Room
                                    </button>
                                </div>
                            )}

                            {!isLogin && (
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full p-4 rounded-xl bg-white/70 border-none focus:ring-2 focus:ring-rose-400 outline-none placeholder:text-rose-900/30 font-medium"
                                    required
                                />
                            )}

                            <input
                                type="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full p-4 rounded-xl bg-white/70 border-none focus:ring-2 focus:ring-rose-400 outline-none placeholder:text-rose-900/30 font-medium"
                                required
                            />

                            <input
                                type="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full p-4 rounded-xl bg-white/70 border-none focus:ring-2 focus:ring-rose-400 outline-none placeholder:text-rose-900/30 font-medium"
                                required
                            />

                            {!isLogin && mode === 'join' && (
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
                                    <input
                                        type="text"
                                        placeholder="Enter Secret Code (e.g. A1B2)"
                                        value={formData.secretCode}
                                        onChange={(e) => setFormData({ ...formData, secretCode: e.target.value })}
                                        className="w-full p-4 pl-12 rounded-xl bg-white/70 border-2 border-indigo-100 focus:border-indigo-400 outline-none placeholder:text-indigo-900/30 font-bold text-indigo-900 tracking-widest uppercase"
                                        required
                                    />
                                </div>
                            )}

                            {!isLogin && mode === 'create' && (
                                <p className="text-center text-xs text-rose-500 font-bold bg-rose-50 p-2 rounded-lg">
                                    We'll generate a secret code for your partner to join after you signup!
                                </p>
                            )}

                            <Button className="w-full py-4 text-lg shadow-xl shadow-rose-300/40" disabled={loading}>
                                {loading ? 'Wait...' : (isLogin ? 'Enter Journal' : (mode === 'create' ? 'Create Private Space' : 'Join Partner'))}
                            </Button>
                        </motion.form>
                    </AnimatePresence>
                </GlassCard>
            </motion.div>
        </div>
    );
}
