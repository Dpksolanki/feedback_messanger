'use client'

// Import necessary dependencies and hooks
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signInSchema } from "@/app/schemas/signInSchema"
import { signIn } from "next-auth/react"
import { useState } from "react"

const Page = () => {
    // Local state to manage form submission loading state
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Initialize toast notifications and router for redirection
    const { toast } = useToast()
    const router = useRouter()

    // Initialize React Hook Form using Zod for validation schema
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema), // Zod schema for validation
        defaultValues: {
            identifier: "",
            password: ""
        }
    })

    // Form submission handler
    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true) // Set loading state
        const response = await signIn('credentials', {
            redirect: false, 
            identifier: data.identifier,
            password: data.password,
        })

        setIsSubmitting(false) // Reset loading state after submission

        if(response?.error) {
            toast({
                title: "Login failed",
                description: response.error ?? "Incorrect username or password.",
                variant: "destructive"
            })
        } else if(response?.url) {
            router.replace('/dashboard') // Redirect to dashboard if successful
        }
    }

    // JSX for the sign-in form
    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-400 to-black-500">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign In</h2>

                {/* Form using React Hook Form with Zod schema */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>

                        {/* Email/Username field */}
                        <FormField
                            name="identifier"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email/Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your email or username" {...field} />
                                    </FormControl>
                                    <FormMessage /> {/* Show validation message */}
                                </FormItem>
                            )}
                        />

                        {/* Password field */}
                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Enter your password" {...field} />
                                    </FormControl>
                                    <FormMessage /> {/* Show validation message */}
                                </FormItem>
                            )}
                        />

                        {/* Submit button with loading state */}
                        <Button type="submit" disabled={isSubmitting} className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                            {isSubmitting ? 'Signing in...' : 'Sign In'}
                        </Button>

                        {/* Optional: Link to the sign-up page */}
                        <p className="text-sm text-center mt-4 text-gray-600">
                            Don't have an account? <a href="/sign-up" className="text-blue-600 hover:underline">Sign Up</a>
                        </p>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default Page
