    "use client"

    import { useState, useEffect } from "react"
    import { useRouter } from "next/navigation"
    import { Sidebar } from "@/components/layout/sidebar"
    import { Navbar } from "@/components/layout/navbar"
    import { ProtectedRoute } from "@/components/layout/protected-route"
    import { tokenService } from "@/lib/utils/token"
    import { User } from "@/types"
    import { X } from "lucide-react"

    // Helper function to decode JWT safely
    const getUserFromToken = (): User | null => {
    const token = tokenService.getToken()
    if (!token) return null

    try {
        // Check if token has the correct JWT format (3 parts separated by dots)
        const tokenParts = token.split('.')
        if (tokenParts.length !== 3) {
        console.error('Invalid token format')
        return null
        }

        // Decode the payload part (second part)
        const payload = tokenParts[1]
        
        // Add padding if needed for base64 decode
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
        const paddedBase64 = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=')
        
        const decodedPayload = atob(paddedBase64)
        const userData = JSON.parse(decodedPayload)
        
        return {
        id: userData.id || userData.sub || 'unknown',
        email: userData.email || 'unknown@example.com',
        role: userData.role || 'USER'
        }
    } catch (error) {
        console.error('Error decoding token:', error)
        return null
    }
    }

    // Alternative: Store user data in localStorage after login
    const getUserFromStorage = (): User | null => {
    if (typeof window === 'undefined') return null
    
    try {
        const userData = localStorage.getItem('userData')
        if (userData) {
        return JSON.parse(userData)
        }
    } catch (error) {
        console.error('Error reading user data from storage:', error)
    }
    return null
    }

    export default function DashboardLayout({
    children,
    }: {
    children: React.ReactNode
    }) {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Try to get user from localStorage first (set during login)
        let userData = getUserFromStorage()
        
        // If not in localStorage, try to decode from token
        if (!userData) {
        userData = getUserFromToken()
        }

        if (!userData) {
        tokenService.removeToken()
        localStorage.removeItem('userData')
        router.push('/login')
        return
        }

        setUser(userData)
        setLoading(false)
    }, [router])

    const handleLogout = () => {
        tokenService.removeToken()
        localStorage.removeItem('userData')
        router.push('/login')
    }

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen)
    }

    if (loading) {
        return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
        )
    }

    if (!user) {
        return null
    }

    return (
        <ProtectedRoute>
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar for desktop */}
            <div className="hidden lg:flex lg:flex-shrink-0">
            <div className="flex flex-col w-64">
                <Sidebar user={user} onLogout={handleLogout} />
            </div>
            </div>

            {/* Sidebar for mobile */}
            {sidebarOpen && (
            <div className="lg:hidden fixed inset-0 flex z-40">
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={toggleSidebar} />
                <div className="relative flex-1 flex flex-col max-w-xs w-full">
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={toggleSidebar}
                    >
                    <span className="sr-only">Close sidebar</span>
                    <X className="h-6 w-6 text-white" />
                    </button>
                </div>
                <Sidebar user={user} onLogout={handleLogout} />
                </div>
            </div>
            )}

            <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
            <Navbar 
                user={user} 
                onToggleSidebar={toggleSidebar}
                sidebarOpen={sidebarOpen}
            />
            <main className="flex-1 relative overflow-y-auto focus:outline-none">
                <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
                </div>
            </main>
            </div>
        </div>
        </ProtectedRoute>
    )
    }