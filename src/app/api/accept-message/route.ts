import { getServerSession } from "next-auth";
// import { AuthOptions } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/models/user";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request){
    await dbConnect
    const session = getServerSession(authOptions)
    const user: User = session?.user ;

    if(!session  || !session.user){
        return Response.json({
            success: false,
            message: "User not authenticated"
        },
        {status: 401}
    )
    }
    const userId = user._id 
    const {acceptMessage} = await request.json();
    try {
        const updateUser = await UserModel.findByIdAndUpdate(userId,{isAcceptingMessage: acceptMessage},
            {new: true} )
        if(!updateUser){
            return Response.json({
                success: false,
                message: "Failed to update user status to accept message"
            },{status:404})
        }
        return Response.json({
            success: true,
            message: "User status updated successfully",
            user: updateUser
        }, {status:200})

    } catch (error) {
        console.log("failed to update user status to accept message", error);
        return Response.json({
            success: false,
            message: "Failed to update user status to accept message"
        },{status:500})
    }

}

export async  function GET(request: Request){
    await dbConnect
    const session = getServerSession(authOptions)
    const user: User = session?.user ;

    if(!session  || !session.user){
        return Response.json({
            success: false,
            message: "User not authenticated"
        },
        {status: 401}
    )
    }
    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId)
        if(!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            },{status:404})
        }
    
        return Response.json({
            success: true,
            message: "User found successfully",
            isAcceptingMessage:foundUser.isAcceptingMessage
        }, {status:200})

    } catch (error) {
        console.log("failed to find user", error);
        return Response.json({
            success: false,
            message: "Error is  getting status isAcceptingMessage"
        },{status:500})
        
    }
 
}