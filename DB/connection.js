import mongoose from "mongoose";
mongoose.set('strictQuery', true);
const connection = async ()=>{
    return await mongoose.connect("mongodb+srv://dohmohammed:doha2001@cluster0.io5stmr.mongodb.net/gallery")
    .then(()=> console.log(`connected on ...... `))
    .catch(err=>console.log(`fail to connect `))
}

export default connection;
