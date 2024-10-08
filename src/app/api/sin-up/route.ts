import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/models/user"
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helper/sendVarification";

// sendVerificationEmail

export async function POST(request: Request){
    await dbConnect()

    try{
        const { email, username, password } = await request.json();
        const existingUserVerifiedByUsername  = await  UserModel.findOne({ username, 
            isVerified: true
        })

        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: true,
                message: "Username is already taken"
            })
        }
        const existingUserByEmail = await UserModel.findOne({ email})
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "user already exists",
                }, { status:400})
            } else {
                const hashPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now()
            + 3600000) // 1 hour
                await existingUserByEmail.save()
            }

        }else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryData = new Date()
            expiryData.setHours(expiryData.getHours() + 1)
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryData,
                isVerified: false,
                isAcceptingMessage: true,
                messages:  []
            });
           await newUser.save()
        }

        //send verification email
        const emailResponse = await sendVerificationEmail(email,
            username,
            verifyCode
        )
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message,
            }, { status:500})
        }

        return Response.json({
            success: true,
            message: "User registered successfully. Please verify your account",
        }, { status:201})

    }
    catch(error){
        console.error("Error for registering",error);
        return Response.json(
            {
                success: false,
                message: "Error registering user",
            },
            {
                status: 500,
            }
        )
    }
}