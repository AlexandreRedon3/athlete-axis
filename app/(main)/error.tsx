"use client";

import React from "react";
import { useTranslations } from "next-intl";

const LandingPageError = () => {
    const dictionnary = useTranslations("landingPage");
    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center">
            <p className="text-2xl font-semibold tracking-tight">
        {dictionnary("error")}
      </p>
    </div>
  );
};

export default LandingPageError;