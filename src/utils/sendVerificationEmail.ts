import VerificationEmail from "../../email/verificationEmail";
import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";

export default async function sendVerificationEmail(
    email:string,
    username:string,
    otp:string
) : Promise<ApiResponse>{
   try {
    await resend.emails.send({
        from: "Mystry Music <onboarding@resend.dev>",
        to: email,
        subject: "Verify your email address",
        react: VerificationEmail({ username, otp }),
      });
      return {
        success:true,
        message:"Verification email sent successfully"
      }
    
   } catch (error) {
    console.log("Error sending verification email",error);
    return {
      success:false,
      message:"Failed to send verification email"
    }
   }
}





