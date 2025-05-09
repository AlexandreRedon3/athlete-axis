"use client";

import React from "react";
import { cn } from "../../src/lib/utils";

interface HamburgerMenuProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
  ariaLabel?: string;
}

export const HamburgerMenu = ({
  isOpen,
  onClick,
  className,
  ariaLabel = "Toggle menu"
}: HamburgerMenuProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-2 rounded-md text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500",
        className
      )}
      aria-label={ariaLabel}
      aria-expanded={isOpen}
    >
      {isOpen ? (
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
  );
}; 