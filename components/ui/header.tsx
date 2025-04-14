"use client";

import React, { useState } from "react";
import { Button } from "./button";
import { useSidebar } from "./sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export const Header = () => {
  const { toggleSidebar } = useSidebar();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="bg-white shadow-sm w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 lg:hidden"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <span className="sr-only">Open sidebar</span>
            </button>

            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <span className="font-bold text-xl text-purple-600">Athlete-Axis</span>
              </Link>
            </div>
          </div>

          {/* Navigation links - desktop */}
          <nav className="hidden md:flex space-x-8">
            <NavLink href="/dashboard" active={pathname === "/dashboard"}>
              Dashboard
            </NavLink>
            <NavLink href="/programs" active={pathname.startsWith("/programs")}>
              Programs
            </NavLink>
            <NavLink href="/schedule" active={pathname.startsWith("/schedule")}>
              Schedule
            </NavLink>
            <NavLink href="/profile" active={pathname.startsWith("/profile")}>
              Profile
            </NavLink>
          </nav>

          {/* User menu */}
          <div className="flex items-center">
            <div className="hidden md:flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="ml-4 relative rounded-full"
                aria-label="User account"
              >
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold">
                  AA
                </div>
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {mobileMenuOpen ? (
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <MobileNavLink href="/dashboard" active={pathname === "/dashboard"}>
              Dashboard
            </MobileNavLink>
            <MobileNavLink href="/programs" active={pathname.startsWith("/programs")}>
              Programs
            </MobileNavLink>
            <MobileNavLink href="/schedule" active={pathname.startsWith("/schedule")}>
              Schedule
            </MobileNavLink>
            <MobileNavLink href="/profile" active={pathname.startsWith("/profile")}>
              Profile
            </MobileNavLink>
          </div>
        </div>
      )}
    </header>
  );
};

interface NavLinkProps {
  href: string;
  active: boolean;
  children: React.ReactNode;
}

const NavLink = ({ href, active, children }: NavLinkProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
        active
          ? "border-purple-500 text-gray-900"
          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
      )}
    >
      {children}
    </Link>
  );
};

const MobileNavLink = ({ href, active, children }: NavLinkProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "block pl-3 pr-4 py-2 border-l-4 text-base font-medium",
        active
          ? "bg-purple-50 border-purple-500 text-purple-700"
          : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
      )}
    >
      {children}
    </Link>
  );
}; 