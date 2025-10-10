    "use client"

    import { useState } from "react"
    import { useForm } from "react-hook-form"
    import { zodResolver } from "@hookform/resolvers/zod"
    import { z } from "zod"
    import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
    import { Button } from "@/components/ui/button"
    import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
    import { Input } from "@/components/ui/input"
    import { Alert, AlertDescription } from "@/components/ui/alert"
    import { adminApi } from "@/lib/api/admin"
    import { AlertCircle, Loader2, Plus } from "lucide-react"

    const addVendorSchema = z.object({
    email: z.string().email("Invalid email address"),
    name: z.string().min(1, "Name is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    })

    type AddVendorFormData = z.infer<typeof addVendorSchema>

    interface AddVendorModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
    }

    export function AddVendorModal({ open, onOpenChange, onSuccess }: AddVendorModalProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const form = useForm<AddVendorFormData>({
        resolver: zodResolver(addVendorSchema),
        defaultValues: {
        email: "",
        name: "",
        password: "",
        },
    })

    const onSubmit = async (data: AddVendorFormData) => {
        setLoading(true)
        setError(null)

        try {
        await adminApi.createVendor({
            email: data.email,
            name: data.name,
            password: data.password
        })
        
        onSuccess()
        form.reset()
        onOpenChange(false)
        } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create vendor')
        } finally {
        setLoading(false)
        }
    }

    const handleOpenChange = (open: boolean) => {
        if (!open) {
        form.reset()
        setError(null)
        }
        onOpenChange(open)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
            <DialogTitle className="flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Add New Vendor
            </DialogTitle>
            </DialogHeader>

            {error && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
            </Alert>
            )}

            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                        <Input
                        placeholder="John Doe"
                        autoComplete="name"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                        <Input
                        placeholder="vendor@example.com"
                        type="email"
                        autoComplete="email"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input
                        placeholder="********"
                        type="password"
                        autoComplete="new-password"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <div className="flex justify-end space-x-2 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleOpenChange(false)}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                    </>
                    ) : (
                    'Create Vendor'
                    )}
                </Button>
                </div>
            </form>
            </Form>
        </DialogContent>
        </Dialog>
    )
    }