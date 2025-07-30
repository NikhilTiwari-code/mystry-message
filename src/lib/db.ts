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
    try {
        const db =await mongoose.connect(process.env.MONGODB_URI!);
        console.log("Connected to db");
        connection.isConnected = db.connection.readyState;
    } catch (error) {
        console.log("Error connecting to db",error);
        process.exit(1);
    }
}

export default dbConnect;



    


