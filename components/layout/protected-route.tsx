    "use client"

    import { useEffect, useState } from "react"
    import { useRouter } from "next/navigation"
    import { tokenService } from "@/lib/utils/token"

    interface ProtectedRouteProps {
    children: React.ReactNode
    allowedRoles?: string[]
    }

    export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const router = useRouter()
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

    useEffect(() => {
        const checkAuth = () => {
        const token = tokenService.getToken()
        
        if (!token) {
            router.push('/login')
            return
        }

        // For now, we'll authorize if token exists
        // Role-based authorization can be added later when user profile is available
        setIsAuthorized(true)
        }

        checkAuth()
    }, [router])

    if (isAuthorized === null) {
        return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
        )
    }

    return <>{children}</>
    }