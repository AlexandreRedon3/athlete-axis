import { useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";

import { Button } from "../../ui/button";
import { ThemeToggle } from "../../ui/theme-toggle";

import { HeaderProps, SessionProps } from "./types";
import { UserNav } from "./UserNav";
import React from 'react';

export const DesktopMenu = ({
    isScrolled,
    session,
} : HeaderProps & SessionProps) => {
    const params = useSearchParams();
    const isPro =  params.get("version") === "pro";

    return (
        <div className={cn(
            "items-center transition-all duration-300", 
            isScrolled ? "hidden lg:flex gap-3" : "hidden lg:flex gap-4")}
            >
                <ThemeToggle />

                {
                    session ? (
                        <UserNav />
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                                Se connecter
                            </Button>
                            <Button size="sm">
                                S'inscrire
                            </Button>
                        </div>
                    )
                }
        </div>
    )
}