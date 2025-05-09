"use client";

import React from "react";
import Link from "next/link";
import { cn } from "../../src/lib/utils";

interface LogoProps {
  className?: string;
  textClassName?: string;
  size?: "sm" | "md" | "lg";
  href?: string;
}

export const Logo = ({ 
  className, 
  textClassName,
  size = "md", 
  href = "/" 
}: LogoProps) => {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <Link href={href} className={cn("flex items-center", className)}>
      <div className={cn("flex-shrink-0 flex items-center")}>
        <div className={cn(
          "mr-2 rounded-md bg-purple-100 flex items-center justify-center text-purple-600 overflow-hidden",
          size === "sm" ? "h-6 w-6" : size === "md" ? "h-8 w-8" : "h-10 w-10"
        )}>
          {/* Logo icon - replace with your own icon if available */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={cn(
              size === "sm" ? "h-4 w-4" : size === "md" ? "h-5 w-5" : "h-6 w-6"
            )}
          >
            <path d="M12 22s8-4 8-10V6l-8-4-8 4v6c0 6 8 10 8 10z"></path>
          </svg>
        </div>
        <span className={cn(
          "font-bold text-purple-600", 
          sizeClasses[size],
          textClassName
        )}>
          Athlete-Axis
        </span>
      </div>
    </Link>
  );
}; 