"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useUser from "./useUser";
import LumaSpin from "@/components/21st/LumaSpin";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading)
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <LumaSpin />
      </div>
    );
  if (!user) return null;

  return <>{children}</>;
}
