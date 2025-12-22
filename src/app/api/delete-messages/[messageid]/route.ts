
import dbConnect from "@/lib/db";
import UserModel from "@/models/user.model";
import { getServerSession } from "next-auth/next";
import authOptions from "@/app/api/auth/[...nextauth]/options";
import { User } from "next-auth";


export async function DELETE(
    request:Request,
    {params}: {params: Promise<{messageid: string}>}
){
        const { messageid } = await params;
        const messageId = messageid;
        
        await dbConnect();

        const session = await getServerSession(authOptions);
        const user:User = session?.user 

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
            
            const userId = user._id;
            
            const updateResult = await UserModel.updateOne({
                _id:userId
            },
            {
                $pull:{
                    messages:{
                        _id:messageId
                    }
                }
            })
            
            if(!updateResult.modifiedCount){
                return Response.json({
                    success:false,
                    message:"Message not found"
                },
                {
                    status:404
                })
            }

            return Response.json({
                success:true,
                message:"Message deleted successfully"
            },
            {
                status:200
            })
            

            
        } catch (error) {
            console.log("Error deleting message",error);
            return Response.json({
                success:false,
                message:"Failed to delete message"
            },
            {
                status:500
            })
        }
}

