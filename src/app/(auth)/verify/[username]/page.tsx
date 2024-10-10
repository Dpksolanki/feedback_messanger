"use client";

import { verifySchema } from '@/app/schemas/verifySchema'; // Importing the Zod schema for form validation
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast'; // Custom toast hook for notifications
import { ApiResponse } from '@/types/apiResponse'; // API response type
import { zodResolver } from '@hookform/resolvers/zod'; // Zod resolver for react-hook-form
import axios, { AxiosError } from 'axios'; // Axios for making API requests
import { useParams, useRouter } from 'next/navigation'; // Next.js router hooks for navigation
import React from 'react';
import { useForm } from 'react-hook-form'; // Form handling hook
import * as z from 'zod'; // Zod for schema validation

const VerifyCode = () => {
  const router = useRouter(); // Initialize router for navigation
  const params = useParams<{ username: string }>(); // Get the username from the URL params
  const { toast } = useToast(); // Toast notification handler

  // Initializing the form with Zod schema validation
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema), // Zod schema for validation
  });

  // Function to handle form submission
  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      // Make API request to verify the code
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });

      // Show success toast notification
      toast({
        title: 'Success',
        description: response.data.message,
      });

      // Redirect to sign-in page after successful verification
      router.replace('/sign-in');
    } catch (error) {
      console.error('Error during verification', error);

      // Handle error during verification API call
      const axiosError = error as AxiosError<ApiResponse>;

      // Show error toast notification
      toast({
        title: 'Verification failed',
        description: axiosError.response?.data?.message ?? 'Failed to verify code',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Verify Code</h1>
        
        {/* Make sure Form wraps only a single child */}
        <Form {...form}>
          {/* Form starts here */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter verification code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VerifyCode;
