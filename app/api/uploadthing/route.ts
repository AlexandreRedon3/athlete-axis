import { createRouteHandler } from "uploadthing/next";

import { safeConfig } from "@/lib";

import { ourFileRouter } from "./core";

export const { GET, POST} = createRouteHandler({
    router: ourFileRouter,
    config: {
        token: safeConfig.UPLOADTHING_TOKEN,
    },
});