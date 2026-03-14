import { createAuthClient } from "better-auth/react"
import { twoFactorClient, oneTapClient } from "better-auth/client/plugins"
import { passkeyClient } from "@better-auth/passkey/client"

export const authClient = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
    plugins: [
        passkeyClient(),
        oneTapClient({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        }),
        twoFactorClient({
            onTwoFactorRedirect: () => {
                window.location.href = "/2fa"
            },
        }),
    ]
}) 