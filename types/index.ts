    export interface User {
        id: string;
        email: string;
        name?: string;
        role: 'ADMIN' | 'VENDOR' | 'USER';
    }
    
    export interface AuthResponse {
        token: string;
        user: User;
    }
    
    export interface LoginData {
        email: string;
        password: string;
    }
    
    export interface RegisterData {
        email: string;
        name: string;
        password: string;
        role?: 'ADMIN' | 'VENDOR' | 'USER';
    }
    
    export interface Vendor {
        id: string;
        email: string;
        name: string;
        role: 'VENDOR';
        balance: number;
        createdAt: string;
    }
    
    export interface Transaction {
        id: string;
        trxnRef: string;  // This should be trxnRef, not reference
        userId: string;
        type: 'AIRTIME' | 'DATABUNDLE' | 'FUND_TRANSFER';
        amount: number;
        commission: number;
        recipient?: string;
        networkId?: string;
        bundlePlanId?: string;
        status: 'PENDING' | 'SUCCESS' | 'FAILED';
        createdAt: string;
        vendorPays?: number; 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        apiResponse?: any;
    }
    
    export interface WalletBalance {
        balance: number;
        currency?:string;
    }
    
    export interface AirtimePurchaseData {
        networkId: string;
        phoneNumber: string;
        amount: number;
    }
    
    export interface DataPurchaseData {
        networkId: string;
        phoneNumber: string;
        planId: string;
        amount: number;
    }
    
    export interface FundVendorData {
        vendorId: string;
        amount: number;
    }
    
    export interface CommissionData {
        rate: number;
        modelType: string;
    }
    
    // Add this interface for transaction results
    export interface TransactionResult {
        status: 'PENDING' | 'SUCCESS' | 'FAILED';
        message: string;
        reference?: string;
    }



    export interface DataBundle {
        planId: string | number;
        name: string;
        price: number;
        amount: number;
        validity?: string;
        volume?: string | number;
        networkName?: string;
      }
      
      
