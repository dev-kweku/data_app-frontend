    import { API_BASE_URL } from '../utils/constants';
    import { tokenService } from '../utils/token';
    import { Vendor, Transaction, FundVendorData, CommissionData } from '../../types';

    class AdminApi {
    private baseUrl = `${API_BASE_URL}/admin`;

    async getVendors(): Promise<Vendor[]> {
        const response = await fetch(`${this.baseUrl}/vendors`, {
            method: 'GET',
            headers: tokenService.getAuthHeaders()
            });
            const data = await response.json();
            return data.vendors || [];
        }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async createVendor(vendorData: { email: string; name: string; password: string }): Promise<{ message: string; user: any }> {
        const response = await fetch(`${this.baseUrl}/vendors`, {
        method: 'POST',
        headers: tokenService.getAuthHeaders(),
        body: JSON.stringify(vendorData)
        });

        if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create vendor');
        }

        return response.json();
    }

    async fundVendor(fundData: FundVendorData): Promise<{ status: string; message: string }> {
        const response = await fetch(`${this.baseUrl}/vendors/fund`, {
            method: 'POST',
            headers: tokenService.getAuthHeaders(),
            body: JSON.stringify(fundData)
            });
        
            if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fund vendor');
            }
        
            return response.json();
        }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async setCommission(vendorId: string, commissionData: { rate: number; modelType: string }): Promise<{ message: string; commission: any }> {
        const response = await fetch(`${this.baseUrl}/vendors/${vendorId}/commission`, {
        method: 'POST',
        headers: tokenService.getAuthHeaders(),
        body: JSON.stringify(commissionData)
        });

        if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to set commission');
        }

        return response.json();
    }

    async getTransactions(): Promise<Transaction[]> {
        const response = await fetch(`${this.baseUrl}/transactions`, {
            method: 'GET',
            headers: tokenService.getAuthHeaders()
            });
            const data = await response.json();
            return data.transactions || [];
        }

    async getVendorWallet(userId: string): Promise<{ userId: string; balance: number }> {
        const response = await fetch(`${this.baseUrl}/wallet/${userId}`, {
        method: 'GET',
        headers: tokenService.getAuthHeaders()
        });

        if (!response.ok) {
        throw new Error('Failed to fetch wallet balance');
        }

        return response.json();
    }

      // get admin balance from tpp api/ backend api
    async getTPPBalance():Promise<{balance:number}>{
        const response=await fetch(`${this.baseUrl}/tpp/balance`,{
            method:`GET`,
            headers:tokenService.getAuthHeaders(),
        });
        if(!response.ok){
            const error=await response.json().catch(()=>({}));
            throw new Error(error.message||'Failed to fetch TPP balance')
        }

        return response.json()
        }
    }




    export const adminApi = new AdminApi();

