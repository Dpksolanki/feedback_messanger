import {z} from "zod"

export const userNameValidation = z.

            string()
            .min(2, "Name should be at least 2 characters long")
            .max(30, "Name should not exceed 30 characters")
            .regex(/^[a-zA-Z\s]+$/, "Name should only contain alphabetic characters and spaces")

export const signUpSchema = z.object({
    username: userNameValidation,
    email: z.string().email(),
    password: z.string()
    .min(6, "Password should be at least 6 characters long")
    .max(30, "Password should not exceed 30 characters"),
    // confirmPassword: z.string().refine((value) => value === z.string().refine((value) => password.toString(), "Passwords do not match"), "Passwords do not match")
})

