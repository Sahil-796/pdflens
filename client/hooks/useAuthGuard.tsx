"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useUser from "./useUser";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>; // Or a nice spinner
  if (!user) return null; // Wait for redirect

  return <>{children}</>;
}
