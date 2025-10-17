    import { API_BASE_URL } from '../utils/constants';
    import { tokenService } from '../utils/token';
    import { Vendor, Transaction, FundVendorData } from '../../types';

    class AdminApi {
    private baseUrl = `${API_BASE_URL}/admin`;

    // ✅ Get all vendors
    async getVendors(): Promise<Vendor[]> {
        const response = await fetch(`${this.baseUrl}/vendors`, {
        method: 'GET',
        headers: tokenService.getAuthHeaders(),
        });

        if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to fetch vendors');
        }

        const data = await response.json();
        return data.vendors || [];
    }

    // ✅ Create a new vendor
    async createVendor(vendorData: { email: string; name: string; password: string }): Promise<{ message: string; vendor: Vendor }> {
        const response = await fetch(`${this.baseUrl}/vendors`, {
        method: 'POST',
        headers: {
            ...tokenService.getAuthHeaders(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(vendorData),
        });

        if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to create vendor');
        }

        return response.json();
    }

    
async fundVendor(fundData: FundVendorData): Promise<{
    status: string;
    message: string;
    remainingTPPBalance?: number;
    }> {
        if (!fundData.vendorId) {
        throw new Error("vendorId is required");
        }
    
        const response = await fetch(
        `${this.baseUrl}/vendors/${fundData.vendorId}/fund`,
        {
            method: "POST",
            headers: {
            ...tokenService.getAuthHeaders(),
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount: fundData.amount }),
        }
        );
    
        const text = await response.text();
    
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let data: any;
        try {
        data = JSON.parse(text);
        } catch {
        console.error("fundVendor(): Non-JSON response:", text.slice(0, 200));
        throw new Error(
            "Server returned an invalid response (HTML or non-JSON)."
        );
        }
    
        if (!response.ok) {
        const errorMsg =
            data?.message ||
            `Failed to fund vendor (status ${response.status})`;
        throw new Error(errorMsg);
        }
    
        return {
        status: data.status || "success",
        message:
            data.message ||
            "Vendor funded successfully (internal wallet transfer only)",
        remainingTPPBalance: data.remainingTPPBalance, // optional info, read-only
        };
    }
    

    // ✅ Set vendor commission
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async setCommission(vendorId: string, commissionData: { rate: number; modelType: string }): Promise<{ message: string; commission: any }> {
        const response = await fetch(`${this.baseUrl}/vendors/${vendorId}/commission`, {
        method: 'POST',
        headers: {
            ...tokenService.getAuthHeaders(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(commissionData),
        });

        if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to set commission');
        }

        return response.json();
    }

    // ✅ Get all transactions
    async getTransactions(): Promise<Transaction[]> {
        const response = await fetch(`${this.baseUrl}/transactions`, {
        method: 'GET',
        headers: tokenService.getAuthHeaders(),
        });

        if (!response.ok) throw new Error('Failed to fetch transactions');

        const data = await response.json();
        return data.transactions || [];
    }

    // ✅ Get vendor wallet balance
    async getVendorWallet(userId: string): Promise<{ userId: string; balance: number }> {
        const response = await fetch(`${this.baseUrl}/wallet/${userId}`, {
        method: 'GET',
        headers: tokenService.getAuthHeaders(),
        });

        if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to fetch vendor wallet balance');
        }

        return response.json();
    }

    // ✅ Get TPP balance (admin wallet)
    async getTPPBalance(): Promise<{ balance: number }> {
        const response = await fetch(`${this.baseUrl}/tpp/balance`, {
        method: 'GET',
        headers: tokenService.getAuthHeaders(),
        });

        if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to fetch TPP balance');
        }

        const data = await response.json();
        return { balance: Number(data.balance || 0) };
    }

    async getDataBundleList(networkId: number) {
        const response = await fetch(`${this.baseUrl}/data-bundles?networkId=${networkId}`, {
            method: "GET",
            headers: tokenService.getAuthHeaders(),
            });
        
            if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || "Failed to fetch data bundles");
            }
        
            return response.json();
        }
        
    }

    export const adminApi = new AdminApi();
