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
import { Checkbox } from "@/components/ui/checkbox"
import { authClient } from "@/lib/auth/auth-client"
import { toast } from "sonner"
import { PasswordInput } from "@/components/ui/password-input"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Suspense, useEffect } from "react"

const updatePasswordSchema = z.object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6),
    revokeOtherSessions: z.boolean(),
})

type UpdatePasswordForm = z.infer<typeof updatePasswordSchema>

function UpdatePasswordFormContent() {
    const router = useRouter()
    const { data: session, isPending: loading } = authClient.useSession()

    useEffect(() => {
        if (!session && !loading) {
            router.push("/auth/login");
        }
    }, [session, loading, router]);

    const form = useForm<UpdatePasswordForm>({
        resolver: zodResolver(updatePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            revokeOtherSessions: true
        },
    })

    const { isSubmitting } = form.formState

    async function handleUpdatePassword(data: UpdatePasswordForm) {

        await authClient.changePassword(
           data,
            {
                onError: error => {
                    toast.error(error.error.message || "Failed to update password")
                },
                onSuccess: () => {
                    toast.success("Password updated successfully", {
                        description: "Attempting to Auto-Login...",
                    })
                    setTimeout(() => {
                        router.push("/dashboard")
                    }, 1000)
                },
            }
        )
    }

    if (!session && !loading) {
        return null; // Show nothing while redirecting
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Update Your Password</CardTitle>
                    <CardDescription>Enter your current password and a new secure password below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            className="space-y-4"
                            onSubmit={form.handleSubmit(handleUpdatePassword)}
                        >
                            <FormField
                                control={form.control}
                                name="currentPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Current Password</FormLabel>
                                        <FormControl>
                                            <PasswordInput {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <PasswordInput {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="revokeOtherSessions"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel>Revoke Other Sessions</FormLabel>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" disabled={isSubmitting} className="flex-1">
                                {isSubmitting ? "Updating..." : "Update Password"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default function UpdatePasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <UpdatePasswordFormContent />
        </Suspense>
    )
}