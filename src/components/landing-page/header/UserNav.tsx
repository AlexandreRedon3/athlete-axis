import { Button } from "../../ui/button";
import { LogoutButton } from "../../ui/logout-button";
import React from 'react';

export const UserNav = () => {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm">
        Dashboard
      </Button>
      <LogoutButton />
    </div>
  );
}; 