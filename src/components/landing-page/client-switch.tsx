import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useState } from "react";

// import { UserAvatar } from "../ui/user-avatar"; // Component not found
import { cn } from "@/lib/utils";

export const ClientSwitch = (
   { isMobileMenuOpen,
    setIsMobileMenuOpen} : {
        isMobileMenuOpen?: boolean,
        setIsMobileMenuOpen?: (open: boolean) => void
    }
) => {

    const params = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const currentVersion = params.get("version") || "user";
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const buttonRefs = useRef<Array<HTMLButtonElement>>([]);
    const [activeWidth, setActiveWidth] = useState(0);
    const [activeLeft, setActiveLeft] = useState(0);

    useEffect(() => {
        const index = currentVersion === "user" ? 0 : 1;
        const activeButton = buttonRefs.current[index];

        if(activeButton) {
            setActiveWidth(activeButton.offsetWidth);
            setActiveLeft(activeButton.offsetLeft);
        }
    }, [currentVersion]);

    const handleSwitch = (version: string) => {
        const params = new URLSearchParams(window.location.search);
        params.set("version", version);
        router.push(`${pathname}?${params.toString()}`);
        setDropdownOpen(false);

        if(isMobileMenuOpen) {
            setIsMobileMenuOpen?.(false);
        }  
    }

    // Version desktop
    return (
        <div className="relative inline-flex p-1 rounded-full bg-muted/50 backdrop-blur-sm border border-border">
      <div className="relative flex">
        {["user", "pro"].map((version, index) => {
          const isActive = currentVersion === version;

          return (
            <button
              key={version}
              ref={el => {
                if(el) {
                    buttonRefs.current[index] = el;
                }
              }}
              onClick={() => handleSwitch(version)}
              className={cn(
                "relative flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium z-10",
                isActive
                  ? "text-background"
                  : "text-foreground/70 hover:text-foreground",
              )}
            >
              <span className="relative flex items-center gap-1.5">
                {version === "user" ? (
                  <>
                    <div className="w-3.5 h-3.5 rounded-full bg-gray-400" />
                    <span>Propriétaires</span>
                  </>
                ) : (
                  <>
                    <div className="w-3.5 h-3.5 rounded-full bg-gray-400" />
                    <span>Professionnels</span>
                  </>
                )}
              </span>
            </button>
          );
        })}
        <motion.div
          layout
          className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-primary to-secondary"
          initial={false}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
            duration: 0.2
          }}
          animate={{
            width: activeWidth,
            left: activeLeft
          }}
        />
      </div>
    </div>
    )
}