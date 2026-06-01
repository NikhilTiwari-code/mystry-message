import mongoose from "mongoose";

// points to remember while connecting to db in nextjs
// 1. check if the connection is already open
// 2. if not open, open the connection
// 3. if open, return the connection

type connectionObject = {
    isConnected?: number;
}

const connection: connectionObject = {};

async function dbConnect(){
    if(connection.isConnected ){
     console.log("Already connected to db");
      return;
    }
    
    if (!process.env.MONGODB_URI) {
        console.error("MONGODB_URI is not defined in environment variables");
        throw new Error("MONGODB_URI is not defined");
    }

    try {
        console.log("Connecting to MongoDB...");
        const db = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
        });
        console.log("Connected to db");
        connection.isConnected = db.connections[0].readyState;
    } catch (error) {
        console.error("Error connecting to db", error);
        throw error;
    }
}

export default dbConnect;



    


