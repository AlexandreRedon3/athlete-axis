import { useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";

import { Button } from "../../ui/button";
import { ThemeToggle } from "../../ui/theme-toggle";
import { ClientSwitch } from "../client-switch";
import { HeaderProps, SessionProps } from "./types";

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

                <ThemeToggle />

                {
                    session ? (
                        <div>User Logged In</div>
                    ) : (
                        <div className="flex gap-2">
                            <Button variant="ghost" className="text-sm">
                                Connexion
                            </Button>
                            <Button className="text-sm">
                                {isPro ? "Commencer gratuitement" : "S'inscrire"}
                            </Button>
                        </div>
                    )
                }
        </div>
    )
}