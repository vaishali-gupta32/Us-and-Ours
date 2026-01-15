"use client";
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Plus, X, Trash2, ArrowLeft } from 'lucide-react';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface Event {
    _id: string;
    title: string;
    date: string; // YYYY-MM-DD
    type: string;
}

export default function CalendarPage() {
    const router = useRouter();
    const [date, setDate] = useState<Date>(new Date());
    const [events, setEvents] = useState<Event[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newEventTitle, setNewEventTitle] = useState('');

    useEffect(() => {
        fetch('/api/events').then(res => res.json()).then(data => {
            if (data.success) setEvents(data.events);
        });
    }, []);

    const selectedDateStr = format(date, 'yyyy-MM-dd');
    const dayEvents = events.filter(e => e.date === selectedDateStr);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEventTitle.trim()) return;

        const res = await fetch('/api/events', {
            method: 'POST',
            body: JSON.stringify({ title: newEventTitle, date: selectedDateStr })
        });
        const data = await res.json();
        if (data.success) {
            setEvents([...events, data.event]);
            setNewEventTitle('');
            setIsAdding(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this event?')) return;
        setEvents(events.filter(e => e._id !== id));
        await fetch(`/api/events?id=${id}`, { method: 'DELETE' });
    };

    // Custom tile content to show dots
    const tileContent = ({ date, view }: any) => {
        if (view === 'month') {
            const d = format(date, 'yyyy-MM-dd');
            const hasEvent = events.some(e => e.date === d);
            if (hasEvent) {
                return <div className="w-2 h-2 bg-rose-500 rounded-full mx-auto mt-1" />;
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100 pb-24 p-4">
            <header className="flex items-center gap-4 mb-6 max-w-2xl mx-auto">
                <button onClick={() => router.back()} className="p-3 rounded-full bg-white/50 hover:bg-white text-rose-500 transition-all shadow-sm">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-3xl font-hand font-bold text-rose-950">Our Cal 🗓️</h1>
            </header>

            <div className="max-w-2xl mx-auto space-y-6">
                <GlassCard className="p-6 !rounded-3xl">
                    <style>{`
                        .react-calendar { 
                            width: 100%; border: none; background: transparent; font-family: inherit; 
                        }
                        .react-calendar__tile {
                            padding: 1rem 0.5rem;
                            border-radius: 12px;
                        }
                        .react-calendar__tile--active {
                            background: #f43f5e !important;
                            color: white !important;
                        }
                        .react-calendar__tile--now {
                            background: #fff1f2;
                            color: #f43f5e;
                        }
                        .react-calendar__navigation button {
                            font-size: 1.25rem;
                            font-weight: 700;
                            color: #881337;
                        }
                     `}</style>
                    <Calendar
                        onChange={(d) => setDate(d as Date)}
                        value={date}
                        tileContent={tileContent}
                    />
                </GlassCard>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-rose-900">
                            {format(date, 'MMMM d, yyyy')}
                        </h2>
                        <Button
                            onClick={() => setIsAdding(true)}
                            className="bg-rose-100 text-rose-600 shadow-none hover:bg-rose-200 !py-2 !px-4 text-sm"
                        >
                            <Plus className="w-4 h-4 mr-1" /> Add Plan
                        </Button>
                    </div>

                    <AnimatePresence>
                        {isAdding && (
                            <motion.form
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                onSubmit={handleAdd}
                                className="flex gap-2"
                            >
                                <input
                                    autoFocus
                                    value={newEventTitle}
                                    onChange={e => setNewEventTitle(e.target.value)}
                                    placeholder=" Dinner date, Movie night..."
                                    className="flex-1 p-3 rounded-2xl border-none shadow-inner bg-white/60 focus:ring-2 focus:ring-rose-300 outline-none"
                                />
                                <button
                                    type="submit"
                                    className="p-3 bg-rose-500 text-white rounded-2xl shadow-lg shadow-rose-200"
                                >
                                    <Plus className="w-6 h-6" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsAdding(false)}
                                    className="p-3 bg-gray-200 text-gray-500 rounded-2xl"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    <div className="space-y-3">
                        {dayEvents.length === 0 && !isAdding && (
                            <p className="text-center text-rose-900/30 py-4 italic">No plans for this day yet.</p>
                        )}
                        {dayEvents.map(event => (
                            <GlassCard key={event._id} className="items-center flex justify-between p-4">
                                <span className="font-medium text-rose-900">{event.title}</span>
                                <button onClick={() => handleDelete(event._id)} className="text-rose-300 hover:text-red-500">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
