"use client"

import Image from "next/image"
import logo from "@/app/assets/better-auth-logo.png"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { SignInForm } from "@/app/(auth)/login/components/sign-in-form"
import { SignUpForm } from "@/app/(auth)/login/components/sign-up-form"
import { useEffect, useRef } from "react"
import { authClient } from "@/lib/auth/auth-client"

export default function LoginPage() {
  const router = useRouter()

  const isOneTapInitialized = useRef(false)

  useEffect(() => {
    // Check if the user is already authenticated
    const checkAuth = async () => {
      const session = await authClient.getSession();
      if (session?.data != null) {
        router.push('/dashboard');   // If authenticated, redirect to dashboard
      } else {
        // Initialize Google One Tap for unauthenticated users
        if (!isOneTapInitialized.current) {
          isOneTapInitialized.current = true;

          // Next.js dev overlay aggressively captures console.error and displays a full-screen crash.
          // Google's One Tap library logs benign aborts (like canceling the prompt) as console.error.
          // We intercept this specifically to prevent the dev environment from showing error overlays.
          if (typeof window !== "undefined") {
            const originalConsoleError = console.error.bind(console);
            console.error = (...args: any[]) => {
              const msg = args[0];
              if (typeof msg === "string" && msg.includes("[GSI_LOGGER]")) {
                if (msg.includes("AbortError") || msg.includes("NetworkError")) {
                  // Silently swallow
                  return;
                }
              }
              originalConsoleError(...args);
            };
          }

          authClient.oneTap({
            fetchOptions: {
              onSuccess: () => {
                window.location.href = '/dashboard';
              },
            },
          }).catch((err) => {
            // Silently swallow unhandled promise rejections from OneTap 
            // aborting due to competing with Passkeys or fedCM
            console.debug("OneTap initialization aborted or failed quietly:", err);
          });
        }
      }
    };

    checkAuth();
  }, [router])



  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/dashboard" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <Image src={logo} alt="Logo" className="size-4" />
            </div>
            Better-Auth Template
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <Tabs defaultValue="sign-in">
              <TabsList className="w-full mb-10">
                <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
                <TabsTrigger value="sign-in">Sign In</TabsTrigger>
              </TabsList>
              <TabsContent value="sign-up">
                <SignUpForm />
              </TabsContent>
              <TabsContent value="sign-in">
                <SignInForm />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:flex items-center justify-center">
        <Image
          src={logo}
          alt="Image"
          className="w-1/2 dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
