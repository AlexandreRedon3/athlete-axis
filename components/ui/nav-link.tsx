"use client";

import React from "react";
import Link from "next/link";
import { cn } from "../../src/lib/utils";

interface NavLinkProps {
  href: string;
  active?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const MobileNavLink = ({
  href,
  active,
  children,
  className,
  onClick
}: NavLinkProps) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "block py-3 text-base font-medium transition-colors",
        active 
          ? "text-primary" 
          : "text-muted-foreground hover:text-foreground",
        className
      )}
    >
      {children}
    </Link>
  );
};

export const DesktopNavLink = ({
  href,
  active,
  children,
  className
}: NavLinkProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "relative py-2 text-sm font-medium transition-colors",
        active 
          ? "text-foreground" 
          : "text-muted-foreground hover:text-foreground",
        className
      )}
    >
      {children}
      {active && (
        <span className="absolute -bottom-2 left-0 h-0.5 w-full bg-primary" />
      )}
    </Link>
  );
};

export const UnderlineNavLink = ({ 
  href, 
  active, 
  children, 
  className, 
  onClick 
}: NavLinkProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
        active
          ? "border-purple-500 text-gray-900"
          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
        className
      )}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}; 