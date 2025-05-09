"use client";

import React from "react";
import { cn } from "../../src/lib/utils";
import { DesktopNavLink } from "./nav-link";
import { usePathname } from "next/navigation";

interface DesktopMenuProps {
  className?: string;
  items: {
    href: string;
    label: string;
  }[];
}

export const DesktopMenu = ({
  className,
  items
}: DesktopMenuProps) => {
  const pathname = usePathname();

  return (
    <div className={cn(
      "hidden md:flex md:space-x-8",
      className
    )}>
      {items.map((item) => (
        <DesktopNavLink 
          key={item.href}
          href={item.href}
          active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
        >
          {item.label}
        </DesktopNavLink>
      ))}
    </div>
  );
}; 