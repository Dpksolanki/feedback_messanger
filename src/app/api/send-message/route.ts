import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/models/user";
import { Message } from "@/app/models/user";
// import { ApiResponse } from "@/types/apiResponse";

export async function POST(request: Request) {
    await dbConnect();
    const { receiverUsername, content } = await request.json();

    try {
        // Find the sender user
        // const sender = await UserModel.findOne({ username: senderUsername });

        // if (!sender) {
        //     return Response.json({
        //         success: false,
        //         message: "Sender not found",
        //     }, { status: 404 });
        // }

        // Find the receiver user
        const receiver = await UserModel.findOne({ username: receiverUsername });

        if (!receiver) {
            return Response.json({
                success: false,
                message: "Receiver not found",
            }, { status: 404 });
        }
        console.log(receiver);
        // Check if the receiver is accepting messages
        if (!receiver.isAcceptingMessage) {
            return Response.json({
                success: false,
                message: "Receiver is not accepting messages",
            }, { status: 403 });
        }

        // Create a new message
        const newMessage: Message = {
            content,
            createdAt: new Date(),
        };

        // Add the message to the receiver's messages array
        receiver.messages.push(newMessage);
        await receiver.save();

        return Response.json({
            success: true,
            message: "Message sent successfully",
            data: newMessage,
        }, { status: 200 });
    } catch (error) {
        console.error("Error sending message", error);
        return Response.json({
            success: false,
            message: "Failed to send message",
        }, { status: 500 });
    }
}
