import { useUserStore } from "@/app/store/useUserStore";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";

export default function useUser() {
  const {
    userId,
    userName,
    userEmail,
    userAvatar,
    userPlan,
    emailVerified,
    setUser,
    clearUser,
    providerId,
    fetched,
  } = useUserStore();

  const [loading, setLoading] = useState(!fetched);

  useEffect(() => {
    // ✅ only fetch if not fetched yet
    if (fetched) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        const { data: session } = await authClient.getSession();

        if (session?.user) {
          setUser({
            userId: session.user.id,
            userName: session.user.name,
            userEmail: session.user.email,
            userAvatar: session.user.image,
          });

          try {
            const res = await fetch("/api/getUserDetails", { cache: "no-store" });
            if (res.ok) {
              const { plan, emailVerified, providerId, creditsLeft } = await res.json();
              setUser({
                userPlan: plan,
                emailVerified,
                creditsLeft,
                providerId,
              });
            }
          } catch (err) {
            console.error("Error fetching user details:", err);
          }
        } else {
          clearUser();
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        clearUser();
      } finally {
        // ✅ mark user as fetched
        setUser({ fetched: true });
        setLoading(false);
      }
    };

    fetchUser();
  }, [fetched, setUser, clearUser]);

  return {
    user: {
      id: userId,
      name: userName,
      email: userEmail,
      avatar: userAvatar,
      plan: userPlan,
      emailVerified,
      isPro: userPlan === "premium",
      isAuthenticated: !!userId && emailVerified,
      userProvider: providerId,
    },
    loading,
  };
}
