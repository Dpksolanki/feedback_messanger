import {z} from "zod"

export const messageSchema = z.object({
    content: z.string()
    .max(50 , {message: "content is max 50 characters"})
    .min(10, {message: "message is content atleast 10 characters"}),
})