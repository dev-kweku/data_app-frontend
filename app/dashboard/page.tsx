"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardCard } from "@/components/shared/dashboard-card"
import { TransactionTable } from "@/components/shared/transaction-table"
import { TransactionChart } from "@/components/charts/transaction-chart"
import { NetworkVolumeChart } from "@/components/charts/network-volume-chart"
import { adminApi } from "@/lib/api/admin"
import { vendorApi } from "@/lib/api/vendor"
import { walletApi } from "@/lib/api/wallet"
import { tokenService } from "@/lib/utils/token"
import { User, Transaction } from "@/types"
import { DollarSign, Users, TrendingUp, Smartphone, AlertCircle } from "lucide-react"

const getUserFromStorage = (): User | null => {
    if (typeof window === 'undefined') return null
    try {
    const userData = localStorage.getItem('userData')
    return userData ? JSON.parse(userData) : null
    } catch (error) {
    console.error('Error reading user data:', error)
    return null
    }
}

export default function DashboardPage() {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)


    const [tppBalance, setTppBalance] = useState<number | null>(null)

    const [dashboardData, setDashboardData] = useState({
    totalBalance: 0,
    subVendors: 0,
    monthlyTransactions: 0,
    todayTransactions: 0,
    todayCommissions: 0,
    walletBalance: 0,
    recentTransactions: [] as Transaction[]
    })

    useEffect(() => {
        const userData = getUserFromStorage()
        if (!userData) {
        tokenService.removeToken()
        router.push('/login')
        return
        }

        setUser(userData)
        fetchData(userData)
    }, [router])

    const fetchData = async (user: User) => {
        try {
        if (user.role === 'ADMIN') {
            // 🔹 Fetch TPP balance, vendors, and transactions in parallel
            const [vendorsResponse, transactionsResponse, tppResp] = await Promise.all([
            adminApi.getVendors(),
            adminApi.getTransactions(),
          adminApi.getTPPBalance().catch(() => ({ balance: 0 })) // fallback if API fails
        ])

        setTppBalance(tppResp.balance || 0)

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const vendors = (vendorsResponse as any).vendors || vendorsResponse
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transactions = (transactionsResponse as any).transactions || transactionsResponse

        const recentTransactions = Array.isArray(transactions) ? transactions.slice(0, 10) : []
        const todayTransactions = Array.isArray(transactions)
            ? transactions.filter(t => new Date(t.createdAt).toDateString() === new Date().toDateString()).length
            : 0

            setDashboardData({
            totalBalance: Array.isArray(vendors)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ? vendors.reduce((sum: number, v: any) => sum + (v.balance || 0), 0)
                : 0,
            subVendors: Array.isArray(vendors) ? vendors.length : 0,
            monthlyTransactions: Array.isArray(transactions) ? transactions.length : 0,
            todayTransactions,
            todayCommissions: todayTransactions * 5,
            walletBalance: 0,
            recentTransactions
        })
        } 
        else if (user.role === 'VENDOR') {
            const [walletResponse, transactionsResponse] = await Promise.all([
            vendorApi.getWalletBalance(),
            vendorApi.getTransactions()
        ])

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const walletBalance = (walletResponse as any)?.balance || 0
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transactions = (transactionsResponse as any).transactions || transactionsResponse

        const recentTransactions = Array.isArray(transactions) ? transactions.slice(0, 5) : []
        const todayTransactions = Array.isArray(transactions)
            ? transactions.filter(t => new Date(t.createdAt).toDateString() === new Date().toDateString()).length
            : 0

        setDashboardData({
            totalBalance: 0,
            subVendors: 0,
            monthlyTransactions: Array.isArray(transactions) ? transactions.length : 0,
            todayTransactions,
            todayCommissions: 0,
            walletBalance,
            recentTransactions
            })
        } 
        else if (user.role === 'USER') {
            const [walletResponse, transactionsResponse] = await Promise.all([
            walletApi.getBalance(),
            walletApi.getTransactions()
        ])

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const walletBalance = (walletResponse as any)?.balance || 0
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transactions = (transactionsResponse as any).transactions || transactionsResponse

        const recentTransactions = Array.isArray(transactions) ? transactions.slice(0, 5) : []
        const todayTransactions = Array.isArray(transactions)
            ? transactions.filter(t => new Date(t.createdAt).toDateString() === new Date().toDateString()).length
            : 0

        setDashboardData({
            totalBalance: 0,
            subVendors: 0,
            monthlyTransactions: Array.isArray(transactions) ? transactions.length : 0,
            todayTransactions,
            todayCommissions: 0,
            walletBalance,
            recentTransactions
        })
        }
        } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data')
        } finally {
        setLoading(false)
        }
    }

    if (loading) {
        return (
        <div className="flex items-center justify-center min-h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        )
    }

    if (error) {
        return (
        <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">{error}</p>
            </div>
        </div>
        )
    }

    if (!user) return null

    return (
    <div className="space-y-6">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
            Welcome back, {user.email}. Here&apos;s your overview.
            </p>
        </div>

        {user.role === 'ADMIN' && (
            <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <DashboardCard
                title="Total Vendor Balance"
                value={`GHS${dashboardData.totalBalance.toLocaleString()}`}
                description="+10% vs last month"
                icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                trend={{ value: "10%", isPositive: true }}
                />
                <DashboardCard
                title="Sub-Vendors"
                value={dashboardData.subVendors.toString()}
                description="+5% vs last month"
                icon={<Users className="h-4 w-4 text-muted-foreground" />}
                trend={{ value: "5%", isPositive: true }}
                />
                <DashboardCard
                title="Monthly Transactions"
                value={dashboardData.monthlyTransactions.toString()}
                description="+15% vs last month"
                icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
                trend={{ value: "15%", isPositive: true }}
            />
            <DashboardCard
                title="Today's Transactions"
                value={dashboardData.todayTransactions.toString()}
                description="+8% vs yesterday"
                icon={<Smartphone className="h-4 w-4 text-muted-foreground" />}
                trend={{ value: "8%", isPositive: true }}
                />
            {/*  Added TPP Balance Card */}
            <DashboardCard
                        title="TPP Wallet Balance"
                        value={
                            tppBalance !== null
                            ? `GHS ${tppBalance.toFixed(2)}`
                            : "Loading..."
                        }
                        description={
                            tppBalance !== null && tppBalance < 100
                            ? "⚠️ Low balance!"
                            : ""
                        }
                icon={<DollarSign className="h-4 w-4 text-yellow-500" />}
                trend={{ value: "", isPositive: !!(tppBalance && tppBalance >= 100) }}
                />

            </div>

            {/* Existing Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                <CardHeader><CardTitle>Transaction Trends</CardTitle></CardHeader>
                <CardContent><TransactionChart /></CardContent>
                </Card>

                <Card>
                <CardHeader><CardTitle>Network Volume Distribution</CardTitle></CardHeader>
                <CardContent><NetworkVolumeChart /></CardContent>
                </Card>
            </div>

            {/* Recent Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <Card>
                <CardHeader><CardTitle>Today&apos;s Performance</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                    <span>Total Transactions</span>
                    <strong>{dashboardData.todayTransactions}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                    <span>Total Commissions</span>
                    <strong>GHS{dashboardData.todayCommissions}</strong>
                    </div>
                </CardContent>
                </Card>

                <Card>
                <CardHeader><CardTitle>Recent Transactions</CardTitle></CardHeader>
                <CardContent>
                    <TransactionTable transactions={dashboardData.recentTransactions} pageSize={5} />
                </CardContent>
                </Card>
            </div>
            </>
        )}

        {user.role === 'VENDOR' && (
            <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DashboardCard
                title="Wallet Balance"
                value={`GHS${dashboardData.walletBalance.toFixed(2)}`}
                icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                />
                <DashboardCard
                title="Monthly Transactions"
                value={dashboardData.monthlyTransactions.toString()}
                icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
                />
                <DashboardCard
                title="Today's Transactions"
                value={dashboardData.todayTransactions.toString()}
                icon={<Smartphone className="h-4 w-4 text-muted-foreground" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                    <TransactionChart />
                </CardContent>
                </Card>

                <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <TransactionTable transactions={dashboardData.recentTransactions} pageSize={5} />
                </CardContent>
                </Card>
            </div>
            </>
        )}

        {user.role === 'USER' && (
            <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DashboardCard
                title="Wallet Balance"
                value={`GHS${dashboardData.walletBalance.toFixed(2)}`}
                icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                />
                <DashboardCard
                title="Total Transactions"
                value={dashboardData.monthlyTransactions.toString()}
                icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
                />
            </div>

            <Card>
                <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                <TransactionTable transactions={dashboardData.recentTransactions} pageSize={5} />
                </CardContent>
            </Card>
            </>
        )}
        </div>
    )
    }