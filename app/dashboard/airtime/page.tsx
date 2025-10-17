    "use client";

    import { useState, useEffect } from "react";
    import { useForm, SubmitHandler } from "react-hook-form";
    import { zodResolver } from "@hookform/resolvers/zod";
    import { z } from "zod";
    import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
    import { Button } from "@/components/ui/button";
    import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    } from "@/components/ui/form";
    import { Input } from "@/components/ui/input";
    import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    } from "@/components/ui/select";
    import { Alert, AlertDescription } from "@/components/ui/alert";
    import { vendorApi } from "@/lib/api/vendor";
    import { AlertCircle, Loader2, CheckCircle2, Clock } from "lucide-react";
    import { TransactionResult } from "@/types";

    // ✅ Static Network Map (fallback)
    const NETWORK_MAP: Record<number, string> = {
    0: "Unknown",
    1: "AirtelTigo",
    2: "EXPRESSO",
    3: "GLO",
    4: "MTN",
    5: "TiGO",
    6: "Telecel",
    8: "Busy",
    9: "Surfline",
    13: "MTN Yellow",
    };

    // ✅ Validation Schema
    const airtimeSchema = z.object({
        recipient: z
            .string()
            .min(10, { message: "Phone number must be at least 10 digits" })
            .regex(/^\d+$/, { message: "Phone number must contain only digits" }),
            amount: z.preprocess(
            (val) => Number(val),
            z.number().positive({ message: "Amount must be greater than 0" })
            ),
            networkId: z.number().min(0, { message: "Please select a network" }),
        });

    type AirtimeFormData = z.infer<typeof airtimeSchema>;

    interface Network {
    id: number;
    name: string;
    }

    export default function AirtimePage() {
    const [loading, setLoading] = useState(false);
    const [networks, setNetworks] = useState<Network[]>([]);
    const [fetchingNetworks, setFetchingNetworks] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<TransactionResult | null>(null);

    const form = useForm<AirtimeFormData>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(airtimeSchema) as any,
        defaultValues: {
            recipient: "",
            amount: 0,
            networkId: 0,
            },
        });

    // ✅ Fetch Networks
    useEffect(() => {
        (async () => {
            try {
                setFetchingNetworks(true);
                setFetchError(null);
        
                const data = await vendorApi.getNetworks?.();
                let mappedNetworks: Network[] = [];
        
                if (Array.isArray(data) && data.length > 0) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                mappedNetworks = data.map((n: any) => ({
                    id: Number(n.id ?? n.network_id ?? n.code ?? 0),
                    name: n.name ?? NETWORK_MAP[n.id ?? n.network_id ?? n.code] ?? "Unknown",
                }));
                } else {
                mappedNetworks = Object.entries(NETWORK_MAP).map(([id, name]) => ({
                    id: Number(id),
                    name,
                }));
                }
        
                setNetworks(mappedNetworks);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                console.error("Failed to fetch networks:", err);
                setFetchError(err.message || "Failed to load networks");
        
                setNetworks(
                Object.entries(NETWORK_MAP).map(([id, name]) => ({
                    id: Number(id),
                    name,
                }))
                );
            } finally {
                setFetchingNetworks(false);
            }
            })();
        }, []);

    // ✅ Handle Submit
    const onSubmit: SubmitHandler<AirtimeFormData> = async (data) => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
        const response = await vendorApi.buyAirtime({
            networkId: data.networkId,
            phoneNumber: data.recipient,
            amount: data.amount,
        });

        const validStatus: TransactionResult["status"] = ["SUCCESS", "PENDING", "FAILED"].includes(
            response.status
        )
            ? (response.status as TransactionResult["status"])
            : "PENDING";

        setResult({
            status: validStatus,
            message: response.message || "Transaction processed successfully",
            reference: response.trxnRef || "",
        });

        form.reset();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
        const message =
            err?.response?.data?.message ||
            err?.message ||
            "Airtime purchase failed";

        setError(message);
        setResult({
            status: "FAILED",
            message,
        });
        } finally {
        setLoading(false);
        }
    };

    const resetForm = () => {
        form.reset();
        setError(null);
        setResult(null);
    };

    // ✅ UI Helpers
    const getStatusIcon = (status: TransactionResult["status"]) => {
        switch (status) {
        case "SUCCESS":
            return <CheckCircle2 className="h-4 w-4 text-green-600" />;
        case "PENDING":
            return <Clock className="h-4 w-4 text-yellow-600" />;
        case "FAILED":
            return <AlertCircle className="h-4 w-4 text-red-600" />;
        }
    };

    const getStatusColor = (status: TransactionResult["status"]) => {
        switch (status) {
        case "SUCCESS":
            return "text-green-600";
        case "PENDING":
            return "text-yellow-600";
        case "FAILED":
            return "text-red-600";
        default:
            return "";
        }
    };

    return (
        <div className="space-y-6">
        {/* Header */}
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Airtime Purchase
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
            Buy airtime instantly for any network.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* === FORM === */}
            <Card>
            <CardHeader>
                <CardTitle>Purchase Airtime</CardTitle>
            </CardHeader>
            <CardContent>
                {(error || fetchError) && (
                <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error || fetchError}</AlertDescription>
                </Alert>
                )}

                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* Phone Number */}
                    <FormField
                    control={form.control}
                    name="recipient"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                            <Input
                            placeholder="Enter phone number"
                            {...field}
                            inputMode="numeric"
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    {/* Amount */}
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
                            value={field.value || ""}
                            onChange={(e) =>
                                field.onChange(Number(e.target.value) || 0)
                            }
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    {/* Network */}
                    <FormField
                    control={form.control}
                    name="networkId"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Network</FormLabel>
                        <Select
                        onValueChange={(val) => field.onChange(Number(val))}
                        value={field.value.toString()}
                        disabled={fetchingNetworks}
                        >
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue
                                placeholder={
                                    fetchingNetworks
                                    ? "Loading networks..."
                                    : "Select network"
                                }
                                />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {networks.map((net) => (
                                <SelectItem key={net.id} value={String(net.id)}>
                                {net.name}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    {/* Buttons */}
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
                    <Button
                        type="submit"
                        disabled={loading || fetchingNetworks}
                        className="flex-1"
                    >
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

            {/* === RESULT === */}
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
                        <span
                        className={`ml-2 font-medium ${getStatusColor(
                            result.status
                        )}`}
                        >
                        {result.status.charAt(0) +
                            result.status.slice(1).toLowerCase()}
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
                        <span className="text-sm font-mono">
                        {result.reference}
                        </span>
                    </div>
                    )}
                </div>
                </CardContent>
            </Card>
            )}
        </div>
        </div>
    );
    }
