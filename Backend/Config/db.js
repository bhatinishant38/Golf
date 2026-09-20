import mongoose from "mongoose";

export const connectDatabase = async ()=>{

    const databaseUrl = process.env.DB_PATH

    if(!databaseUrl){
        throw new Error("DB_PATH is not configured")
    }
    await mongoose.connect(databaseUrl)
    console.log('Database Connected');
    
}
