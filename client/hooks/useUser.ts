import { useUserStore } from "@/app/store/useUserStore";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";

export default function useUser() {
    const { userId, userName, userEmail, userAvatar, userPlan, status, setUser, clearUser } = useUserStore();
    const [loading, setLoading] = useState(status === "loading");

    useEffect(() => {
        const fetchUser = async () => {
            if (status !== "loading") return;

            try {
                setLoading(true);
                const {data: session} = await authClient.getSession();

                if (session?.user) {
                    setUser({
                        userId: session.user.id,
                        userName: session.user.name,
                        userEmail: session.user.email,
                        userAvatar: session.user.image,
                    });

                    // Fetch authoritative plan from DB
                    try {
                        const res = await fetch('/api/getPlan', { cache: 'no-store' })
                        if (res.ok) {
                            const { plan } = await res.json()
                            if (plan) setUser({ userPlan: plan })
                        }
                    } catch {}
                } else {
                    clearUser();
                }
            } catch (error) {
                console.error("Failed to fetch user:", error);
                clearUser();
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [status, setUser, clearUser]);

    return {
        user: {
            id: userId,
            name: userName,
            email: userEmail,
            avatar: userAvatar,
            plan: userPlan,
        },
        loading,
        status,
        isAuthenticated: status === "authenticated",
        isPro: userPlan === 'premium'
    };
}