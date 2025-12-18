    "use client"

    import { useState } from "react"
    import { useRouter } from "next/navigation"
    // import Link from "next/link"
    import { useForm } from "react-hook-form"
    import { zodResolver } from "@hookform/resolvers/zod"
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
    import { Button } from "@/components/ui/button"
    import { Input } from "@/components/ui/input"
    // import { Label } from "@/components/ui/label"
    import { Alert, AlertDescription } from "@/components/ui/alert"
    import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
    import { authApi } from "@/lib/api/auth"
    import { loginSchema, type LoginFormData } from "@/lib/validations/auth"
    import { AlertCircle, Loader2 } from "lucide-react"

    export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
        email: "",
        password: "",
        },
    })

    async function onSubmit(data: LoginFormData) {
        setIsLoading(true)
        setError(null)
        
            try {
            const response = await authApi.login(data)
            
            // Store user data in localStorage for easy access
            if (typeof window !== 'undefined') {
                localStorage.setItem('userData', JSON.stringify(response.user))
            }
            
            // Redirect to dashboard
            router.push('/dashboard')
            } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed')
            } finally {
            setIsLoading(false)
            }
        }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
                Login to manage your Airtime & Data
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
                            autoComplete="current-password"
                            {...field}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <div className="flex items-center justify-between text-sm">
                    <button
                    type="button"
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                    Forgot password?
                    </button>
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                >
                    {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                    </>
                    ) : (
                    'Login'
                    )}
                </Button>

                {/* <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link
                    href="/register"
                    className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
                    >
                    Sign up
                    </Link>
                </div> */}
                </form>
            </Form>
            </CardContent>
        </Card>
        </div>
    )
    }