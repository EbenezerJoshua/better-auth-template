"use client"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth/auth-client"
import { toast } from "sonner"
import { useState } from "react"
import { LoadingSwap } from "@/components/auth/loading-swap"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

export function SetPasswordButton({ email }: { email: string }) {
  const [loading, setLoading] = useState(false)

  async function handleSetPassword() {
    setLoading(true)
    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: window.location.origin + "/reset-password",
    })
    if (error) {
      toast.error(error.message || "Failed to send password set email")
    } else {
      toast.success("Password set email sent")
    }
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle>Set Password</CardTitle>
          <CardDescription>
            We will send you a password setting email to set up a password.
          </CardDescription>
        </div>
        <Button onClick={handleSetPassword} disabled={loading} variant="outline">
          <LoadingSwap isLoading={loading}>Send Email</LoadingSwap>
        </Button>
      </CardHeader>
    </Card>
  )
}