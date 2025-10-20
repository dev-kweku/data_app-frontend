    "use client"

    import Link from "next/link"
    import { usePathname } from "next/navigation"
    import { cn } from "@/lib/utils"
    import { Button } from "@/components/ui/button"
    import { User } from "@/types"
    import { 
    LayoutDashboard, 
    Users, 
    CreditCard, 
    History, 
    User as UserIcon,
    LogOut,
    Smartphone,
    Wifi
    } from "lucide-react"

    interface SidebarProps {
    user: User
    onLogout: () => void
    onLinkClick?:()=>void
    }

    const navigation = {
    ADMIN: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Vendors', href: '/dashboard/vendors', icon: Users },
        { name: 'Transactions', href: '/dashboard/transactions', icon: History },
        { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
    ],
    VENDOR: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Airtime', href: '/dashboard/airtime', icon: Smartphone },
        { name: 'Data', href: '/dashboard/data', icon: Wifi },
        { name: 'Transactions', href: '/dashboard/transactions', icon: History },
        { name: 'Wallet', href: '/dashboard/wallet', icon: CreditCard },
        { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
    ],
    USER: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Wallet', href: '/dashboard/wallet', icon: CreditCard },
        { name: 'Transactions', href: '/dashboard/transactions', icon: History },
        { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
    ]
    }

    export function Sidebar({ user, onLogout }: SidebarProps) {
    const pathname = usePathname()
    const userNavigation = navigation[user.role]

    return (
        <div className="flex h-full flex-col bg-gray-900 text-white">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Smartphone className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold">Vendor Platform</span>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-3">
            {userNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                    "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    )}
                >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                </Link>
                )
            })}
            </nav>
        </div>

        <div className="p-4 border-t border-gray-700">
            <div className="flex items-center space-x-3 mb-4 p-2 rounded-lg bg-gray-800">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <UserIcon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.email}</p>
                <p className="text-xs text-gray-400 capitalize">{user.role.toLowerCase()}</p>
            </div>
            </div>
            <Button
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
            onClick={onLogout}
            >
            <LogOut className="mr-3 h-4 w-4" />
            Sign out
            </Button>
        </div>
        </div>
    )
    }