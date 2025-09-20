import mongoose from "mongoose";

const connectDB = async() =>{
    try{
        await mongoose.connect("mongodb://localhost:27017/GarbaGo");
        console.log("Connected")
    }
    catch(err){
        console.error("Unable to Connect DB :",err.message);
        process.exit(1);
    }
}
export default connectDB;