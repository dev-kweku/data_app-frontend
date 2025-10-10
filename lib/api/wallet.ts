    import { API_BASE_URL } from '../utils/constants';
    import { tokenService } from '../utils/token';
    import { WalletBalance, Transaction } from '../../types';

    class WalletApi {
    private baseUrl = `${API_BASE_URL}/wallet`;

    async getBalance(): Promise<number> {
        const response = await fetch(`${this.baseUrl}/balance`, {
            method: 'GET',
            headers: tokenService.getAuthHeaders()
            });
        
            if (!response.ok) {
            throw new Error('Failed to fetch wallet balance');
            }
        
            const data = await response.json();
            return data.balance;
        }
        
        async getTransactions(): Promise<Transaction[]> {
            const response = await fetch(`${this.baseUrl}/transactions`, {
            method: 'GET',
            headers: tokenService.getAuthHeaders()
            });
        
            if (!response.ok) {
            throw new Error('Failed to fetch transactions');
            }
        
            const data = await response.json();
            return data.transactions || [];
        }
    }

    export const walletApi = new WalletApi();