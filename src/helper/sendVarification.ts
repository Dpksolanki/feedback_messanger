import {resend} from '@/lib/resend'
import {VerifyEmailTemplate} from '../../emails/verificationEmailTemplate'
import { ApiResponse } from '@/types/apiResponse'

export async function sendVerificationEmail(
    email: string, 
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try{
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Feedback_Messanger verification code',
            react: VerifyEmailTemplate({username, verifyCode }),
          });
        return {
            success: false,
            message: "Verification email send successfully."
        }
    }
    catch(emailError) {
        console.error("Error for sending verification email",emailError)
        return {
            success: false,
            message: "Failed to send verification email. Please try again later."
        }
    }
}