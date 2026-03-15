"use client"

import { BetterAuthActionButton } from "@/components/auth/better-auth-action-button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { authClient } from "@/lib/auth/auth-client"
import { Session } from "better-auth"
import { Monitor, Smartphone, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { UAParser } from "ua-parser-js"

export function SessionManagement({
  sessions,
  currentSessionToken,
}: {
  sessions: Session[]
  currentSessionToken: string
}) {
  const router = useRouter()

  const otherSessions = sessions.filter(s => s.token !== currentSessionToken)
  const currentSession = sessions.find(s => s.token === currentSessionToken)

  function revokeOtherSessions() {
    return authClient.revokeOtherSessions(undefined, {
      onSuccess: () => {
        router.refresh()
      },
    })
  }

  function handleSignOut() {
    return authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login")
        }
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Current Session</h3>
        {currentSession && (
          <SessionCard session={currentSession} isCurrentSession onSignOut={handleSignOut} />
        )}
      </div>

      {otherSessions.length > 0 && (
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Other Active Sessions</h3>
          </div>

          <div className="space-y-3">
            {otherSessions.map(session => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>

          <div className="bg-destructive/5 text-destructive rounded-xl p-4 border border-destructive/20 flex flex-col gap-2 items-start sm:flex-row sm:items-center justify-between mt-6">
            <div className="space-y-1">
              <p className="font-semibold text-sm">Security check</p>
              <p className="text-sm opacity-90 max-w-sm">If you see a session you don't recognize or trust, log out of all unauthorized devices immediately to protect your account.</p>
            </div>
            <BetterAuthActionButton
              variant="destructive"
              size="sm"
              action={revokeOtherSessions}
              className="w-full sm:w-auto mt-2 sm:mt-0 shadow-sm"
            >
              Revoke all sessions
            </BetterAuthActionButton>
          </div>
        </div>
      )}
    </div>
  )
}

function SessionCard({
  session,
  isCurrentSession = false,
  onSignOut,
}: {
  session: Session
  isCurrentSession?: boolean
  onSignOut?: () => Promise<any>
}) {
  const router = useRouter()
  const userAgentInfo = session.userAgent ? UAParser(session.userAgent) : null

  function getBrowserInformation() {
    if (userAgentInfo == null) return "Unknown Device"
    if (userAgentInfo.browser.name == null && userAgentInfo.os.name == null) {
      return "Unknown Device"
    }

    if (userAgentInfo.browser.name == null) return userAgentInfo.os.name
    if (userAgentInfo.os.name == null) return userAgentInfo.browser.name

    return `${userAgentInfo.browser.name}, ${userAgentInfo.os.name}`
  }

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date))
  }

  function revokeSession() {
    return authClient.revokeSession(
      {
        token: session.token,
      },
      {
        onSuccess: () => {
          router.refresh()
        },
      }
    )
  }

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isCurrentSession ? "border-green-500/50 bg-green-500/5" : "border-border bg-card"}`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-full ${isCurrentSession ? 'bg-green-500/10 text-green-600' : 'bg-secondary text-muted-foreground'}`}>
          {userAgentInfo?.device.type === "mobile" ? <Smartphone className="size-5" /> : <Monitor className="size-5" />}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium text-foreground">
              {getBrowserInformation()}
            </p>

            {isCurrentSession && (
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold text-green-700 bg-green-100 rounded-full dark:bg-green-900/30 dark:text-green-400">
                This Session
              </span>
            )}
          </div>
          <div className="text-sm text-muted-foreground flex flex-col gap-0.5 mt-0.5">
            <p>Signed in: {formatDate(session.createdAt)}</p>
            <p>Expires: {formatDate(session.expiresAt)}</p>
          </div>
        </div>
      </div>

      {isCurrentSession ? (
        <BetterAuthActionButton
          variant="outline"
          size="sm"
          action={onSignOut || (() => Promise.resolve())}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Sign Out
        </BetterAuthActionButton>
      ) : (
        <BetterAuthActionButton
          variant="ghost"
          size="sm"
          action={revokeSession}
          successMessage="Session revoked"
          className="text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          title="Log out from this device"
        >
          <Trash2 className="size-4" />
        </BetterAuthActionButton>
      )}
    </div>
  )
}