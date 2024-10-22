import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/app/models/user"; // Grouped the import for Message
import { ApiResponse } from "@/types/apiResponse";

export async function POST(request: Request): Promise<Response> {
    await dbConnect();
    const { receiverUsername, content }: { receiverUsername: string; content: string } = await request.json();

    try {
        const receiver = await UserModel.findOne({ username: receiverUsername });

        if (!receiver) {
            const responseBody: ApiResponse = {
                success: false,
                message: "Receiver not found",
            };
            return new Response(JSON.stringify(responseBody), { status: 404 });
        }

        if (!receiver.isAcceptingMessage) {
            const responseBody: ApiResponse = {
                success: false,
                message: "Receiver is not accepting messages",
            };
            return new Response(JSON.stringify(responseBody), { status: 403 });
        }

        const newMessage: Message = {
            content,
            createdAt: new Date(),
        };

        receiver.messages.push(newMessage);
        await receiver.save();

        const responseBody: ApiResponse = {
            success: true,
            message: "Message sent successfully",
            data: newMessage,
        };
        return new Response(JSON.stringify(responseBody), { status: 200 });
    } catch (error) {
        console.error("Error sending message", error);
        const responseBody: ApiResponse = {
            success: false,
            message: "Failed to send message",
        };
        return new Response(JSON.stringify(responseBody), { status: 500 });
    }
}
