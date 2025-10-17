    "use client";

    import React, { useEffect, useState, useCallback } from "react";
    import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    } from "recharts";
    import { vendorApi } from "@/lib/api/vendor";
    import { walletApi } from "@/lib/api/wallet";
    import { Transaction } from "@/types";
import { adminApi } from "@/lib/api/admin";

    interface ChartData {
    name: string; // Date label
    transactions: number;
    revenue: number;
    }

    interface TransactionChartProps {
    role?: "vendor" | "admin"; 
    refreshInterval?: number; 
    }

    export function TransactionChart({
    role = "vendor",
    refreshInterval = 15000, // default 15s refresh
    }: TransactionChartProps) {
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 🟦 Fetch transactions from backend
    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        try {
        let transactions: Transaction[] = [];

        // 🟩 Choose endpoint based on role
        if (role === "vendor") {
            transactions = await vendorApi.getTransactions();
            } else if (role === "admin") {
                transactions = await adminApi.getTransactions(); 
            }
            

        if (!transactions?.length) {
            setChartData([]);
            setError(null);
            return;
        }

        // 🧮 Group transactions by date
        const grouped: Record<
            string,
            { transactions: number; revenue: number }
        > = {};

        transactions.forEach((tx) => {
            if (!tx.createdAt) return;
            const date = new Date(tx.createdAt).toISOString().split("T")[0];
            if (!grouped[date]) grouped[date] = { transactions: 0, revenue: 0 };
            grouped[date].transactions += 1;

            // Use tx.amount or tx.vendorPays depending on backend shape
            const amount =
            Number(tx.vendorPays ?? tx.amount ?? 0) > 0
                ? Number(tx.vendorPays ?? tx.amount)
                : 0;
            grouped[date].revenue += amount;
        });

        // 🧾 Format and sort for chart
        const formatted: ChartData[] = Object.keys(grouped)
            .map((date) => ({
            name: date,
            transactions: grouped[date].transactions,
            revenue: grouped[date].revenue,
            }))
            .sort(
            (a, b) => new Date(a.name).getTime() - new Date(b.name).getTime()
            );

        setChartData(formatted);
        setError(null);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
        console.error("Transaction chart fetch error:", err);
        setError(err.message || "Failed to load transactions");
        } finally {
        setLoading(false);
        }
    }, [role]);

    // 🕒 Polling and initial fetch
    useEffect(() => {
        fetchTransactions();
        const interval = setInterval(fetchTransactions, refreshInterval);
        return () => clearInterval(interval);
    }, [fetchTransactions, refreshInterval]);

    // 🧭 Render states
    if (loading)
        return <p className="text-sm text-gray-500">Loading transactions...</p>;
    if (error) return <p className="text-sm text-red-500">{error}</p>;
    if (chartData.length === 0)
        return (
        <p className="text-sm text-gray-500">No transactions data available.</p>
        );

    return (
        <div className="w-full h-96 bg-card rounded-2xl shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4 text-center">
            {role === "admin" ? "Platform Transactions Overview" : "My Transactions"}
        </h2>

        <ResponsiveContainer width="100%" height="100%">
            <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
                dataKey="name"
                className="text-xs"
                tick={{ fill: "currentColor" }}
            />
            <YAxis className="text-xs" tick={{ fill: "currentColor" }} />
            <Tooltip
                formatter={(value: number, key) => [
                key === "transactions"
                    ? `${value} txs`
                    : `GHS ${value.toFixed(2)}`,
                key === "transactions" ? "Transactions" : "Revenue",
                ]}
                contentStyle={{
                backgroundColor: "hsl(var(--background))",
                borderColor: "hsl(var(--border))",
                borderRadius: "8px",
                }}
            />
            <Legend />
            <Line
                type="monotone"
                dataKey="transactions"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                activeDot={{ r: 8 }}
                name="Transactions"
            />
            <Line
                type="monotone"
                dataKey="revenue"
                stroke="hsl(142, 76%, 36%)"
                strokeWidth={2}
                name="Revenue (GHS)"
            />
            </LineChart>
        </ResponsiveContainer>
        </div>
    );
    }
