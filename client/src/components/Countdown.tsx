"use client";
import { GlassCard } from "@/components/ui/GlassCard";
import { differenceInDays, differenceInHours, differenceInMinutes, format } from "date-fns";
import { useState, useEffect } from "react";
import { CalendarHeart, Pencil, X, Save } from "lucide-react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export function Countdown({ targetDate, onUpdate }: { targetDate?: string | null, onUpdate: () => void }) {
    const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, minutes: number }>({ days: 0, hours: 0, minutes: 0 });
    const [isEditing, setIsEditing] = useState(false);

    // Edit State
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedTime, setSelectedTime] = useState('12:00');

    useEffect(() => {
        if (!targetDate) {
            setTimeLeft({ days: 0, hours: 0, minutes: 0 });
            return;
        }

        const calculate = () => {
            const target = new Date(targetDate);
            const now = new Date();

            if (target <= now) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0 });
                return;
            }

            const days = differenceInDays(target, now);
            const hours = differenceInHours(target, now) % 24;
            const minutes = differenceInMinutes(target, now) % 60;

            setTimeLeft({ days, hours, minutes });
        };

        calculate();
        const timer = setInterval(calculate, 60000);
        return () => clearInterval(timer);
    }, [targetDate]);

    // Initialize edit state when opening
    useEffect(() => {
        if (isEditing) {
            if (targetDate) {
                const d = new Date(targetDate);
                setSelectedDate(d);
                setSelectedTime(format(d, 'HH:mm'));
            } else {
                setSelectedDate(new Date());
                setSelectedTime('12:00');
            }
        }
    }, [isEditing, targetDate]);

    const handleSave = async () => {
        try {
            // Combine Date and Time
            const [hours, minutes] = selectedTime.split(':').map(Number);
            const finalDate = new Date(selectedDate);
            finalDate.setHours(hours);
            finalDate.setMinutes(minutes);

            const { apiFetch } = await import('@/lib/api');
            await apiFetch('/couple', {
                method: 'PATCH',
                body: JSON.stringify({ nextMeetingDate: finalDate.toISOString() })
            });

            onUpdate();
            setIsEditing(false);
        } catch (e) {
            console.error("Failed to update date", e);
        }
    };

    return (
        <GlassCard className="text-center py-8 relative group" gradient>
            {/* Styles for Calendar */}
            <style>{`
                .react-calendar { 
                    width: 100%; border: none; background: transparent; font-family: inherit; 
                }
                .react-calendar__tile {
                    padding: 0.75rem 0.5rem;
                    border-radius: 8px;
                    font-size: 0.8rem;
                }
                .react-calendar__tile--active {
                    background: #f43f5e !important;
                    color: white !important;
                }
                .react-calendar__tile--now {
                    background: #fff1f2;
                    color: #f43f5e;
                }
                .custom-calendar-popup {
                    animation: fadeIn 0.2s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>

            {/* Edit Trigger */}
            <button
                onClick={() => setIsEditing(true)}
                className="absolute top-2 right-2 p-2 opacity-50 hover:opacity-100 transition-opacity text-rose-800 hover:text-rose-600 z-10"
            >
                <Pencil className="w-4 h-4" />
            </button>

            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm" onClick={() => setIsEditing(false)}>
                    <div
                        className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-sm custom-calendar-popup relative"
                        onClick={e => e.stopPropagation()}
                    >
                        <button onClick={() => setIsEditing(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                        </button>

                        <h3 className="text-lg font-bold text-rose-900 mb-4 font-heading text-left">Set Next Date ❤️</h3>

                        <div className="bg-rose-50/50 rounded-2xl p-2 mb-4">
                            <Calendar
                                onChange={(d) => setSelectedDate(d as Date)}
                                value={selectedDate}
                                minDate={new Date()}
                                view="month"
                                prev2Label={null}
                                next2Label={null}
                            />
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <label className="text-sm font-bold text-rose-800">Time:</label>
                            <input
                                type="time"
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                className="flex-1 p-2 rounded-xl bg-gray-100 border-none outline-none focus:ring-2 focus:ring-rose-300 font-bold text-rose-900"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleSave}
                                className="flex-1 py-3 bg-rose-500 text-white rounded-xl font-bold shadow-lg shadow-rose-200 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                            >
                                <Save className="w-4 h-4" /> Save Date
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {!targetDate ? (
                <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => setIsEditing(true)}>
                    <div className="bg-white/50 p-3 rounded-full animate-bounce">
                        <CalendarHeart className="w-8 h-8 text-rose-500" />
                    </div>
                    <p className="font-hand text-xl text-rose-900 font-bold">Plan our next date! ❤️</p>
                    <p className="text-xs text-rose-500/60 uppercase tracking-widest font-bold">Tap to schedule</p>
                </div>
            ) : (
                <>
                    <div className="flex justify-center mb-4">
                        <div className="bg-white/50 p-3 rounded-full shadow-inner">
                            <CalendarHeart className="w-8 h-8 text-rose-500" />
                        </div>
                    </div>
                    <h2 className="text-lg font-medium text-rose-800/80 mb-2">Next Meeting In</h2>
                    <div className="flex justify-center items-end gap-3 font-hand text-rose-900">
                        <div className="flex flex-col">
                            <span className="text-4xl md:text-5xl font-bold leading-none">{timeLeft.days}</span>
                            <span className="text-xs font-sans pt-1 opacity-70 font-bold uppercase tracking-wider">Days</span>
                        </div>
                        <span className="text-3xl font-bold mb-3 text-rose-400">:</span>
                        <div className="flex flex-col">
                            <span className="text-4xl md:text-5xl font-bold leading-none">{timeLeft.hours}</span>
                            <span className="text-xs font-sans pt-1 opacity-70 font-bold uppercase tracking-wider">Hrs</span>
                        </div>
                        <span className="text-3xl font-bold mb-3 text-rose-400">:</span>
                        <div className="flex flex-col">
                            <span className="text-4xl md:text-5xl font-bold leading-none">{timeLeft.minutes}</span>
                            <span className="text-xs font-sans pt-1 opacity-70 font-bold uppercase tracking-wider">Mins</span>
                        </div>
                    </div>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-rose-400">Can't Wait</p>
                </>
            )}
        </GlassCard>
    );
}
