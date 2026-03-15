"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { LoadingSwap } from "@/components/auth/loading-swap"
import { authClient } from "@/lib/auth/auth-client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { PasswordInput } from "@/components/ui/password-input"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import QRCode from "react-qr-code"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

const twoFactorAuthSchema = z.object({
  password: z.string().min(1),
})

type TwoFactorAuthForm = z.infer<typeof twoFactorAuthSchema>
type TwoFactorData = {
  totpURI: string
  backupCodes: string[]
}

export function TwoFactorAuth({ isEnabled }: { isEnabled: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const [twoFactorData, setTwoFactorData] = useState<TwoFactorData | null>(null)
  const router = useRouter()
  const form = useForm<TwoFactorAuthForm>({
    resolver: zodResolver(twoFactorAuthSchema),
    defaultValues: { password: "" },
  })

  const { isSubmitting } = form.formState

  async function handleDisableTwoFactorAuth(data: TwoFactorAuthForm) {
    await authClient.twoFactor.disable(
      {
        password: data.password,
      },
      {
        onError: error => {
          toast.error(error.error.message || "Failed to disable 2FA")
        },
        onSuccess: () => {
          toast.success("2FA Disabled Successfully")
          form.reset()
          setIsOpen(false)
          router.refresh()
        },
      }
    )
  }

  async function handleEnableTwoFactorAuth(data: TwoFactorAuthForm) {
    const result = await authClient.twoFactor.enable({
      password: data.password,
    })

    if (result.error) {
      toast.error(result.error.message || "Failed to enable 2FA")
    } else {
      setTwoFactorData(result.data)
      form.reset()
    }
  }

  return (
    <div className="space-y-4 pt-4 border-t">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
            <Badge variant={isEnabled ? "default" : "secondary"}>
              {isEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {isEnabled 
              ? "Two factor authentication is currently enabled for this account." 
              : "Enhance your account security by enabling two-factor authentication."}
          </p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open)
          if (!open) {
             setTwoFactorData(null)
             form.reset()
          }
        }}>
          <DialogTrigger asChild>
            <Button variant={isEnabled ? "destructive" : "outline"} className="w-full sm:w-40">
              {isEnabled ? "Disable 2FA" : "Enable 2FA"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEnabled ? "Disable Two-Factor Authentication" : "Enable Two-Factor Authentication"}</DialogTitle>
              <DialogDescription>
                {isEnabled
                  ? "Enter your password to disable 2FA."
                  : "Enter your password to begin the 2FA setup process."}
              </DialogDescription>
            </DialogHeader>

            {twoFactorData != null ? (
              <QRCodeVerify
                {...twoFactorData}
                onDone={() => {
                  setTwoFactorData(null)
                  setIsOpen(false)
                }}
              />
            ) : (
              <Form {...form}>
                <form
                  className="space-y-4"
                  onSubmit={form.handleSubmit(
                    isEnabled ? handleDisableTwoFactorAuth : handleEnableTwoFactorAuth
                  )}
                >
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <PasswordInput {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                    variant={isEnabled ? "destructive" : "default"}
                  >
                    <LoadingSwap isLoading={isSubmitting}>
                      {isEnabled ? "Disable 2FA" : "Continue setup"}
                    </LoadingSwap>
                  </Button>
                </form>
              </Form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

const qrSchema = z.object({
  token: z.string().length(6),
})

type QrForm = z.infer<typeof qrSchema>

function QRCodeVerify({
  totpURI,
  backupCodes,
  onDone,
}: TwoFactorData & { onDone: () => void }) {
  const [successfullyEnabled, setSuccessfullyEnabled] = useState(false)
  const router = useRouter()
  const form = useForm<QrForm>({
    resolver: zodResolver(qrSchema),
    defaultValues: { token: "" },
  })

  const { isSubmitting } = form.formState

  async function handleQrCode(data: QrForm) {
    await authClient.twoFactor.verifyTotp(
      {
        code: data.token,
      },
      {
        onError: error => {
          toast.error(error.error.message || "Failed to verify code")
        },
        onSuccess: () => {
          setSuccessfullyEnabled(true)
          router.refresh()
        },
      }
    )
  }

  if (successfullyEnabled) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground mb-2">
          Save these backup codes in a safe place. You can use them to access
          your account if you lose your authenticator device.
        </p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {backupCodes.map((code, index) => (
            <div key={index} className="font-mono text-sm p-2 bg-secondary rounded text-center">
              {code}
            </div>
          ))}
        </div>
        <Button className="w-full" onClick={onDone}>
          Done
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4 flex flex-col items-center">
      <p className="text-muted-foreground text-center text-sm">
        Scan this QR code with your authenticator app and enter the generated code below.
      </p>

      <div className="p-4 bg-white w-fit rounded-lg shadow-sm border">
        <QRCode size={200} value={totpURI} />
      </div>

      <Form {...form}>
        <form className="w-full space-y-4" onSubmit={form.handleSubmit(handleQrCode)}>
          <FormField
            control={form.control}
            name="token"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Authenticator Code</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="000000" className="text-center tracking-widest text-lg" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full">
            <LoadingSwap isLoading={isSubmitting}>Submit Code</LoadingSwap>
          </Button>
        </form>
      </Form>
    </div>
  )
}