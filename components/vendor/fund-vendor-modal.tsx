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
    import { Vendor } from "@/types"
    import { AlertCircle, Loader2 } from "lucide-react"

    const fundVendorSchema = z.object({
    amount: z.number().min(1, "Amount must be greater than 0"),
    })

    type FundVendorFormData = z.infer<typeof fundVendorSchema>

    interface FundVendorModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    vendor: Vendor | null
    onSuccess: () => void
    }

    export function FundVendorModal({ open, onOpenChange, vendor, onSuccess }: FundVendorModalProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const form = useForm<FundVendorFormData>({
        resolver: zodResolver(fundVendorSchema),
        defaultValues: {
        amount: 0,
        },
    })

    const onSubmit = async (data: FundVendorFormData) => {
        if (!vendor) return

        setLoading(true)
        setError(null)

        try {
        await adminApi.fundVendor({
            vendorId: vendor.id,
            amount: data.amount
        })
        onSuccess()
        form.reset()
        } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fund vendor')
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
            <DialogTitle>Fund Vendor Wallet</DialogTitle>
            </DialogHeader>

            {vendor && (
            <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Vendor: {vendor.email}</p>
                <p className="text-sm text-gray-600">
                    Current Balance: <strong>GHS{(vendor.balance || 0).toFixed(2)}</strong>
                </p>
                </div>

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
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Amount to Fund</FormLabel>
                        <FormControl>
                            <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
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
                            Funding...
                        </>
                        ) : (
                        'Fund Wallet'
                        )}
                    </Button>
                    </div>
                </form>
                </Form>
            </div>
            )}
        </DialogContent>
        </Dialog>
    )
    }