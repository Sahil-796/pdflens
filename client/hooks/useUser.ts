import { authClient } from "@/lib/auth-client";
import { userKeys } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";

interface DetailsProps {
  plan: string;
  emailVerified: boolean;
  creditsLeft: number;
  providerId: string;
}

export default function useUser() {
  const { data: user, isLoading: loading } = useQuery({
    queryKey: userKeys.profile(),
    queryFn: async () => {
      const { data: session } = await authClient.getSession();
      if (!session?.user) {
        return null;
      }

      const [creditHistoryRes, detailsRes] = await Promise.all([
        fetch("/api/getCreditHistory"),
        fetch("/api/getUserDetails", { cache: "no-store" }),
      ]);

      const creditsHistory = creditHistoryRes.ok
        ? await creditHistoryRes.json()
        : [];

      let details: Partial<DetailsProps> = {};

      if (detailsRes.ok) {
        details = await detailsRes.json();
      }

      return {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        avatar: session.user.image,
        plan: details.plan || "free",
        emailVerified: details.emailVerified ?? false,
        creditsLeft: details.creditsLeft ?? 0,
        providerId: details.providerId ?? "",
        creditsHistory,
      };
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    user: user
      ? {
          ...user,
          isCreator: user.plan === "creator",
          isAuthenticated: !!user.id,
          userProvider: user.providerId,
        }
      : null,
    loading,
  };
}
