import { BetterAuthPlugin } from "better-auth";

export const polarPlugin = () => {
  return {
    id: "polar-integration",
    schema: {
      user: {
        fields: {
          plan: {
            type: "string",
            required: false,
            defaultValue: "free",
          },
          creditsLeft: {
            type: "number",
            required: false,
            defaultValue: 0,
          },
          polarSubscriptionId: {
            type: "string",
            required: false,
          },
          polarCustomerId: {
            type: "string",
            required: false,
          },
        },
      },
    },
  } satisfies BetterAuthPlugin;
};
