import { motion } from 'framer-motion';
import { GlassCard } from './ui/GlassCard';
import { Heart, Plane, Home, Star, Camera, Diamond } from 'lucide-react';

interface TimelineNodeProps {
    moment: any;
    index: number;
    isLast: boolean;
}

const icons = {
    heart: Heart,
    ring: Diamond,
    plane: Plane,
    home: Home,
    star: Star,
    camera: Camera
};

export function TimelineNode({ moment, index, isLast }: TimelineNodeProps) {
    const isEven = index % 2 === 0;
    const Icon = icons[moment.iconType as keyof typeof icons] || Heart;

    return (
        <div className={`relative flex items-center justify-between md:justify-center ${isEven ? 'flex-row-reverse' : ''} w-full mb-8`}>
            {/* The Line */}
            <div className="absolute left-4 md:left-1/2 w-0.5 h-full bg-gradient-to-b from-rose-300 to-rose-100 -translate-x-1/2 z-0" />

            {/* Empty Space for Desktop Alternate Layout */}
            <div className="hidden md:block w-5/12" />

            {/* The Node Marker */}
            <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10 bg-rose-500 p-2 rounded-full border-4 border-white shadow-lg"
            >
                <Icon className="w-4 h-4 text-white" />
            </motion.div>

            {/* The Content Card */}
            <motion.div
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`w-[calc(100%-3rem)] md:w-5/12 ml-12 md:ml-0 ${isEven ? 'md:mr-auto md:text-right' : 'md:ml-auto md:text-left'}`}
            >
                <GlassCard className="p-4 hover:scale-[1.02] transition-transform duration-300">
                    <span className="text-xs font-bold text-rose-400 uppercase tracking-widest block mb-1">
                        {new Date(moment.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                    <h3 className="text-xl font-bold text-rose-900 mb-2 font-heading">{moment.title}</h3>

                    {moment.image && (
                        <div className="mb-3 rounded-lg overflow-hidden shadow-sm">
                            <img src={moment.image} alt={moment.title} className="w-full h-48 object-cover hover:scale-110 transition-transform duration-700" />
                        </div>
                    )}

                    {moment.description && (
                        <p className="text-rose-950/70 text-sm leading-relaxed">{moment.description}</p>
                    )}
                </GlassCard>
            </motion.div>
        </div>
    );
}
