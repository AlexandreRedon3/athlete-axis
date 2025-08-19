import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  src?: string;
  alt?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const UserAvatar = ({ src, alt, className, size = "md" }: UserAvatarProps) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12"
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt || "Avatar utilisateur"}
        className={cn(
          "rounded-full object-cover border-2 border-border",
          sizeClasses[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-muted flex items-center justify-center border-2 border-border",
        sizeClasses[size],
        className
      )}
    >
      <User className="h-1/2 w-1/2 text-muted-foreground" />
    </div>
  );
}; 