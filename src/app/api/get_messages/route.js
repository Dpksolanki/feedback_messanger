import { getServerSession } from "next-auth";
// import { AuthOptions } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/models/user";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";


export async function GET(request: Request){
    await dbConnect()
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
    const userId = new mongoose.Types.ObjectId(user._id);
    
    try{
        const user = await UserModel.aggregate([
            {$match:{id: userId}},
            {$unwind:'$messages'},
            {$sort:{'messages.createdAt': -1}},
            {$group:{_id: '$_id' , messages: {$push:'$messages'}}}
        ])
        if(!user || !user.lenght === 0){
            return Response.json({
                success: false,
                message: "No feedback found"
            },
            {status: 404})
        }
        return Response.json({
            success: true,
            data: user[0].messages
        }, {status:200})
    }
    catch(err){
        console.error("Error for getting messaage", err)
        return Response.json({
            success: false,
            message: "Failed to fetch user's feedback"
        },
        {status: 500})
    
    }

}