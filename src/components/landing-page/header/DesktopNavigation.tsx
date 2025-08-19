"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";

import { HeaderProps } from "./types";

const baseNavigationItems = [
    { label: "Fonctionnalités", href: "#features" },
    { label: "À propos", href: "/about" },
    { label: "Contact", href: "/contact" },
]

// Le prix sera affiché conditionnellement 
const princingItem = { label: "Prix", href: "#pricing" };

export const DesktopNavigation = ({ isScrolled }: HeaderProps) => {
    const params = useSearchParams();
    const version = params.get("version") || "user";

    const navItem  = [...baseNavigationItems]

    if(version === "pro") {
        navItem.splice(1, 0, princingItem);
    }

    return (
        <nav className={cn(
            "items-center gap-4 transition-all duration-300", 
            isScrolled ? "hidden lg:flex": "hidden lg:flex gap-6")}
            >
                {navItem.map((item) => (
                    <Link key={item.label} href={item.href}>
                        {item.label}
                    </Link>
                ))}
        </nav>
    )
}