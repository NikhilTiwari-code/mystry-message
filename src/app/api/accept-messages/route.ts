// in this i have to check two thing that is user accepting messages 
// and user current status


import dbConnect from "@/lib/db";
import UserModel from "@/models/user.model";
import { getServerSession } from "next-auth/next";
import authOptions from "@/app/api/auth/[...nextauth]/options";
import { User } from "next-auth";

export async function POST(request:Request){
    await dbConnect();
    
        // here user is logged in 
       const session = await getServerSession(authOptions);
       const user = session?.user as User;

     if(!user|| !session){
        return Response.json({
            success:false,
            message:"User not logged in"
        },
        {
            status:401
        })
     }
     const userId = user._id;
     const {acceptMessages} = await request.json();
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessages:acceptMessages},
            {new:true});

        if (!updatedUser) {
            return Response.json({
                success:false,
                message:"User not found"
            },
            {
                status:404
            })
        }

        return Response.json({
            success:true,
            message:"User updated successfully",
            user:updatedUser
        },
        {
            status:200
        })
        
    } catch (error) {
        console.log("Error updating user",error);
        return Response.json({
            success:false,
            message:"Failed to update user"
        },
        {
            status:500
        })
    }
}

export const dynamic = 'force-dynamic';

export async function GET(request: Request){
    await dbConnect();
    
   const session = await getServerSession(authOptions);
   const user = session?.user as User;

   if(!user|| !session){
    return Response.json({
        success:false,
        message:"User not logged in"
    },
    {
        status:401
    })
   }
   try {
    // find the user from the database 
    const foundUser = await UserModel.findById(user._id);

    if (!foundUser) {
        return Response.json({
            success:false,
            message:"User not found"
        },
        {
            status:404
        })
    }
    return Response.json({
        success:true,
        message:"User fetched successfully",
        isAcceptingMessages :foundUser.isAcceptingMessages
    },
    {
        status:200
    })
    
   } catch (error) {
    console.error("Error fetching user:", error);
    return Response.json({
        success:false,
        message:"Error fetching user"
    },
    {
        status:500
    })
   }
}

