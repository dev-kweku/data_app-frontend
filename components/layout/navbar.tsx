    "use client"

    import { useState } from "react"
    import { Button } from "@/components/ui/button"
    import { User } from "@/types"
    import { Menu, X, Bell, User as UserIcon } from "lucide-react"
    import { ThemeToggle } from "@/components/themes/theme-toggle"

    interface NavbarProps {
    user: User
    onToggleSidebar: () => void
    sidebarOpen: boolean
    }

    export function Navbar({ user, onToggleSidebar, sidebarOpen }: NavbarProps) {
    const [notificationsOpen, setNotificationsOpen] = useState(false)

    return (
        <header className="bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700 sticky top-0 z-10">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
            <Button
                variant="ghost"
                size="icon"
                onClick={onToggleSidebar}
                className="lg:hidden"
            >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
            <h1 className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">Airtime & Data</h1>
            </div>

            <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
                <Bell className="h-5 w-5" />
            </Button>

            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <UserIcon className="h-4 w-4 text-white" />
                </div>
                <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.email}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role.toLowerCase()}</p>
                </div>
            </div>
            </div>
        </div>
        </header>
    )
    }