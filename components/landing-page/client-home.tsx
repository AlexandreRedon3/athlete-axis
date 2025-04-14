import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";
import { Header } from "../ui/header";
import { AnimatePresence, motion } from "framer-motion";
import { UserLanding } from "@/components/landing-page/user-landing";
import { ProLanding } from "@/components/landing-page/pro-landing";

export default function ClientHome() {
    
    const searchParams = useSearchParams();
    const version = searchParams.get('version') || 'user';
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return 
    <div className="h-screen w-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
    </div>
    ;
    return (
        <div className="flex flex-col h-screen w-screen relative overflow-hidden">
            { /** Effet gradiant pour le fond de l'application */}
            <div className="absolute inset-0 bg-gradient-radial-br from-primary/50 to-primary/10">
            </div>

            { /** Header de la page */}
            <Header />

            <AnimatePresence mode="wait">
                <motion.main 
                className="flex-1 flex flex-col items-center justify-center"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -100 }}
                transition={{ duration: 0.5 }}
                >
                    {version === 'user' ? <UserLanding /> : <ProLanding />}
                </motion.main>
            </AnimatePresence>


        </div>
    )
}