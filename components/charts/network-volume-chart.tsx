    "use client"

    import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, PieLabelRenderProps } from 'recharts'

    interface ChartData {
    name: string
    value: number
    [key: string]: string | number
    }

    const defaultData: ChartData[] = [
    { name: 'MTN', value: 400 },
    { name: 'Airtel', value: 300 },
    { name: 'Glo', value: 200 },
    { name: '9mobile', value: 100 },
    ]

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

    interface NetworkVolumeChartProps {
    data?: ChartData[]
    }

    export function NetworkVolumeChart({ data = defaultData }: NetworkVolumeChartProps) {
    const chartData = data.length > 0 ? data : defaultData

    // Properly typed label function with complete null checks
    const renderLabel = (props: PieLabelRenderProps) => {
        const { name, percent } = props
        // Check if name exists and percent is a valid number
        if (!name || percent === undefined || percent === null || typeof percent !== 'number') {
        return null
        }
        return `${name} ${(percent * 100).toFixed(0)}%`
    }

    return (
        <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
            <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
            >
                {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip 
                formatter={(value: number) => [`${value} transactions`, 'Volume']}
                contentStyle={{ 
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                borderRadius: '8px'
                }}
            />
            <Legend />
            </PieChart>
        </ResponsiveContainer>
        </div>
    )
    }