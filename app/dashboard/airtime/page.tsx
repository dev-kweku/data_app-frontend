    "use client"

    import { useState } from "react"
    import { useForm } from "react-hook-form"
    import { zodResolver } from "@hookform/resolvers/zod"
    import { z } from "zod"
    import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
    import { Button } from "@/components/ui/button"
    import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
    import { Input } from "@/components/ui/input"
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
    import { Alert, AlertDescription } from "@/components/ui/alert"
    import { vendorApi } from "@/lib/api/vendor"
    import { NETWORKS } from "@/lib/utils/constants"
    import { AlertCircle, Loader2, CheckCircle2, Clock } from "lucide-react"
    import { TransactionResult } from "@/types"

    // ✅ Compatible Zod schema (no required_error)
    const airtimeSchema = z.object({
    recipient: z
        .string()
        .min(10, "Phone number must be at least 10 digits")
        .regex(/^\d+$/, "Phone number must contain only digits"),
    amount: z
        .number()
        .positive("Amount must be greater than 0"),
    networkId: z.string().min(1, "Please select a network"),
    })

    type AirtimeFormData = z.infer<typeof airtimeSchema>

    export default function AirtimePage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [result, setResult] = useState<TransactionResult | null>(null)

    const form = useForm<AirtimeFormData>({
        resolver: zodResolver(airtimeSchema),
        defaultValues: {
        recipient: "",
        amount: 0,
        networkId: "",
        },
    })

    const onSubmit = async (data: AirtimeFormData) => {
        setLoading(true)
        setError(null)
        setResult(null)
    
        try {
        const response = await vendorApi.buyAirtime({
            networkId: data.networkId,
            phoneNumber: data.recipient, // ✅ FIXED HERE
            amount: data.amount,
        })
    
        const validStatus =
            ["PENDING", "SUCCESS", "FAILED"].includes(response.status)
            ? (response.status as "PENDING" | "SUCCESS" | "FAILED")
            : "PENDING"
    
        setResult({
            status: validStatus,
            message: response.message,
            reference: response.trxnRef,
        })
    
        form.reset()
        } catch (err) {
        const message = err instanceof Error ? err.message : "Airtime purchase failed"
        setError(message)
        setResult({
            status: "FAILED",
            message,
        })
        } finally {
        setLoading(false)
        }
    }
    

    const resetForm = () => {
        form.reset()
        setError(null)
        setResult(null)
    }

    const getStatusIcon = (status: TransactionResult["status"]) => {
        switch (status) {
        case "SUCCESS":
            return <CheckCircle2 className="h-4 w-4 text-green-600" />
        case "PENDING":
            return <Clock className="h-4 w-4 text-yellow-600" />
        case "FAILED":
            return <AlertCircle className="h-4 w-4 text-red-600" />
        }
    }

    const getStatusColor = (status: TransactionResult["status"]) => {
        switch (status) {
        case "SUCCESS":
            return "text-green-600"
        case "PENDING":
            return "text-yellow-600"
        case "FAILED":
            return "text-red-600"
        }
    }

    return (
        <div className="space-y-6">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Airtime Purchase</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
            Buy airtime for any phone number
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
            <CardHeader>
                <CardTitle>Purchase Airtime</CardTitle>
            </CardHeader>
            <CardContent>
                {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                )}

                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* Phone number field */}
                    <FormField
                    control={form.control}
                    name="recipient"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    {/* Amount field */}
                    <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                            <Input
                            type="number"
                            placeholder="Enter amount"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    {/* Network selection */}
                    <FormField
                    control={form.control}
                    name="networkId"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Network</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select network" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {NETWORKS.map((network) => (
                                <SelectItem key={network.id} value={network.id}>
                                {network.name}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <div className="flex space-x-2 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={resetForm}
                        disabled={loading}
                        className="flex-1"
                    >
                        Clear
                    </Button>
                    <Button type="submit" disabled={loading} className="flex-1">
                        {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </>
                        ) : (
                        "Purchase Airtime"
                        )}
                    </Button>
                    </div>
                </form>
                </Form>
            </CardContent>
            </Card>

            {result && (
            <Card>
                <CardHeader>
                <CardTitle>Transaction Result</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                    <span className="font-medium">Status</span>
                    <div className="flex items-center">
                        {getStatusIcon(result.status)}
                        <span className={`ml-2 font-medium ${getStatusColor(result.status)}`}>
                        {result.status.charAt(0) + result.status.slice(1).toLowerCase()}
                        </span>
                    </div>
                    </div>

                    <div className="flex items-center justify-between">
                    <span className="font-medium">Message</span>
                    <span className="text-sm text-right">{result.message}</span>
                    </div>

                    {result.reference && (
                    <div className="flex items-center justify-between">
                        <span className="font-medium">Reference</span>
                        <span className="text-sm font-mono">{result.reference}</span>
                    </div>
                    )}
                </div>
                </CardContent>
            </Card>
            )}
        </div>
        </div>
    )
    }
