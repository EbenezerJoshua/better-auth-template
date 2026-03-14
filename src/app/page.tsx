"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";

export default function Home() {

  const handleClick = () => {
    window.location.href = "/login";
  };

    const router = useRouter()
  
    useEffect(() => {
      const checkAuth = async () => {
        const session = await authClient.getSession();
        if (session?.data != null) {
          router.push('/dashboard');
        }
      };
      checkAuth();
    }, [router])
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Button variant="outline" onClick={handleClick}>Login</Button>
    </div>
  );
}
