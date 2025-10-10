import { useUserStore } from "@/app/store/useUserStore";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";

export default function useUser() {
    const { userId, userName, userEmail, userAvatar, userPlan, emailVerified, status, setUser, clearUser } = useUserStore();
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

                    // Fetch authoritative plan and email verification status from DB
                    try {
                        const res = await fetch('/api/getUserDetails', { cache: 'no-store' })
                        if (res.ok) {
                            const { plan, emailVerified } = await res.json()
                            setUser({ 
                                userPlan: plan,
                                emailVerified,
                            })
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
            emailVerified,
            isPro: userPlan === 'premium',
            isAuthenticated: emailVerified,
        },
        loading,
        status,
    };
}