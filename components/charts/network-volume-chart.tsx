    "use client";

    import { useEffect, useState } from "react";
    import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
    PieLabelRenderProps,
    } from "recharts";
    import { adminApi } from "@/lib/api/admin";

    interface ChartData {
    [key:string]:string|number;
    name: string;
    value: number;
    label: string;
    }

    const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#FF6384",
    "#36A2EB",
    "#8A2BE2",
    "#00CED1",
    ];

    export function NetworkVolumeChart() {
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBundles = async () => {
        try {
            setLoading(true);
            setError(null);

            const networkIds = [1, 2, 3, 4, 5, 6];

            const bundleResponses = await Promise.all(
            networkIds.map(async (id) => {
                try {
                const res = await adminApi.getDataBundleList(id);
                return { id, bundles: res.bundles || [] };
                } catch {
                return { id, bundles: [] };
                }
            })
            );

            const aggregated: Record<string, number> = {};

            bundleResponses.forEach(({ id, bundles }) => {
            const networkName = `Network ${id}`;
            let total = 0;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            bundles.forEach((bundle: any) => {
                let value = 0;
                if (bundle.volume) {
                const parsed = parseFloat(bundle.volume.replace(/[^\d.]/g, ""));
                value = isNaN(parsed) ? Number(bundle.price ?? 0) : parsed;
                } else {
                value = Number(bundle.price ?? 0);
                }
                total += value;
            });

            aggregated[networkName] = total;
            });

            const formatted: ChartData[] = Object.entries(aggregated)
            .filter(([_, v]) => v > 0)
            .map(([name, value]) => ({
                name,
                value,
                label: `${name} (${value.toFixed(0)})`,
            }));

            setChartData(formatted);
        } catch (err) {
            console.error("NetworkVolumeChart error:", err);
            setError(
            err instanceof Error ? err.message : "Failed to load network volume data"
            );
        } finally {
            setLoading(false);
        }
        };

        fetchBundles();
    }, []);

    const renderLabel = (props: PieLabelRenderProps) => {
        const { name, percent } = props;
        if (!name || percent == null) return null;
        return `${name} ${(percent as number * 100).toFixed(0)}%`;
    };

    if (loading) return <p className="text-sm text-gray-500">Loading chart...</p>;
    if (error) return <p className="text-sm text-red-500">{error}</p>;
    if (!chartData.length)
        return <p className="text-sm text-gray-500">No data available</p>;

    return (
        <div className="w-full h-96 bg-card rounded-2xl shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4 text-center">
            Network Data Volume (Admin)
        </h2>
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
            <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                labelLine={false}
                label={renderLabel}
                dataKey="value"

            >
                {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
                    <Tooltip
            formatter={(value, _name, props) => {
                const numericValue =
                typeof value === "number" ? value : Number(value ?? 0);

                return [
                `${numericValue.toLocaleString()} total`,
                props?.payload?.name || "Network",
                ];
            }}
            />

            <Legend verticalAlign="bottom" height={36} />
            </PieChart>
        </ResponsiveContainer>
        </div>
    );
    }
