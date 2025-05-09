import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";
import { safeConfig } from "@/lib";

export const { GET, POST} = createRouteHandler({
    router: ourFileRouter,
    config: {
        token: safeConfig.UPLOADTHING_TOKEN,
    },
});