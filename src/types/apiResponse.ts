import { Message } from "@/app/models/user";
export interface ApiResponse{
    success: boolean;
    message: string;
    isAcceptingMessage?: boolean;
    messages?: Array<Message>;
}