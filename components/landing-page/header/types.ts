export interface HeaderProps {
    isScrolled: boolean;
}

export interface SessionProps {
    session: any;
}

export interface MobileMenuProps {
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (isMobileMenuOpen: boolean) => void;
}

export interface MobileUserMenuProps {
    session: SessionProps;
    setIsMobileMenuOpen: (isMobileMenuOpen: boolean) => void;
}

export interface MobileGuestMenuProps {
    setIsMobileMenuOpen: (isMobileMenuOpen: boolean) => void;
}
