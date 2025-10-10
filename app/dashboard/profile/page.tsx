    "use client"

    import { useState, useEffect } from "react"
    import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
    import { Button } from "@/components/ui/button"
    import { Input } from "@/components/ui/input"
    import { Label } from "@/components/ui/label"
    import { Alert, AlertDescription } from "@/components/ui/alert"
    import { authApi } from "@/lib/api/auth"
    import { User } from "@/types"
    import { AlertCircle, Loader2, CheckCircle2, User as UserIcon, Mail, Shield } from "lucide-react"

    export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
        const response = await authApi.getProfile()
        setUser(response.user) // Extract user from response
        } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch profile')
        } finally {
        setLoading(false)
        }
    }

    const handleSave = async () => {
        if (!user) return

        setSaving(true)
        setError(null)
        setSuccess(false)

        try {
        // In a real app, you would call an API to update the profile
        // For now, we'll simulate a successful update
        await new Promise(resolve => setTimeout(resolve, 1000))
        setSuccess(true)
        
        // Hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000)
        } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update profile')
        } finally {
        setSaving(false)
        }
    }

    if (loading) {
        return (
        <div className="flex items-center justify-center min-h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        )
    }

    if (!user) {
        return (
        <div className="flex items-center justify-center min-h-64">
            <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Failed to load profile</AlertDescription>
            </Alert>
        </div>
        )
    }

    return (
        <div className="space-y-6">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your account settings and preferences
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                {error && (
                    <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {success && (
                    <Alert variant="success">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>Profile updated successfully</AlertDescription>
                    </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                        id="email"
                        type="email"
                        value={user.email}
                        className="pl-10"
                        readOnly
                        />
                    </div>
                    </div>

                    <div className="space-y-2">
                    <Label htmlFor="role">Account Role</Label>
                    <div className="relative">
                        <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                        id="role"
                        value={user.role}
                        className="pl-10 capitalize"
                        readOnly
                        />
                    </div>
                    </div>
                </div>

                {user.name && (
                    <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        value={user.name}
                        readOnly
                    />
                    </div>
                )}

                {/* <div className="space-y-2">
                    <Label htmlFor="userId">User ID</Label>
                    <Input
                    id="userId"
                    value={user.id}
                    readOnly
                    className="font-mono"
                    />
                </div> */}

                <div className="pt-4">
                    <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                        <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                        </>
                    ) : (
                        'Save Changes'
                    )}
                    </Button>
                </div>
                </CardContent>
            </Card>
            </div>

            <div className="space-y-6">
            <Card>
                <CardHeader>
                <CardTitle>Account Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                    <p className="font-medium text-gray-900 dark:text-white">{user.email}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{user.role.toLowerCase()}</p>
                    </div>
                </div>

                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Member since</span>
                    <span className="text-gray-900 dark:text-white">
                        {new Date().toLocaleDateString()}
                    </span>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Status</span>
                    <span className="text-green-600 font-medium">Active</span>
                    </div>
                </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                <CardTitle>Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                    Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                    Two-Factor Authentication
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                    Delete Account
                </Button>
                </CardContent>
            </Card>
            </div>
        </div>
        </div>
    )
    }