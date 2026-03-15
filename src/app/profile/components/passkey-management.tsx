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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LoadingSwap } from "@/components/auth/loading-swap"
import { authClient } from "@/lib/auth/auth-client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Passkey } from "@better-auth/passkey"
import { BetterAuthActionButton } from "@/components/auth/better-auth-action-button"
import { Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"

const passkeySchema = z.object({
  name: z.string().min(1),
})

type PasskeyForm = z.infer<typeof passkeySchema>

export function PasskeyManagement({ passkeys }: { passkeys: Passkey[] }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()
  const form = useForm<PasskeyForm>({
    resolver: zodResolver(passkeySchema),
    defaultValues: {
      name: "",
    },
  })

  const { isSubmitting } = form.formState

  async function handleAddPasskey(data: PasskeyForm) {
    await authClient.passkey.addPasskey(data, {
      onError: error => {
        toast.error(error.error.message || "Failed to add passkey")
      },
      onSuccess: () => {
        router.refresh()
        setIsDialogOpen(false)
      },
    })
  }
  function handleDeletePasskey(passkeyId: string) {
    return authClient.passkey.deletePasskey(
      { id: passkeyId },
      { onSuccess: () => router.refresh() }
    )
  }

  return (
    <div className="space-y-4 pt-4 border-t">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Passkeys</h3>
          <p className="text-sm text-muted-foreground">
            Manage your secure passkeys for passwordless login.
          </p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={o => {
            if (o) form.reset()
            setIsDialogOpen(o)
          }}
        >
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full sm:w-40">New Passkey</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Passkey</DialogTitle>
              <DialogDescription>
                Create a new passkey for secure, passwordless authentication.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                className="space-y-4"
                onSubmit={form.handleSubmit(handleAddPasskey)}
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  <LoadingSwap isLoading={isSubmitting}>Add</LoadingSwap>
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div>
        {passkeys.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground border rounded-xl bg-card">
            No passkeys found. Add your first passkey above.
          </div>
        ) : (
        <div className="space-y-4">
          {passkeys.map(passkey => (
            <div
              key={passkey.id}
              className="flex items-center justify-between p-4 rounded-xl border border-border bg-card transition-all"
            >
              <div className="space-y-1">
                <p className="font-medium text-foreground">{passkey.name}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-0.5">
                  Created {new Date(passkey.createdAt).toLocaleDateString()}
                </p>
              </div>
              <BetterAuthActionButton
                requireAreYouSure
                variant="ghost"
                size="sm"
                action={() => handleDeletePasskey(passkey.id)}
                className="text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                <Trash2 className="size-4" />
              </BetterAuthActionButton>
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  )
}