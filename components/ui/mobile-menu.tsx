"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { cn } from "../../src/lib/utils";
import { MobileNavLink } from "./nav-link";
import { Sheet, SheetContent, SheetTrigger } from "./sheet";
import { Button } from "./button";
import { Menu } from "lucide-react";

interface MobileMenuProps {
  className?: string;
  items: {
    href: string;
    label: string;
  }[];
}

export function MobileMenu({ className, items }: MobileMenuProps) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("md:hidden", className)}
          aria-label="Open mobile menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <nav className="grid gap-2 py-6">
          {items.map((item) => (
            <MobileNavLink
              key={item.href}
              href={item.href}
              active={pathname === item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </MobileNavLink>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
} 