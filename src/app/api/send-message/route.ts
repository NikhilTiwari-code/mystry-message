import dbConnect from "@/lib/db";
import { Message } from "@/models/user.model";
import UserModel from "@/models/user.model";
 

export async function POST(request:Request){
    await dbConnect();
    
    try {

        const {username,content} = await request.json();

        const user = await UserModel.findOne({username}).exec();

        if(!user){
            return Response.json({
                success:false,
                message:"User not found"
            },
            {
                status:404
            })
        }

        //check if user is accepting messages

        if(!user.isAcceptingMessages){
            return Response.json({
                success:false,
                message:"User is not accepting messages"
            },
            {
                status:400
            })
        }

        const newMessage =  {
            content,
            createdAt: new Date(),
        };

        user.messages.push(newMessage as Message );

        await user.save();

        return Response.json({
            success:true,
            message:"Message sent successfully"
        },
        {
            status:201
        })

         
        
    } catch (error) {
        console.log("Error sending message",error);
        return Response.json({
            success:false,
            message:"Failed to send message"
        },
        {
            status:500
        })
    }
}

