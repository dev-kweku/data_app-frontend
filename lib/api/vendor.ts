    import { API_BASE_URL } from '../utils/constants'
    import { tokenService } from '../utils/token'
    import { Transaction } from '../../types'

    // ✅ Define shared transaction response status type
    export type TransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED'

    // ✅ Airtime request + response types
    export interface AirtimePurchaseRequest {
    networkId: string
    phoneNumber: string
    amount: number
    }

    export interface AirtimeResponse {
    message: string
    trxnRef: string
    status: TransactionStatus
    }

    // ✅ Data bundle request + response types
    export interface DataPurchaseRequest {
    networkId: string
    phoneNumber: string
    planId: string
    amount: number
    }

    export interface DataResponse {
    message: string
    trxnRef: string
    status: TransactionStatus
    }

    // ✅ Wallet + transaction types
    export interface WalletBalanceResponse {
    balance: number
    }

    export interface TransactionListResponse {
    transactions: Transaction[]
    }

    // 🧠 Vendor API class
    class VendorApi {
    private baseUrl = `${API_BASE_URL}/vendor`

    // ✅ Buy Airtime
    async buyAirtime(purchaseData: AirtimePurchaseRequest): Promise<AirtimeResponse> {
        const response = await fetch(`${this.baseUrl}/airtime`, {
        method: 'POST',
        headers: tokenService.getAuthHeaders(),
        body: JSON.stringify(purchaseData),
        })

        if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Airtime purchase failed')
        }

        const data = await response.json()
        const validStatus: TransactionStatus =
        ['PENDING', 'SUCCESS', 'FAILED'].includes(data.status) ? data.status : 'PENDING'

        return { ...data, status: validStatus }
    }

    // ✅ Buy Data Bundle
    async buyData(purchaseData: DataPurchaseRequest): Promise<DataResponse> {
        const response = await fetch(`${this.baseUrl}/databundle`, {
        method: 'POST',
        headers: tokenService.getAuthHeaders(),
        body: JSON.stringify(purchaseData),
        })

        if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Data bundle purchase failed')
        }

        const data = await response.json()
        const validStatus: TransactionStatus =
        ['PENDING', 'SUCCESS', 'FAILED'].includes(data.status) ? data.status : 'PENDING'

        return { ...data, status: validStatus }
    }

    // ✅ Get Wallet Balance
    async getWalletBalance(): Promise<number> {
        const response = await fetch(`${this.baseUrl}/wallet`, {
        method: 'GET',
        headers: tokenService.getAuthHeaders(),
        })

        if (!response.ok) throw new Error('Failed to fetch wallet balance')

        const data: WalletBalanceResponse = await response.json()
        return data.balance
    }

    // Get Transaction History
    async getTransactions(): Promise<Transaction[]> {
        const response = await fetch(`${this.baseUrl}/transactions`, {
        method: 'GET',
        headers: tokenService.getAuthHeaders(),
        })

        if (!response.ok) throw new Error('Failed to fetch transactions')

        const data: TransactionListResponse = await response.json()
        return data.transactions || []
    }
    }

    export const vendorApi = new VendorApi()
