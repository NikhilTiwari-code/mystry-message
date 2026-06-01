import dbConnect from "@/lib/db";
import UserModel from "@/models/user.model";
import { getServerSession } from "next-auth/next";
import authOptions from "@/app/api/auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";



export async function GET(request: Request){
    await dbConnect();
    
    
    const session = await getServerSession(authOptions);
    const _user = session?.user as User;
    
    if(!_user|| !session){
        return Response.json({
            success:false,
            message:"User not logged in"
        },
        {
            status:401
        })
    }

    const userId = new mongoose.Types.ObjectId(_user._id);
    try {

     const user = await UserModel.aggregate([
        {
            $match:{_id:userId}
        },
        {
            $unwind:"$messages"
        },
        {
            $sort:{"messages.createdAt":-1}
        },
        {
            $group:{
                _id:"$_id",
                messages:{$push:"$messages"}
            }
        }
     ]).exec();

     if(!user){
        return Response.json({
            success:false,
            message:"User not found"
        },
        {
            status:404
        })
     }
     if (!user || user.length === 0) {
        return Response.json(
          { success: true, messages: [] },   // simply no messages yet
          { status: 200 },
        );
      }
      return Response.json(
        { success: true, messages: user[0].messages },
        { status: 200 },
      );
     
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return Response.json(
          { message: 'Internal server error', success: false },
          { status: 500 }
        );
    }
   
    
}
