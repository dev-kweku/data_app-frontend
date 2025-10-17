    import { API_BASE_URL } from "../utils/constants";
    import { tokenService } from "../utils/token";
    import { Transaction } from "../../types";

    export type TransactionStatus = "PENDING" | "SUCCESS" | "FAILED";

    export interface AirtimePurchaseRequest {
    networkId: string | number;
    phoneNumber: string;
    amount: number;
    }

    export interface AirtimeResponse {
    message: string;
    trxnRef: string;
    status: TransactionStatus;
    commission?: number;
    vendorPays?: number;
    }

    export interface DataBundleItem {
    plan_name?: string;
    planId: string;
    name: string;
    price: number;
    validity?: string;
    volume?: string;
    category?: string;
    networkId?: number;
    networkName?: string;
    }

    export interface DataBundleListResponse {
    networkId: number;
    bundles: DataBundleItem[];
    }

    export interface DataPurchaseRequest {
    networkId: number;
    phoneNumber: string;
    planId: string;
    amount: number;
    }

    export interface DataResponse {
    message: string;
    trxnRef: string;
    status: TransactionStatus;
    commission?: number;
    vendorPays?: number;
    }

    export interface WalletBalanceResponse {
    balance: number;
    }

    export interface TransactionListResponse {
    transactions: Transaction[];
    }

    
    const NETWORK_MAP: Record<number, string> = {
        0: "Unknown",
        1: "AirtelTigo",
        2: "EXPRESSO",
        3: "GLO",
        4: "MTN",
        5: "TiGO",
        6: "Telecel",
        8: "Busy",
        9: "Surfline",
        13: "MTN Yellow",
    };
    

    class VendorApi {
    private baseUrl = `${API_BASE_URL}/vendor`;

    private async handleFetch<T>(
        url: string,
        options?: RequestInit,
        errorMsg = "Request failed"
    ): Promise<T> {
        try {
        const res = await fetch(url, options);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.message || errorMsg);
        return data as T;
        } catch (err) {
        console.error("Fetch error:", err);
        throw err;
        }
    }

    async buyAirtime(purchaseData: AirtimePurchaseRequest): Promise<AirtimeResponse> {
        const data = await this.handleFetch<AirtimeResponse>(
        `${this.baseUrl}/airtime`,
        {
            method: "POST",
            headers: { ...tokenService.getAuthHeaders(), "Content-Type": "application/json" },
            body: JSON.stringify(purchaseData),
        },
        "Airtime purchase failed"
        );

        return {
        message: data.message || "Airtime purchase processed",
        trxnRef: data.trxnRef || "",
        status: ["PENDING", "SUCCESS", "FAILED"].includes(data.status)
            ? data.status
            : "PENDING",
        commission: data.commission,
        vendorPays: data.vendorPays,
        };
    }

    async buyData(purchaseData: DataPurchaseRequest): Promise<DataResponse> {
        const data = await this.handleFetch<DataResponse>(
        `${this.baseUrl}/data-bundle`,
        {
            method: "POST",
            headers: { ...tokenService.getAuthHeaders(), "Content-Type": "application/json" },
            body: JSON.stringify(purchaseData),
        },
        "Data bundle purchase failed"
        );

        return {
        message: data.message || "Data purchase processed",
        trxnRef: data.trxnRef || "",
        status: ["PENDING", "SUCCESS", "FAILED"].includes(data.status)
            ? data.status
            : "PENDING",
        commission: data.commission,
        vendorPays: data.vendorPays,
        };
    }

    async getWalletBalance(): Promise<number> {
        const data = await this.handleFetch<WalletBalanceResponse>(
        `${this.baseUrl}/wallet`,
        { method: "GET", headers: tokenService.getAuthHeaders() },
        "Failed to fetch wallet balance"
        );
        return data.balance ?? 0;
    }

    async getTransactions(): Promise<Transaction[]> {
        const data = await this.handleFetch<TransactionListResponse>(
        `${this.baseUrl}/transactions`,
        { method: "GET", headers: tokenService.getAuthHeaders() },
        "Failed to fetch transactions"
        );
        return Array.isArray(data.transactions) ? data.transactions : [];
    }

    async getDataBundleList(networkId: number): Promise<DataBundleItem[]> {
        try {
        if (!networkId || isNaN(networkId)) return [];

        const data = await this.handleFetch<DataBundleListResponse>(
            `${this.baseUrl}/data-bundles?networkId=${networkId}`,
            { method: "GET", headers: tokenService.getAuthHeaders() },
            "Failed to fetch data bundle list"
        );

        if (!data || !Array.isArray(data.bundles)) return [];

        return data.bundles.map((item) => ({
            planId: String(item.planId || item.plan_name || "N/A"),
            name: item.name || item.plan_name || "Unknown Plan",
            price: Number(item.price ?? 0),
            validity: item.validity || "N/A",
            volume: item.volume || "",
            category: item.category || "",
            networkId: Number(item.networkId ?? data.networkId),
            networkName: item.networkName || "Unknown Network",
        }));
        } catch (err) {
        console.error(`Error fetching data bundles for network ${networkId}:`, err);
        return []; // never throw
        }
    }

    async getNetworkVolumeData(networkId: number): Promise<DataBundleItem[]> {
        return this.getDataBundleList(networkId);
    }

    async getNetworks(): Promise<{ id: number; name: string }[]> {
        try {
        const networkIds = [1, 2, 3, 4,5,6,7,8,9,10,11,12,13];
        const allBundles = await Promise.all(networkIds.map((id) => this.getNetworkVolumeData(id)));

        const networkMap = new Map<number, string>();

        networkIds.forEach((id) => {
            networkMap.set(id, NETWORK_MAP[id] ?? `Network ${id}`);
        });

        // Override with real names from bundles if available
        allBundles.flat().forEach((b) => {
            if (b.networkId && b.networkName) networkMap.set(b.networkId, b.networkName);
        });

        return Array.from(networkMap.entries())
            .map(([id, name]) => ({ id, name }))
            .sort((a, b) => a.id - b.id);
        } catch (err) {
        console.error("Failed to fetch networks:", err);
        // fallback to static map
        return Object.entries(NETWORK_MAP).map(([id, name]) => ({ id: Number(id), name }));
        }
    }
    }

    export const vendorApi = new VendorApi();
