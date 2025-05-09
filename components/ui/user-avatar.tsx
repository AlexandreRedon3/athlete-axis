"use client";

import React from "react";
import { cn } from "../../src/lib/utils";
import { Button } from "./button";

interface UserAvatarProps {
  user?: {
    name?: string;
    image?: string;
    email?: string;
  };
  size?: "sm" | "md" | "lg";
  className?: string;
  showStatus?: boolean;
  isOnline?: boolean;
  onClick?: () => void;
}

export const UserAvatar = ({
  user,
  size = "md",
  className,
  showStatus = false,
  isOnline = false,
  onClick,
}: UserAvatarProps) => {
  // Calcule les initiales à partir du nom
  const getInitials = () => {
    if (!user?.name) return "AA"; // Default pour Athlete-Axis
    
    const names = user.name.split(" ");
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("p-0 relative rounded-full", className)}
      aria-label="User account"
      onClick={onClick}
    >
      <div className={cn(
        "rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold",
        sizeClasses[size]
      )}>
        {user?.image ? (
          <img 
            src={user.image} 
            alt={user.name || "User"} 
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          getInitials()
        )}
      </div>
      
      {showStatus && (
        <span className={cn(
          "absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white",
          isOnline ? "bg-green-400" : "bg-gray-300"
        )} />
      )}
    </Button>
  );
}; 