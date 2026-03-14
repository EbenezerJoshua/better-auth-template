"use client"

import { BetterAuthActionButton } from "@/components/auth/better-auth-action-button"
import { authClient } from "@/lib/auth/auth-client"

export function PasskeyButton() {
  const { refetch } = authClient.useSession()

  return (
    <BetterAuthActionButton
      variant="outline"
      className="w-full"
      action={async () => {
        // Force-close the Google One Tap popup so it doesn't collide with the Passkey popup.
        if (typeof window !== "undefined" && (window as any).google?.accounts?.id) {
          (window as any).google.accounts.id.cancel()
        }

        const res = await authClient.signIn.passkey(undefined, {
          onSuccess() {
            refetch()
            window.location.href = "/dashboard"
          },
        }).catch(() => null) // Catch any stray top-level promise rejections

        // Catch the AbortError (caused by 1Password/browser cancelling the background autoFill)
        // and return a null error to prevent the UI from showing a failure toast.
        const isAbortError =
          res?.error?.message?.includes("abort signal") ||
          res?.error?.message?.includes("AbortError")

        if (isAbortError) {
          return { error: null }
        }

        return res as any
      }}
    >
      Use Passkey
    </BetterAuthActionButton>
  )
}
