"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface SidebarContextType {
  isOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

interface SidebarProviderProps {
  children: ReactNode;
  defaultOpen?: boolean;
}

export function SidebarProvider({ 
  children, 
  defaultOpen = false 
}: SidebarProviderProps) {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);

  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    document.cookie = `sidebar:state=${String(newState)}; path=/; max-age=31536000`;
  };

  const closeSidebar = () => {
    setIsOpen(false);
    document.cookie = "sidebar:state=false; path=/; max-age=31536000";
  };

  const openSidebar = () => {
    setIsOpen(true);
    document.cookie = "sidebar:state=true; path=/; max-age=31536000";
  };

  return (
    <SidebarContext.Provider
      value={{ isOpen, toggleSidebar, closeSidebar, openSidebar }}
    >
      {children}
    </SidebarContext.Provider>
  );
} 