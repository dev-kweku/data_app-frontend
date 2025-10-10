    import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
    import { cn } from "@/lib/utils"

    interface DashboardCardProps {
    title: string
    value: string | number
    description?: string
    icon?: React.ReactNode
    className?: string
    trend?: {
        value: string
        isPositive: boolean
    }
    }

    export function DashboardCard({
    title,
    value,
    description,
    icon,
    className,
    trend
    }: DashboardCardProps) {
    return (
        <Card className={cn("", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            {description && (
            <p className="text-xs text-muted-foreground">
                {description}
                {trend && (
                <span className={cn(
                    "ml-1 font-medium",
                    trend.isPositive ? "text-green-600" : "text-red-600"
                )}>
                    {trend.isPositive ? '+' : ''}{trend.value}
                </span>
                )}
            </p>
            )}
        </CardContent>
        </Card>
    )
    }