    "use client"

    import { useState } from "react"
    import { useRouter } from "next/navigation"
    import Link from "next/link"
    import { useForm } from "react-hook-form"
    import { zodResolver } from "@hookform/resolvers/zod"
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
    import { Button } from "@/components/ui/button"
    import { Input } from "@/components/ui/input"
    import { Alert, AlertDescription } from "@/components/ui/alert"
    import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
    import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    } from "@/components/ui/select"
    import { authApi } from "@/lib/api/auth"
    import { registerSchema, type RegisterFormData } from "@/lib/validations/auth"
    import { AlertCircle, Loader2, CheckCircle2, User } from "lucide-react"

    export default function RegisterPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const form = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
        email: "",
        name: "",
        password: "",
        role: "USER",
        },
    })

    async function onSubmit(data: RegisterFormData) {
        setIsLoading(true)
        setError(null)

        try {
        await authApi.register(data)
        setSuccess(true)
        
        // Redirect to login after successful registration
        setTimeout(() => {
            router.push('/login')
        }, 2000)
        } catch (err) {
        setError(err instanceof Error ? err.message : 'Registration failed')
        } finally {
        setIsLoading(false)
        }
    }

    if (success) {
        return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
            <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Registration Successful!</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <Alert variant="success" className="mb-4">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                    Your account has been created successfully. Redirecting to login...
                </AlertDescription>
                </Alert>
            </CardContent>
            </Card>
        </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
        <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
            <CardDescription className="text-center">
                Sign up for your Airtime & Data account
            </CardDescription>
            </CardHeader>
            <CardContent>
            {error && (
                <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                            placeholder="John Doe"
                            autoComplete="name"
                            className="pl-10"
                            {...field}
                            />
                        </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                        <Input
                            placeholder="you@example.com"
                            type="email"
                            autoComplete="email"
                            {...field}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                        <Input
                            placeholder="********"
                            type="password"
                            autoComplete="new-password"
                            {...field}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Account Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select account type" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="USER">User</SelectItem>
                            <SelectItem value="VENDOR">Vendor</SelectItem>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                >
                    {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                    </>
                    ) : (
                    'Create Account'
                    )}
                </Button>

                <div className="text-center text-sm">
                    Already have an account?{" "}
                    <Link
                    href="/login"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium"
                    >
                    Sign in
                    </Link>
                </div>
                </form>
            </Form>
            </CardContent>
        </Card>
        </div>
    )
    }