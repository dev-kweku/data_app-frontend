    class TokenService {
        private readonly tokenKey = 'accessToken';
    
        getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(this.tokenKey);
        }
    
        setToken(token: string): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem(this.tokenKey, token);
        }
    
        removeToken(): void {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(this.tokenKey);
        }
    
        getAuthHeaders(): HeadersInit {
        const token = this.getToken();
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        }
    }
    
    export const tokenService = new TokenService();