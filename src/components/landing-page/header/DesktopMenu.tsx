import { useSearchParams } from "next/navigation";
import { HeaderProps, SessionProps } from "./types";
import { cn } from "@/lib/utils";
import { Button } from "../../ui/button";

export const DesktopMenu = ({
    isScrolled,
    session,
} : HeaderProps & SessionProps) => {
    const params = useSearchParams();
    const isPro =  params.get("version") === "pro";

    return (
        <div className={cn(
            "items-center transition-all duration-300", 
            isScrolled ? "hidden lg:flex gap-3" : "hidden lg:flex gap-4")}
            >
                <ClientSwitch />

                <ModeToggle />

                {
                    session ? (
                        <UserNav />
                    ) : (

                    )
                }
        </div>
    )
}