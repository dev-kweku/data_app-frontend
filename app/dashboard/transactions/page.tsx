"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionTable } from "@/components/shared/transaction-table"
import { tokenService } from "@/lib/utils/token"
import { adminApi } from "@/lib/api/admin"
import { vendorApi } from "@/lib/api/vendor"
import { walletApi } from "@/lib/api/wallet"
import { User, Transaction } from "@/types"
import { AlertCircle, RefreshCw } from "lucide-react"
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

    export default function TransactionsPage() {
    const [user, setUser] = useState<User | null>(null)
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
        let transactionsData: Transaction[] = []
        
        if (userData.role === 'ADMIN') {
            transactionsData = await adminApi.getTransactions()
        } else if (userData.role === 'VENDOR') {
            transactionsData = await vendorApi.getTransactions()
        } else if (userData.role === 'USER') {
            transactionsData = await walletApi.getTransactions()
        }
    
        setTransactions(transactionsData)
        } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch transactions')
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transactions</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View your transaction history and status
          </p>
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

      <Card>
        <CardHeader>
          <CardTitle>
            {user?.role === 'ADMIN' ? 'All Transactions' : 'My Transactions'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionTable transactions={transactions} pageSize={20} />
        </CardContent>
      </Card>
    </div>
  )
}