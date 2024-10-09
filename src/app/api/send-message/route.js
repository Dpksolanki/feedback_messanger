import dbConnect from "@/lib/dbConnect";
import UserModel from "@/lib/userModel";
import {message} from "@/models/message"

export async function POST(request: Request){
    await dbConnect();
    const {username , content} = await request.json()
    try {
        const user = await UserModel.findOne({username})
        if(!user){
            return Resposne.json({
                success: false,
                message: "User not found", 
            }, {status: 404})


        }

        if(!user.isAcceptingMessage){
            return Response.json({
                success: false,
                message: "User is not accepting messages",
            }, {status: 403})
        }
        const  newMessage = {content , createdAt: new Date()}
        user.messages.push(newMessage)
        await user.save()

        return Response.json({
            success: true,
            message: "Message sent successfully",
            data: newMessage
        })
    } catch (error) {
        console.error("Error for Sending the message ", error) 
            return Response.json({
                success: false,
                message: "Error for Sending the message",
            })
        
    }
}