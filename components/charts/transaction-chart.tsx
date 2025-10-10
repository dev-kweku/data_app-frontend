    "use client"

    import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

    interface ChartData {
    name: string
    transactions: number
    revenue: number
    }

    const defaultData: ChartData[] = [
    { name: 'Jan', transactions: 400, revenue: 2400 },
    { name: 'Feb', transactions: 300, revenue: 1398 },
    { name: 'Mar', transactions: 200, revenue: 9800 },
    { name: 'Apr', transactions: 278, revenue: 3908 },
    { name: 'May', transactions: 189, revenue: 4800 },
    { name: 'Jun', transactions: 239, revenue: 3800 },
    { name: 'Jul', transactions: 349, revenue: 4300 },
    ]

    interface TransactionChartProps {
    data?: ChartData[]
    }

    export function TransactionChart({ data = defaultData }: TransactionChartProps) {
    const chartData = data.length > 0 ? data : defaultData

    return (
        <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
            data={chartData}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
            >
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
                dataKey="name" 
                className="text-xs"
                tick={{ fill: 'currentColor' }}
            />
            <YAxis 
                className="text-xs"
                tick={{ fill: 'currentColor' }}
            />
            <Tooltip 
                contentStyle={{ 
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                borderRadius: '8px'
                }}
            />
            <Legend />
            <Line 
                type="monotone" 
                dataKey="transactions" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                activeDot={{ r: 8 }} 
            />
            <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(142, 76%, 36%)" 
                strokeWidth={2}
            />
            </LineChart>
        </ResponsiveContainer>
        </div>
    )
    }