'use client'

// Import necessary dependencies and hooks
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link" // Correct import (lowercase 'l')
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/app/schemas/signUpSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/apiResponse"
import { useEffect, useState } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

const Page = () => {
    // Local states for username validation, form submission, etc.
    const [username, setUsername] = useState("") // Username input
    const [usernameMessage, setUsernameMessage] = useState("") // Message to show if username is available or taken
    const [isCheckingUsername, setIsCheckingUsername] = useState(false) // Show loader while checking username
    const [isSubmitting, setIsSubmitting] = useState(false) // Show loader while form is submitting

    // Initialize toast notifications and router for redirection
    const { toast } = useToast()
    const router = useRouter()

    // Initialize React Hook Form using Zod for validation schema
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema), // Zod schema for validation
        defaultValues: {
            username: "",
            email: "",
            password: ""
        }
    })

    // Debounce username input to avoid sending multiple requests on every keystroke
    const debounced = useDebounceCallback(setUsername, 1000)

    // Effect hook to check if the username is unique whenever debouncedUsername changes
    useEffect(() => {
        const checkUserNameUnique = async () => {
            if (username) {
                setIsCheckingUsername(true)
                setUsernameMessage('') // Clear previous message

                try {
                    // Send a request to check if username is available
                    const response = await axios.get(`/api/check-username-unique?username=${username}`)
                    setUsernameMessage(response.data.message) // Update message based on response

                } catch (error) {
                    // Handle any errors during the API call
                    const axiosError = error as AxiosError<ApiResponse>;
                    setUsernameMessage(axiosError.response?.data?.message ??
                        "Error checking username")
                } finally {
                    setIsCheckingUsername(false) // Stop loader
                }
            }
        }
        checkUserNameUnique() // Invoke the function to check username uniqueness
    }, [username]) // Run effect when debouncedUsername changes

    // Form submission handler
    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true) // Start submission loader
        try {
            // Send form data to the sign-up API
            const response = await axios.post<ApiResponse>('/api/sign-up', data)

            // Show success or error toast based on response
            toast({
                title: response.data.success ? "Success" : "Error",
                description: response.data.message,
            })

            // Redirect to verification page if sign-up is successful
            router.replace(`/verify/${username}`)

        } catch (error) {
            console.error("Error during sign-up", error)

            // Handle error during sign-up API call
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data?.message

            // Show error toast notification
            toast({
                title: "Sign up failed",
                description: errorMessage ?? "Failed to sign-up",
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false) // Stop submission loader
        }
    }

    // JSX for the sign-up form
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

                {/* Form using React Hook Form with Zod schema */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        
                        {/* Username field with validation */}
                        <FormField
                            name="username"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Username" {...field}
                                            onChange={(e) => {
                                                field.onChange(e) // Trigger form state update
                                                debounced(e.target.value) // Update local username state
                                            }} />
                                    </FormControl>
                                    {/* Show loader or message while checking username */}
                                    {isCheckingUsername ? (
                                        <p className="text-sm text-blue-500">Checking username...</p>
                                    ) : (
                                        <p className={`text-sm ${usernameMessage === 'Username available' ? 'text-green-500' : 'text-red-500'}`}>
                                            {usernameMessage} {/* Display username availability message */}
                                        </p>
                                    )}
                                    <FormMessage /> {/* Show validation message */}
                                </FormItem>
                            )}
                        />

                        {/* Email field */}
                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email" {...field} />
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
                                        <Input type="password" placeholder="Password" {...field} />
                                    </FormControl>
                                    <FormMessage /> {/* Show validation message */}
                                </FormItem>
                            )}
                        />

                        {/* Submit button with loading state */}
                        <Button type="submit" disabled={isSubmitting} className="w-full mt-4">
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" /> {/* Loader icon */}
                                    Please wait...
                                </>
                            ) : (
                                'Sign Up' 
                            )}
                        </Button>

                        {/* Link to login page */}
                        <p className="text-sm text-center mt-4">
                            Already have an account? <Link href="/sign-in" className="text-blue-600">Login</Link>
                        </p>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default Page
