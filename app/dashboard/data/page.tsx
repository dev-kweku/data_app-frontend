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

    const dataSchema = z.object({
    recipient: z
        .string()
        .min(10, { message: "Phone number must be at least 10 digits" })
        .regex(/^\d+$/, { message: "Phone number must contain only digits" }),
    networkId: z.string().min(1, { message: "Please select a network" }),
    planId: z.string().min(1, { message: "Please select a data plan" }),
    });

    type DataFormData = z.infer<typeof dataSchema>;

    interface Network {
    id: string | number;
    name: string;
    }

    interface DataBundle {
    planId: string;
    name: string;
    price: number;
    validity?: string;
    volume?: string;
    category?: string;
    networkId?: number;
    networkName?: string;
    amount?: number;
    }

    export default function DataPage() {
    const [loading, setLoading] = useState(false);
    const [networks, setNetworks] = useState<Network[]>([]);
    const [bundles, setBundles] = useState<DataBundle[]>([]);
    const [fetchingNetworks, setFetchingNetworks] = useState(true);
    const [fetchingBundles, setFetchingBundles] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<TransactionResult | null>(null);

    const form = useForm<DataFormData>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(dataSchema) as any,
        defaultValues: { recipient: "", networkId: "", planId: "" },
    });

    const networkId = form.watch("networkId");
    const planId = form.watch("planId");
    const selectedBundle = bundles.find((b) => String(b.planId) === planId);

    useEffect(() => {
        (async () => {
        try {
            setFetchingNetworks(true);
            setError(null);
            const data = await vendorApi.getNetworks?.();

            let mappedNetworks: Network[] = [];
            if (Array.isArray(data) && data.length > 0) {
            mappedNetworks = data.map((n) => ({
                id: n.id ?? 0,
                name: n.name ?? NETWORK_MAP[n.id ?? 0] ?? "Unknown",
            }));
            } else {
            mappedNetworks = Object.entries(NETWORK_MAP).map(([id, name]) => ({
                id,
                name,
            }));
            }
            setNetworks(mappedNetworks);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error("Failed to fetch networks:", err);
            setError(err?.message || "Failed to load networks");
            setNetworks(Object.entries(NETWORK_MAP).map(([id, name]) => ({ id, name })));
        } finally {
            setFetchingNetworks(false);
        }
        })();
    }, []);

    useEffect(() => {
        if (!networkId) {
        setBundles([]);
        form.setValue("planId", "");
        return;
        }

        (async () => {
        try {
            setFetchingBundles(true);
            setError(null);

            const id = Number(networkId);
            if (isNaN(id)) throw new Error("Invalid network ID");

            const data = await vendorApi.getDataBundleList(id);

            const normalized: DataBundle[] = data.map((b) => ({
            planId: String(b.planId ?? b.plan_name ?? ""),
            name: b.name || b.plan_name || "Unnamed Plan",
            price: Number(b.price ?? 0),
            validity: b.validity || "",
            volume: b.volume || "",
            category: b.category || "",
            networkId: id,
            networkName: b.networkName || "",
            amount: Number(b.price ?? 0),
            }));

            setBundles(normalized);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error("Failed to fetch data bundles:", err);
            setError(err?.message || "Could not load data bundles for this network");
            setBundles([]);
        } finally {
            setFetchingBundles(false);
        }
        })();
    }, [networkId, form]);

    const onSubmit: SubmitHandler<DataFormData> = async (data) => {
        if (!selectedBundle) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
        const response = await vendorApi.buyData({
            networkId: Number(data.networkId),
            phoneNumber: data.recipient,
            planId: String(selectedBundle.planId),
            amount: Number(selectedBundle.price),
        });

        const validStatus: TransactionResult["status"] =
            ["SUCCESS", "PENDING", "FAILED"].includes(response.status)
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
        const message = err?.response?.data?.message || err?.message || "Data purchase failed";
        setError(message);
        setResult({ status: "FAILED", message });
        } finally {
        setLoading(false);
        }
    };

    const resetForm = () => {
        form.reset();
        setError(null);
        setResult(null);
    };

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
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Buy Data Bundle</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
            Purchase affordable data bundles across all networks.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* FORM */}
            <Card>
            <CardHeader>
                <CardTitle>Purchase Data Bundle</CardTitle>
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
                    {/* Phone Number */}
                    <FormField
                    control={form.control}
                    name="recipient"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter phone number" {...field} inputMode="numeric" />
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
                        <Select onValueChange={field.onChange} value={field.value} disabled={fetchingNetworks}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue
                                placeholder={fetchingNetworks ? "Loading networks..." : "Select network"}
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

                    {/* Data Plan */}
                    <FormField
                    control={form.control}
                    name="planId"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Data Plan</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={fetchingBundles || bundles.length === 0}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={fetchingBundles ? "Loading bundles..." : bundles.length === 0 ? "No bundles available" : "Select data plan"} />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {bundles.map((bundle) => (
                                <SelectItem key={bundle.planId} value={String(bundle.planId)}>
                                GHS{bundle.price} {bundle.volume ? `(${bundle.volume})` : ""}{" "}
                                {bundle.validity && `- ${bundle.validity}`}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    {/* Selected bundle preview */}
                    {selectedBundle && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                        Selected: <strong>{selectedBundle.name}</strong> — GHS{selectedBundle.price}{" "}
                        {selectedBundle.volume && `(${selectedBundle.volume})`} — Validity:{" "}
                        <strong>{selectedBundle.validity ?? "N/A"}</strong>
                    </div>
                    )}

                    {/* Buttons */}
                    <div className="flex space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={resetForm} disabled={loading} className="flex-1">
                        Clear
                    </Button>
                    <Button type="submit" disabled={loading || fetchingBundles} className="flex-1">
                        {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </>
                        ) : (
                        "Purchase Bundle"
                        )}
                    </Button>
                    </div>
                </form>
                </Form>
            </CardContent>
            </Card>

            {/* RESULT */}
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
    );
    }
