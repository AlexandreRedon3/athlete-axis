import { routing } from "./routing";
import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({requestLocale}) => {
    const localCookie = await cookies();
    const locale = localCookie.get('NEXT_LOCALE')?.value ?? routing.defaultLocale;
    return {
        locale,
        messages: (await import(`../../public/messages/${locale}.json`)).default
    };
})