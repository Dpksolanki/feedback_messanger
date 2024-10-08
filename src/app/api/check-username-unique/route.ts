import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/models/user";
import {z} from "zod"
import { userNameValidation } from "@/app/schemas/signUpSchema";

const userNameQuerySchema = z.object({
    username: userNameValidation
})

export async function GET(request: Request ){
    //Handle the method of route
    await dbConnect()

    try{
        const {searchParams} = new URL(request.url)
        //localhost:3000/api/cuu?username=deepak
        const queryParams = {username: searchParams.get('username')}
        // validate with zod
        const result = userNameQuerySchema.safeParse(queryParams)
        console.log(result)
        if(!result.success){
            const userNameErrors = result.error.format()
            .username?._errors || []
            return Response.json({
                success: false, 
                message: userNameErrors?.length > 0 ?
                userNameErrors.join(", ") : "Invalid username",


            }, {status: 400})

            
        }
        const {username } = result.data
        const existingVerifiedUser  = await UserModel.findOne({username , isVerified: true})

        if (existingVerifiedUser){
            return Response.json({success:false, 
                message: "user name is already exists", 
        })
    }
    return Response.json({success:true, 
        message: "username is unique", 
})

    }
    catch(err){
        console.error("Error checking user", err);
        return Response.json(
        {
            success: false,
            message: "Failed to check user"
        },
        { status:500})
    }
}