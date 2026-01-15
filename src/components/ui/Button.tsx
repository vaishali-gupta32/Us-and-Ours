"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import React from "react";

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'ghost';
    children: React.ReactNode;
}

export function Button({ variant = 'primary', className, children, ...props }: ButtonProps) {
    const variants = {
        primary: "bg-rose-400 text-white shadow-rose-200 shadow-lg hover:bg-rose-500",
        secondary: "bg-lavender-400 text-white shadow-lavender-200 shadow-lg hover:bg-lavender-500",
        ghost: "bg-transparent text-rose-500 hover:bg-white/30"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
                "px-6 py-3 rounded-full font-medium transition-colors duration-200 flex items-center justify-center gap-2",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </motion.button>
    );
}
