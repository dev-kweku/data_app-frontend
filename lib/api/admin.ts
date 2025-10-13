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

    // async fundVendor(fundData: FundVendorData): Promise<{ status: string; message: string }> {
    //     const response = await fetch(`${this.baseUrl}/vendors/fund`, {
    //         method: 'POST',
    //         headers: tokenService.getAuthHeaders(),
    //         body: JSON.stringify(fundData)
    //         });
        
    //         if (!response.ok) {
    //         const error = await response.json();
    //         throw new Error(error.message || 'Failed to fund vendor');
    //         }
        
    //         return response.json();
    //     }


    // update fund vendor function
    async fundVendor(fundData: FundVendorData): Promise<{ status: string; message: string; remainingTPPBalance?: number }> {
        try {
            const response = await fetch(`${this.baseUrl}/vendors/fund`, {
                method: 'POST',
                headers: {
                ...tokenService.getAuthHeaders(),
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(fundData),
            });
        
            
            const text = await response.text();
        
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let data: any;
            try {
                data = JSON.parse(text);
            } catch {
                console.log(" fundVendor(): Non-JSON response:", text.slice(0, 200));
                throw new Error("Server returned an invalid response (HTML or non-JSON).");
            }
        
            if (!response.ok) {
                const errorMsg = data?.message || `Failed to fund vendor (status ${response.status})`;
                throw new Error(errorMsg);
            }
        
            return {
                status: data.status || "success",
                message: data.message || "Vendor funded successfully",
                remainingTPPBalance: data.remainingTPPBalance,
            };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
            console.error(" fundVendor() error:", err.message);
            throw new Error(err.message || "Failed to fund vendor");
            }
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

        const data=await response.json()
        const balance=Number(data.balance||0)
        return {balance}

        // return response.json()
        }
    }




    export const adminApi = new AdminApi();

