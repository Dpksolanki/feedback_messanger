import { getServerSession } from "next-auth";
// import { AuthOptions } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/models/user";
// import { User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";


export async function DELETE(request: Request, {params}:
    {params:{messageid: string}}
){
    const messageId = params?.messageid;
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user = session?.user ;

    if(!session  || !session.user){
        return Response.json({
            success: false,
            message: "User not authenticated"
        },
        {status: 401}
    )
    }
    try {
        const updateResult = await UserModel.updateOne(
           { _id: user?._id},
          { $pull: { messages: {_id:messageId} } }
        )
        if (updateResult.modifiedCount == 0){
            return Response.json({
                success: false,
                message: "Message not found"
            },
            {status: 404})
        }
        return Response.json({
            success: true,
            message: "Message deleted successfully"
        }, {status: 200})
    } catch (error) {
        console.log("failed to deleting message", error)
        return Response.json({
            success: false,
            message: "Failed to delete message"
        }, {status: 500})
    }
  

}