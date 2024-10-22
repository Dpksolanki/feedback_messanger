import { getServerSession } from "next-auth";
// import { AuthOptions } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/models/user";
// import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
// Renaming the user variable in the try block to avoid duplicate naming

export async function GET() { // Keeping ': Request' as it is TypeScript
    await dbConnect();
    const session = await getServerSession(authOptions); // Added 'await' to getServerSession
    const user = session?.user;
    // console.log(123, user);

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "User not authenticated"
        },
        { status: 401 });
    }
    const userId = new mongoose.Types.ObjectId(user._id);
    // console.log(1234, userId);
    
    try {
        const userData = await UserModel.aggregate([
            { $match: { _id: userId, messages: { $ne: [] } } }, // Added condition to check for non-empty messages
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ]);
        // console.log(123, userData);
        if (!userData || userData.length === 0) { // Fixed 'lenght' to 'length'
            return Response.json({
                success: false,
                message: "No feedback found"
            },
            { status: 200 });
        }
        return Response.json({
            success: true,
            data: userData[0].message
        }, { status: 200 });
    }
    catch (err) {
        console.error("Error for getting message", err); // Fixed typo 'messaage' to 'message'
        return Response.json({
            success: false,
            message: "Failed to fetch user's feedback"
        },
        { status: 500 });
    }
}