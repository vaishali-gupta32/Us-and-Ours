"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PenTool, LayoutGrid, Calendar, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function Navbar() {
    const pathname = usePathname();

    const links = [
        { href: '/dashboard', icon: Home, label: 'Home' },
        { href: '/write', icon: PenTool, label: 'Journal' },
        { href: '/gallery', icon: LayoutGrid, label: 'Gallery' },
        { href: '/calendar', icon: Calendar, label: 'Schedules' },
    ];

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <motion.nav
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="glass-card flex items-center gap-2 p-2 rounded-full shadow-2xl shadow-rose-200/50"
            >
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link key={link.href} href={link.href}>
                            <div
                                className={cn(
                                    "flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-300",
                                    isActive ? "bg-rose-400 text-white shadow-lg" : "text-rose-400 hover:bg-rose-100"
                                )}
                            >
                                <link.icon className="w-5 h-5" />
                            </div>
                        </Link>
                    );
                })}

                <div className="w-px h-8 bg-rose-200 mx-2" />

                <button
                    onClick={() => {
                        document.cookie = 'token=; Max-Age=0; path=/;';
                        window.location.href = '/login';
                    }}
                    className="flex flex-col items-center justify-center w-12 h-12 rounded-full text-rose-400 hover:bg-red-50 hover:text-red-400 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </motion.nav>
        </div>
    );
}
