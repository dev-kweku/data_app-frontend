    import { API_BASE_URL } from '../utils/constants';
    import { tokenService } from '../utils/token';
    import { AuthResponse, LoginData, RegisterData, User } from '../../types';

    class AuthApi {
    private baseUrl = `${API_BASE_URL}/auth`;

    async login(loginData: LoginData): Promise<AuthResponse> {
        const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
        });

        if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
        }

        const data: AuthResponse = await response.json();
        tokenService.setToken(data.token);
        return data;
    }

    async register(registerData: RegisterData): Promise<{ message: string; user: User }> {
        const response = await fetch(`${this.baseUrl}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData)
            });
        
            if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Registration failed');
            }
        
            return response.json();
        }

    async getProfile(): Promise<{ user: User }> {
        const token = tokenService.getToken();
        if (!token) {
            throw new Error('No authentication token found');
            }
        
            const response = await fetch(`${this.baseUrl}/profile`, {
            method: 'GET',
            headers: tokenService.getAuthHeaders()
            });
        
            if (!response.ok) {
            if (response.status === 401) {
                tokenService.removeToken();
            }
            throw new Error('Failed to fetch profile');
            }
        
            return response.json();
        }

    logout(): void {
        tokenService.removeToken();
    }
    }

    export const authApi = new AuthApi();