//verify code  i  want username and otp from the user 

// take otp from req
//find user based on username
// check opt is right 
// user update is verified true



import UserModel from "@/models/user.model";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";




export async function POST(request:Request){
    
    await dbConnect();
    
    
    
    try {
        const {username,code} = await request.json();
        const decodedUser = decodeURIComponent(username)

        // Find the user document by its username
        const user = await UserModel.findOne({ username: decodedUser });

        if (!user) {
           return NextResponse.json({
            success:false,
            message:"User not found"
           },
           {
            status:404
           })
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (!isCodeValid || !isCodeNotExpired) {
            return NextResponse.json({
                success:false,
                message:"Invalid otp or otp expired"
            },
            {
                status:400
            })
        }
        const verifiedUser = await UserModel.findByIdAndUpdate
            (user._id,
            {isVerified:true},
            {new:true});
 
        return NextResponse.json({
            success:true,
            message:"User verified successfully",
            user:verifiedUser
        },
        {
            status:200
        })

    } catch (error) {
        console.log("Error verifying user",error);
        return NextResponse.json({
            success:false,
            message:"Failed to verify user"
        },
        {
            status:500
        })
        
    }

}
