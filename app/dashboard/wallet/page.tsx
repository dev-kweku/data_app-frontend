    "use client"

    import { useState, useEffect } from "react"
    import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
    import { TransactionTable } from "@/components/shared/transaction-table"
    import { tokenService } from "@/lib/utils/token"
    import { vendorApi } from "@/lib/api/vendor"
    import { walletApi } from "@/lib/api/wallet"
    import { User, WalletBalance, Transaction } from "@/types"
    import { DollarSign, TrendingUp, AlertCircle, RefreshCw } from "lucide-react"
    import { Button } from "@/components/ui/button"

    // Helper function to get user from storage
    const getUserFromStorage = (): User | null => {
    if (typeof window === 'undefined') return null
    
    try {
        const userData = localStorage.getItem('userData')
        if (userData) {
        return JSON.parse(userData)
        }
    } catch (error) {
        console.error('Error reading user data from storage:', error)
    }
    return null
    }

    export default function WalletPage() {
    const [user, setUser] = useState<User | null>(null)
    const [wallet, setWallet] = useState<WalletBalance | null>(null)
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const userData = getUserFromStorage()
        if (!userData) {
        tokenService.removeToken()
        window.location.href = '/login'
        return
        }

        setUser(userData)
        fetchData(userData)
    }, [])

    const fetchData = async (userData: User) => {
        try {
        let walletBalance: number
        let transactionsData: Transaction[] = []
    
        if (userData.role === 'VENDOR') {
            walletBalance = await vendorApi.getWalletBalance()
            transactionsData = await vendorApi.getTransactions()
        } else {
            walletBalance = await walletApi.getBalance()
            transactionsData = await walletApi.getTransactions() // No arguments needed
        }
    
        setWallet({ balance: walletBalance, currency: 'USD' })
        setTransactions(transactionsData)
        } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch wallet data')
        } finally {
        setLoading(false)
        }
    }

    const handleRefresh = () => {
        if (!user) return
        
        setLoading(true)
        setError(null)
        fetchData(user)
    }

    if (loading) {
        return (
        <div className="flex items-center justify-center min-h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        )
    }

    return (
        <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Wallet</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your wallet balance and transactions</p>
            </div>
            <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
            </Button>
        </div>

        {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
            </div>
        )}

        {wallet && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            <DollarSign className="h-4 w-4" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">
            {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'GHS', // ✅ Force Ghanaian Cedi display
                minimumFractionDigits: 2,
            }).format(wallet.balance)}
            </div>
            <p className="text-xs text-blue-100 mt-1">
            Available for transactions
            </p>
        </CardContent>
        </Card>


            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{transactions.length}</div>
                <p className="text-xs text-muted-foreground">
                    All time transactions
                </p>
                </CardContent>
            </Card>
            </div>
        )}

        <Card>
            <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
            <TransactionTable transactions={transactions} pageSize={10} />
            </CardContent>
        </Card>
        </div>
    )
    }