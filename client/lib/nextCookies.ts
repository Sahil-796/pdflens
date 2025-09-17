import { BetterAuthPlugin, HookEndpointContext, MiddlewareInputContext, MiddlewareOptions } from "better-auth";

export function nextCookies(): BetterAuthPlugin {
    return {
        id: "next-cookies",
        hooks: {
            after: [
                {
                    matcher: (ctx: HookEndpointContext) => true,
                    handler: async (inputContext: MiddlewareInputContext<MiddlewareOptions>) => {
                        // your logic for cookies here
                    },
                },
            ],
        },
    };
}