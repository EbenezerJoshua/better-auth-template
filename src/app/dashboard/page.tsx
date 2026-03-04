"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SessionManager } from "./components/session-manager";

export default function DashboardPage() {

    const { data: session, isPending: loading } = authClient.useSession();
    const router = useRouter();

    useEffect(() => {
        // Poll every 15 seconds to see if the session is still valid
        // 15 seconds is a much better balance for server load than 5 seconds.
        const interval = setInterval(async () => {
            const { data, error } = await authClient.getSession();
            if (error || !data) {
                router.push("/auth/login");
            }
        }, 15000); // 15 seconds

        // Add event listener for window focus to check immediately when coming back
        const handleFocus = async () => {
            const { data, error } = await authClient.getSession();
            if (error || !data) {
                router.push("/auth/login");
            }
        };
        window.addEventListener("focus", handleFocus);

        return () => {
            clearInterval(interval);
            window.removeEventListener("focus", handleFocus);
        };
    }, [router]);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!session && !loading) {
            router.push("/auth/login");
        }
    }, [session, loading, router]);

    // Show nothing while redirecting
    if (!session && !loading) {
        return null;
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    const handleSignOut = async () => {
        await authClient.signOut();
        router.push("/auth/login");
    }

    return (
        <div className="text-center mt-20">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p>Welcome to your dashboard!</p>
            {session ? (
                <div className="mt-4">
                    <p className="mb-2">You are logged in as: <strong>{session.user.name}</strong></p>
                    <Button variant="destructive" onClick={handleSignOut}>Sign Out</Button>
                </div>
            ) : null}
            <h2 className="mt-8">Here are your Sessions of your account</h2>
            <SessionManager />
        </div>
    );
}

