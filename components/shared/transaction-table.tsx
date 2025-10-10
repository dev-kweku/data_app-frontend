    "use client"

    import { useState } from "react"
    import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    } from "@/components/ui/table"
    import { Badge } from "@/components/ui/badge"
    import { Button } from "@/components/ui/button"
    import { Transaction } from "@/types"
    import { TRANSACTION_STATUS } from "@/lib/utils/constants"
    import { ChevronLeft, ChevronRight } from "lucide-react"

    interface TransactionTableProps {
    transactions: Transaction[]
    pageSize?: number
    }

    export function TransactionTable({ transactions, pageSize = 20 }: TransactionTableProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = Math.ceil(transactions.length / pageSize)
    
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    const currentTransactions = transactions.slice(startIndex, endIndex)

    const getStatusBadge = (status: Transaction['status']) => {
        const statusConfig = TRANSACTION_STATUS[status]
        return (
        <Badge variant={
            status === 'SUCCESS' ? 'success' :
            status === 'PENDING' ? 'warning' : 'error'
        }>
            {statusConfig.label}
        </Badge>
        )
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
        })
    }

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
        }).format(amount)
    }

    return (
        <div className="space-y-4">
        <div className="rounded-md border">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reference</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {currentTransactions.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No transactions found
                    </TableCell>
                </TableRow>
                ) : (
                currentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                        {formatDate(transaction.createdAt)}
                    </TableCell>
                    <TableCell>
                        <Badge variant="outline" className="capitalize">
                        {transaction.type.toLowerCase().replace('_', ' ')}
                        </Badge>
                    </TableCell>
                    <TableCell>{formatAmount(transaction.amount)}</TableCell>
                    <TableCell>{transaction.recipient || '-'}</TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    <TableCell className="font-mono text-xs">
                        {transaction.trxnRef}
                    </TableCell>
                    </TableRow>
                ))
                )}
            </TableBody>
            </Table>
        </div>

        {totalPages > 1 && (
            <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1}-{Math.min(endIndex, transactions.length)} of{" "}
                {transactions.length} transactions
            </div>
            <div className="flex items-center space-x-2">
                <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                >
                <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">
                Page {currentPage} of {totalPages}
                </span>
                <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                >
                <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
            </div>
        )}
        </div>
    )
    }