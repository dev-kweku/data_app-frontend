    import { API_BASE_URL } from "../utils/constants";
    import { tokenService } from "../utils/token";
    import { Transaction } from "../../types";

    class WalletApi {
    private getBaseUrl(role: "vendor" | "admin" = "vendor") {
        return `${API_BASE_URL}/${role}`;
    }

    /**
     * Get wallet balance for vendor or admin
     */
    async getBalance(role: "vendor" | "admin" = "vendor"): Promise<number> {
        const token = tokenService.getToken();
        if (!token) throw new Error("No authentication token found");

        const response = await fetch(`${this.getBaseUrl(role)}/wallet`, {
        method: "GET",
        headers: tokenService.getAuthHeaders(),
        });

        if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Failed to fetch wallet balance: ${errText}`);
        }

        const data = await response.json();
        return data.balance ?? 0;
    }

    /**
     * Fetch transaction history for vendor or admin
     * @param role - "vendor" or "admin"
     * @param params - Optional query params (limit, date range, etc.)
     */
    async getTransactions(
        role: "vendor" | "admin" = "vendor",
        params?: { limit?: number; startDate?: string; endDate?: string }
    ): Promise<Transaction[]> {
        const token = tokenService.getToken();
        if (!token) throw new Error("No authentication token found");

        const query = new URLSearchParams();
        if (params?.limit) query.append("limit", params.limit.toString());
        if (params?.startDate) query.append("startDate", params.startDate);
        if (params?.endDate) query.append("endDate", params.endDate);

        const url = `${this.getBaseUrl(role)}/transactions${
        query.toString() ? `?${query.toString()}` : ""
        }`;

        const response = await fetch(url, {
        method: "GET",
        headers: tokenService.getAuthHeaders(),
        });

        if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Failed to fetch transactions: ${errText}`);
        }

        const data = await response.json();
        return data.transactions || [];
    }
    }

    export const walletApi = new WalletApi();
