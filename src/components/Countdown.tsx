"use client";
import { GlassCard } from "@/components/ui/GlassCard";
import { differenceInDays, differenceInHours, differenceInMinutes } from "date-fns";
import { useState, useEffect } from "react";
import { CalendarHeart } from "lucide-react";

export function Countdown({ targetDate = "2026-02-14" }: { targetDate?: string }) { // Default to Valentine's Day 2026 for demo
    const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number }>({ days: 0, hours: 0 });

    useEffect(() => {
        const calculate = () => {
            const target = new Date(targetDate);
            const now = new Date();

            const days = differenceInDays(target, now);
            const hours = differenceInHours(target, now) % 24;

            setTimeLeft({ days, hours });
        };

        calculate();
        const timer = setInterval(calculate, 60000); // Update every minute
        return () => clearInterval(timer);
    }, [targetDate]);

    return (
        <GlassCard className="text-center py-8" gradient>
            <div className="flex justify-center mb-4">
                <div className="bg-white/50 p-3 rounded-full">
                    <CalendarHeart className="w-8 h-8 text-rose-500" />
                </div>
            </div>
            <h2 className="text-lg font-medium text-rose-800/80 mb-2">Next Meeting In</h2>
            <div className="flex justify-center items-end gap-2 font-hand text-rose-900">
                <div className="flex flex-col">
                    <span className="text-5xl font-bold leading-none">{timeLeft.days}</span>
                    <span className="text-sm font-sans pt-1 opacity-70">Days</span>
                </div>
                <span className="text-3xl font-bold mb-3">:</span>
                <div className="flex flex-col">
                    <span className="text-5xl font-bold leading-none">{timeLeft.hours}</span>
                    <span className="text-sm font-sans pt-1 opacity-70">Hrs</span>
                </div>
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-rose-400">Can't Wait</p>
        </GlassCard>
    );
}
