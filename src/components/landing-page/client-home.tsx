"use client"

import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useEffect,useState } from "react";

import { ProLanding } from "./pro-landing";
import { UserLanding } from "./user-landing";

export default function ClientHome() {
    const searchParams = useSearchParams();
    const version = searchParams.get('version') || 'user';
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-[#2F455C]">
                <div className="w-12 h-12 rounded-full border-4 border-[#21D0B2] border-t-transparent animate-spin"></div>
            </div>
        );
    }

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={version}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="min-h-screen w-full"
            >
                {version === 'user' ? <UserLanding /> : <ProLanding />}
            </motion.div>
        </AnimatePresence>
    );
}