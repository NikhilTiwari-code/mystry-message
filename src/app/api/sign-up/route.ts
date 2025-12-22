import dbConnect from "@/lib/db";
import UserModel from "@/models/user.model";
import bcrypt from "bcrypt";
import sendVerificationEmail from "@/utils/sendVerificationEmail";




export async function POST(request:Request){

    await dbConnect();

    try {
        const {username,email,password} = await request.json();

        const existingUserVerifiedByUsername = await UserModel.findOne(
            {username,
            isVerified:true
            });

        if(existingUserVerifiedByUsername){
            return Response.json({
                success:false,
                message:"Username is  already exists"
            },
            {
                status:400
            })
        }
        
    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: 'User already exists with this email',
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    }else{
        const hashedPassword = await bcrypt.hash(password, 10);
        const expiryDate = new Date(Date.now() + 3600000);
        const newUser = new UserModel({
            username,
            email,
            password:hashedPassword,
            verifyCode,
            verifyCodeExpiry:expiryDate,
            isVerified:false,
            isAcceptingMessages:true,
            messages:[]
        })
        await newUser.save();

        // send verification email

        const emailResponse = await sendVerificationEmail(email,username,verifyCode);
        
        if(!emailResponse.success){
            return Response.json({
                success:false,
                message:"Failed to send verification email"
            },
            {
                status:500
            })
        }
    }

    return Response.json({
        success:true,
        message:"User registered successfully"
    },
    {
        status:201
    })

    
    } catch (error) {

        console.log("Error registering user",error);
        return Response.json({
            success:false,
            message:"Failed to register user"
        },
        {
            status:500
        })
        
    }
}